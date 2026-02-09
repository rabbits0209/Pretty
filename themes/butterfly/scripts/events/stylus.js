/**
 * stylus
 */

'use strict'

hexo.extend.filter.register('stylus:renderer', function (style) {
  const { highlight } = hexo.config
  style
    .define('$highlight_enable', highlight && highlight.enable)
    .define('$highlight_line_number', highlight && highlight.line_number)
})
