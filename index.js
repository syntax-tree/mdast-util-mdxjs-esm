export const mdxjsEsmFromMarkdown = {
  enter: {mdxjsEsm: enterMdxjsEsm},
  exit: {mdxjsEsm: exitMdxjsEsm, mdxjsEsmData: exitMdxjsEsmData}
}

export const mdxjsEsmToMarkdown = {handlers: {mdxjsEsm: handleMdxjsEsm}}

function enterMdxjsEsm(token) {
  this.enter({type: 'mdxjsEsm', value: ''}, token)
  this.buffer() // Capture EOLs
}

function exitMdxjsEsm(token) {
  const value = this.resume()
  const node = this.exit(token)

  node.value = value

  if (token.estree) {
    node.data = {estree: token.estree}
  }
}

function exitMdxjsEsmData(token) {
  this.config.enter.data.call(this, token)
  this.config.exit.data.call(this, token)
}

function handleMdxjsEsm(node) {
  return node.value || ''
}
