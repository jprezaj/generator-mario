'use strict';

module.exports = function(Generator) {

  Generator.prototype.buildToolPrompt = function() {
		if (this.preferences.ecma === 6) {
      this._.merge(this.preferences, {buildTool: 'grunt'});
      return;
    }

    var done = this.async();
    this.prompt({
      type: 'list',
      name: 'buildTool',
      message: 'What build tool would you like to use?',
      choices: [
        { name: 'Grunt', value: 'grunt' },
        { name: 'Gulp', value: 'gulp' },
        { name: 'Grunt + Webpack (experimental!)', value: 'webpack' }
      ],
      default: 'grunt'
    }, function(answer) {
      this._.merge(this.preferences, answer);

      done();
    }.bind(this));
  };

};
