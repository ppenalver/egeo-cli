'use strict';

const path = require('path');
const PROJECT_PATH = path.join(__dirname, '..');

// Register TS compilation.
require('ts-node').register({
  project: path.join(PROJECT_PATH, 'tools/document/tsconfig.json')
});

var docGenerator = require('../tools/document/generator');

module.exports = function (componentFile) {
   docGenerator.getComponentDoc(path.resolve(componentFile));
}
