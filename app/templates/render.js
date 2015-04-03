var gulp = require('gulp');
var data = require('gulp-data');
var rename = require('gulp-rename');
var swig = require('gulp-swig');

module.exports = function (scriptsMap, shimsMap, urlRoot) {
    'use strict';

    gulp.src(['static/js/<%= packageName %>/*.swig']).pipe(data({
        scriptsMap: scriptsMap,
        shimsMap: shimsMap,
        urlRoot: urlRoot,
    })).pipe(swig()).pipe(rename(function (path) {
        path.extname = '';
    })).pipe(gulp.dest('static/js/'));
};
