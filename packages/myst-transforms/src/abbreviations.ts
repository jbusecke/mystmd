import type { Plugin } from 'unified';
import type { Root, StaticPhrasingContent } from 'mdast';
import { toText } from 'myst-common';
import { selectAll } from 'unist-util-select';
import type { Abbreviation } from 'myst-spec';
import { u } from 'unist-builder';
import type { FindAndReplaceSchema, RegExpMatchObject } from 'mdast-util-find-and-replace';
import { findAndReplace } from 'mdast-util-find-and-replace';

type Options = {
  abbreviations?: Record<string, string>;
};

// We will not replace abbreviation text inside of these nodes
const doNotModifyParents = new Set(['link', 'crossReference', 'cite', 'code', 'abbreviation']);

function replaceText(mdast: Root, opts: Options) {
  if (!opts?.abbreviations || Object.keys(opts.abbreviations).length === 0) return;
  const replacements: FindAndReplaceSchema = Object.fromEntries(
    Object.entries(opts.abbreviations)
      .filter(([abbr]) => abbr.length > 1) // We can't match on single characters!
      .map(([abbr, title]) => [
        abbr,
        (value: any, { stack }: RegExpMatchObject) => {
          if (stack.slice(-1)[0].type !== 'text') return false;
          const parent = stack.find((p) => doNotModifyParents.has(p.type));
          if (parent) return false;
          return u('abbreviation', { title }, [
            u('text', value),
          ]) as unknown as StaticPhrasingContent;
        },
      ]),
  );
  findAndReplace(mdast, replacements);
}

export function abbreviationTransform(mdast: Root, opts?: Options) {
  if (!opts?.abbreviations || Object.keys(opts.abbreviations).length === 0) return;
  const abbreviations = selectAll('abbreviation', mdast) as Abbreviation[];
  abbreviations.forEach((node) => {
    if (node.title) return;
    const abbr = toText(node);
    const title = opts.abbreviations?.[abbr];
    if (title) node.title = title;
  });
  replaceText(mdast, opts);
}

export const abbreviationPlugin: Plugin<[Options], Root, Root> = (opts) => (tree) => {
  abbreviationTransform(tree, opts);
};