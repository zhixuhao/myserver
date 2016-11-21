#ionic学习笔记

##1.环境搭建

参考网址：
> http://ionicframework.com/docs/guide/installation.html

需要安装 **cordova** 和**ionic**，都是用npm 安装，非常方便。

之后就可以直接开始创建项目了，ionic start appname tabs，其中有三种官方模板，blank,tabs,sidemenu,默认是tabs。

浏览器启动服务是ionic serve，当然也可以添加iOS和Android平台，用模拟器启动，比如 

	ionic build ios;
	ionic emulate ios;

##2.sass 配置

ionic是用**gulp**自动化构建工具来实现sass的监听，gulp.js文件在根目录下面，定义了sass和watch任务，可以自己配置，根目录下面ionic.config.json文件定义了gulpStartupTasks，在服务启动之后先sass然后watch，从而实现liveReload。

 ionic setup sass 命令用来启动sass自动化服务。    
 
 但是我现在遇到问题，只执行了sass,并没有执行watch，也就是说不能监听scss文件，这个应该不是gulp.js的问题，因为我用gulp sass命令和gulp watch 命令都是正常的，说明ionic没有启动gulp 的watch 函数。
 
##3.tabs嵌套路由

参考网址：
>http://www.oschina.net/translate/angularjs-ui-router-nested-routes

**这里是目录结构：**

<div align=center>
<img src="images/ionic目录.png" width=200>
</div>

index.html 里用`<ion-nav-view></ion-nav-view>`来标记渲染的view层

tabs.html里面

    <ion-tabs class="tabs-icon-top tabs-color-active-  positive">

     <!-- Dashboard Tab -->
     <ion-tab title="Status" icon-off="ion-ios-pulse" icon-on="ion-ios-pulse-strong" href="#/tab/dash">
    <ion-nav-view name="tab-dash"></ion-nav-view>
    </ion-tab>

    <!-- Chats Tab -->
    <ion-tab title="Chats" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes" href="#/tab/chats">
    <ion-nav-view name="tab-chats"></ion-nav-view>
    </ion-tab>

    <!-- Account Tab -->
    <ion-tab title="Account" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab/account">
    <ion-nav-view name="tab-account"></ion-nav-view>
    </ion-tab>


    </ion-tabs>

有三个tab，分别是status，chats和account。

######关系：tabs.html是tabs.html的子页面，tab-*.html和chat-detail.html都是tabs.html的子页面。

###AngularJs ui-router 嵌套路由
这个是由app.js 定义：

    .config(function($stateProvider, $urlRouterProvider) {

     // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
    })

    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

    .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

    });
    

$stateProvider 和 $urlRouteProvider 路由引擎作为函数参数传入，这样我们就可以为这个应用程序配置路由了.

`.state('tab', `这一段代码定义了在index.html第一个显示出来的状态，作为页面加载好之后第一个使用的路由。

`.state('tab.*'`接下来加上了前缀，并且使用点“.“号进行了分隔的状态名比如说tab.account，都是表示定义的子页面，也就是tab-account.html是作为tabs.html的子页面，渲染到view控件里。

最后的页面是这样子的：
<div align=center>
<img src="images/dash.png" width=200>
</div>
<div align=center>
<img src="images/chats.png" width=200>
</div>



