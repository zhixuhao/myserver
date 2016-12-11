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