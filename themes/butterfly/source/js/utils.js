const btf = {
  debounce (func, wait, immediate) {
    let timeout
    return function () {
      const context = this
      const args = arguments
      const later = () => {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  },

  throttle (func, wait, options = {}) {
    let timeout, context, args, previous = 0

    const later = () => {
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      func.apply(context, args)
      if (!timeout) context = args = null
    }

    return function () {
      const now = Date.now()
      if (!previous && options.leading === false) previous = now
      const remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) { clearTimeout(timeout); timeout = null }
        previous = now
        func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      }
    }
  },

  sidebarPaddingR () {
    const paddingRight = window.innerWidth - document.body.clientWidth
    if (paddingRight) document.body.style.paddingRight = paddingRight + 'px'
  },

  diffDate (d, more = false) {
    const dateDiff = Date.now() - new Date(d).getTime()
    const minute = 6e4
    const hour = 36e5
    const day = 864e5
    const month = day * 30

    if (!more) return Math.floor(dateDiff / day)

    const s = GLOBAL_CONFIG.date_suffix
    if (dateDiff / month > 12) return new Date(d).toLocaleDateString().replace(/\//g, '-')
    if (dateDiff >= month) return Math.floor(dateDiff / month) + ' ' + s.month
    if (dateDiff >= day) return Math.floor(dateDiff / day) + ' ' + s.day
    if (dateDiff >= hour) return Math.floor(dateDiff / hour) + ' ' + s.hour
    if (dateDiff >= minute) return Math.floor(dateDiff / minute) + ' ' + s.min
    return s.just
  },

  loadComment (dom, callback) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { callback(); observer.disconnect() }
      }, { threshold: [0] })
      observer.observe(dom)
    } else {
      callback()
    }
  },

  scrollToDest (pos, time = 500) {
    const currentPos = window.pageYOffset
    if (currentPos > pos) pos -= 70
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: pos, behavior: 'smooth' })
      return
    }
    let start = null
    pos = +pos
    requestAnimationFrame(function step (ts) {
      start = start || ts
      const progress = ts - start
      const ratio = Math.min(progress / time, 1)
      window.scrollTo(0, currentPos + (pos - currentPos) * ratio)
      if (progress < time) requestAnimationFrame(step)
    })
  },

  animateIn (ele, text) {
    ele.style.display = 'block'
    ele.style.animation = text
  },

  animateOut (ele, text) {
    ele.addEventListener('animationend', function f () {
      ele.style.display = ''
      ele.style.animation = ''
      ele.removeEventListener('animationend', f)
    })
    ele.style.animation = text
  },

  getParents (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem
    }
    return null
  },

  siblings (ele, selector) {
    return [...ele.parentNode.children].filter(child =>
      child !== ele && (!selector || child.matches(selector))
    )
  },

  wrap (selector, eleType, options) {
    const el = document.createElement(eleType)
    Object.entries(options).forEach(([k, v]) => el.setAttribute(k, v))
    selector.parentNode.insertBefore(el, selector)
    el.appendChild(selector)
  },

  unwrap (el) {
    const parent = el.parentNode
    if (parent !== document.body) {
      parent.parentNode.insertBefore(el, parent)
      parent.remove()
    }
  },

  isHidden: ele => ele.offsetHeight === 0 && ele.offsetWidth === 0,

  getEleTop (ele) {
    let top = ele.offsetTop
    let current = ele.offsetParent
    while (current) { top += current.offsetTop; current = current.offsetParent }
    return top
  },

  loadLightbox (ele) {
    if (GLOBAL_CONFIG.lightbox !== 'fancybox') return

    ele.forEach(i => {
      if (i.parentNode.tagName !== 'A') {
        const src = i.dataset.lazySrc || i.src
        btf.wrap(i, 'a', {
          href: src,
          'data-fancybox': 'gallery',
          'data-caption': i.title || i.alt || '',
          'data-thumb': src
        })
      }
    })

    if (!window.fancyboxRun) {
      Fancybox.bind('[data-fancybox]', { Hash: false, Thumbs: { autoStart: false } })
      window.fancyboxRun = true
    }
  },

  initJustifiedGallery (selector) {
    selector.forEach(i => {
      if (!btf.isHidden(i)) {
        fjGallery(i, {
          itemSelector: '.fj-gallery-item',
          rowHeight: 220,
          gutter: 4,
          onJustify () { this.$container.style.opacity = '1' }
        })
      }
    })
  },

  updateAnchor (anchor) {
    if (anchor !== window.location.hash) {
      const title = GLOBAL_CONFIG_SITE.title
      window.history.replaceState({ url: location.href, title }, title, anchor || location.pathname)
    }
  }
}
