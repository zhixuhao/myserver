#CSS3 动画

**animation** 用来绑定动画，这是一个简写属性，包括以下六个属性：
   
    animation-name
	animation-duration
	animation-timing-function
	animation-delay
	animation-iteration-count
	animation-direction
	
**@keyframes** 用来创建动画

    @keyframes myfirst
	{
		0%   {background:red; left:0px; top:0px;}
		25%  {background:yellow; left:200px; top:0px;}
		50%  {background:blue; left:200px; top:200px;}
		75%  {background:green; left:0px; top:200px;}
		100% {background:red; left:0px; top:0px;}
	}
	
**注意** 兼容性，所以最好要加上前缀，一个完整的动画参考网页：
>http://www.w3school.com.cn/tiy/t.asp?f=css3_animation4

**animate.css** 是一个动画插件，展示网址：
>https://daneden.github.io/animate.css/

里面有很多种特效，纯css实现，可以学习一个。

**:target伪元素**

用target实现滑入滑出效果：
>http://caibaojian.com/demo/2013/open-close-fixed.html#volet

**z-index** 

用来定义堆叠顺序，只能应用到定位元素上（fixed,absolute,relative），z-index 值大的在上面，如果为负值则不显示。申请通的搜索页面特效就是这样做的（一开始模态框opacity为0，z-index为-1，点击button之后，opacity增大，z-index=1001）。