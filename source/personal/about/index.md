---
title: 关于
date: 2022-08-10 16:05:11
---

<style>
	/* 头像卡片 */
	.author-img {
        position: relative; /* 设置相对定位 */
    }

    .author-box {
        text-align: center;
        padding: 20px;
        height: auto;
        border-bottom: 2px solid #ddd;
        /* 分割线 */
    }
    
    .author-img img {
        border-radius: 50%; /* 显示为圆形 */
        width: 150px; /* 宽度设置 */
        height: 150px; /* 高度保持一致，否则就成椭圆了 */
        margin-bottom: 10px;
    }
    
    .green-dot {
    	position: absolute;
    	right: calc(50% - 67px);
    	bottom: 13px;
    	width: 20px; /* 小圆点的宽度 */
    	height: 20px; /* 小圆点的高度 */
    	background-color: rgb(40, 231, 139); /* 小圆点的颜色，感觉很好看，对照着QQ的颜色搞的 */
    	border-radius: 50%; /* 使小圆点变成圆形 */
    }
    
    /* 文本格式，全局 */
    .content h2 {
        margin-top: 0;
        margin-bottom: 0;
    }
    
    /* 设置每一节宽度，高度，长度等等 */
    .content .column {
    	margin-top: 4px;
        margin-bottom: 4px;
        width: 65%;
        margin-left: 20px;
    }
    
    /* 给第一格个人信息进行适配 */
    .content .info-columns {
        margin: 10px 0;
    }
    
    /* 第一格的个人信息，我使用了表格，为了显示更多信息的同时不空出大部分地方，你们自行选择 */
    .content .row {
        display: flex;
        justify-content: space-between;
    }
    
    /* 每一节通用格式 */
    .section {
        display: flex;
        padding: 10px;
        align-items: center;
        justify-content: space-between;
        border-bottom: none;
        margin-top: 20px;
        margin: 20px 10px 0 10px;
        border-radius: 10px;
        background-color: white;
        height: 250px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* 夜间适配，改变背景和相关阴影部分 */
    [data-theme=dark] .section {
        background-color: #2c2c2c;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    /* 右图左文样式，左边为row，因为是默认的所以不需要指定 */
    .section.right {
        flex-direction: row-reverse;
    }
    
    /* 节内图片所在位置相关格式，这里是因为我开了fancybox，也就是点击预览大图的效果，使图片被一个a所包裹，如果你关了请自行将该内容添加到下面的img中，其他位置对应调整 */
    .section a {
    	width: 45%;
    	height: 100%;
    	transition: transform 0.5s ease; /* 添加过渡效果 */
    
    }
    
    /* 节内A标签内的图片，占满a标签，并不拉伸，使用覆盖，自适应大小 */
    .section img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }
    
    /* 在鼠标悬停在 .section 上时，放大图片 */
    .section:hover a {
    	transform: scale(1.10); /* 将图片放大10% */
    }
    
    /* 设置放大只在当图片没有消失时，否则这个宽度会覆盖掉设置的小时候为100%的设定 */
    @media (min-width: 870px) {
    	/* 图像在右边的节，当鼠标放入，适当向左偏移，造成好像被图像挤过去的视觉效果 */
    	.section.right:hover .content {
    		margin-left: 10px;
    	}
    	/* 通用，因为文字是靠左的，改变宽度就被挤过去了 */
    	.section:hover .content {
    		width: 50%;
    		width: 50%;
    	}
    }
    
    /* 通用文字部分基础设置 */
    .section .content {
        width: 55%;
        margin: 20px 20px;
        max-height: 100%;
        overflow: hidden; /* 超出部分不好看，我给隐藏了，看不见也比超出强，不过这个可以通过修改各种宽度高度进行个性适配 */
        text-overflow: ellipsis;
        transition: width 0.5s ease, margin-left 0.3s ease; /* 添加过渡效果 */
    }
    
    /* 最下方的一堆个人站点 */
    .wrapper {
    	text-align: center; /* 文字居中 */
        padding: 10px;
        margin: 20px 10px 0 10px;
        border-radius: 10px;
        background-color: white;
        height: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* 四个大字 */
    .wrapper .label {
        margin: 20px 20px;
    }
    
    /* 网格相关链接布局样式 */
    .wrapper .site-grid {
        margin-top: 10px;
        border-radius: 8px;
        display: grid;
        grid-template-columns: repeat(4, 1fr); /* 一行四块 */
        gap: 10px; /* 块之间的间隙 */
        width: 100%;
        height: auto; /* 宽度自动填充 */
    }
    
    /* 每个站点块的样式 */
    .wrapper .site-grid .site-item {
    	z-index: 1;
        border-radius: 10px;
        position: relative;
        width: 100%;/* 宽度自动填充 */
        height: 200px;/* 设置块的高度 */
        background-size: cover;/* 背景图片填充整个块 */
        background-position: center;/* 背景图片居中 */
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        overflow: hidden; /* 使超出边框的内容隐藏 */
        transition: transform 0.3s ease-in-out, z-index 0.3s ease-in-out;
    }


​    
    /* 动画效果，鼠标放上去时背景图片放大的动画 */
    @media (min-width: 870px) {
    	.wrapper .site-grid .site-item:hover {
    		transform: scale(1.2); /* 放大倍数 */
    		z-index: 2;
    	}
    }
    
    /* 块中的字覆盖层样式 */
    .wrapper .site-overlay {
        position: absolute;
        inset: 0; /* 将 top, right, bottom, left 都设为 0 */
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.5); /* 初始为透明背景 */
        transition: background 0.6s, color 0.6s; /* 背景过渡效果 */
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        font: bold 25px sans-serif; /* 根据需求更改字体大小 */
        color: #000000; /* 根据需求更改字体颜色，默认是黑 */
    }
    
    /* 鼠标悬停时的样式 */
    .wrapper .site-item:hover .site-overlay {
        background: rgba(0, 0, 0, 0.5); /* 白底变黑 */
        color: #ffffff; /* 黑字变白 */
    }
    
    /* 夜间适配 */
    [data-theme=dark] .wrapper {
        background-color: #2c2c2c; /* 这是我全局的夜间统一色，你们自己看 */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    /* 夜间鼠标悬停动效适配 */
    [data-theme=dark] .wrapper .site-item:hover .site-overlay {
        background: rgba(255, 255, 255, 0.5);
        color: #000000;
    }
    
    /* 夜间卡片背景适配，和白天是相反的 */
    [data-theme=dark] .wrapper .site-overlay {
        background: rgba(0, 0, 0, 0.5);
        color: #ffffff;
    }
    
    /* 窄屏适配 */
    @media (max-width: 870px) {/* 当页面宽度小于870像素时 */
        /* 不显示图片 */
    	.section a {
    		display: none;
    	}
    	
    	/* 将位置留给文字 */
    	.section .content {
    		width: 100%;
    	}
    	/* 高度自己调整，因为窄屏视野没有那么大，部分节窄一点宽一点不影响，但是最小仍然是之前设置的值，这个需要你们自己改 */
    	.section {
    	    height: auto;
    	    min-height: 250px;
    	}
    	
    	/* 下方链接到现在显示为两列，要不然挤得不行 */
    	.wrapper .site-grid {
            grid-template-columns: repeat(2, 1fr);
            /* 一行显示2个块 */
            grid-auto-rows: 200px;
            /* 保持行高一致 */
        }
    }
    
    /* 当页面宽度小于480像素时，我们的表格成为1列 */
    @media (max-width: 560px) {
        .wrapper .site-grid {
            grid-template-columns: repeat(1, 1fr);
            /* 一行显示1个块 */
            grid-auto-rows: 200px;
            /* 保持行高一致 */
        }
    }
</style>

<div class="author-box">
    <div class="author-img">
        <img class="no-lightbox" src="https://tutublog.eu.org/file/1763260619100_Image_1759321330220.jpg">
        <div class="green-dot"></div>
    </div>
    <div class="image-dot"></div>
    <p class="p center logo large">关于我</p>
    <p class="p center small">熙熙攘攘，做个人间过客</p>
</div>


<div class="section left">
    <img src="https://t.mwm.moe/ysmp">
    <div class="content">
        <div class="info-columns">
            <h2>个人信息</h2>
            <ul>
                <div class="row">
                    <div class="column">
                        <li>姓名: 兔兔</li>
                        <li>住址: 广东省</li>
                        <li>学校: 不知名的小学校</li>
                    </div>
                    <div class="column">
                        <li>性别: 颜控</li>
                        <li>年级: 二年级</li>
                        <li>擅长: 人工智能，网站开发</li>
                    </div>
                </div>
                <li>邮箱: 1742305143@qq.com</li>
            </ul>
        </div>
    </div>
</div>

<div class="section right">
    <img src="https://t.mwm.moe/ys">
    <div class="content">
        <h2>教育背景</h2>
        <ul>
            <li>学校: 野鸡大学</li>
            <li>主要专业课程: 干饭.jpg(101.5)</li>
        </ul>
    </div>
</div>

<div class="section right">
    <img src="https://t.mwm.moe/ysz">
    <div class="content">
        <h2>主要项目</h2>
        <ul>
            <li>hexo 博客</li>
            <li>GitHub action 自动打包</li>
            <li>搜狗词库自动转谷歌</li>
            <li>基于 php 实现即时通讯</li>
            <li>基于 github 实现自动签到</li>
        </ul>
    </div>
</div>

<div class="section left">
	<img src="https://t.mwm.moe/ycy">
    <div class="content">
        <h2>技能</h2>
        <ul>
            <li>语言技能: 汉语</li>
            <li>专业技能: C++、Java、Python、Linux、HTML、CSS、JavaScript</li>
            <li>通用技能: 干饭</li>
        </ul>
    </div>
</div>

<div class="section left">
    <img src="https://t.mwm.moe/ysmp">
    <div class="content">
        <h2>自我评价</h2>
        <ul>
            <li>思想上乐观开朗，乐于助人，具有团队协作精神及创新意识。</li>
            <li>工作上极富责任心与信念感，对待工作认真负责，有较强的组织管理及动手能力。</li>
            <li>总结：人嘎嘎好！</li>
        </ul>
    </div>
</div>
