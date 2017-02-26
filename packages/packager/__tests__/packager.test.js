'use strict';
// @flow
const packager = require('../');
const path = require('path');

const fixtures = path.join(__dirname, '..', '__fixtures__');

let fixture = (name) => path.join(fixtures, name, 'entry.js');

test('sync', async () => {
  expect(await packager(fixture('sync'))).toMatchSnapshot();
});

test('async', async () => {
  expect(await packager(fixture('async'))).toMatchSnapshot();
});
