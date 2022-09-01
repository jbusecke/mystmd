import type { PageFrontmatter } from '@curvenote/frontmatter';

export const DEFAULT_IMAGE_WIDTH = 0.7;
export const DEFAULT_PAGE_WIDTH_PIXELS = 800;

export type Handler = (node: any, state: ITexSerializer, parent: any) => void;

export type LatexResult = {
  value: string;
  imports?: string[];
  commands?: string[];
};

export type Options = {
  handlers?: Record<string, Handler>;
  math?: PageFrontmatter['math'];
  localizeId?: (src: string) => string;
  localizeLink?: (src: string) => string;
  localizeImageSrc?: (src: string) => string;
};

export interface ITexSerializer {
  isInTable: boolean;
  longFigure?: boolean;
  nextCaptionNumbered?: boolean;
  nextCaptionId?: string;
  options: Options;
  mathPlugins: Required<PageFrontmatter>['math'];
  write: (value: string) => void;
  text: (value: string, mathMode?: boolean) => void;
  trimEnd: () => void;
  ensureNewLine: (trim?: boolean) => void;
  renderChildren: (node: any, inline?: boolean, delim?: string) => void;
  renderInlineEnvironment: (node: any, env: string, opts?: { after?: string }) => void;
  renderEnvironment: (
    node: any,
    env: string,
    opts?: { parameters?: string; arguments?: string[] },
  ) => void;
  closeBlock: (node: any) => void;
}
