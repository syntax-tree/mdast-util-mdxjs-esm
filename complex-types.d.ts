import {type Literal} from 'mdast'
import {type Program} from 'estree-jsx'

export type MdxjsEsm = {
  type: 'mdxjsEsm'
  data?: {estree?: Program} & Literal['data']
} & Literal

declare module 'mdast' {
  type BlockContentMap = {
    mdxjsEsm: MdxjsEsm
  }
}

declare module 'hast' {
  type RootContentMap = {
    mdxjsEsm: MdxjsEsm
  }
  type ElementContentMap = {
    mdxjsEsm: MdxjsEsm
  }
}
