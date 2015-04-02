'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var lodash = require('lodash');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the riveting' + chalk.red('FlaskCrud') + ' generator!'
    ));

    var prompts = [{
        type: 'input',
        name: 'packageName',
        message: 'your package name',
    }, {
        type: 'input',
        name: 'modelsModule',
        message: 'the module that define all the database models'
    }, {
        type: 'confirm',
        name: 'searchable',
        message: 'if the model could be searched',
        default: true,
    }, {
        type: 'list',
        name: 'searchableFields',
        message: 'searchable fields',
        default: ['name'],
    }];

    this.prompt(prompts, function (props) {
        this.packageName = props.packageName;
        this.modelsModule = props.modelsModule; 
        this.searchable = props.searchable;
        this.searchableFields = props.searchableFields;
        done();
    }.bind(this));
  },

  writing: {
    app: function () {
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
