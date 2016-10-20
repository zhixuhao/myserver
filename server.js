var express = require('express');
var app = express();
//app.use(express.static(__dirname + '/public'));
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

// 运行hbs模块,模板引擎,用于渲染
app.engine('html', hbs.__express);

app.use(bodyParser.json()); // for parsing application/json 用body-parsing中间件来使用req.body
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
	console.log("index");
    res.render(__dirname+'/public/index',{title:"allnotes"});
});


app.post('/allnotes',function(req,res){
	console.log('all notes');
	var allFile = new Array();
	var items = fs.readdirSync('jsondata');
	console.log(items);
	for(var i = 0; i < items.length;i++){
		var filename = items[i];
		if(filename.length > 4){
			var postfix = filename.substring(filename.length-4,filename.length);
			if(postfix == "json"){
				console.log(filename);
				var data = fs.readFileSync('jsondata/'+filename,'utf-8');
				console.log(data);
				allFile.push(JSON.parse(data));
			}
		}
	}
	res.send(allFile);
	res.end();
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
	var title = postdata.time+"_"+postdata.class;
	var options = {encoding:'utf8', flag:'w'};
	fs.writeFile('jsondata/'+title+'.json', configTxt, options, function(err){
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


app.post('/noteDetail',function(req,res){
	var filename = req.body.filename + ".json";
	fs.readFile('jsondata/'+filename,'utf-8',function(err,data){
		console.log(data);
		var jsondata = JSON.parse(data);
		console.log(jsondata);
		res.send(jsondata);
		res.end();
	});
});


app.post('/alternote',function(req,res){
	var postdata = req.body;
	var delfilename = postdata.orifilename + ".json";
	fs.unlink('jsondata/'+delfilename);
	console.log(postdata);
	var configTxt = JSON.stringify(postdata);
	var title = postdata.time+"_"+postdata.class;
	var options = {encoding:'utf8', flag:'w'};
	fs.writeFile('jsondata/'+title+'.json', configTxt, options, function(err){
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


app.post('/deleteNote',function(req,res){
	var postdata = req.body;
	var delfilename = postdata.filename + ".json";
	fs.unlink('jsondata/'+delfilename);
	var data = {success:true};
	res.send(data);
	res.end();
});
app.listen(3000);