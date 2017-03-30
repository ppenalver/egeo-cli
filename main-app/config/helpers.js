var path = require('path');

// Helper functions
var ROOT = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function node_modules() {
  return path.resolve(__dirname, '../../node_modules');
}

exports.root = root;
exports.node_modules = node_modules;
