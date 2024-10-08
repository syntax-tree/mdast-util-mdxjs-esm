/**
 * @import {CompileContext, Extension as FromMarkdownExtension, Handle as FromMarkdownHandle} from 'mdast-util-from-markdown'
 * @import {Handle as ToMarkdownHandle, Options as ToMarkdownExtension} from 'mdast-util-to-markdown'
 * @import {MdxjsEsm} from 'mdast-util-mdxjs-esm'
 */

import {ok as assert} from 'devlop'

/**
 * Create an extension for `mdast-util-from-markdown` to enable MDX.js ESM in
 * markdown.
 *
 * When using the micromark syntax extension with `addResult`, nodes will have
 * a `data.estree` field set to an ESTree [`Program`][program] node.
 *
 * @returns {FromMarkdownExtension}
 *   Extension for `mdast-util-from-markdown` to enable MDX.js ESM.
 */
export function mdxjsEsmFromMarkdown() {
  return {
    enter: {mdxjsEsm: enterMdxjsEsm},
    exit: {mdxjsEsm: exitMdxjsEsm, mdxjsEsmData: exitMdxjsEsmData}
  }
}

/**
 * Create an extension for `mdast-util-to-markdown` to enable MDX.js ESM in
 * markdown.
 *
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown` to enable MDX.js ESM.
 */
export function mdxjsEsmToMarkdown() {
  return {handlers: {mdxjsEsm: handleMdxjsEsm}}
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterMdxjsEsm(token) {
  this.enter({type: 'mdxjsEsm', value: ''}, token)
  this.buffer() // Capture EOLs
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitMdxjsEsm(token) {
  const value = this.resume()
  const node = this.stack[this.stack.length - 1]
  assert(node.type === 'mdxjsEsm')

  this.exit(token)

  const estree = token.estree

  node.value = value

  if (estree) {
    node.data = {estree}
  }
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitMdxjsEsmData(token) {
  this.config.enter.data.call(this, token)
  this.config.exit.data.call(this, token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {MdxjsEsm} node
 */
function handleMdxjsEsm(node) {
  return node.value || ''
}
