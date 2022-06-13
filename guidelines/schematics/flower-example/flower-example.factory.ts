import { strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { FlowerExampleOptions } from './flower-example.schema';

export function main(options: FlowerExampleOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([mergeWith(generate(options))]),
    )(tree, context);
  };
}

function generate(options: FlowerExampleOptions) {
  return (context: SchematicContext) =>
    apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
      move('.'),
    ])(context);
}
