# -*- coding: UTF-8 -*-

from flask import Blueprint

bp = Blueprint('<%= packageName %>', __name__, static_folder='static',
               template_folder='templates')
