document.addEventListener('DOMContentLoaded', function () {
  let $nav
  let mobileSidebarOpen = false

  const adjustMenu = (init) => {
    if (init) $nav = document.getElementById('nav')
    $nav.classList.toggle('hide-menu', window.innerWidth <= 800)
  }

  const initAdjust = () => {
    adjustMenu(true)
    $nav.classList.add('show')
  }

  const sidebarFn = {
    open () {
      btf.sidebarPaddingR()
      document.body.style.overflow = 'hidden'
      btf.animateIn(document.getElementById('menu-mask'), 'to_show 0.5s')
      document.getElementById('sidebar-menus').classList.add('open')
      mobileSidebarOpen = true
    },
    close () {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      btf.animateOut(document.getElementById('menu-mask'), 'to_hide 0.5s')
      document.getElementById('sidebar-menus').classList.remove('open')
      mobileSidebarOpen = false
    }
  }

  const scrollDownInIndex = () => {
    const el = document.getElementById('scroll-down')
    el && el.addEventListener('click', () => {
      btf.scrollToDest(document.getElementById('content-inner').offsetTop, 300)
    })
  }

  const addHighlightTool = () => {
    const hl = GLOBAL_CONFIG.highlight
    if (!hl) return

    const { highlightCopy, highlightLang, highlightHeightLimit } = hl
    const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink
    const isShowTool = highlightCopy || highlightLang || isHighlightShrink !== undefined
    const isPrismjs = hl.plugin === 'prismjs'
    const $figures = isPrismjs
      ? document.querySelectorAll('pre[class*="language-"]')
      : document.querySelectorAll('figure.highlight')

    if (!((isShowTool || highlightHeightLimit) && $figures.length)) return

    const shrinkClass = isHighlightShrink === true ? 'closed' : ''
    const shrinkHtml = isHighlightShrink !== undefined
      ? `<i class="fas fa-angle-down expand ${shrinkClass}"></i>` : ''
    const copyHtml = highlightCopy
      ? '<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>' : ''

    const copy = (text, ctx) => {
      if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        document.execCommand('copy')
        const prev = ctx.previousElementSibling
        prev.innerText = GLOBAL_CONFIG.copy.success
        prev.style.opacity = 1
        setTimeout(() => { prev.style.opacity = 0 }, 700)
      } else {
        ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport
      }
    }

    const highlightCopyFn = (ele) => {
      const parent = ele.parentNode
      parent.classList.add('copy-true')
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(parent.querySelector(isPrismjs ? 'pre code' : 'table .code pre'))
      selection.removeAllRanges()
      selection.addRange(range)
      copy(selection.toString(), ele.lastChild)
      selection.removeAllRanges()
      parent.classList.remove('copy-true')
    }

    const highlightShrinkFn = (ele) => {
      const siblings = [...ele.parentNode.children].slice(1)
      ele.firstChild.classList.toggle('closed')
      const display = btf.isHidden(siblings[siblings.length - 1]) ? 'block' : 'none'
      siblings.forEach(e => { e.style.display = display })
    }

    const toolClickHandler = function (e) {
      const cl = e.target.classList
      if (cl.contains('expand')) highlightShrinkFn(this)
      else if (cl.contains('copy-button')) highlightCopyFn(this)
    }

    const expandCode = function () { this.classList.toggle('expand-done') }

    const createEle = (lang, item, isHl) => {
      const frag = document.createDocumentFragment()

      if (isShowTool) {
        const tools = document.createElement('div')
        tools.className = `highlight-tools ${shrinkClass}`
        tools.innerHTML = shrinkHtml + lang + copyHtml
        tools.addEventListener('click', toolClickHandler)
        frag.appendChild(tools)
      }

      if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
        const btn = document.createElement('div')
        btn.className = 'code-expand-btn'
        btn.innerHTML = '<i class="fas fa-angle-double-down"></i>'
        btn.addEventListener('click', expandCode)
        frag.appendChild(btn)
      }

      if (isHl) item.insertBefore(frag, item.firstChild)
      else item.parentNode.insertBefore(frag, item)
    }

    $figures.forEach(item => {
      let lang = ''
      if (highlightLang) {
        const name = isPrismjs
          ? (item.getAttribute('data-language') || 'Code')
          : (item.getAttribute('class').split(' ')[1] || 'Code').replace('plain', 'Code')
        lang = `<div class="code-lang">${name}</div>`
      }
      if (isPrismjs) btf.wrap(item, 'figure', { class: 'highlight' })
      createEle(lang, item, !isPrismjs)
    })
  }

  function addPhotoFigcaption () {
    document.querySelectorAll('#article-container img').forEach(item => {
      const alt = item.title || item.alt
      if (alt && !item.parentNode.parentNode.classList.contains('justified-gallery')) {
        const el = document.createElement('div')
        el.className = 'img-alt is-center'
        el.textContent = alt
        item.parentNode.insertBefore(el, item.nextSibling)
      }
    })
  }

  const runLightbox = () => {
    btf.loadLightbox(document.querySelectorAll('#article-container img:not(.no-lightbox)'))
  }

  const runJustifiedGallery = (ele) => {
    ele.forEach(item => {
      item.querySelectorAll('img').forEach(i => {
        if (i.dataset.lazySrc) i.src = i.dataset.lazySrc
        btf.wrap(i, 'div', { class: 'fj-gallery-item' })
      })
    })

    if (window.fjGallery) {
      setTimeout(() => btf.initJustifiedGallery(ele), 100)
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = GLOBAL_CONFIG.source.justifiedGallery.css
    document.body.appendChild(link)
    getScript(GLOBAL_CONFIG.source.justifiedGallery.js).then(() => btf.initJustifiedGallery(ele))
  }

  const scrollFn = () => {
    const $rightside = document.getElementById('rightside')
    const innerHeight = window.innerHeight + 56
    const showRight = 'opacity: 0.8; transform: translateX(-58px)'

    if (document.body.scrollHeight <= innerHeight) {
      $rightside.style.cssText = 'opacity: 1; transform: translateX(-58px)'
      return
    }

    let initTop = 0
    const $header = document.getElementById('page-header')

    window.scrollCollect = btf.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop
      const isDown = currentTop > initTop
      initTop = currentTop

      if (currentTop > 56) {
        $header.classList.toggle('nav-visible', !isDown)
        $header.classList.add('nav-fixed')
        if (window.getComputedStyle($rightside).opacity === '0') {
          $rightside.style.cssText = showRight
        }
      } else {
        if (currentTop === 0) $header.classList.remove('nav-fixed', 'nav-visible')
        $rightside.style.cssText = "opacity: ''; transform: ''"
      }

      if (document.body.scrollHeight <= innerHeight) {
        $rightside.style.cssText = showRight
      }
    }, 200)

    window.addEventListener('scroll', window.scrollCollect)
  }

  const scrollFnToDo = () => {
    const isToc = GLOBAL_CONFIG_SITE.isToc
    const isAnchor = GLOBAL_CONFIG.isAnchor
    const $article = document.getElementById('article-container')

    if (!($article && (isToc || isAnchor))) return

    let $tocLink, $cardToc, scrollPercent, autoScrollToc, isExpand

    if (isToc) {
      const $cardTocLayout = document.getElementById('card-toc')
      $cardToc = $cardTocLayout.getElementsByClassName('toc-content')[0]
      $tocLink = $cardToc.querySelectorAll('.toc-link')
      const $tocPercentage = $cardTocLayout.querySelector('.toc-percentage')
      isExpand = $cardToc.classList.contains('is-expand')

      scrollPercent = currentTop => {
        const contentMath = Math.max($article.clientHeight, document.documentElement.scrollHeight) - document.documentElement.clientHeight
        const pct = Math.round(((currentTop - $article.offsetTop) / contentMath) * 100)
        $tocPercentage.textContent = Math.max(0, Math.min(100, pct))
      }

      window.mobileToc = {
        open: () => { $cardTocLayout.style.cssText = 'animation: toc-open .3s; opacity: 1; right: 55px' },
        close: () => {
          $cardTocLayout.style.animation = 'toc-close .2s'
          setTimeout(() => { $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''" }, 100)
        }
      }

      $cardToc.addEventListener('click', e => {
        e.preventDefault()
        const cl = e.target.classList
        if (cl.contains('toc-content')) return
        const target = cl.contains('toc-link') ? e.target : e.target.parentElement
        btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI(target.getAttribute('href')).replace('#', ''))), 300)
        if (window.innerWidth < 900) window.mobileToc.close()
      })

      autoScrollToc = item => {
        const pos = item.getBoundingClientRect().top
        const clientH = document.documentElement.clientHeight
        if (pos > clientH - 100) $cardToc.scrollTop += 150
        if (pos < 100) $cardToc.scrollTop -= 150
      }
    }

    const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
    let detectItem = ''

    const findHeadPosition = (top) => {
      if (top === 0) return

      let currentId = '', currentIndex = ''
      list.forEach((ele, index) => {
        if (top > btf.getEleTop(ele) - 80) {
          currentId = ele.id ? '#' + encodeURI(ele.id) : ''
          currentIndex = index
        }
      })

      if (detectItem === currentIndex) return
      if (isAnchor) btf.updateAnchor(currentId)
      detectItem = currentIndex

      if (isToc) {
        $cardToc.querySelectorAll('.active').forEach(i => i.classList.remove('active'))
        if (currentId === '') return

        const active = $tocLink[currentIndex]
        active.classList.add('active')
        setTimeout(() => autoScrollToc(active), 0)

        if (isExpand) return
        for (let p = active.parentNode; !p.matches('.toc'); p = p.parentNode) {
          if (p.matches('li')) p.classList.add('active')
        }
      }
    }

    window.tocScrollFn = btf.throttle(() => {
      const top = window.scrollY || document.documentElement.scrollTop
      if (isToc) scrollPercent(top)
      findHeadPosition(top)
    }, 100)
    window.addEventListener('scroll', window.tocScrollFn)
  }

  const rightSideFn = {
    switchReadMode () {
      const body = document.body
      body.classList.add('read-mode')
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'fas fa-sign-out-alt exit-readmode'
      body.appendChild(btn)
      const exit = () => { body.classList.remove('read-mode'); btn.remove() }
      btn.addEventListener('click', exit)
    },
    switchDarkMode () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      isDark ? activateLightMode() : activateDarkMode()
      saveToLocal.set('theme', isDark ? 'light' : 'dark', 2)
    },
    showOrHideBtn (e) {
      const cl = document.getElementById('rightside-config-hide').classList
      cl.toggle('show')
      if (e.classList.contains('show')) {
        cl.add('status')
        setTimeout(() => cl.remove('status'), 300)
      }
      e.classList.toggle('show')
    },
    scrollToTop: () => btf.scrollToDest(0, 500),
    hideAsideBtn () {
      const cl = document.documentElement.classList
      saveToLocal.set('aside-status', cl.contains('hide-aside') ? 'show' : 'hide', 2)
      cl.toggle('hide-aside')
    },
    runMobileToc () {
      const toc = document.getElementById('card-toc')
      window.getComputedStyle(toc).opacity === '0' ? window.mobileToc.open() : window.mobileToc.close()
    }
  }

  document.getElementById('rightside').addEventListener('click', e => {
    const target = e.target.id ? e.target : e.target.parentNode
    const actions = {
      'go-up': rightSideFn.scrollToTop,
      'rightside_config': () => rightSideFn.showOrHideBtn(target),
      'mobile-toc-button': rightSideFn.runMobileToc,
      'readmode': rightSideFn.switchReadMode,
      'darkmode': rightSideFn.switchDarkMode,
      'hide-aside-btn': rightSideFn.hideAsideBtn
    }
    const action = actions[target.id]
    if (action) action()
  })

  const clickFnOfSubMenu = () => {
    document.querySelectorAll('#sidebar-menus .site-page.group').forEach(item => {
      item.addEventListener('click', function () { this.classList.toggle('hide') })
    })
  }

  const addCopyright = () => {
    const { limitCount, languages } = GLOBAL_CONFIG.copyright
    document.body.oncopy = e => {
      e.preventDefault()
      const copyFont = window.getSelection(0).toString()
      const text = copyFont.length > limitCount
        ? `${copyFont}\n\n\n${languages.author}\n${languages.link}${location.href}\n${languages.source}\n${languages.info}`
        : copyFont
      ;(e.clipboardData || window.clipboardData).setData('text', text)
    }
  }

  const addLastPushDate = () => {
    const el = document.getElementById('last-push-date')
    if (el) el.innerText = btf.diffDate(el.dataset.lastpushdate, true)
  }

  const addTableWrap = () => {
    document.querySelectorAll('#article-container :not(.highlight) > table, #article-container > table').forEach(item => {
      btf.wrap(item, 'div', { class: 'table-wrap' })
    })
  }

  const clickFnOfTagHide = () => {
    document.querySelectorAll('#article-container .hide-button').forEach(item => {
      item.addEventListener('click', function () {
        this.classList.add('open')
        const gallery = this.nextElementSibling.querySelectorAll('.fj-gallery')
        if (gallery.length) btf.initJustifiedGallery(gallery)
      })
    })
  }

  const tabsFn = {
    clickFnOfTabs () {
      document.querySelectorAll('#article-container .tab > button').forEach(item => {
        item.addEventListener('click', function () {
          const tabItem = this.parentNode
          if (tabItem.classList.contains('active')) return

          const tabContent = tabItem.parentNode.nextElementSibling
          const sibling = btf.siblings(tabItem, '.active')[0]
          if (sibling) sibling.classList.remove('active')
          tabItem.classList.add('active')

          const tabId = this.dataset.href.replace('#', '')
          ;[...tabContent.children].forEach(c => c.classList.toggle('active', c.id === tabId))

          const gallery = tabContent.querySelectorAll(`#${tabId} .fj-gallery`)
          if (gallery.length) btf.initJustifiedGallery(gallery)
        })
      })
    },
    backToTop () {
      document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(item => {
        item.addEventListener('click', function () {
          btf.scrollToDest(btf.getEleTop(btf.getParents(this, '.tabs')), 300)
        })
      })
    }
  }

  const toggleCardCategory = () => {
    document.querySelectorAll('#aside-cat-list .card-category-list-item.parent i').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault()
        this.classList.toggle('expand')
        const next = this.parentNode.nextElementSibling
        next.style.display = btf.isHidden(next) ? 'block' : 'none'
      })
    })
  }

  const switchComments = () => {
    let switchDone = false
    const btn = document.querySelector('#comment-switch > .switch-btn')
    btn && btn.addEventListener('click', function () {
      this.classList.toggle('move')
      document.querySelectorAll('#post-comment > .comment-wrap > div').forEach(item => {
        item.style.cssText = btf.isHidden(item)
          ? 'display: block;animation: tabshow .5s'
          : "display: none;animation: ''"
      })
      if (!switchDone && typeof loadOtherComment === 'function') {
        switchDone = true
        loadOtherComment()
      }
    })
  }

  const lazyloadImg = () => {
    window.lazyLoadInstance = new LazyLoad({ elements_selector: 'img', threshold: 0, data_src: 'lazy-src' })
  }

  const relativeDate = (selector) => {
    selector.forEach(el => {
      el.innerText = btf.diffDate(el.getAttribute('datetime'), true)
      el.style.display = 'inline'
    })
  }

  const unRefreshFn = () => {
    window.addEventListener('resize', () => {
      adjustMenu(false)
      if (btf.isHidden(document.getElementById('toggle-menu')) && mobileSidebarOpen) sidebarFn.close()
    })
    document.getElementById('menu-mask').addEventListener('click', () => sidebarFn.close())
    clickFnOfSubMenu()
    if (GLOBAL_CONFIG.islazyload) lazyloadImg()
    if (GLOBAL_CONFIG.copyright !== undefined) addCopyright()
  }

  window.refreshFn = () => {
    initAdjust()

    if (GLOBAL_CONFIG_SITE.isPost) {
      if (GLOBAL_CONFIG.relativeDate.post) relativeDate(document.querySelectorAll('#post-meta time'))
    } else {
      if (GLOBAL_CONFIG.relativeDate.homepage) relativeDate(document.querySelectorAll('#recent-posts time'))
      addLastPushDate()
      toggleCardCategory()
    }

    scrollFnToDo()
    if (GLOBAL_CONFIG_SITE.isHome) scrollDownInIndex()
    addHighlightTool()
    if (GLOBAL_CONFIG.isPhotoFigcaption) addPhotoFigcaption()
    scrollFn()

    const $jgEle = document.querySelectorAll('#article-container .fj-gallery')
    if ($jgEle.length) runJustifiedGallery($jgEle)

    runLightbox()
    addTableWrap()
    clickFnOfTagHide()
    tabsFn.clickFnOfTabs()
    tabsFn.backToTop()
    switchComments()
    document.getElementById('toggle-menu').addEventListener('click', () => sidebarFn.open())
  }

  refreshFn()
  unRefreshFn()
})
