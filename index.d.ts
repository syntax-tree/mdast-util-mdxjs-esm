import type {Literal} from 'mdast'
import type {Program} from 'estree-jsx'

export {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from './lib/index.js'

/**
 * MDX ESM (import/export) node.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxjsEsm extends Literal {
  /**
   * Node type.
   */
  type: 'mdxjsEsm'

  /**
   * Data.
   */
  data?: {
    /**
     * Program node from estree.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    estree?: Program | null | undefined
  }
}

/**
 * Deprecated: use the `MdxjsEsm` type instead.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type MDXJSEsm = MdxjsEsm

// Add nodes to content.
declare module 'mdast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BlockContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsm
  }
}

declare module 'hast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RootContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsm
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ElementContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsm
  }
}
