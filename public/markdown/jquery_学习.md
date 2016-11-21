#Jquery 学习

用jquery的设置属性attr和prop有时候效果不同，
>http://www.jb51.net/article/48503.htm

以下两种方法效果相同:
<div align=center><img src = images/prop1.png width=300></div>
<div align=center><img src = images/prop2.png width=300></div> 

然而如果用attr，虽然看出来checked是=“checked”，但是实际上并没有改变属性:

<div align=center><img src = images/prop3.png width=300></div> 

根据官方的建议：具有 true 和 false 两个属性的属性，如 checked, selected 或者 disabled 使用prop()，其他的使用 attr(),看下图所示：

<div align=center><img src = images/prop4.png width=300></div> 