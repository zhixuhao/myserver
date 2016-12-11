(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zhixuhao on 12/8/16.
 */

function myModule(name,type,time){
    this.name = name;
    this.type = type;
    this.time = time;
}

myModule.prototype = {
  init:function(){
      var $html = $("<div>").html("name:"+this.name + "type:"+this.type+"time:"+time);
      return $html;
  },
    getname:function(){
        return this.name;
    },
    gettime:function(){
        return this.time;
    }
};

module.exports = function(name,type,time){
    return new myModule(name,type,time);
};
},{}],2:[function(require,module,exports){
/**
 * Created by zhixuhao on 12/7/16.
 */
(function(window){
    var zmodule = require("./Note.js");
    function zxh(){
        this.author = "zhixuhao";
        this.createTime = "20161207";
        this.mymodule = zmodule("zhixuhao","try",1208);
    }

    zxh.prototype = {
        initSimditor:function (){
        var editor = new Simditor({
            textarea: $("#simditor_area"),
            toolbar: toolbar,
            imageButton: "upload",
            pasteImage: true,
            upload: {
                url: location.origin + "/noteimg/upload/",
                formData : {
                    "childPath" : "picture"
                },
                fileKey: "file",
                leaveConfirm: "上传正在进行，您确定要离开本页面？"
            }
        });
        },

        mobile_click:function (){
        $("p.title").bind("touchstart",function(){
            $(this).addClass("active");
        });
        $("p.title").bind("touchend",function(){
            $(this).removeClass("active");
        });
        },

        initUploadFile:function (){
        $("input[type=file]").click(function(){
            $("input[type=file]").val("");
            var interval = setInterval(function(){
                var uploadVal = $("input[type=file]").val();
                if(uploadVal !== ""){
                    window.clearInterval(interval);
                    $(".modal-body-text").text("上传文件:  "+uploadVal);
                    $("#myModal input.input-title").val(uploadVal);
                    $("#myModal").modal();
                }
            },500)
        });
        },

        getAllType:function (){
            var that = this;
        $.ajax({
            contentType:'application/json;charset=UTF-8',
            type: "POST",
            url: location.origin+'/alltype/',
            dataType: "json",
            success:function(data){
                console.log(data);
                that.showAllType(data);
                //var tmp = new zxh();
                //tmp.showAllType(data);
            }
        })
        },

        showAllType:function (data){
        var notes_num = data.notes;
        var mds_num = data.mds;
        var notes_url = "'"+location.origin + "/notes"+"'";
        var mds_url = "'" + location.origin + "/markdown" + "'";
        //这个是字符串模板,es6的语法,不兼容x5内核(qq浏览器以及微信的内核)
        //var template = `<div class="type" onclick="location.href = location.origin + '/markdown'"><p>Markdown 笔记</p><p>一共有${mds_num}</p></div>
        //			   <div class="type" onclick="location.href = location.origin + '/notes'"><p>随笔记</p><p>一共有${notes_num}</p>`;
        var template = '<div class="type" onclick="location.href ='+mds_url+'"><p>Markdown 笔记</p><p>一共有'
            +mds_num+'</p></div><div class="type" onclick="location.href ='+notes_url+'"><p>随笔记</p><p>一共有'+notes_num+'</p>';
        var $articleWrapper = $("#article-wrapper");
        progressJs("#porgress").start();
        progressJs("#porgress").set(50);
        $articleWrapper.css("opacity",0);
        setTimeout(function(){
            $articleWrapper.empty();
            $articleWrapper.html(template);
            $articleWrapper.css("opacity",1);
            progressJs("#porgress").end();
        },500);
        },
        getAllNotes:function (){
            var that = this;
        $.ajax({
            contentType:'application/json;charset=UTF-8',
            type: "POST",
            url: location.origin+'/allnotes/',
            dataType: "json",
            success:function(data){
                data.sort(function(a,b){
                    if(a.time < b.time){
                        return 1;
                    }
                    else if(a.time > b.time){
                        return -1;
                    }
                    return 0;
                });
                console.log(data);
                that.showNotes(data);
            }
        });
        },
        showNotes:function(data){
        var $articleWrapper = $("#article-wrapper");
        progressJs("#porgress").start();
        $articleWrapper.css("opacity",0);
        $articleWrapper.removeClass("markdown");
        setTimeout(function(){
            $articleWrapper.empty();
            for(var i = 0; i < data.length; i++){
                var $article = $("<article>").addClass("note").addClass(data[i].class).attr("data-target",data[i].time.toString());
                var $atitle = $("<p>").addClass("article-title").text(data[i].title.toString());
                var $acontent = $("<p>").addClass("content").text(data[i].describe.toString());
                var $afooter = $("<p>").addClass("footer");
                var $timespan = $("<span>").text("发布于 "+time_transfer(data[i].time));
                var $classspan = $("<span>").addClass("classSpan").text(data[i].class);
                var $alterspan = $("<span>").addClass("alterSpan").text("修改");
                $alterspan.bind("click",function(){
                    alterNote($(this).parent().parent().attr("data-target"),"all");
                });
                var $deletespan = $("<span>").text("删除").addClass("deleteSpan");
                $deletespan.bind("click",function(){
                    deleteNote($(this).parent().parent().attr("data-target"),"all");
                });
                $afooter.append($timespan).append($classspan).append($alterspan).append($deletespan);
                $article.append($atitle).append($acontent).append($afooter);
                var arg = data[i].time.toString()+"_"+data[i].class.toString();
                $atitle.bind("click",function(){
                    getNoteDetail($(this).parent().attr("data-target"),showNoteDetail);
                });
                $articleWrapper.append($article);
            }
            $articleWrapper.css("opacity",1);
            progressJs("#porgress").end();
        },500);
        },
        getMarkdown:function(){
            var that = this;
        $.ajax({
            contentType:'application/json;charset=UTF-8',
            type: "POST",
            url: location.origin+'/markdown/',
            dataType: "json",
            success:function(data){
                console.log(data);
                that.showMarkdown("array",data);
            }
        })
        },

        showMarkdown:function(type,data){
        if(type == "single"){
            var html = data.html;
            var $articleWrapper = $("#article-wrapper");
            $articleWrapper.addClass("markdown");
            progressJs("#porgress").start();
            progressJs("#porgress").set(50);
            $articleWrapper.css("opacity",0);
            setTimeout(function(){
                $articleWrapper.empty();
                $articleWrapper.html(html);
                if($(window).width() < 500){
                    imgResize();
                }
                $articleWrapper.css("opacity",1);
                progressJs("#porgress").end();
            },500);
        }
        else if(type == "array"){
            var $articleWrapper = $("#article-wrapper");
            $articleWrapper.addClass("markdown");
            progressJs("#porgress").start();
            $articleWrapper.css("opacity",0);
            progressJs("#porgress").set(50);
            setTimeout(function(){
                $articleWrapper.empty();
                $.each(data,function(index,item){
                    var $article = $("<article>").addClass("note").addClass(item.class).attr("data-target",item.time.toString());
                    var $atitle = $("<p>").addClass("article-title").text(item.title.toString());
                    var $acontent = $("<p>").addClass("content").text(item.describe.toString());
                    var $afooter = $("<p>").addClass("footer");
                    var $timespan = $("<span>").text("发布于 "+time_transfer(parseInt(item.time)));
                    var $classspan = $("<span>").addClass("classSpan").text(item.class);
                    var $deletespan = $("<span>").text("删除").addClass("deleteSpan");
                    $deletespan.bind("click",function(){
                        deleteMd($(this).parent().parent().attr("data-target"));
                    });
                    $afooter.append($timespan).append($classspan).append($deletespan);
                    $atitle.bind("click",function(){
                        getMdDetail($(this).parent().attr("data-target"),showMarkdown);
                    });
                    $article.append($atitle).append($acontent).append($afooter);
                    $articleWrapper.append($article);
                });
                if($(window).width() < 500){
                    imgResize();
                }
                $articleWrapper.css("opacity",1);
                progressJs("#porgress").end();
            },500);
        }
        },

};

    function Basic(type){
        this.type = type;
    }
    function Note(){
        this.type = "note";
        this._article = null;
    }

    Note.prototype = {
        noteInit:function(data){
            
        },
        getArticle:function(data){
            var $article = $("<article>").addClass("note").addClass(data.class).attr("data-target",data.time.toString());
            var $atitle = $("<p>").addClass("article-title").text(data.title.toString());
            var $acontent = $("<p>").addClass("content").text(data.describe.toString());
            var $afooter = $("<p>").addClass("footer");
            var $timespan = $("<span>").text("发布于 "+this.time_transfer(data.time));
            var $classspan = $("<span>").addClass("classSpan").text(data.class);
            var $alterspan = $("<span>").addClass("alterSpan").text("修改");
            return $article;
        },
        time_transfer:function(t){
            var date = new Date(t);
            Y = date.getFullYear() + '-';
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
            h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+':';
            m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+'';
            return Y+M+D+h+m;
        },
        getNoteDetail:function(filename,func){
            var postdata = {
                filename:filename
            };
            $.ajax({
                contentType:'application/json;charset=UTF-8',
                type: "POST",
                url: location.origin+"/noteDetail/",
                dataType: "json",
                data:JSON.stringify(postdata),
                success: function(data){
                    func(data[0],filename);
                }
            });
        },
        alterNote:function(filename){
        $("#addNote").addClass("active");
        $("#post_button").text("保存修改");
        var showAlterEditor = function(data,filename){
            var title = $("input.input-title").eq(0);
            var describe = $("input.input-describe").eq(0);
            var content = $(".simditor-body").eq(0);
            var placeholder = $(".simditor-placeholder").eq(0);
            title.val(data.title);
            describe.val(data.describe);
            placeholder.empty();
            content.html(data.content);
            $("input[value="+data.class+"]").prop("checked",true);
        };
        getNoteDetail(filename,showAlterEditor);
        $("#post_button")[0].onclick = function(){
            post_note(true,filename);
        };
        },
    };

    window.zxh = zxh;
})(window);
},{"./Note.js":1}]},{},[2]);
