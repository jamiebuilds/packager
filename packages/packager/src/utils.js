// @flow
'use strict';
const pify = require('pify');
const gracefulFs = require('graceful-fs');
const resolve = require('resolve');

type ReadFile = (
  filename: string,
  options?: string | { encoding?: string, flag?: string }
) => Promise<Buffer>;

type Resolve = (id: string, opts: $npm$resolve$ResolveAsyncOptions) => Promise<string>;

exports.readFile = (pify(gracefulFs.readFile): ReadFile);
exports.resolve = (pify(resolve): Resolve);
