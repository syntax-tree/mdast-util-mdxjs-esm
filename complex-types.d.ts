import type {Literal} from 'mdast'
import type {Program} from 'estree-jsx'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MdxjsEsm extends Literal {
  type: 'mdxjsEsm'
  data?: {estree?: Program}
}

declare module 'mdast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BlockContentMap {
    mdxjsEsm: MdxjsEsm
  }
}

declare module 'hast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RootContentMap {
    mdxjsEsm: MdxjsEsm
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ElementContentMap {
    mdxjsEsm: MdxjsEsm
  }
}
