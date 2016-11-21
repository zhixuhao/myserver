#flex 布局
参考链接：

1. 语法
>http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
2. 实战
>http://www.ruanyifeng.com/blog/2015/07/flex-examples.html

**注意：** 有两种类型的属性，容器属性（应用到父元素上的，比如想让当前元素水平垂直居中，就要在父元素上设置display:flex，justify-content：center,align-items:center）还有项目属性（直接应用到当前元素上的，比如order，flex-grow）
####举例：
    <!DOCTYPE html>

    <html>
	<head>
		<style>
			body{
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.container{
				width: 500px;
				height: 500px;
				display: flex;
				flex-direction: column;
			}
			.row{
				width: 100%;
				height: 33.3%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.item{
				margin:10px;
				max-height: 100%;
				height: calc(100% - 20px);
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #3cc7c5;
				color: white;
				font-size: 50px;
				flex:1 1 auto;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="row">
				<div class="item">1</div>
				<div class="item">2</div>
				<div class="item">3</div>
			</div>
			<div class="row">
				<div class="item">4</div>
				<div class="item">5</div>
				<div class="item">6</div>
			</div>
			<div class="row">
				<div class="item">7</div>
				<div class="item">8</div>
				<div class="item">9</div>
			</div>
		</div>
	</body>
    </html>
    
#####效果：

<div align=center><img src = images/flex1.png width=300></div>

######其中flex-grow用来分配未分配的空间，表示权重，order用来表示排列的顺序，如果给5分配flex-grow:2,order:3,则：
<div align=center><img src = images/flex2.png width=300></div>

####响应式布局的例子：

    <!DOCTYPE html>
    <html>
    <head>
    <style>
    .flex-container {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-flow: row wrap;
        flex-flow: row wrap;
        text-align: center;
    }

    .flex-container > * {
        padding: 15px;
        -webkit-flex: 1 100%;
        flex: 1 100%;
    }

    .article {
        text-align: left;
    }

    header {background: black;color:white;}
    footer {background: #aaa;color:white;}
    .nav {background:#eee;}

    .nav ul {
        list-style-type: none;
     padding: 0;
    }
       
    .nav ul a {
     text-decoration: none;
    }

    @media all and (min-width: 768px) {
        .nav {text-align:left;-webkit-flex: 1 auto;flex:1 auto;-webkit-order:1;order:1;}
        .article {-webkit-flex:5 0px;flex:5 0px;-webkit-order:2;order:2;}
        footer {-webkit-order:3;order:3;}
    }
    </style>
    </head>
    <body>

    <div class="flex-container">
    <header>
      <h1>City Gallery</h1>
    </header>

    <nav class="nav">
    <ul>
      <li><a href="#">London</a></li>
      <li><a href="#">Paris</a></li>
      <li><a href="#">Tokyo</a></li>
    </ul>
    </nav>

    <article class="article">
      <h1>London</h1>
      <p>London is the capital city of England. It is the most populous city in the United Kingdom,
      with a metropolitan area of over 13 million inhabitants.</p>
      <p>Standing on the River Thames, London has been a major settlement for two millennia,
      its history going back to its founding by the Romans, who named it Londinium.</p>
      <p><strong>Resize this page to see that what happens!</strong></p>
    </article>

    <footer>Copyright © W3Schools.com</footer>
    </div>

    </body>
    </html>
#####屏幕宽度大于768：
<div align=center><img src = images/flex3.png width=600></div>

#####屏幕宽度小于768：
<div align=center><img src = images/flex4.png width=600></div>


