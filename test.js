import assert from 'node:assert/strict'
import test from 'node:test'
import * as acorn from 'acorn'
import {mdxjsEsm} from 'micromark-extension-mdxjs-esm'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {mdxjsEsmFromMarkdown, mdxjsEsmToMarkdown} from 'mdast-util-mdxjs-esm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {removePosition} from 'unist-util-remove-position'

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('mdast-util-mdxjs-esm')).sort(), [
      'mdxjsEsmFromMarkdown',
      'mdxjsEsmToMarkdown'
    ])
  })
})

test('mdxjsEsmFromMarkdown()', async function (t) {
  await t.test('should support ESM', async function () {
    assert.deepEqual(
      fromMarkdown('import a from "b"\nexport var c = ""\n\nd', {
        extensions: [mdxjsEsm({acorn})],
        mdastExtensions: [mdxjsEsmFromMarkdown()]
      }),
      {
        type: 'root',
        children: [
          {
            type: 'mdxjsEsm',
            value: 'import a from "b"\nexport var c = ""',
            position: {
              start: {line: 1, column: 1, offset: 0},
              end: {line: 2, column: 18, offset: 35}
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'd',
                position: {
                  start: {line: 4, column: 1, offset: 37},
                  end: {line: 4, column: 2, offset: 38}
                }
              }
            ],
            position: {
              start: {line: 4, column: 1, offset: 37},
              end: {line: 4, column: 2, offset: 38}
            }
          }
        ],
        position: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 4, column: 2, offset: 38}
        }
      }
    )
  })

  await t.test(
    'should add a `data.estree` if `addResult` was used in the syntax extension',
    async function () {
      let tree = fromMarkdown('import a from "b"\nexport var c = ""\n\nd', {
        extensions: [mdxjsEsm({acorn, addResult: true})],
        mdastExtensions: [mdxjsEsmFromMarkdown()]
      })

      removePosition(tree, {force: true})

      // eslint-disable-next-line unicorn/prefer-structured-clone -- cheap clone to remove non-JSON values.
      tree = JSON.parse(JSON.stringify(tree))

      assert.deepEqual(tree, {
        type: 'root',
        children: [
          {
            type: 'mdxjsEsm',
            value: 'import a from "b"\nexport var c = ""',
            data: {
              estree: {
                type: 'Program',
                start: 0,
                end: 35,
                body: [
                  {
                    type: 'ImportDeclaration',
                    start: 0,
                    end: 17,
                    specifiers: [
                      {
                        type: 'ImportDefaultSpecifier',
                        start: 7,
                        end: 8,
                        local: {
                          type: 'Identifier',
                          start: 7,
                          end: 8,
                          name: 'a',
                          loc: {
                            start: {line: 1, column: 7, offset: 7},
                            end: {line: 1, column: 8, offset: 8}
                          },
                          range: [7, 8]
                        },
                        loc: {
                          start: {line: 1, column: 7, offset: 7},
                          end: {line: 1, column: 8, offset: 8}
                        },
                        range: [7, 8]
                      }
                    ],
                    source: {
                      type: 'Literal',
                      start: 14,
                      end: 17,
                      value: 'b',
                      raw: '"b"',
                      loc: {
                        start: {line: 1, column: 14, offset: 14},
                        end: {line: 1, column: 17, offset: 17}
                      },
                      range: [14, 17]
                    },
                    loc: {
                      start: {line: 1, column: 0, offset: 0},
                      end: {line: 1, column: 17, offset: 17}
                    },
                    range: [0, 17]
                  },
                  {
                    type: 'ExportNamedDeclaration',
                    start: 18,
                    end: 35,
                    declaration: {
                      type: 'VariableDeclaration',
                      start: 25,
                      end: 35,
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          start: 29,
                          end: 35,
                          id: {
                            type: 'Identifier',
                            start: 29,
                            end: 30,
                            name: 'c',
                            loc: {
                              start: {line: 2, column: 11, offset: 29},
                              end: {line: 2, column: 12, offset: 30}
                            },
                            range: [29, 30]
                          },
                          init: {
                            type: 'Literal',
                            start: 33,
                            end: 35,
                            value: '',
                            raw: '""',
                            loc: {
                              start: {line: 2, column: 15, offset: 33},
                              end: {line: 2, column: 17, offset: 35}
                            },
                            range: [33, 35]
                          },
                          loc: {
                            start: {line: 2, column: 11, offset: 29},
                            end: {line: 2, column: 17, offset: 35}
                          },
                          range: [29, 35]
                        }
                      ],
                      kind: 'var',
                      loc: {
                        start: {line: 2, column: 7, offset: 25},
                        end: {line: 2, column: 17, offset: 35}
                      },
                      range: [25, 35]
                    },
                    specifiers: [],
                    source: null,
                    loc: {
                      start: {line: 2, column: 0, offset: 18},
                      end: {line: 2, column: 17, offset: 35}
                    },
                    range: [18, 35]
                  }
                ],
                sourceType: 'module',
                comments: [],
                loc: {
                  start: {line: 1, column: 0, offset: 0},
                  end: {line: 2, column: 17, offset: 35}
                },
                range: [0, 35]
              }
            }
          },
          {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
        ]
      })
    }
  )
})

test('mdxjsEsmToMarkdown()', async function (t) {
  await t.test('should serialize ESM', async function () {
    assert.deepEqual(
      toMarkdown(
        {
          type: 'root',
          children: [
            {type: 'mdxjsEsm', value: 'import a from "b"\nexport var c = ""'},
            {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
          ]
        },
        {extensions: [mdxjsEsmToMarkdown()]}
      ),
      'import a from "b"\nexport var c = ""\n\nd\n'
    )
  })

  await t.test('should not crash on ESM missing `value`', async function () {
    assert.deepEqual(
      toMarkdown(
        {
          type: 'root',
          children: [
            // @ts-expect-error: check that the runtime handles missing `value`.
            {type: 'mdxjsEsm'},
            {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
          ]
        },
        {extensions: [mdxjsEsmToMarkdown()]}
      ),
      '\n\nd\n'
    )
  })
})
