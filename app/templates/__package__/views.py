# -*- coding: UTF-8 -*-
from flask import (Blueprint, flash, render_template, redirect, request,
                   jsonify, url_for)
from flask.ext.login import login_required
from flask.ext.wtf import Form
from flask.ext.babel import _
from wtforms_alchemy import model_form_factory
from collections import namedtuple


bp = Blueprint('<%= packageName %>', __name__, static_folder='static',
               template_folder='templates')

ModelForm = model_form_factory(Form)


class <%= modelName %>ModelView(object):

    instance = None

    def __init__(self, app, db, model_cls, page_size=None):
        if not <%= modelName =>ModelView.instance:
            <%= modelName =>ModelView.instance = namedtuple(
                '<%= modelName %>ModelView', 'app model_cls db page_size'
            )(app, model_cls, db, page_size or app.config.get('PAGE_SIZE', 16))

        app.register_blueprint(bp, url_prefix='/<%= packageName %>')


@bp.route('/object/<int:id_>', methods=['GET', 'POST'])
@bp.route('/object', methods=['GET', 'POST'])
@login_required
def object_view(id_=None):

    model_view = <%= modelName %>ModelView.instance

    obj = model_view.model_cls.query.get_or_404(id_) if id_ else None

    class _Form(ModelForm):

        class Meta:
            model = model_view.model_cls
    form = _Form(obj=obj)
    if form.validate_on_submit():
        # if create a new object, return to object list
        back_ref = request.url if obj else url_for('.list_view')
        obj = obj or model_view.model_cls()
        form.populate_obj(obj)
        model_view.db.session.add(obj)
        model_view.db.session.commit()

        flash(_(u'%(model_name)s %(model)s was %(method)s successfully',
                model_name='<%=modelName %>', model=unicode(obj),
                method='updated' if id_ else 'created'))
        return redirect(back_ref)

    return render_template('<%= packageName %>/object.html', form=form, obj=obj,
                           mapper=model_view.model_cls.__mapper__)


@bp.route('/list')
@login_required
def list_view():
    page = request.args.get("page", 1, type=int)
    order_by = request.args.get("order_by")
    desc = request.args.get("desc", 0, type=int)


    model_view = <%= modelName %>ModelView.instance
    q = model_view.model_cls.query

    <% if (searchable) { %>
    kw = request.args.get('kw')
    if kw:
        <% if (searchableFields.length > 1) { %>
        q = q.filter(or_(
            <%= searchableFields.map(function (field) {
                return 'model_view.model_cls.' + field + '.like(u\'%%s%%\' % kw)';
            }).join(', ') %>
        ))
        <% } else { %>
        q = q.filter(model_view.model_cls.<%= searchableFields[0] %>.like(u'%%%s%%' % kw))
        <% } %>
    <% } %>

    if order_by:
        order_by_criterion = getattr(model_view.model_cls, order_by)
        if desc:
            order_by_criterion = order_by_criterion.desc()
        q = q.order_by(order_by_criterion)
    pagination = q.paginate(page, model_view.page_size)
    q = q.offset((page - 1) * model_view.page_size).limit(model_view.page_size)

    return render_template('<%= packageName %>/list.html',
                           pagination=pagination,
                           objs=q.all(), mapper=model_view.model_cls.__mapper__)



@bp.route('/list.json', methods=['GET', 'DELETE', 'PUT'])
@login_required
def list_json():
    model_view = <%= modelName %>ModelView.instance
    session = model_view.db.session
    if request.method == 'DELETE':
        for id_ in request.args['ids'].split(','):
            session.delete(model_view.model_cls.query.get(id_))
        session.commit()
        return 'ok'
    elif request.method == 'PUT':
        objs = [model.query.get(id_) for id_ in
                request.args['ids'].split(',')]
        for obj in objs:
            for k, v in request.json.items():
                setattr(obj, k, v)
        session.add_all(objs)
        session.commit()
        return jsonify({
            'data': [obj.to_dict() for obj in model.query]
        })

    name = request.args.get('name')
    return jsonify({
        'data': [obj.to_dict() for obj in
                 model.query.filter(model.name == name)]
    })


@bp.route('/object/<int:id_>.json', methods=['PUT', 'DELETE'])
@login_required
def object_json(id_):
    model = model_view.model_cls
    obj = model.query.get_or_404(id_)
    ret = jsonify(obj.to_dict())
    session = model_view.db.session
    if request.method == 'PUT':
        for k, v in request.json.items():
            setattr(obj, k, v)
        session.add(obj)
        session.commit()
    else:
        session.delete(obj)
        session.commit()
    return ret

<% if (searchable) { %>
@bp.route('/search/<kw>')
@login_required
def search_view(kw=None):
    model_cls = model_view.model_cls
    <% if (searchableFields.length > 1) { %>
    q = model_cls.query.filter(or_(
        <%= searchableFields.map(function (field) {
            return 'model_view.model_cls' + field + '.like(u\'%%s%%\' % kw)';
        }).join(', ') %>
    ))
    <% } else { %>
    q = model_cls.query.filter(
        model_cls.<%= searchableFields[0] %>.like(u'%%%s%%' % kw))
    <% } %>

    return jsonify({
        "results": [{
            "title": entry.name,
            "url": url_for('.list_view',
                           kw=entry.<%= searchableFields[0] %>),
        } for entry in q],
    })
<% } %>
