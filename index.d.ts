import type {Program} from 'estree-jsx'
import type {Literal as HastLiteral} from 'hast'
import type {Literal as MdastLiteral} from 'mdast'

export {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from './lib/index.js'

/**
 * MDX ESM (import/export) node.
 */
export interface MdxjsEsm extends MdastLiteral {
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
    estree?: Program | null | undefined
  }
}

/**
 * Deprecated: use the `MdxjsEsm` type instead.
 */
export type MDXJSEsm = MdxjsEsm

/**
 * MDX ESM (import/export) node (for hast).
 */
export interface MdxjsEsmHast extends HastLiteral {
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
    estree?: Program | null | undefined
  }
}

// Add nodes to mdast content.
declare module 'mdast' {
  interface FrontmatterContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsm
  }

  interface RootContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsm
  }
}

// Add nodes to hast content.
declare module 'hast' {
  interface RootContentMap {
    /**
     * MDX ESM.
     */
    mdxjsEsm: MdxjsEsmHast
  }
}
