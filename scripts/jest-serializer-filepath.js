'use strict';

const path = require('path');
const cwd = process.cwd();

module.exports = {
  test: function(val) {
    return typeof val === 'string' && val.indexOf(cwd) > -1;
  },
  print: function(val, serialize, indent) {
    return serialize(val.replace(cwd, '/..'));
  }
};
