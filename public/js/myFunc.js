/**
 * Created by zhixuhao on 11/21/16.
 */
function addnote(obj){
    var div = $(obj).parent().parent();
    if(div.hasClass('active')){
        div.removeClass('active');
        return;
    }
    else{
        div.addClass('active');
    }
}

function getNoteDetail(filename,func){
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

}

function getMdDetail(time,func){
    var postdata = {
        time:time
    };
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+"/mdDetail/",
        dataType: "json",
        data:JSON.stringify(postdata),
        success: function(data){
            func("single",data[0]);
        }
    });
}

function showNoteDetail(data,filename){
    progressJs("#porgress").start();
    $("#article-wrapper").css("opacity",0);
    progressJs("#porgress").set(50);
    var $title = $("<p>").addClass("article-title");
    $title.text(data.title);
    var $time = $("<span>").html("发布于"+time_transfer(data.time));
    var $tag = $("<span>").html(data.class);
    var $alterspan = $("<span>").text("修改").addClass("alterSpan");
    $alterspan.bind("click",function(){
        alterNote($(this).parent().parent().attr("data-target"));
    });
    var $deletespan = $("<span>").text("删除").addClass("deleteSpan");
    $deletespan.bind("click",function(){
        deleteNote($(this).parent().parent().attr("data-target"));
    });
    var $footer = $("<p>").addClass("footer");
    $footer.append($time,$tag,$alterspan,$deletespan);
    var $content = $("<p>").addClass("content").html(data.content);
    var $article = $("<article>").addClass("note-detail").addClass(data.class).append($title,$content,$footer).attr("data-target",filename);
    setTimeout(function(){
        $("#article-wrapper").empty();
        $("#article-wrapper").append($article);
        $("#article-wrapper").css("opacity",1);
        progressJs("#porgress").end();
    },500);
}

function getAllType(){
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+'/alltype/',
        dataType: "json",
        success:function(data){
            console.log(data);
            showAllType(data);
        }
    })
}

function showAllType(data){
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
}

function getMarkdown(){
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+'/markdown/',
        dataType: "json",
        success:function(data){
            console.log(data);
            showMarkdown("array",data);
        }
    })
}

function showMarkdown(type,data){
    if(type == "single"){
        var html = data.html;
        var $articleWrapper = $("#article-wrapper");
        progressJs("#porgress").start();
        progressJs("#porgress").set(50);
        $articleWrapper.css("opacity",0);
        setTimeout(function(){
            $articleWrapper.empty();
            $articleWrapper.html(html);
            $articleWrapper.css("opacity",1);
            progressJs("#porgress").end();
        },500);
    }
    else if(type == "array"){
        var $articleWrapper = $("#article-wrapper");
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
            $articleWrapper.css("opacity",1);
            progressJs("#porgress").end();
        },500);
    }
}

function startUploadFile(){
    var title = $("#myModal input.input-title").val();
    var describe = $("#myModal input.input-describe").val();
    var type = $("#myModal input[name=note-class]:checked").val();
    var time = Date.now();
    var formdata = new FormData();
    formdata.append('file',$("input[name=file]")[0].files[0]);
    formdata.append("title",title);
    formdata.append("describe",describe);
    formdata.append("class",type);
    formdata.append("time",time);
    $.ajax({
        url: location.origin + "/markdown/upload/",
        type: 'POST',
        cache: false,
        data: formdata,
        processData: false,
        contentType: false,
        success:function(data){
            console.log(data);
            if(data.success){
                $("#myModal input.input-title").val("");
                $("#myModal input.input-describe").val("");
                alert("上传成功!");
                setTimeout(function(){$("#myModal").modal('hide');},500);
                showMarkdown("single",data);
            }
            else{
                $(".modal-body").text("请上传.md文件");
            }
        }
    })
}

function initUploadFile(){
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
}

function initSimditor(){
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
}

function getAllNotes(){
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
            showNotes(data);
        }
    });
}

function alterNote(filename){
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
}

function deleteNote(filename){
    var postdata =  new Object();
    postdata.filename = filename;
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+'/deleteNote/',
        dataType: "json",
        data:JSON.stringify(postdata),
        success:function(data){
            alert("删除成功");
            getAllNotes();
        }
    });
}

function deleteMd(time){
    var postdata =  new Object();
    postdata.time = time;
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+'/deleteMd/',
        dataType: "json",
        data:JSON.stringify(postdata),
        success:function(data){
            alert("删除成功");
            getMarkdown();
        }
    });
}
//所有笔记
function showNotes(data){
    var $articleWrapper = $("#article-wrapper");
    progressJs("#porgress").start();
    $articleWrapper.css("opacity",0);
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
}

//提交笔记
function post_note(isAlter,filename,arg){
    var url = '/addnote/';
    var title = $("input.input-title").eq(0);
    var describe = $("input.input-describe").eq(0);
    var content = $(".simditor-body").eq(0);
    var postdata = getNoteData(title,describe,content);
    if(isAlter){
        url = '/alternote/';
        postdata.orifilename = filename;
    }
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        type: "POST",
        url: location.origin+url,
        dataType: "json",
        data:JSON.stringify(postdata),
        success: function(data){
            title.val("");
            describe.val("");
            content.html("");
            $("#addNote").removeClass("active");
            alert("上传成功");
            $("#post_button")[0].onclick = function(){
                post_note();
            };
            getAllNotes();
        }
    });
}

//得到笔记的信息
function getNoteData(title,describe,content){
    var postdata = new Object();
    var type = $("input[name='note-class']:checked").val();
    postdata.time = Date.now();
    postdata.title = title.val().toString();
    postdata.describe = describe.val().toString();
    postdata.content = content.html().toString();
    postdata.class = type;
    return postdata;
}

//转换时间
function time_transfer(t){
    var date = new Date(t);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes())+'';
    return Y+M+D+h+m;
}

//移动端点击事件
function mobile_click(){
    $("p.title").bind("touchstart",function(){
        $(this).addClass("active");
    });
    $("p.title").bind("touchend",function(){
        $(this).removeClass("active");
    });
}