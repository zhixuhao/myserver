#Html5 知识点

**accesskey **是快捷键，可以用使得元素获得焦点，比如跳转超链接，或者input输入，Alt + accessKey (或者 Shift + Alt + accessKey)，mac是control+option+accessKey

**contenteditable** 声明内容可编辑

可以实现**拖放（拖动和放置）**功能，参考网址：
> http://www.w3school.com.cn/html5/html_5_draganddrop.asp 

**jquery ui库**也可以实现拖放

**hidden**属性直接可以隐藏，但是IE11之前都不支持

**tabindex** 是tab键次序，-1是不能通过tab访问

**title**是提供额外信息的，通常显示为工具提示,比如说bootstrap的tooltip

**虚元素**只能用一个标签表示，表示段落级别的终止，例如 hr

样式表可以从其他样式表中**导入样式，**比如@import “style.css"

样式表可以**声明字符编码** @charset “UTF-8”,如果没有声明，则浏览器采用html的编码，默认是utf-8

**css 优先程度**，选择器中id数目（可以大于1）>属性值（class也是属性）和伪类数目（比如:hover）>元素名和伪元素（before,after）数目

**颜色表示**一般用十六进制，但是如果要表示更复杂的颜色，可以用rgb，rgba，其中的a代表透明度，0表示完全透明，1表示不透明。也可以用hsl和hsla模型来表示。透明度也可以单独用opacity表示，0全透明，1不透明。

img的**alt属性**，在图片加载不出来时候显示替代文本

**label绑定checkbox或者radio**（比如点击说明文字就可以勾选）的方法有两种，一种是label的for属性，另外一种就是用label包裹住checkbox或者radio。