// @flow
'use strict';
const {parse, tokTypes} = require('babylon');
const Graph = require('./graph');
const path = require('path');
const {resolve, readFile} = require('./utils');

let tokenize = (fileContents) => {
  return parse(fileContents, {
    sourceType: 'module',
    plugins: ['dynamicImport']
  }).tokens;
};

let collect = async (graph, tokens, from: string, index) => {
  if (index >= tokens.length) {
    return graph;
  } else if (tokens[index].type.label === 'import') {
    let next = tokens[index + 1];
    let sync = next.type.label === 'string';
    let async = next.type.label === '(';

    if (!(sync || async)) throw new Error('Unexpected token: ' + next.label);

    let skip = sync ? 1 : 2;
    let importPath = tokens[index + skip].value;

    let filePath = await resolve(importPath, {
      basedir: path.dirname(from),
    });

    graph = await traverse(graph, filePath);
    graph = Graph.addEdge(graph, from, filePath, async);

    return collect(graph, tokens, from, index + skip);
  } else {
    return collect(graph, tokens, from, index + 1);
  }
};

let traverse = async (graph, filePath) => {
  if (Graph.hasNode(graph, filePath)) {
    return graph;
  } else {
    let fileBuffer = await readFile(filePath);
    let fileContents = fileBuffer.toString();
    let tokens = tokenize(fileContents);

    graph = Graph.addNode(graph, { filePath, fileContents });
    graph = await collect(graph, tokens, filePath, 0);

    return graph;
  }
};

module.exports = (entry: string) => {
  return traverse(Graph.createGraph(), entry);
};
