// @flow
'use strict';
const assert = require('assert');

export type Node = {
  filePath: string,
  fileContents: string,
};

export type Edge = {
  filePath: string,
  async: boolean,
};

export type Graph = {
  nodes: { [filePath: string]: Node },
  edges: { [filePath: string]: Array<Edge> },
};

exports.createGraph = (): Graph => {
  return {
    nodes: {},
    edges: {},
  };
};

let hasNode = exports.hasNode = (graph: Graph, filePath: string): boolean => {
  return graph.nodes.hasOwnProperty(filePath);
};

let hasEdge = exports.hasEdge = (graph: Graph, from: string, to: string): boolean => {
  let edges = graph.edges[from];
  return !!(edges && edges.find(edge => edge.filePath === to));
};

exports.addNode = (graph: Graph, node: Node): Graph => {
  if (process.env.NODE_ENV === 'development') {
    assert(hasNode(graph, node.filePath), 'Cannot create a node that already exists');
  }

  return {
    nodes: {
      ...graph.nodes,
      [node.filePath]: node,
    },
    edges: graph.edges,
  };
};

exports.addEdge = (graph: Graph, from: string, to: string, async: boolean): Graph => {
  if (process.env.NODE_ENV === 'development') {
    assert(!hasNode(graph, from), 'Cannot create an edge from a node that does not exist');
    assert(!hasNode(graph, to), 'Cannot create an edge to a node that does not exist');
    assert(hasEdge(graph, from, to), 'Cannot create an edge that already exists');
  }

  let edge = { filePath: to, async };
  let prev = graph.edges[from];

  return {
    nodes: graph.nodes,
    edges: {
      ...graph.edges,
      [from]: prev ? prev.concat(edge) : [edge],
    },
  };
};
