---
date: ''
title: 唠叨
updated: Wed, 05 Apr 2023 00:58:45 GMT
---
<head>
  <!-- ... -->
  <script type="text/javascript"     src="/js/qexo-dao.min.js"></script>
  <!-- ... -->
</head>
<body>
  <!-- ... -->
  <div id="qexoDaoDao"></div>
  <script>
    qexoDaodao?.init({
      el: "#qexoDaoDao",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=1742305143&s=640",
      name: "兔兔",
      limit: 10,
      useLoadingImg: false,
      baseURL: "https://astro.xn--eet944d.top/",
    }).then(function (){
      console.log("说说加载完成");
    })
  </script>
</body>
