/**
 * @typedef {import('mdast').Literal} Literal
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('estree-jsx').Program} Estree
 *
 * @typedef {Literal & {type: 'mdxjsEsm', data: {estree?: Estree}}} MDXJSEsm
 */

/** @type {FromMarkdownExtension} */
export const mdxjsEsmFromMarkdown = {
  enter: {mdxjsEsm: enterMdxjsEsm},
  exit: {mdxjsEsm: exitMdxjsEsm, mdxjsEsmData: exitMdxjsEsmData}
}

/** @type {ToMarkdownExtension} */
export const mdxjsEsmToMarkdown = {handlers: {mdxjsEsm: handleMdxjsEsm}}

/** @type {FromMarkdownHandle} */
function enterMdxjsEsm(token) {
  // @ts-expect-error: custom.
  this.enter({type: 'mdxjsEsm', value: ''}, token)
  this.buffer() // Capture EOLs
}

/** @type {FromMarkdownHandle} */
function exitMdxjsEsm(token) {
  const value = this.resume()
  const node = this.exit(token)
  /** @type {Estree?} */
  // @ts-expect-error: custom.
  const estree = token.estree

  node.value = value

  if (estree) {
    node.data = {estree}
  }
}

/** @type {FromMarkdownHandle} */
function exitMdxjsEsmData(token) {
  this.config.enter.data.call(this, token)
  this.config.exit.data.call(this, token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {MDXJSEsm} node
 */
function handleMdxjsEsm(node) {
  return node.value || ''
}
