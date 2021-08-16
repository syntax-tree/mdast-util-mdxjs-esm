import {Literal} from 'mdast'
import {Program} from 'estree-jsx'

export interface MDXJSEsm extends Literal {
  type: 'mdxjsEsm'
  data?: {estree?: Program} & Literal['data']
  value?: string
}

declare module 'mdast' {
  interface BlockContentMap {
    mdxjsEsm: MDXJSEsm
  }
}
