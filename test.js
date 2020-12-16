var test = require('tape')
var acorn = require('acorn')
var fromMarkdown = require('mdast-util-from-markdown')
var toMarkdown = require('mdast-util-to-markdown')
var removePosition = require('unist-util-remove-position')
var syntax = require('micromark-extension-mdxjs-esm')
var mdxjsEsm = require('.')

test('markdown -> mdast', function (t) {
  t.deepEqual(
    fromMarkdown('import a from "b"\nexport var c = ""\n\nd', {
      extensions: [syntax({acorn: acorn})],
      mdastExtensions: [mdxjsEsm.fromMarkdown]
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
    },
    'should support ESM'
  )

  t.deepEqual(
    // Cheap clone to remove non-JSON values.
    JSON.parse(
      JSON.stringify(
        removePosition(
          fromMarkdown('import a from "b"\nexport var c = ""\n\nd', {
            extensions: [syntax({acorn: acorn, addResult: true})],
            mdastExtensions: [mdxjsEsm.fromMarkdown]
          }),
          true
        )
      )
    ),
    {
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
              loc: {start: {line: 1, column: 0}, end: {line: 2, column: 17}},
              body: [
                {
                  type: 'ImportDeclaration',
                  start: 0,
                  end: 17,
                  loc: {
                    start: {line: 1, column: 0},
                    end: {line: 1, column: 17}
                  },
                  specifiers: [
                    {
                      type: 'ImportDefaultSpecifier',
                      start: 7,
                      end: 8,
                      loc: {
                        start: {line: 1, column: 7},
                        end: {line: 1, column: 8}
                      },
                      local: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        loc: {
                          start: {line: 1, column: 7},
                          end: {line: 1, column: 8}
                        },
                        name: 'a',
                        range: [7, 8]
                      },
                      range: [7, 8]
                    }
                  ],
                  source: {
                    type: 'Literal',
                    start: 14,
                    end: 17,
                    loc: {
                      start: {line: 1, column: 14},
                      end: {line: 1, column: 17}
                    },
                    value: 'b',
                    raw: '"b"',
                    range: [14, 17]
                  },
                  range: [0, 17]
                },
                {
                  type: 'ExportNamedDeclaration',
                  start: 18,
                  end: 35,
                  loc: {
                    start: {line: 2, column: 0},
                    end: {line: 2, column: 17}
                  },
                  declaration: {
                    type: 'VariableDeclaration',
                    start: 25,
                    end: 35,
                    loc: {
                      start: {line: 2, column: 7},
                      end: {line: 2, column: 17}
                    },
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 29,
                        end: 35,
                        loc: {
                          start: {line: 2, column: 11},
                          end: {line: 2, column: 17}
                        },
                        id: {
                          type: 'Identifier',
                          start: 29,
                          end: 30,
                          loc: {
                            start: {line: 2, column: 11},
                            end: {line: 2, column: 12}
                          },
                          name: 'c',
                          range: [29, 30]
                        },
                        init: {
                          type: 'Literal',
                          start: 33,
                          end: 35,
                          loc: {
                            start: {line: 2, column: 15},
                            end: {line: 2, column: 17}
                          },
                          value: '',
                          raw: '""',
                          range: [33, 35]
                        },
                        range: [29, 35]
                      }
                    ],
                    kind: 'var',
                    range: [25, 35]
                  },
                  specifiers: [],
                  source: null,
                  range: [18, 35]
                }
              ],
              sourceType: 'module',
              range: [0, 35]
            }
          }
        },
        {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
      ]
    },
    'should add a `data.estree` if `addResult` was used in the syntax plugin'
  )

  t.end()
})

test('mdast -> markdown', function (t) {
  t.deepEqual(
    toMarkdown(
      {
        type: 'root',
        children: [
          {type: 'mdxjsEsm', value: 'import a from "b"\nexport var c = ""'},
          {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
        ]
      },
      {extensions: [mdxjsEsm.toMarkdown]}
    ),
    'import a from "b"\nexport var c = ""\n\nd\n',
    'should serialize ESM'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'root',
        children: [
          {type: 'mdxjsEsm'},
          {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
        ]
      },
      {extensions: [mdxjsEsm.toMarkdown]}
    ),
    '\n\nd\n',
    'should not crash on ESM missing `value`'
  )

  t.end()
})
