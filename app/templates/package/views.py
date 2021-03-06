# -*- coding: UTF-8 -*-
from datetime import datetime, date
from sqlalchemy import or_
import types
from flask import (Blueprint, flash, render_template, redirect, request,
                   jsonify, url_for)
from flask.ext.login import login_required
from flask.ext.wtf import Form
from flask.ext.babel import _
from wtforms_alchemy import model_form_factory
from collections import namedtuple

from <%= projectPackage %>.models import <%= modelName %>
from <%= projectPackage %>.utils import do_commit
from <%= projectPackage %>.database import db


bp = Blueprint('<%= packageName %>', __name__, static_folder='static',
               template_folder='templates')

ModelForm = model_form_factory(Form)

class _Form(ModelForm):

    class Meta:
        model = <%= modelName %>

class <%= modelName %>ModelView(object):

    instance = None

    def __init__(self, app, page_size=None):
        if not <%= modelName %>ModelView.instance:
            <%= modelName %>ModelView.instance = namedtuple(
                '<%= modelName %>ModelView', 'app page_size'
            )(app, page_size or app.config.get('PAGE_SIZE', 16))

        app.register_blueprint(bp, url_prefix='/<%= packageName %>')


@bp.route('/object/<int:id_>', methods=['GET', 'POST'])
@bp.route('/object', methods=['GET', 'POST'])
@login_required
def object_view(id_=None):

    obj = <%= modelName %>.query.get_or_404(id_) if id_ else None

    form = _Form(obj=obj)
    if form.validate_on_submit():
        # if create a new object, return to object list
        back_ref = request.url if obj else (request.args.get('next')
                                            or url_for('.list_view'))
        obj = obj or <%= modelName %>()
        form.populate_obj(obj)
        do_commit(db, obj)

        flash(_(u'%(model_name)s %(model)s was %(method)s successfully',
                model_name='<%=modelName %>', model=unicode(obj),
                method='updated' if id_ else 'created'))
        return redirect(back_ref)

    return render_template('<%= packageName %>/object.html', form=form, obj=obj,
                           mapper=<%= modelName %>.__mapper__)



@bp.route('/list')
@login_required
def list_view():
    page = request.args.get("page", 1, type=int)
    order_by = request.args.get("order_by")
    desc = request.args.get("desc", 0, type=int)


    model_view = <%= modelName %>ModelView.instance
    q = <%= modelName %>.query
    <% if (searchable) { %>
    kw = request.args.get('kw')
    if kw:
        <% if (searchableFields.length > 1) { %>
        q = q.filter(or_(
        <%= searchableFields.map(function (field) {
            return modelName + '.' + field + '.like(u\'%%s%%\' % kw)';
        }).join(', ') %>))
        <% } else { %>
        q = q.filter(<%= modelName %>.<%= searchableFields[0] %>.like(u'%%%s%%' % kw))
        <% } %>
    <% } %>
    if order_by:
        order_by_criterion = getattr(<%= modelName %>, order_by)
        if desc:
            order_by_criterion = order_by_criterion.desc()
        q = q.order_by(order_by_criterion)
    pagination = q.paginate(page, model_view.page_size)
    q = q.offset((page - 1) * model_view.page_size).limit(model_view.page_size)

    return render_template('<%= packageName %>/list.html',
                           pagination=pagination,
                           objs=q.all(), mapper=<%= modelName %>.__mapper__)



@bp.route('/list.json', methods=['GET', 'DELETE', 'PUT'])
@login_required
def list_json():
    if request.method == 'DELETE':
        do_commit(db, filter(lambda x: x, [
            <%= modelName %>.query.get(id_) for id_ in
            request.args['ids'].split(',')
        ]), action='delete')
        return 'ok'
    elif request.method == 'PUT':
        objs = filter(lambda x: x, [<%= modelName %>.query.get(id_) for id_ in
                                    request.args['ids'].split(',')])
        for obj in objs:
            for k, v in request.json.items():
                setattr(obj, k, v)
        do_commit(db, objs)

        return jsonify({
            'data': objs
        })

    # GET
    q = <%= modelName %>.query
    if request.args.get('ids'):
        q = objs.filter(<%= modelName %>.id.in_(request.args.get('ids')))
    return jsonify({
        'data': q.all()
    })


@bp.route('/object/<int:id_>.json', methods=['GET', 'PUT', 'DELETE'])
@bp.route('/object.json', methods=['POST'])
@login_required
def object_json(id_):

    form = _Form(csrf_enabled=False)
    if request.method == 'POST':
        if form.validate():
            obj = <%= modelName %>()
            form.populate_obj(obj)
            return jsonify(do_commit(db, obj).__json__())
        else:
            return jsonify(form.errors), 403

    # DELETE or PUT
    obj = <%= modelName %>.query.get_or_404(id_)
    ret = jsonify(obj.__json__())
    if request.method == 'PUT':
        for k, v in request.json.items():
            type_ = getattr(<%= modelName %>,
                            k).property.columns[0].type
            if isinstance(type_, db.DateTime):
                v = datetime.strptime(v, '%Y-%m-%d %H:%M:%S')
            elif isinstance(type_, db.Date):
                v = datetime.strptime(v, '%Y-%m-%d')
            setattr(obj, k, v)
        do_commit(db, obj)
    elif request.method == "DELETE":
        do_commit(db, obj, action='delete')
    return ret


<% if (searchable) { %>@bp.route('/search/<kw>')
@login_required
def search_view(kw=None):
    <% if (searchableFields.length > 1) { %>
    q = <%= modelName %>.query.filter(or_(
        <%= searchableFields.map(function (field) {
            return modelName + '.' + field + '.like(u\'%%s%%\' % kw)';
        }).join(', ') %>
    ))<% } else { %>
    q = <%= modelName %>.query.filter(
        <%= modelName %>.<%= searchableFields[0] %>.like(u'%%%s%%' % kw))<% } %>
    return jsonify({
        "results": [{
            "title": entry.name,
            "url": url_for('.list_view',
                           kw=entry.<%= searchableFields[0] %>),
        } for entry in q],
    })<% } %>
