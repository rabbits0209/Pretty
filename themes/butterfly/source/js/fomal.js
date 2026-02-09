/* ============================================================
 * fomal.js - 兔兔博客 自定义功能脚本 (优化版)
 * ============================================================ */

// ==================== 工具函数 ====================

// 防抖
function debounce(fn, time) {
  if (fn._timer) clearTimeout(fn._timer)
  fn._timer = setTimeout(fn, time)
}

// 注册 DOMContentLoaded + pjax:complete 双事件
function onReady(fn) {
  document.addEventListener('DOMContentLoaded', fn)
  document.addEventListener('pjax:complete', fn)
}

// 移动端检测
const isMobile = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent)

// Vue通知封装
function notify(title, message, type = 'success') {
  new Vue({
    data() {
      this.$notify({ title, message, position: 'top-left', offset: 50, showClose: true, type, duration: 5000 })
    }
  })
}

// 复制到剪贴板
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const txa = document.createElement('textarea')
    txa.value = text
    document.body.appendChild(txa)
    txa.select()
    document.execCommand('Copy')
    document.body.removeChild(txa)
  }
}

// ==================== 阅读进度 ====================

function percent() {
  try { rmf.showRightMenu(false); $('.rmMask').attr('style', 'display: none') } catch (err) {}

  const a = document.documentElement.scrollTop
  const b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight
  const result = Math.round(a / b * 100)
  const btn = document.querySelector('#go-up')

  if (result < 95) {
    btn.childNodes[0].style.display = 'none'
    btn.childNodes[1].style.display = 'block'
    btn.childNodes[1].innerHTML = result + '<span>%</span>'
  } else {
    btn.childNodes[1].style.display = 'none'
    btn.childNodes[0].style.display = 'block'
  }
}

onReady(() => { window.onscroll = percent })

// ==================== 文章卡片入场动画 ====================
function initCardAnimation() {
  const cards = document.querySelectorAll('.recent-post-item')
  if (!cards.length) return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // ratio 0~1 映射到 opacity 和 translateY
        const r = entry.intersectionRatio
        entry.target.style.opacity = r
        entry.target.style.transform = `translateY(${30 * (1 - r)}px)`
        if (r >= 0.95) {
          entry.target.style.opacity = 1
          entry.target.style.transform = 'translateY(0)'
          observer.unobserve(entry.target)
        }
      }
    })
  }, { threshold: Array.from({ length: 20 }, (_, i) => i / 19) })
  cards.forEach((card) => observer.observe(card))
}
onReady(initCardAnimation)

// ==================== 导航栏显示标题 ====================

function tonav() {
  document.getElementById('name-container').setAttribute('style', 'display:none')
  let position = $(window).scrollTop()
  $(window).scroll(function () {
    const scroll = $(window).scrollTop()
    if (scroll > position) {
      document.getElementById('name-container').setAttribute('style', '')
      document.getElementsByClassName('menus_items')[1].setAttribute('style', 'display:none!important')
    } else {
      document.getElementsByClassName('menus_items')[1].setAttribute('style', '')
      document.getElementById('name-container').setAttribute('style', 'display:none')
    }
    position = scroll
  })
  document.getElementById('page-name').innerText = document.title.split(' | 兔兔博客🇨🇳')[0]
}

function scrollToTop() {
  document.getElementsByClassName('menus_items')[1].setAttribute('style', '')
  document.getElementById('name-container').setAttribute('style', 'display:none')
  btf.scrollToDest(0, 500)
}

onReady(tonav)


// ==================== 欢迎信息 ====================

$.ajax({
  type: 'get',
  url: 'https://ip.xn--eet944d.top/api/ip',
  timeout: 5000,
  success(res) { ipLoacation = res; showWelcome() },
  error() {}
})

function getDistance(e1, n1, e2, n2) {
  const R = 6371
  const { sin, cos, asin, PI, hypot } = Math
  const toRad = (e, n) => {
    e *= PI / 180; n *= PI / 180
    return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
  }
  const a = toRad(e1, n1), b = toRad(e2, n2)
  return Math.round(asin(hypot(a.x - b.x, a.y - b.y, a.z - b.z) / 2) * 2 * R)
}

// 省份→欢迎语映射
const provinceMessages = {
  '北京市': '北——京——欢迎你~~~',
  '天津市': '讲段相声吧。',
  '河北省': '山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。',
  '山西省': '展开坐具长三尺，已占山河五百余。',
  '内蒙古自治区': '天苍苍，野茫茫，风吹草低见牛羊。',
  '辽宁省': '我想吃烤鸡架！',
  '吉林省': '状元阁就是东北烧烤之王。',
  '黑龙江省': '很喜欢哈尔滨大剧院。',
  '上海市': '众所周知，中国只有两个城市。',
  '浙江省': '东风渐绿西湖柳，雁已还人未南归。',
  '安徽省': '蚌埠住了，芜湖起飞。',
  '福建省': '井邑白云间，岩城远带山。',
  '江西省': '落霞与孤鹜齐飞，秋水共长天一色。',
  '山东省': '遥望齐州九点烟，一泓海水杯中泻。',
  '湖北省': '来碗热干面！',
  '湖南省': '74751，长沙斯塔克。',
  '广东省': '老板来两斤福建人。',
  '广西壮族自治区': '桂林山水甲天下。',
  '海南省': '朝观日出逐白浪，夕看云起收霞光。',
  '四川省': '康康川妹子。',
  '贵州省': '茅台，学生，再塞200。',
  '云南省': '玉龙飞舞云缠绕，万仞冰川直耸天。',
  '西藏自治区': '躺在茫茫草原上，仰望蓝天。',
  '陕西省': '来份臊子面加馍。',
  '甘肃省': '羌笛何须怨杨柳，春风不度玉门关。',
  '青海省': '牛肉干和老酸奶都好好吃。',
  '宁夏回族自治区': '大漠孤烟直，长河落日圆。',
  '新疆维吾尔自治区': '驼铃古道丝绸路，胡马犹闻唐汉风。',
  '台湾省': '我在这头，大陆在那头。',
  '香港特别行政区': '永定贼有残留地鬼嚎，迎击光非岁玉。',
  '澳门特别行政区': '性感荷官，在线发牌。'
}

// 城市级别特殊欢迎语
const cityMessages = {
  '江苏省': { '南京市': '这是我挺想去的城市啦。', '苏州市': '上有天堂，下有苏杭。', _default: '散装是必须要散装的。' },
  '河南省': {
    '郑州市': '豫州之域，天地之中。', '南阳市': '臣本布衣，躬耕于南阳。此南阳非彼南阳！',
    '驻马店市': '峰峰有奇石，石石挟仙气。嵖岈山的花很美哦！', '开封市': '刚正不阿包青天。',
    '洛阳市': '洛阳牡丹甲天下。', _default: '可否带我品尝河南烩面啦？'
  }
}

const nationMessages = {
  '日本': 'よろしく，一起去看樱花吗', '美国': 'Let us live in peace!',
  '英国': '想同你一起夜乘伦敦眼', '俄罗斯': '干了这瓶伏特加！',
  '法国': "C'est La Vie", '德国': 'Die Zeit verging im Fluge.',
  '澳大利亚': '一起去大堡礁吧！', '加拿大': '拾起一片枫叶赠予你'
}

function showWelcome() {
  const info = ipLoacation.result
  const dist = getDistance(114.41, 23.19, info.location.lng, info.location.lat)
  const nation = info.ad_info.nation
  let pos = nation, ip, posdesc

  if (nation === '中国') {
    const province = info.ad_info.province
    const city = info.ad_info.city
    pos = province + ' ' + city + ' ' + info.ad_info.district
    ip = info.ip

    // 先查城市级别映射
    const cityMap = cityMessages[province]
    if (cityMap) {
      posdesc = cityMap[city] || cityMap._default
    } else {
      posdesc = provinceMessages[province] || '带我去你的城市逛逛吧！'
    }
  } else {
    posdesc = nationMessages[nation] || '带我去你的国家逛逛吧。'
  }

  // 时间问候
  const h = new Date().getHours()
  const timeChange = h >= 5 && h < 11 ? '<span>上午好</span>，一日之计在于晨！'
    : h < 13 ? '<span>中午好</span>，该摸鱼吃午饭了。'
    : h < 15 ? '<span>下午好</span>，懒懒地睡个午觉吧！'
    : h < 16 ? '<span>三点几啦</span>，一起饮茶呀！'
    : h < 19 ? '<span>夕阳无限好！</span>'
    : h < 24 ? '<span>晚上好</span>，夜生活嗨起来！'
    : '夜深了，早点休息，少熬夜。'

  try {
    document.getElementById('welcome-info').innerHTML =
      `<b><center>🎉 欢迎信息 🎉</center>&emsp;&emsp;欢迎来自 <span style="color:var(--theme-color)">${pos}</span> 的小伙伴，${timeChange}您现在距离站长约 <span style="color:var(--theme-color)">${dist}</span> 公里，当前的IP地址为： <span style="color:var(--theme-color)">${ip}</span>， ${posdesc}</b>`
  } catch (err) {}
}

document.addEventListener('pjax:complete', showWelcome)


// ==================== 复制/F12提醒 ====================

document.addEventListener('copy', () => {
  debounce(() => notify('哎嘿！复制成功🍬', '若要转载最好保留原文链接哦，给你一个大大的赞！'), 300)
})

document.onkeydown = function (e) {
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [74, 73, 67].includes(e.keyCode)) || (e.ctrlKey && e.keyCode === 85)) {
    debounce(() => notify('你已被发现😜', '小伙子，扒源记住要遵循GPL协议！', 'warning'), 300)
  }
}

// ==================== 雪花特效 ====================

window && (() => {
  const cfg = {
    flakeCount: isMobile ? 12 : 50, minDist: isMobile ? 80 : 150,
    color: '255, 255, 255', size: isMobile ? 1 : 1.5,
    speed: isMobile ? 0.35 : 0.5, opacity: 0.7, stepsize: isMobile ? 0.3 : 0.5
  }
  const rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || (cb => setTimeout(cb, 1e3 / 60))
  window.requestAnimationFrame = rAF

  const canvas = document.getElementById('snow')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const count = cfg.flakeCount
  let mx = -100, my = -100, flakes = []

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const resetFlake = f => {
    f.x = Math.floor(Math.random() * canvas.width)
    f.y = 0
    f.size = Math.random() * 3 + 2
    f.speed = Math.random() + 0.5
    f.velY = f.speed
    f.velX = 0
    f.opacity = Math.random() * 0.5 + 0.3
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const r = cfg.minDist
    for (let i = 0; i < count; i++) {
      const f = flakes[i]
      const dx = mx - f.x, dy = my - f.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < r) {
        const force = r / (dist * dist) / 2
        f.velX -= force * dx / dist
        f.velY -= force * dy / dist
      } else {
        f.velX *= 0.98
        if (f.velY < f.speed && f.speed - f.velY > 0.01) f.velY += 0.01 * (f.speed - f.velY)
        f.velX += Math.cos(f.step += 0.05) * f.stepSize
      }
      ctx.fillStyle = `rgba(${cfg.color}, ${f.opacity})`
      f.y += f.velY
      f.x += f.velX
      if (f.y >= canvas.height || f.y <= 0 || f.x >= canvas.width || f.x <= 0) resetFlake(f)
      ctx.beginPath()
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
      ctx.fill()
    }
    rAF(animate)
  }

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight })

  for (let i = 0; i < count; i++) {
    flakes.push({
      speed: Math.random() + cfg.speed, velX: 0, velY: Math.random() + cfg.speed,
      x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height),
      size: Math.random() * 3 + cfg.size, stepSize: Math.random() / 30 * cfg.stepsize,
      step: 0, angle: 180, opacity: Math.random() * 0.5 + cfg.opacity
    })
  }
  animate()
})()

// ==================== 星空特效 ====================

function dark() {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
  var n, e, i, h, t = 0.05,
    s = document.getElementById('universe'), o = true,
    a = '180,184,240', r = '226,225,142', d = '226,225,224', c = []

  function f() { n = window.innerWidth; e = window.innerHeight; i = 0.216 * n; s.setAttribute('width', n); s.setAttribute('height', e) }
  function u() {
    h.clearRect(0, 0, n, e)
    for (var t = c.length, i = 0; i < t; i++) { var s = c[i]; s.move(); s.fadeIn(); s.fadeOut(); s.draw() }
  }
  function y() {
    this.reset = function () {
      this.giant = m(3); this.comet = !this.giant && !o && m(10)
      this.x = l(0, n - 10); this.y = l(0, e); this.r = l(1.1, 2.6)
      this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t
      this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120)
      this.fadingOut = null; this.fadingIn = true; this.opacity = 0
      this.opacityTresh = l(0.2, 1 - 0.4 * (this.comet + 1 - 1))
      this.do = l(5e-4, 0.002) + 0.001 * (this.comet + 1 - 1)
    }
    this.fadeIn = function () { this.fadingIn && (this.fadingIn = !(this.opacity > this.opacityTresh), this.opacity += this.do) }
    this.fadeOut = function () {
      this.fadingOut && (this.fadingOut = !(this.opacity < 0), this.opacity -= this.do / 2,
        (this.x > n || this.y < 0) && (this.fadingOut = false, this.reset()))
    }
    this.draw = function () {
      if (h.beginPath(), this.giant) {
        h.fillStyle = `rgba(${a},${this.opacity})`; h.arc(this.x, this.y, 2, 0, Math.PI * 2, false)
      } else if (this.comet) {
        h.fillStyle = `rgba(${d},${this.opacity})`; h.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false)
        for (var t = 0; t < 30; t++) {
          h.fillStyle = `rgba(${d},${this.opacity - this.opacity / 20 * t})`
          h.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2); h.fill()
        }
      } else { h.fillStyle = `rgba(${r},${this.opacity})`; h.rect(this.x, this.y, this.r, this.r) }
      h.closePath(); h.fill()
    }
    this.move = function () {
      this.x += this.dx; this.y += this.dy
      if (this.fadingOut === false) this.reset()
      if (this.x > n - n / 4 || this.y < 0) this.fadingOut = true
    }
    setTimeout(() => { o = false }, 50)
  }
  function m(t) { return Math.floor(Math.random() * 1e3) + 1 < 10 * t }
  function l(t, i) { return Math.random() * (i - t) + t }

  f(); window.addEventListener('resize', f, false)
  h = s.getContext('2d')
  for (var j = 0; j < i; j++) { c[j] = new y(); c[j].reset() }
  ;(function loop() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') u()
    window.requestAnimationFrame(loop)
  })()
}
dark()


// ==================== 表情放大 ====================

function owoBig() {
  let flag = 1, owo_time = '', m = 3
  const div = document.createElement('div')
  div.id = 'owo-big'
  document.body.appendChild(div)

  const observer = new MutationObserver(mutations => {
    for (const mut of mutations) {
      const dom = mut.addedNodes
      let owo_body = ''
      if (dom.length === 2 && dom[1].className === 'OwO-body') owo_body = dom[1]
      else continue

      if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault())

      owo_body.onmouseover = e => {
        if (flag && e.target.tagName === 'IMG') {
          flag = 0
          owo_time = setTimeout(() => {
            const target = e.target
            const height = target.clientHeight * m
            const width = target.clientWidth * m
            let left = (e.x - e.offsetX) - (width - target.clientWidth) / 2
            const top = e.y - e.offsetY

            if (left + width > document.body.clientWidth) left -= (left + width - document.body.clientWidth + 10)
            if (left < 0) left = 10
            div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`
            div.innerHTML = `<img src="${target.src}">`
          }, 300)
        }
      }
      owo_body.onmouseout = () => { div.style.display = 'none'; flag = 1; clearTimeout(owo_time) }
    }
  })
  observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true })
}

onReady(() => { if (document.getElementById('post-comment')) owoBig() })

// ==================== 随便逛逛 ====================

function randomPost() {
  fetch('/baidusitemap.xml').then(r => r.text())
    .then(str => new DOMParser().parseFromString(str, 'text/xml'))
    .then(data => {
      const ls = data.querySelectorAll('url loc')
      let url
      do { url = ls[Math.floor(Math.random() * ls.length)].innerHTML } while (location.href === url)
      location.href = url
    })
}

// ==================== 右键菜单 ====================

function setMask() {
  if (document.getElementsByClassName('rmMask')[0]) return document.getElementsByClassName('rmMask')[0]
  const mask = document.createElement('div')
  mask.className = 'rmMask'
  Object.assign(mask.style, {
    width: window.innerWidth + 'px', height: window.innerHeight + 'px',
    background: '#fff', opacity: '0', position: 'fixed', top: '0', left: '0', zIndex: 998
  })
  document.body.appendChild(mask)
  document.getElementById('rightMenu').style.zIndex = 19198
  return mask
}

function insertAtCursor(myField, myValue) {
  if (document.selection) {
    myField.focus()
    const sel = document.selection.createRange()
    sel.text = myValue
    sel.select()
  } else if (myField.selectionStart || myField.selectionStart === '0') {
    const startPos = myField.selectionStart
    const endPos = myField.selectionEnd
    const restoreTop = myField.scrollTop
    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos)
    if (restoreTop > 0) myField.scrollTop = restoreTop
    myField.focus()
    myField.selectionStart = myField.selectionEnd = startPos + myValue.length
  } else {
    myField.value += myValue
    myField.focus()
  }
}

let rmf = {}
rmf.showRightMenu = function (isTrue, x = 0, y = 0) {
  const $rm = $('#rightMenu')
  $rm.css('top', x + 'px').css('left', y + 'px')
  isTrue ? $rm.show() : $rm.hide()
}

rmf.copyWordsLink = () => copyToClipboard(window.location.href)

rmf.switchReadMode = function () {
  const $body = document.body
  $body.classList.add('read-mode')
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'fas fa-sign-out-alt exit-readmode'
  $body.appendChild(btn)
  const exit = () => { $body.classList.remove('read-mode'); btn.remove(); btn.removeEventListener('click', exit) }
  btn.addEventListener('click', exit)
}

rmf.copySelect = () => document.execCommand('Copy', false, null)

rmf.scrollToTop = scrollToTop

rmf.fullScreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()

document.body.addEventListener('touchmove', function () {}, { passive: false })

function popupMenu() {
  window.oncontextmenu = function (event) {
    if (mouseMode === 'off') return true

    $('.rightMenu-group.hide').hide()
    if (document.getSelection().toString()) $('#menu-text').show()
    if (document.getElementById('post') || document.getElementById('page')) $('#menu-post').show()

    const el = event.target
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!'*+,;=.]+$/
    if (urlRegex.test(window.getSelection().toString()) && el.tagName !== 'A') $('#menu-too').show()

    if (el.tagName === 'A') {
      $('#menu-to').show()
      rmf.open = () => {
        if (!el.href.includes('http://') && !el.href.includes('https://') || el.href.includes('yisous.xyz'))
          pjax.loadUrl(el.href)
        else location.href = el.href
      }
      rmf.openWithNewTab = () => window.open(el.href)
      rmf.copyLink = () => copyToClipboard(el.href)
    } else if (el.tagName === 'IMG') {
      $('#menu-img').show()
      rmf.openWithNewTab = () => window.open(el.src)
      rmf.click = () => el.click()
      rmf.copyLink = () => copyToClipboard(el.src)
      rmf.saveAs = () => {
        const a = document.createElement('a')
        a.href = el.src
        a.download = el.src.split('/').pop()
        a.click()
      }
    } else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      $('#menu-paste').show()
      rmf.paste = () => {
        navigator.permissions.query({ name: 'clipboard-read' }).then(result => {
          if (result.state === 'granted' || result.state === 'prompt') {
            navigator.clipboard.readText().then(text => insertAtCursor(el, text))
          } else { alert('请允许读取剪贴板！') }
        })
      }
    }

    let pageX = event.clientX + 10, pageY = event.clientY
    const rmWidth = $('#rightMenu').width(), rmHeight = $('#rightMenu').height()
    if (pageX + rmWidth > window.innerWidth) pageX -= rmWidth + 10
    if (pageY + rmHeight > window.innerHeight) pageY -= pageY + rmHeight - window.innerHeight

    const mask = setMask()
    $('.rightMenu-item').click(() => { $('.rmMask').attr('style', 'display: none') })
    $(window).resize(() => { rmf.showRightMenu(false); $('.rmMask').attr('style', 'display: none') })
    mask.onclick = () => { $('.rmMask').attr('style', 'display: none') }
    rmf.showRightMenu(true, pageY, pageX)
    $('.rmMask').attr('style', 'display: flex')
    return false
  }
  window.addEventListener('click', () => rmf.showRightMenu(false))
}

if (!isMobile) {
  popupMenu()
}

// 长按触发右键菜单（移动端）
;(() => {
  const box = document.documentElement
  let timer = 0
  box.ontouchstart = () => { timer = 0; timer = setTimeout(() => { popupMenu(); timer = 0 }, 3000) }
  box.ontouchmove = () => { clearTimeout(timer); timer = 0 }
  box.ontouchend = () => { if (timer) clearTimeout(timer) }
})()

// 右键开关
if (localStorage.getItem('mouse') == null) localStorage.setItem('mouse', 'on')
var mouseMode = localStorage.getItem('mouse')

function changeMouseMode() {
  const isOn = localStorage.getItem('mouse') === 'on'
  mouseMode = isOn ? 'off' : 'on'
  localStorage.setItem('mouse', mouseMode)
  debounce(() => notify('切换右键模式成功🍔',
    isOn ? '当前鼠标右键已恢复为系统默认！' : '当前鼠标右键已更换为网站指定样式！'), 300)
}


// ==================== 控制台输出 ====================

;(() => {
  const grt = new Date('12/31/2022 12:22:39')
  const dnum = Math.floor((Date.now() - grt) / 864e5)
  const lines = [
    '欢迎来到兔兔博客🇨🇳の小家!', 'Future is now 🍭🍭🍭',
    '\n\n███████  ██        ██  ███████  ██        ██   ██        ██                ██\n     ██        ██        ██       ██        ██        ██      ██  ██                ██  ██\n     ██        ██        ██       ██        ██        ██         ██                ██         ██\n     ██        ██        ██       ██        ██        ██      ██  ██         ██   ██  ██  ██\n     ██            ████           ██            ████       ██        ██   ██                      ██\n',
    '小站已经苟活', dnum, '天啦!', '©2022 By 兔兔博客🇨🇳'
  ]
  setTimeout(console.log.bind(console,
    `\n%c${lines[0]} %c ${lines[1]} %c ${lines[2]} %c${lines[3]}%c ${lines[4]}%c ${lines[5]}\n\n%c ${lines[6]}\n`,
    'color:#39c5bb', '', 'color:#39c5bb', 'color:#39c5bb', '', 'color:#39c5bb', ''))

  setTimeout(console.log.bind(console, '%c WELCOME %c 欢迎光临，大聪明', 'color:white; background-color:#23c682', ''))
  setTimeout(console.warn.bind(console, '%c ⚡ Powered by 兔兔博客🇨🇳 %c 你正在访问兔兔博客🇨🇳の小家', 'color:white; background-color:#f0ad4e', ''))
  setTimeout(console.log.bind(console, '%c W23-12 %c 系统监测到你已打开控制台', 'color:white; background-color:#4f90d9', ''))
  setTimeout(console.warn.bind(console, '%c S013-782 %c 你现在正处于监控中', 'color:white; background-color:#d9534f', ''))
})()

// ==================== 夜间模式切换动画 ====================

function switchNightMode() {
  document.body.insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>')
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

  setTimeout(() => {
    document.getElementById('sun').style.opacity = isDark ? '1' : '0'
    document.getElementById('moon').style.opacity = isDark ? '0' : '1'
    setTimeout(() => {
      document.getElementById('sun').style.opacity = isDark ? '0' : '1'
      document.getElementById('moon').style.opacity = isDark ? '1' : '0'
    }, 1000)
  })

  setTimeout(() => {
    const sky = document.getElementsByClassName('Cuteen_DarkSky')[0]
    sky.style.transition = 'opacity 3s'
    sky.style.opacity = '0'
    setTimeout(() => sky.remove(), 1e3)
  }, 2e3)

  if (!isDark) {
    activateDarkMode()
    saveToLocal.set('theme', 'dark', 2)
    document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')
    setTimeout(() => notify('关灯啦🌙', '当前已成功切换至夜间模式！'), 2000)
  } else {
    activateLightMode()
    saveToLocal.set('theme', 'light', 2)
    document.body.classList.add('DarkMode')
    document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')
    setTimeout(() => notify('开灯啦🌞', '当前已成功切换至白天模式！'), 2000)
  }
}

// ==================== 分享按钮 ====================

function share_() {
  const url = window.location.origin + window.location.pathname
  try {
    const siteName = '兔兔博客🇨🇳'
    const title = document.title
    const separator = ' | ' + siteName
    const subTitle = title.endsWith(separator) ? title.substring(0, title.length - separator.length) : title
    navigator.clipboard.writeText(`${siteName}的站内分享\n标题：${subTitle}\n链接：${url}\n欢迎来访！🍭🍭🍭`)
    notify('成功复制分享信息🎉', '您现在可以通过粘贴直接跟小伙伴分享了！')
  } catch (err) { console.error('复制失败！', err) }
}

function share() { debounce(share_, 300) }

// ==================== 恶搞标题 ====================

var OriginTitile = document.title
var titleTime
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '👀跑哪里去了~'
    clearTimeout(titleTime)
  } else {
    document.title = '🐖抓到你啦～'
    titleTime = setTimeout(() => { document.title = OriginTitile }, 2000)
  }
})


// ==================== 农历转换 ====================
// @1900-2100区间内的公历、农历互转 @Author jiangjiazhi

var lunarInfo = [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,0x0d520]
var solarMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
var Gan = ['\u7532','\u4e59','\u4e19','\u4e01','\u620a','\u5df1','\u5e9a','\u8f9b','\u58ec','\u7678']
var Zhi = ['\u5b50','\u4e11','\u5bc5','\u536f','\u8fb0','\u5df3','\u5348','\u672a','\u7533','\u9149','\u620c','\u4ea5']
var Animals = ['\u9f20','\u725b','\u864e','\u5154','\u9f99','\u86c7','\u9a6c','\u7f8a','\u7334','\u9e21','\u72d7','\u732a']
var solarTerm = ['\u5c0f\u5bd2','\u5927\u5bd2','\u7acb\u6625','\u96e8\u6c34','\u60ca\u86f0','\u6625\u5206','\u6e05\u660e','\u8c37\u96e8','\u7acb\u590f','\u5c0f\u6ee1','\u8292\u79cd','\u590f\u81f3','\u5c0f\u6691','\u5927\u6691','\u7acb\u79cb','\u5904\u6691','\u767d\u9732','\u79cb\u5206','\u5bd2\u9732','\u971c\u964d','\u7acb\u51ac','\u5c0f\u96ea','\u5927\u96ea','\u51ac\u81f3']
var sTermInfo = ['9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd0b06bdb0722c965ce1cfcc920f','b027097bd097c36b0b6fc9274c91aa','9778397bd19801ec9210c965cc920e','97b6b97bd19801ec95f8c965cc920f','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd197c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bd09801d98082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec95f8c965cc920e','97bcf97c3598082c95f8e1cfcc920f','97bd097bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c3598082c95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf97c359801ec95f8c965cc920f','97bd097bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd19801ec9210c9274c920e','97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e','97b6b97bd19801ec95f8c965cc920f','97bd07f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c91aa','97b6b97bd19801ec9210c965cc920e','97bd07f1487f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c965cc920e','97bcf7f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b97bd19801ec9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c91aa','97b6b97bd197c36c9210c9274c920e','97bcf7f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','9778397bd097c36c9210c9274c920e','97b6b7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c36b0b6fc9210c8dc2','9778397bd097c36b0b70c9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc9210c8dc2','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9274c91aa','97b6b7f0e47f531b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c91aa','97b6b7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','9778397bd097c36b0b6fc9210c8dc2','977837f0e37f149b0723b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f5307f595b0b0bc920fb0722','7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f595b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc9210c8dc2','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd097c35b0b6fc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0b0bb0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14998082b0723b06bd','7f07e7f0e37f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e397bd07f595b0b0bc920fb0722','977837f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f595b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e37f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f149b0723b0787b0721','7f0e27f1487f531b0b0bb0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd','7f07e7f0e47f149b0723b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14998082b0723b06bd','7f07e7f0e37f14998083b0787b0721','7f0e27f0e47f531b0723b0b6fb0722','7f0e37f0e366aa89801eb072297c35','7ec967f0e37f14898082b0723b02d5','7f07e7f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66aa89801e9808297c35','665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b0721','7f07e7f0e47f531b0723b0b6fb0722','7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b0723b02d5','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e36665b66a449801e9808297c35','665f67f0e37f14898082b072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e26665b66a449801e9808297c35','665f67f0e37f1489801eb072297c35','7ec967f0e37f14998082b0787b06bd','7f07e7f0e47f531b0723b0b6fb0721','7f0e27f1487f531b0b0bb0b6fb0722']
var nStr1 = ['\u65e5','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d','\u5341']
var nStr2 = ['\u521d','\u5341','\u5eff','\u5345']
var nStr3 = ['\u6b63','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d','\u5341','\u51ac','\u814a']

function lYearDays(y) { var i, sum = 348; for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y-1900] & i) ? 1 : 0; return sum + leapDays(y) }
function leapMonth(y) { return lunarInfo[y-1900] & 0xf }
function leapDays(y) { return leapMonth(y) ? ((lunarInfo[y-1900] & 0x10000) ? 30 : 29) : 0 }
function monthDays(y, m) { return (m > 12 || m < 1) ? -1 : ((lunarInfo[y-1900] & (0x10000 >> m)) ? 30 : 29) }
function solarDays(y, m) { if (m > 12 || m < 1) return -1; return m === 2 ? ((y%4===0 && y%100!==0 || y%400===0) ? 29 : 28) : solarMonth[m-1] }
function toGanZhiYear(lYear) { var g = (lYear-3)%10, z = (lYear-3)%12; return Gan[(g||10)-1] + Zhi[(z||12)-1] }
function toAstro(cMonth, cDay) { var s = '\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf'; return s.substr(cMonth*2-(cDay<[20,19,21,21,21,22,23,23,23,23,22,22][cMonth-1]?2:0),2)+'\u5ea7' }
function toGanZhi(offset) { return Gan[offset%10] + Zhi[offset%12] }
function getTerm(y, n) {
  if (y<1900||y>2100||n<1||n>24) return -1
  var t = sTermInfo[y-1900], info = []
  for (var j = 0; j < 6; j++) info.push(parseInt('0x'+t.substr(j*5,5)).toString())
  var cal = []
  for (var k = 0; k < 6; k++) { cal.push(info[k].substr(0,1), info[k].substr(1,2), info[k].substr(3,1), info[k].substr(4,2)) }
  return parseInt(cal[n-1])
}
function toChinaMonth(m) { return (m>12||m<1) ? -1 : nStr3[m-1]+'\u6708' }
function toChinaDay(d) { return d===10?'\u521d\u5341':d===20?'\u4e8c\u5341':d===30?'\u4e09\u5341':nStr2[Math.floor(d/10)]+nStr1[d%10] }
function getAnimal(y) { return Animals[(y-4)%12] }


function solar2lunar(y, m, d) {
  if (y<1900||y>2100) return -1
  if (y===1900&&m===1&&d<31) return -1
  var objDate = (!y) ? new Date() : new Date(y, parseInt(m)-1, d)
  var i, leap = 0, temp = 0
  y = objDate.getFullYear(); m = objDate.getMonth()+1; d = objDate.getDate()
  var offset = (Date.UTC(y, objDate.getMonth(), d) - Date.UTC(1900,0,31)) / 86400000
  for (i=1900; i<2101 && offset>0; i++) { temp = lYearDays(i); offset -= temp }
  if (offset<0) { offset += temp; i-- }
  var isTodayObj = new Date()
  var isToday = isTodayObj.getFullYear()===y && isTodayObj.getMonth()+1===m && isTodayObj.getDate()===d
  var nWeek = objDate.getDay(), cWeek = nStr1[nWeek]
  if (nWeek===0) nWeek = 7
  var year = i
  leap = leapMonth(i)
  var isLeap = false
  for (i=1; i<13 && offset>0; i++) {
    if (leap>0 && i===(leap+1) && !isLeap) { --i; isLeap = true; temp = leapDays(year) }
    else { temp = monthDays(year, i) }
    if (isLeap && i===(leap+1)) isLeap = false
    offset -= temp
  }
  if (offset===0 && leap>0 && i===leap+1) { if (isLeap) isLeap = false; else { isLeap = true; --i } }
  if (offset<0) { offset += temp; --i }
  var month = i, day = offset + 1, sm = m-1
  var gzY = toGanZhiYear(year)
  var firstNode = getTerm(y, m*2-1), secondNode = getTerm(y, m*2)
  var gzM = toGanZhi((y-1900)*12+m+11)
  if (d >= firstNode) gzM = toGanZhi((y-1900)*12+m+12)
  var isTerm = false, Term = null
  if (firstNode===d) { isTerm = true; Term = solarTerm[m*2-2] }
  if (secondNode===d) { isTerm = true; Term = solarTerm[m*2-1] }
  var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10
  var gzD = toGanZhi(dayCyclical+d-1)
  return {lYear:year,lMonth:month,lDay:day,Animal:getAnimal(year),IMonthCn:(isLeap?'\u95f0':'')+toChinaMonth(month),IDayCn:toChinaDay(day),cYear:y,cMonth:m,cDay:d,gzYear:gzY,gzMonth:gzM,gzDay:gzD,isToday:isToday,isLeap:isLeap,nWeek:nWeek,ncWeek:'\u661f\u671f'+cWeek,isTerm:isTerm,Term:Term,astro:toAstro(m,d)}
}

var calendarFormatter = {
  solar2lunar: (y, m, d) => solar2lunar(y, m, d),
  lunar2solar(y, m, d, isLeapMonth) {
    isLeapMonth = !!isLeapMonth
    if (isLeapMonth && leapMonth !== m) return -1
    if ((y===2100&&m===12&&d>1)||(y===1900&&m===1&&d<31)) return -1
    var day = monthDays(y, m), _day = isLeapMonth ? leapDays(y, m) : day
    if (y<1900||y>2100||d>_day) return -1
    var offset = 0
    for (var i=1900; i<y; i++) offset += lYearDays(i)
    var leap = 0, isAdd = false
    for (i=1; i<m; i++) { leap = leapMonth(y); if (!isAdd && leap<=i && leap>0) { offset += leapDays(y); isAdd = true }; offset += monthDays(y, i) }
    if (isLeapMonth) offset += day
    var stmap = Date.UTC(1900,1,30,0,0,0)
    var calObj = new Date((offset+d-31)*86400000+stmap)
    return solar2lunar(calObj.getUTCFullYear(), calObj.getUTCMonth()+1, calObj.getUTCDate())
  }
}


// ==================== 节日弹窗 (数据驱动) ====================

;(() => {
  const d = new Date(), m = d.getMonth() + 1, dd = d.getDate(), y = d.getFullYear()

  // 公祭日（灰色滤镜 + 弹窗）
  const memorials = [
    { m: 9, d: 18, msg: y => `今天是九一八事变${y-1931}周年纪念日\n🪔勿忘国耻，振兴中华🪔` },
    { m: 7, d: 7, msg: y => `今天是卢沟桥事变${y-1937}周年纪念日\n🪔勿忘国耻，振兴中华🪔` },
    { m: 12, d: 13, msg: y => `今天是南京大屠杀${y-1937}周年纪念日\n🪔勿忘国耻，振兴中华🪔` },
    { m: 8, d: 14, msg: () => '今天是世界慰安妇纪念日\n🪔勿忘国耻，振兴中华🪔' }
  ]

  for (const ev of memorials) {
    if (m === ev.m && dd === ev.d) {
      document.documentElement.setAttribute('style', 'filter: grayscale(60%);')
      if (sessionStorage.getItem('isPopupWindow') !== '1') {
        Swal.fire(ev.msg(y))
        sessionStorage.setItem('isPopupWindow', '1')
      }
    }
  }

  // 公历节日
  const holidays = [
    { m: 10, d: [1,2,3], msg: `祝祖国${y-1949}岁生日快乐！` },
    { m: 8, d: 15, msg: `小日子已经投降${y-1945}年了😃` },
    { m: 1, d: 1, msg: `${y}年元旦快乐！🎉` },
    { m: 3, d: 8, msg: '各位女神们，妇女节快乐！👩' },
    { m: 5, d: 1, msg: '劳动节快乐\n为各行各业辛勤工作的人们致敬！' },
    { m: 5, d: 4, msg: '青年节快乐\n青春不是回忆逝去,而是把握现在！' },
    { m: 5, d: 20, msg: '今年是520情人节\n快和你喜欢的人一起过吧！💑' },
    { m: 7, d: 1, msg: `祝中国共产党${y-1921}岁生日快乐！` },
    { m: 9, d: 10, msg: '各位老师们教师节快乐！👩‍🏫' },
    { m: 12, d: 25, msg: '圣诞节快乐！🎄' }
  ]

  // 愚人节特殊处理
  const aprilFoolMsgs = ['非常抱歉，因为不可控原因，博客将于明天停止运营！','好消息，日本没了！','美国垮了，原因竟然是川普！','微软垮了！','你的电脑已经过载，建议立即关机！','你知道吗？站长很喜欢你哦！','一分钟有61秒哦','你喜欢的人跟别人跑了！']
  holidays.push({ m: 4, d: 1, msg: aprilFoolMsgs[Math.floor(Math.random() * aprilFoolMsgs.length)] })

  // 清明节、冬至（按年份查表）
  const solarTermDates = {
    qingming: { 2023: [4,5], 2024: [4,4], 2025: [4,4], 2026: [4,5] },
    dongzhi: { 2023: [12,22], 2024: [12,21], 2025: [12,21], 2026: [12,22] }
  }
  const qm = solarTermDates.qingming[y]
  if (qm) holidays.push({ m: qm[0], d: qm[1], msg: '清明时节雨纷纷,一束鲜花祭故人💐' })
  const dz = solarTermDates.dongzhi[y]
  if (dz) holidays.push({ m: dz[0], d: dz[1], msg: '冬至快乐\n快吃上一碗热热的汤圆和饺子吧🧆' })

  function showPopup(msg) {
    if (sessionStorage.getItem('isPopupWindow') !== '1') {
      Swal.fire(msg)
      sessionStorage.setItem('isPopupWindow', '1')
    }
  }

  for (const h of holidays) {
    const days = Array.isArray(h.d) ? h.d : [h.d]
    if (m === h.m && days.includes(dd)) { showPopup(h.msg); break }
  }

  // 农历节日
  const lunar = calendarFormatter.solar2lunar()
  const lunarHolidays = [
    { month: '正月', days: ['初一','初二','初三','初四','初五','初六'], msg: `${y}年新年快乐\n🎊祝你心想事成，诸事顺利🎊` },
    { month: '腊月', days: ['廿九','三十'], msg: `${y}年新年快乐\n🎊祝你心想事成，诸事顺利🎊` },
    { month: '正月', days: ['十五'], msg: '元宵节快乐\n送你一个大大的灯笼🧅' },
    { month: '五月', days: ['初五'], msg: '端午节快乐\n请你吃一条粽子🍙' },
    { month: '七月', days: ['初七'], msg: '七夕节快乐\n黄昏后,柳梢头,牛郎织女来碰头' },
    { month: '八月', days: ['十五'], msg: '中秋节快乐\n请你吃一块月饼🍪' },
    { month: '九月', days: ['初九'], msg: '重阳节快乐\n独在异乡为异客，每逢佳节倍思亲' },
    { month: '腊月', days: ['廿六'], msg: `祝站长${y-2010}岁生日快乐！🥝` }
  ]

  for (const lh of lunarHolidays) {
    if (lunar.IMonthCn === lh.month && lh.days.includes(lunar.IDayCn)) { showPopup(lh.msg); break }
  }
})()


// ==================== 听话鼠标 ====================

var CURSOR
Math.lerp = (a, b, n) => (1 - n) * a + n * b

const getStyle2 = (el, attr) => {
  try { return window.getComputedStyle ? window.getComputedStyle(el)[attr] : el.currentStyle[attr] }
  catch (e) {} return ''
}

const colorMap = new Map([
  ['red','rgb(241, 71, 71)'], ['orange','rgb(241, 162, 71)'], ['yellow','rgb(241, 238, 71)'],
  ['purple','rgb(179, 71, 241)'], ['blue','rgb(102, 204, 255)'], ['gray','rgb(226, 226, 226)'],
  ['green','rgb(57, 197, 187)'], ['whitegray','rgb(241, 241, 241)'], ['pink','rgb(237, 112, 155)'],
  ['black','rgb(0, 0, 0)'], ['darkblue','rgb(97, 100, 159)'], ['heoblue','rgb(66, 90, 239)']
])
// 保持向后兼容（美化模块中使用 map 变量名）
var map = colorMap

class Cursor {
  constructor() {
    this.pos = { curr: null, prev: null }
    this.pt = []
    this.create()
    this.init()
    this.render()
  }
  move(left, top) { this.cursor.style.left = `${left}px`; this.cursor.style.top = `${top}px` }
  create() {
    if (!this.cursor) {
      this.cursor = document.createElement('div')
      this.cursor.id = 'cursor'
      this.cursor.classList.add('hidden')
      document.body.append(this.cursor)
    }
    const els = document.getElementsByTagName('*')
    for (let i = 0; i < els.length; i++) {
      if (getStyle2(els[i], 'cursor') === 'pointer') this.pt.push(els[i].outerHTML)
    }
    const colorVal = colorMap.get(localStorage.getItem('themeColor'))
    document.body.appendChild(this.scr = document.createElement('style'))
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='1.0' fill='${colorVal}'/></svg>") 4 4, auto}`
  }
  refresh() {
    this.scr.remove()
    this.cursor.classList.remove('hover', 'active')
    this.pos = { curr: null, prev: null }
    this.pt = []
    this.create(); this.init(); this.render()
  }
  init() {
    document.onmouseover = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add('hover')
    document.onmouseout = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove('hover')
    document.onmousemove = e => { if (!this.pos.curr) this.move(e.clientX-8, e.clientY-8); this.pos.curr = {x:e.clientX-8, y:e.clientY-8}; this.cursor.classList.remove('hidden') }
    document.onmouseenter = () => this.cursor.classList.remove('hidden')
    document.onmouseleave = () => this.cursor.classList.add('hidden')
    document.onmousedown = () => this.cursor.classList.add('active')
    document.onmouseup = () => this.cursor.classList.remove('active')
  }
  render() {
    if (this.pos.prev) {
      this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15)
      this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15)
      this.move(this.pos.prev.x, this.pos.prev.y)
    } else { this.pos.prev = this.pos.curr }
    requestAnimationFrame(() => this.render())
  }
}

CURSOR = new Cursor()

// ==================== 页脚计时器 ====================

var now = new Date()
var _siteBirthday = new Date('12/31/2022 12:22:39')
var _voyagerStart = new Date('09/05/1977 00:00:00')
function createtime() {
  now.setTime(now.getTime() + 1000)
  const dis = Math.trunc(23400000000 + ((now - _voyagerStart) / 1000) * 17)
  const unit = (dis / 149600000).toFixed(6)
  const elapsed = now - _siteBirthday
  const dnum = Math.floor(elapsed / 864e5)
  const hnum = String(Math.floor((elapsed / 36e5) - 24 * dnum)).padStart(2, '0')
  const mnum = String(Math.floor((elapsed / 6e4) - 1440 * dnum - 60 * hnum)).padStart(2, '0')
  const snum = String(Math.round((elapsed / 1e3) - 86400 * dnum - 3600 * hnum - 60 * mnum)).padStart(2, '0')

  const isWork = hnum >= 9 && hnum < 18
  const icon = isWork
    ? `<img class='boardsign' src='https://tutublog.eu.org/file/HoaV1dz8.svg' title='什么时候能够实现财富自由呀~'>`
    : `<img class='boardsign' src='https://tutublog.eu.org/file/sqqq8CPo.svg' title='下班了就该开开心心地玩耍~'>`

  const el = document.getElementById('workboard')
  if (el) {
    el.innerHTML = `${icon}<br><div style="font-size:13px;font-weight:bold">本站居然运行了 ${dnum} 天 ${hnum} 小时 ${mnum} 分 ${snum} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 旅行者 1 号当前距离地球 ${dis} 千米，约为 ${unit} 个天文单位 🚀</div>`
  }
}
setInterval(createtime, 1000)


// ==================== FPS检测 ====================

if (localStorage.getItem('fpson') == null || localStorage.getItem('fpson') === '1') {
  ;(() => {
    const rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || (cb => setTimeout(cb, 1e3/60))
    let frame = 0, lastTime = Date.now()
    const fpsLevels = [
      [5, '#bd0000', '卡成ppt🤢'], [15, 'red', '电竞级帧率😖'], [25, 'orange', '有点难受😨'],
      [35, '#9338e6', '不太流畅🙄'], [45, '#08b7e4', '还不错哦😁'], [Infinity, '#39c5bb', '十分流畅🤣']
    ]
    ;(function loop() {
      const now = Date.now()
      frame++
      if (now > 1000 + lastTime) {
        const fps = Math.round(frame * 1000 / (now - lastTime))
        const [, color, text] = fpsLevels.find(([max]) => fps <= max)
        document.getElementById('fps').innerHTML = `FPS:${fps} <span style="color:${color}">${text}</span>`
        frame = 0; lastTime = now
      }
      rAF(loop)
    })()
  })()
} else {
  document.getElementById('fps').style = 'display:none!important'
}

// ==================== 美化模块 ====================

// 版本重置检查
if (localStorage.getItem('reset_4') == null) {
  localStorage.setItem('reset_4', '1')
  for (let i = 1; i <= 3; i++) localStorage.removeItem('reset_' + i)
  clearItem()
  setTimeout(() => notify('提示🍒', ' (｡･∀･)ﾉﾞ由于网站部分设置项更新，当前已为您重置所有设置，祝您愉快！'), 1500)
}

function clearItem() {
  ['blogbg','universe','blur','fpson','transNum','blurRad','font','themeColor','rs','mouse','light','snow']
    .forEach(k => localStorage.removeItem(k))
}

// 设置字体
if (!localStorage.getItem('font')) localStorage.setItem('font', 'BlogFont')
setFont(localStorage.getItem('font'))

function setFont(n) {
  localStorage.setItem('font', n)
  if (n === 'default') {
    document.documentElement.style.setProperty('--global-font', '-apple-system')
    document.body.style.fontFamily = "-apple-system, Consolas_1, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Lato, Roboto, 'PingFang SC', 'Microsoft JhengHei', 'Microsoft YaHei', sans-serif"
  } else {
    document.documentElement.style.setProperty('--global-font', n)
    document.body.style.fontFamily = "var(--global-font),-apple-system, IBM Plex Mono, monosapce,'微软雅黑', sans-serif"
  }
  try { setFontBorder() } catch (err) {}
}

function setFontBorder() {
  const curFont = localStorage.getItem('font')
  const swfId = 'swf_' + curFont
  document.getElementById(swfId).style.border = '2px solid var(--theme-color)'
  document.querySelectorAll('.swf').forEach(el => {
    if (el.id !== swfId) el.style.border = '2px solid var(--border-color)'
  })
}

// 设置主题色
if (!localStorage.getItem('themeColor')) localStorage.setItem('themeColor', 'green')
setColor(localStorage.getItem('themeColor'))

function setColor(c) {
  const rgb = colorMap.get(c)
  document.getElementById('themeColor').innerText = `:root{--theme-color:${rgb} !important}`
  localStorage.setItem('themeColor', c)
  CURSOR.refresh()
  const base = rgb.substring(3, rgb.length - 1)
  document.documentElement.style.setProperty('--text-bg-hover', `rgba${base}, 0.7)`)
  document.documentElement.style.setProperty('--high-trans-color', `rgba${base}, 0.5)`)
}

// 星空背景开关
if (!localStorage.getItem('universe')) localStorage.setItem('universe', 'block')
setUniverse2(localStorage.getItem('universe'))
function setUniverse2(c) { document.getElementById('universe').style.display = c; localStorage.setItem('universe', c) }
function setUniverse() { setUniverse2(document.getElementById('universeSet').checked ? 'block' : 'none') }

// 雪花开关
if (!localStorage.getItem('snow')) localStorage.setItem('snow', 'none')
document.getElementById('snow').style.display = localStorage.getItem('snow')
function setSnow() {
  const on = document.getElementById('snowSet').checked
  document.getElementById('snow').style.display = on ? 'block' : 'none'
  localStorage.setItem('snow', on ? 'block' : 'none')
}

// 帧率监测开关
if (!localStorage.getItem('fpson')) localStorage.setItem('fpson', '1')
function fpssw() { localStorage.setItem('fpson', document.getElementById('fpson').checked ? '1' : '0'); setTimeout(reload, 600) }
function reload() { window.location.reload() }

// 侧边栏开关
if (!localStorage.getItem('rs')) localStorage.setItem('rs', 'block')
document.getElementById('rightSide').innerText = `:root{--rightside-display: ${localStorage.getItem('rs')}}`
function toggleRightside() {
  const on = document.getElementById('rightSideSet').checked
  localStorage.setItem('rs', on ? 'block' : 'none')
  document.getElementById('rightSide').innerText = `:root{--rightside-display: ${on ? 'block' : 'none'}}`
}

// 透明度调节
if (!localStorage.getItem('transNum')) localStorage.setItem('transNum', 95)
var curTransNum = localStorage.getItem('transNum')
var curTransMini = curTransNum * 0.95
document.getElementById('transPercent').innerText = `:root{--trans-light: rgba(253,253,253,${curTransNum}%) !important; --trans-dark: rgba(25,25,25,${curTransNum}%) !important}`

function setTrans() {
  const val = document.getElementById('transSet').value
  document.querySelector('.transValue').innerHTML = '透明度 (0%-100%): ' + val + '%'
  localStorage.setItem('transNum', val)
  curTransMini = val * 0.95; curTransNum = val
  document.querySelector('#rang_trans').style.width = curTransMini + '%'
  document.getElementById('transPercent').innerText = `:root{--trans-light: rgba(253,253,253,${val}%) !important; --trans-dark: rgba(25,25,25,${val}%) !important}`
}

// 模糊度调节
if (!localStorage.getItem('blurRad')) localStorage.setItem('blurRad', 20)
var curBlur = localStorage.getItem('blurRad')
var miniBlur = curBlur * 0.95
document.getElementById('blurNum').innerText = `:root{--blur-num: blur(${curBlur}px) saturate(120%) !important`

function setBlurNum() {
  const val = document.getElementById('blurSet').value
  document.querySelector('.blurValue').innerHTML = '模糊半径 (开启模糊生效 0px-100px): ' + val + 'px'
  localStorage.setItem('blurRad', val)
  curBlur = val; miniBlur = curBlur * 0.95
  document.querySelector('#rang_blur').style.width = miniBlur + '%'
  document.getElementById('blurNum').innerText = `:root{--blur-num: blur(${curBlur}px) saturate(120%) !important`
}

// 模糊效果开关
if (!localStorage.getItem('blur')) localStorage.setItem('blur', 0)
document.getElementById('settingStyle').innerText = `:root{--backdrop-filter: ${localStorage.getItem('blur') == 0 ? 'none' : 'var(--blur-num)'}}`
function setBlur() {
  const on = document.getElementById('blur').checked
  localStorage.setItem('blur', on ? 1 : 0)
  document.getElementById('settingStyle').innerText = `:root{--backdrop-filter: ${on ? 'var(--blur-num)' : 'none'}}`
}

// 背景设置
var defineColor = localStorage.getItem('blogbg') && localStorage.getItem('blogbg').charAt(0) === '#' ? localStorage.getItem('blogbg') : '#F4D88A'
let bingDayBg = screen.width <= 768 ? 'url(https://bing.img.run/m.php)' : 'url(https://bing.img.run/1920x1080.php)'
let bingHistoryBg = screen.width <= 768 ? 'url(https://bing.img.run/rand_m.php)' : 'url(https://bing.img.run/rand.php)'

if (localStorage.getItem('blogbg')) {
  setBg(localStorage.getItem('blogbg'))
} else {
  document.getElementById('defineBg').innerText = `:root{--default-bg:url(/assets/tutu.jpg);--darkmode-bg:url(/assets/tutu.jpg);--mobileday-bg:url(/assets/tutu.jpg);--mobilenight-bg:url(/assets/tutu.jpg)}`
}

function changeBg(s) { defineColor = s.charAt(0) === '#' ? s : '#F4D88A'; setBg(s); localStorage.setItem('blogbg', s) }
function setBg(s) { document.getElementById('defineBg').innerText = `:root{--default-bg:${s};--darkmode-bg:${s};--mobileday-bg:${s};--mobilenight-bg:${s}}` }
function changeBgColor() { changeBg(document.querySelector('#define_colors').value) }

// 霓虹灯开关
if (!localStorage.getItem('light')) localStorage.setItem('light', 'true')
onReady(() => changeLight(localStorage.getItem('light') === 'true'))

function setLight() {
  const on = document.getElementById('lightSet').checked
  changeLight(on)
  localStorage.setItem('light', String(on))
}

function changeLight(flag) {
  const mkAnim = (size) => flag ? `neon-glow 10s linear infinite` : 'none'
  const setNeon = (el, size) => { if (el) { el.style.setProperty('--neon-size', size); el.style.animation = mkAnim() } }
  ;['site-name','site-title'].forEach(id => setNeon(document.getElementById(id), '15px'))
  setNeon(document.getElementById('site-subtitle'), '10px')
  setNeon(document.getElementById('post-info'), '5px')
  document.getElementById('menu_shadow').innerText = flag ? ':root{--menu-shadow: 0 0 1px var(--theme-color)}' : ':root{--menu-shadow: none}'
}


// ==================== 美化设置窗口 ====================

var winbox = ''

function createWinbox() {
  const div = document.createElement('div')
  document.body.appendChild(div)
  winbox = WinBox({
    id: 'meihuaBox', index: 99, title: '美化设置', x: 'left', y: 'center',
    minwidth: '300px', height: '60%', background: 'var(--theme-color)',
    onmaximize: () => { div.innerHTML = '<style>body::-webkit-scrollbar{display:none}div#meihuaBox{width:100%!important}</style>' },
    onrestore: () => { div.innerHTML = '' }
  })
  winResize()
  window.addEventListener('resize', winResize)

  winbox.body.innerHTML = `
<div class="settings" style="display:block">
<div id="article-container" style="padding:12px">
<br>
<center><p><button onclick="reset()" style="background:linear-gradient(to right,#fc354c,#0abfbc);display:block;width:40%;padding:15px 0;border-radius:30px;color:white;font-size:1.1em"><i class="fa-solid fa-arrows-rotate"></i>&nbsp;恢复默认设置</button></p></center>
<h2>一、显示偏好</h2>
<div class="transValue" style="font-weight:bold;padding-left:10px">透明度 (0%-100%): ${curTransNum}%</div>
<div class="range"><input id="transSet" type="range" min="0" max="100" step="1" value=${curTransNum} oninput="setTrans()"><p class="rang_width" id="rang_trans" style="width:${curTransMini}%"></p></div>
<div class="blurValue" style="font-weight:bold;padding-left:10px">模糊半径 (开启模糊生效 0px-100px): ${curBlur} px</div>
<div class="range"><input id="blurSet" type="range" min="0" max="100" step="1" value="${curBlur}" oninput="setBlurNum()"><p class="rang_width" id="rang_blur" style="width:${miniBlur}%"></p></div>
<div class="content" style="display:flex">
  <div class="content-text" style="font-weight:bold;padding-left:10px">星空特效 (夜间模式)</div><input type="checkbox" id="universeSet" onclick="setUniverse()">
  <div class="content-text" style="font-weight:bold;padding-left:20px">霓虹灯 (夜间模式)</div><input type="checkbox" id="lightSet" onclick="setLight()">
</div>
<div class="content" style="display:flex">
  <div class="content-text" style="font-weight:bold;padding-left:10px">模糊效果 (消耗性能)</div><input type="checkbox" id="blur" onclick="setBlur()">
  <div class="content-text" style="font-weight:bold;padding-left:20px">侧边栏 (默认开)</div><input type="checkbox" id="rightSideSet" onclick="toggleRightside()">
</div>
<div class="content" style="display:flex">
  <div class="content-text" style="font-weight:bold;padding-left:10px">帧率监测 (刷新生效)</div><input type="checkbox" id="fpson" onclick="fpssw()">
  <div class="content-text" style="font-weight:bold;padding-left:10px">雪花特效 (白天模式)</div><input type="checkbox" id="snowSet" onclick="setSnow()">
</div>
<h2>二、字体设置</h2>
<div style="background:#fcf8e3;border-left:4px solid #f0ad4e;border-radius:8px;padding:12px 16px;margin:10px 0;color:#8a6d3b;font-size:13px">⚠️ 非商免字体未经授权只能个人使用。本站为完全非商业、非盈利性质的网站，平时用于个人学习交流，如有侵权请联系站长删除，谢谢！ —— 致版权方</div>
<p id="swfs">
<a class="swf" id="swf_BlogFont" href="javascript:;" rel="noopener external nofollow" style="font-family:'BlogFont'!important;color:black" onclick="setFont('BlogFont')">BlogFont</a>
<a class="swf" id="swf_ZhuZiAWan" href="javascript:;" rel="noopener external nofollow" style="font-family:'ZhuZiAWan'!important;color:black" onclick="setFont('ZhuZiAWan')">筑紫A丸标准体2.0</a>
<a class="swf" id="swf_HYTMR" href="javascript:;" rel="noopener external nofollow" style="font-family:'HYTMR'!important;color:black" onclick="setFont('HYTMR')">汉仪唐美人</a>
<a class="swf" id="swf_LXGW" href="javascript:;" rel="noopener external nofollow" style="font-family:'LXGW'!important;color:black" onclick="setFont('LXGW')">霞鹜文楷</a>
<a class="swf" id="swf_TTQHB" href="javascript:;" rel="noopener external nofollow" style="font-family:'TTQHB'!important;color:black" onclick="setFont('TTQHB')">甜甜圈海报</a>
<a class="swf" id="swf_YSHST" href="javascript:;" rel="noopener external nofollow" style="font-family:'YSHST'!important;color:black" onclick="setFont('YSHST')">优设好身体</a>
<a class="swf" id="swf_MiSans" href="javascript:;" rel="noopener external nofollow" style="font-family:'MiSans'!important;color:black" onclick="setFont('MiSans')">MiSans</a>
<a class="swf" id="swf_default" href="javascript:;" rel="noopener external nofollow" style="font-family:-apple-system,IBM Plex Mono,monosapce,'微软雅黑',sans-serif!important;color:black" onclick="setFont('default')">系统默认</a>
</p>
<h2>三、主题色设置</h2>
<div class="content" style="display:flex"><input type="radio" id="red" name="colors" value=" " onclick="setColor('red')"><input type="radio" id="orange" name="colors" value=" " onclick="setColor('orange')"><input type="radio" id="yellow" name="colors" value=" " onclick="setColor('yellow')"><input type="radio" id="green" name="colors" value=" " onclick="setColor('green')"><input type="radio" id="blue" name="colors" value=" " onclick="setColor('blue')"><input type="radio" id="heoblue" name="colors" value=" " onclick="setColor('heoblue')"><input type="radio" id="darkblue" name="colors" value=" " onclick="setColor('darkblue')"><input type="radio" id="purple" name="colors" value=" " onclick="setColor('purple')"><input type="radio" id="pink" name="colors" value=" " onclick="setColor('pink')" checked="checked"><input type="radio" id="black" name="colors" value=" " onclick="setColor('black')"><input type="radio" id="blackgray" name="colors" value=" " onclick="setColor('blackgray')"></div>
<h2>四、背景设置</h2>
<center><button onclick="resetBg()" style="background:var(--theme-color);display:block;width:35%;padding:15px 0;border-radius:30px;color:white"><i class="fa-solid fa-arrows-rotate"></i>&nbsp;恢复默认背景</button></center>
<h3>1. 必应壁纸</h3>
<details style="margin:8px 0"><summary style="cursor:pointer;color:var(--theme-color);font-weight:bold">🎨 查看必应壁纸</summary>
<div class="bgbox">
<a id="bingDayBox" rel="noopener external nofollow" style="background-image:${bingDayBg}" class="box apiBox" onclick="changeBg('${bingDayBg}')"></a>
<a id="bingHistoryBox" rel="noopener external nofollow" style="background-image:${bingHistoryBg}" class="box apiBox" onclick="changeBg('${bingHistoryBg}')"></a>
</div>
</details>
<h3>2. 渐变色</h3>
<details style="margin:8px 0"><summary style="cursor:pointer;color:var(--theme-color);font-weight:bold">🎨 查看渐变色背景</summary>
<div class="bgbox">
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to right,#544a7d,#ffd452)" onclick="changeBg('linear-gradient(to right,#544a7d,#ffd452)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to bottom,#7f7fd5,#86a8e7,#91eae4)" onclick="changeBg('linear-gradient(to bottom,#7f7fd5,#86a8e7,#91eae4)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to left,#654ea3,#eaafc8)" onclick="changeBg('linear-gradient(to left,#654ea3,#eaafc8)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to top,#feac5e,#c779d0,#4bc0c8)" onclick="changeBg('linear-gradient(to top,#feac5e,#c779d0,#4bc0c8)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to top,#d3959b,#bfe6ba)" onclick="changeBg('linear-gradient(to top,#d3959b,#bfe6ba)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to top,#8360c3,#2ebf91)" onclick="changeBg('linear-gradient(to top,#8360c3,#2ebf91)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to top,#108dc7,#ef8e38)" onclick="changeBg('linear-gradient(to top,#108dc7,#ef8e38)')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:linear-gradient(to top,#355c7d,#6c5b7b,#c06c84)" onclick="changeBg('linear-gradient(to top,#355c7d,#6c5b7b,#c06c84)')"></a>
</div>
</details>
<h3>3. 纯色</h3>
<details style="margin:8px 0"><summary style="cursor:pointer;color:var(--theme-color);font-weight:bold">🎨 查看纯色背景</summary>
<div class="bgbox">
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#ecb1b1" onclick="changeBg('#ecb1b1')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#d3ebac" onclick="changeBg('#d3ebac')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#ace9ce" onclick="changeBg('#ace9ce')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#c1ebea" onclick="changeBg('#c1ebea')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#dee7f1" onclick="changeBg('#dee7f1')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#e9e3f2" onclick="changeBg('#e9e3f2')"></a>
<a href="javascript:;" rel="noopener external nofollow" class="box" style="background:#f7eff5" onclick="changeBg('#f7eff5')"></a>
<input type="color" id="define_colors" href="javascript:;" rel="noopener external nofollow" class="box" autocomplete="on" value="${defineColor}" oninput="changeBgColor()">
</div>
</details>
<br>
<center><div style="font-size:1.2em;color:var(--theme-color);font-weight:bold">------ ( •̀ ω •́ )y 到底啦 ------</div></center>
<br>
</div>
</div>`

  // 初始化复选框状态
  $('#' + localStorage.getItem('themeColor')).attr('checked', true)
  document.getElementById('blur').checked = localStorage.getItem('blur') == 1
  document.getElementById('universeSet').checked = localStorage.getItem('universe') === 'block'
  document.getElementById('fpson').checked = localStorage.getItem('fpson') === '1'
  document.getElementById('rightSideSet').checked = localStorage.getItem('rs') === 'block'
  document.getElementById('lightSet').checked = localStorage.getItem('light') === 'true'
  document.getElementById('snowSet').checked = localStorage.getItem('snow') === 'block'
  setFontBorder()
}

function resetBg() { localStorage.removeItem('blogbg'); reload() }
function reset() { clearItem(); reload() }

function winResize() {
  try {
    const w = document.documentElement.clientWidth
    const ratio = w <= 768 ? 0.95 : 0.6
    const height = w <= 768 ? '90%' : '70%'
    winbox.resize(w * ratio + 'px', height).move('center', 'center')
  } catch (err) {}
}

function toggleWinbox() {
  document.querySelector('#meihuaBox') ? winbox.toggleClass('hide') : createWinbox()
}
