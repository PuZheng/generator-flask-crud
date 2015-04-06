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
        name: 'modelName',
        message: 'your model\'s name',
    }, {
        type: 'confirm',
        name: 'searchable',
        message: 'if the model could be searched',
        default: true,
    }, {
        type: 'input',
        name: 'searchableFields',
        message: 'searchable fields, seperated by ","',
        default: 'name',
        when: function (answers) {
            return answers.searchable;
        }
    }];

    this.prompt(prompts, function (props) {
        this.templateArgs = {};
        this.templateArgs.packageName = props.packageName;
        this.templateArgs.modelName = props.modelName;
        this.templateArgs.searchable = props.searchable;
        this.templateArgs.searchableFields = props.searchableFields && props.searchableFields.split(',').map(function (field) {return field.trim();});
        done();
    }.bind(this));
  },

  writing: {
    app: function () {
        ['__init__.py', 'views.py'].forEach(function (fname) {
            this.fs.copyTpl(this.templatePath('__package__/' + fname),
                           this.destinationPath(this.templateArgs.packageName + '/' + fname), 
                           this.templateArgs);
        }.bind(this));
        this.fs.copyTpl(this.templatePath('render.js'),
                       this.destinationPath(this.templateArgs.packageName + '/render.js'),
                       this.templateArgs);
        this.fs.copy(this.templatePath('js/crud-utils.js'),
                    this.destinationPath('static/js/crud-utils.js'));
        ['list/app.js', 'list/main.js.swig', 'object/app.js', 'object/main.js.swig'].forEach(function (fname) {
            this.fs.copyTpl(this.templatePath('js/__package__/' + fname),
                           this.destinationPath('static/js/' + this.templateArgs.packageName + '/' + fname),
                           this.templateArgs);
        }.bind(this));
        ['list.scss', 'object.scss'].forEach(function (fname) {
            this.fs.copy(this.templatePath('sass/__package__/' + fname),
                        this.destinationPath('static/sass/' + this.templateArgs.packageName + '/' + fname));
        }.bind(this));
        this.fs.copy(this.templatePath('templates/crud-macros.html'), 
                        this.destinationPath('templates/crud-macros.html'));
        ['list.html', 'object.html'].forEach(function (fname) {
            this.fs.copyTpl(this.templatePath('templates/__package__/' + fname),
                        this.destinationPath('templates/' + this.templateArgs.packageName + '/' + fname),
                        this.templateArgs);
        }.bind(this));
    },

    projectfiles: function () {
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  },

  end: function () {
      this.log(lodash.template(this.fs.read(this.templatePath('manifest.txt')))(this.templateArgs));
  }
});
