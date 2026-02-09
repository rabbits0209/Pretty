'use strict'

const pluginname = 'butterfly_categories_card'

// Read priority from config; must be higher number than swiper's (default 10)
// so that this filter runs AFTER swiper, meaning its injector is registered later,
// its script tag appears later in HTML, executes later, and afterbegin puts it on top... 
// BUT we want categoryBar BELOW swiper. So we need categoryBar's script to run FIRST.
// Lower priority number = runs first. Swiper defaults to 10, so we use a number < 10.
const categoryBarConfig = hexo.config.categoryBar || hexo.theme.config.categoryBar || {}
const filterPriority = categoryBarConfig.priority || 5

hexo.extend.filter.register('after_generate', function () {
  const config = hexo.config.categoryBar || hexo.theme.config.categoryBar
  if (!(config && config.enable)) return

  const urlFor = require('hexo-util').url_for.bind(hexo)
  const categoriesList = hexo.locals.get('categories').data
  const categoriesMessage = config.message || []

  const mergedList = categoriesList.map((cat, i) => ({
    name: cat.name,
    path: cat.path,
    length: cat.length,
    descr: categoriesMessage[i] ? categoriesMessage[i].descr : '',
    cover: categoriesMessage[i] ? categoriesMessage[i].cover : ''
  }))

  const pjaxEnabled = hexo.theme.config.pjax && hexo.theme.config.pjax.enable
  const enablePage = config.enable_page || '/'
  const layoutType = config.layout.type
  const layoutName = config.layout.name
  const layoutIndex = config.layout.index || 0
  const column = config.column || 'odd'
  const row = config.row || 2
  const customCss = config.custom_css
    ? urlFor(config.custom_css)
    : '/css/categorybar.css'

  // Build category items HTML
  let itemsHtml = ''
  mergedList.forEach(cl => {
    const cleanPath = cl.path.replace(/^\/?categories\//, '')
    const linkHtml = pjaxEnabled
      ? `<a class="categoryBar-list-link" onclick="pjax.loadUrl('/categories/${cleanPath}');" href="javascript:void(0);">${cl.name}</a>`
      : `<a class="categoryBar-list-link" href="/categories/${cleanPath}">${cl.name}</a>`
    itemsHtml += `<li class="categoryBar-list-item" style="background:url(${cl.cover});">${linkHtml}<span class="categoryBar-list-count">${cl.length}</span><span class="categoryBar-list-descr">${cl.descr}</span></li>`
  })

  const templeHtml = `<div class="recent-post-item" style="height:auto;width:100%;padding:0px;"><div id="categoryBar"><ul class="categoryBar-list">${itemsHtml}</ul></div></div>`

  // Column width style
  const prow = 190 * row + 'px'
  const mrow = 160 * row + 'px'
  let columnStyle = ''
  if (column === 'even') {
    columnStyle = `<style>li.categoryBar-list-item{width:24%;}.categoryBar-list{max-height:${prow};overflow:auto;}.categoryBar-list::-webkit-scrollbar{width:0!important}@media screen and (max-width:650px){.categoryBar-list{max-height:${mrow};}}</style>`
  } else {
    columnStyle = `<style>li.categoryBar-list-item{width:32.3%;}.categoryBar-list{max-height:${prow};overflow:auto;}.categoryBar-list::-webkit-scrollbar{width:0!important}@media screen and (max-width:650px){.categoryBar-list{max-height:${mrow};}}</style>`
  }

  // Get layout container
  let getLayout
  if (layoutType === 'class') {
    getLayout = `document.getElementsByClassName('${layoutName}')[${layoutIndex}]`
  } else {
    getLayout = `document.getElementById('${layoutName}')`
  }

  const jsCode = `<script data-pjax>
function ${pluginname}_injector_config(){
  var parent_div_git = ${getLayout};
  if (!parent_div_git) return;
  var item_html = '${templeHtml.replace(/'/g, "\\'")}';
  parent_div_git.insertAdjacentHTML("afterbegin",item_html)
}
if (location.pathname.startsWith('${enablePage}') || '${enablePage}' === 'all') {
  ${pluginname}_injector_config();
}
</script>`

  const cssLink = `<link rel="stylesheet" href="${customCss}">`

  hexo.extend.injector.register('body_end', jsCode, 'default')
  hexo.extend.injector.register('body_end', columnStyle, 'default')
  hexo.extend.injector.register('head_end', cssLink, 'default')
}, filterPriority)
