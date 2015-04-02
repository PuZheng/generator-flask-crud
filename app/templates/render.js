var gulp = require('gulp');
var rename = require('gulp-rename');
var template = require('gulp-template');

module.exports = function (scriptsMap, shimsMap, urlRoot) {
    'use strict';

    gulp.src(['static/js/<%= packageName %>/*.mtpl']).pipe(template({
        scriptsMap: scriptsMap,
        shimsMap: shimsMap,
        urlRoot: urlRoot,
    })).pipe(rename(function (path) {
        path.extname = '';
    })).pipe(gulp.dest('static/js/'));
};
