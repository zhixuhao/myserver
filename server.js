var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
//var routes = require('./routes/zhi.js')(app);
var blogEngine = require('./jsondata/data');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var markdown = require('markdown-js');
var multer=require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
	//设置上传后文件路径，uploads文件夹会自动创建。
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
	},
	//给上传文件重命名，获取添加后缀名
	filename: function (req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});
//添加配置文件到muler对象。
var upload = multer({
	storage: storage
});

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

// 运行hbs模块
app.engine('html', hbs.__express);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
	console.log("index");
    res.render(__dirname+'/public/index',{title:"最近文章"});
});

app.get('/detail/:id', function(req, res){
  	var data = blogEngine.getBlogEntry(req.params.id);
  	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
  	console.log(req.params);
  	console.log(data);
    res.render('note',data);
  });
app.post('/noteimg/upload', upload.single('file'),function(req, res){
	console.log(req.file);
	var file_path ="uploads/"+req.file.filename;
	var data = {
		success:true,
		file_path:file_path
	};
	console.log(data);
	res.send(data);
  });
app.get('/markdown', function(req, res) {
	var html = markdown.makeHtml("[Java Eye](http://www.iteye.com/ \"Click\") ");
	res.send(html);
	res.end();
});
app.post('/addnote',function(req,res){
	var postdata = req.body;
	console.log(postdata);
	var configTxt = JSON.stringify(postdata);
	var title = postdata.title+postdata.time;
	var options = {encoding:'utf8', flag:'w'};
	fs.writeFile('jsondata/'+title+'.txt', configTxt, options, function(err){
		if (err){
			console.log("Config Write Failed.");
		} else {
			console.log("Config Saved.");
		}
	});
	var data = {success:true};
	res.send(data);
	res.end();
});
app.get('/writefile',function(req,res){
	//写入文件
	var config = {
		maxFiles: 20,
		maxConnections: 15,
		rootPath: "/webroot"
	};
	var configTxt = JSON.stringify(config);
	var options = {encoding:'utf8', flag:'w'};
	fs.writeFile('jsondata/config.txt', configTxt, options, function(err){
		if (err){
			console.log("Config Write Failed.");
		} else {
			console.log("Config Saved.");
		}
	});

});
app.listen(3000);