'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var os = require('os');
var chai = require('chai');
chai.use(require('chai-fs'));
var assert = require('yeoman-generator').assert;


describe('aowp-marionette:layoutview without template option', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/layoutview'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withArguments(['apples'])
      .withOptions({
        directory: 'fruit'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'app/scripts/apps/fruit/apples-layout-view.js',
      'app/scripts/apps/fruit/apples-layout-view-test.js'
    ]);
  });
  it('contains template', function () {
    assert.fileContent('app/scripts/apps/fruit/apples-layout-view.js', /JST\['app\/scripts\/apps\/fruit\/apples-layout-view-template.hbs']/);
  });
  it('test with right content', function () {
    assert.fileContent('app/scripts/apps/fruit/apples-layout-view-test.js', /.\/apples-layout-view/);
    assert.fileContent('app/scripts/apps/fruit/apples-layout-view-test.js', /, ApplesLayoutView/);
    assert.fileContent('app/scripts/apps/fruit/apples-layout-view-test.js', /new ApplesLayoutView/);
  });
});

describe('aowp-marionette:layoutview with template option', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/layoutview'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withArguments(['apples'])
      .withOptions({
        directory: 'fruit',
        template: 'my-fruit'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'app/scripts/apps/fruit/apples-layout-view.js',
      'app/scripts/apps/fruit/apples-layout-view-test.js'
    ]);
  });
  it('contains template', function () {
    assert.fileContent('app/scripts/apps/fruit/apples-layout-view.js', /JST\['app\/scripts\/apps\/fruit\/my-fruit-layout-view-template.hbs']/);
  });
});
