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

var mdstorage = multer.diskStorage({
	//设置上传后文件路径，uploads文件夹会自动创建。
	destination: function (req, file, cb) {
		cb(null, './public/markdown')
	},
	//给上传文件重命名，获取添加后缀名
	filename: function (req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});

//添加配置文件到muler对象。
var upload = multer({
	storage: storage
});

var mdupload = multer({
	storage: mdstorage
});

var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Connection URL
var dburl = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server

// 指定模板文件的后缀名为html
app.set('view engine', 'html');
// 运行hbs模块,模板引擎,用于渲染
app.engine('html', hbs.__express);

app.use(bodyParser.json()); // for parsing application/json 用body-parsing中间件来使用req.body
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
	console.log("index");
    res.render(__dirname+'/public/index',{title:'<p class="title" onclick="location.href=location.origin">学习笔记</p>',type:"alltype"});
});

app.get('/notes', function(req, res) {
	console.log("notes");
	res.render(__dirname+'/public/index',{title:'<p class="title" onclick="location.href=location.origin">学习笔记</p>',type:"notes"});
});

app.get('/markdown', function(req, res) {
	console.log("markdown");
	res.render(__dirname+'/public/index',{title:'<p class="title" onclick="location.href=location.origin">学习笔记</p>',type:'markdown'});
});

app.post('/alltype',function(req,res){
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		var mds = db.collection('mds');
		var notes_count;
		var md_count;
		notes.count(function(err,count){
			notes_count = count;
			mds.count(function(err,count1){
				md_count = count1;
				db.close();
				console.log("notes num:"+notes_count+"md num:"+md_count);
				var data = {notes:notes_count,mds:md_count};
				res.send(data);
				res.end();
			});
		});
	});
});

app.post('/allnotes',function(req,res){
	console.log('all notes');
	/*var items = fs.readdirSync('jsondata');
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
	}*/
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		notes.find().sort({"time":1}).toArray(function(err,docs){
			console.log(docs);
			db.close();
			res.send(docs);
			res.end();
		});
	});
});

app.post('/markdown',function(req,res){
	console.log('all mds');
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var mds = db.collection('mds');
		mds.find().sort({"time":1}).toArray(function(err,docs){
			console.log(docs);
			db.close();
			res.send(docs);
			res.end();
		});
	});
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

app.post('/markdown/upload', mdupload.single('file'),function(req, res){
	console.log(req.file);
	var postdata = req.body;
	postdata.time = parseInt(postdata.time);
	var file_path ="markdown/"+req.file.filename;
	var fileFormat = (req.file.filename).split(".");
	fileFormat = fileFormat[fileFormat.length - 1];
	var resdata = {
		success:false,
		file_path:file_path
	};
	if(fileFormat == "md"){
		fs.readFile('public/markdown/'+req.file.filename,'utf-8',function(err,data){
			console.log(data);
			var html = markdown.makeHtml(data);
			postdata.html = html;
			MongoClient.connect(dburl, function(err, db) {
				assert.equal(null, err);
				var mds = db.collection('mds');
				mds.insertOne(postdata,function(err,data){
					resdata.success = true;
					resdata.type = "md";
					resdata.html = html;
					res.send(resdata);
					res.end();
				});
			});
		 });
	}
	else{
		console.log(resdata);
		res.send(resdata);
	}
});

app.post('/addnote',function(req,res){
	var postdata = req.body;
	console.log(postdata);
	/*var configTxt = JSON.stringify(postdata);
	var title = postdata.time+"_"+postdata.class;
	var options = {encoding:'utf8', flag:'w'};
	fs.writeFile('jsondata/'+title+'.json', configTxt, options, function(err){
		if (err){
			console.log("Config Write Failed.");
		} else {
			console.log("Config Saved.");
		}
	});*/
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		notes.insertOne(postdata);
		db.close();
	});
	var data = {success:true};
	res.send(data);
	res.end();
});

app.get('/notes/:id', function(req, res){
	var data = blogEngine.getBlogEntry(req.params.id);
	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
	console.log(req.params);
	console.log(data);
	res.render('note',data);
});

app.post('/noteDetail',function(req,res){
	var time = req.body.filename;
	time = parseInt(time);
	/*fs.readFile('jsondata/'+filename,'utf-8',function(err,data){
		console.log(data);
		var jsondata = JSON.parse(data);
		console.log(jsondata);
		res.send(jsondata);
		res.end();
	});*/
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		notes.find({"time":time}).toArray(function(err,docs){
			console.log(docs);
			db.close();
			res.send(docs);
			res.end();
		});
	});
});

app.get('/markdown/:id', function(req, res){
	var data = blogEngine.getBlogEntry(req.params.id);
	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
	console.log(req.params);
	console.log(data);
	res.render('note',data);
});

app.post('/mdDetail',function(req,res){
	var time = req.body.time;
	time = parseInt(time);
	/*fs.readFile('jsondata/'+filename,'utf-8',function(err,data){
	 console.log(data);
	 var jsondata = JSON.parse(data);
	 console.log(jsondata);
	 res.send(jsondata);
	 res.end();
	 });*/
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var mds = db.collection('mds');
		mds.find({"time":time}).toArray(function(err,docs){
			console.log(docs);
			db.close();
			res.send(docs);
			res.end();
		});
	});
});

app.post('/alternote',function(req,res){
	var postdata = req.body;
	/*var delfilename = postdata.orifilename + ".json";
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
	res.end();*/
	var time = parseInt(postdata.orifilename);
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		notes.updateOne({"time":time},{$set:{"title":postdata.title,"content":postdata.content,"describe":postdata.describe,"class":postdata.class}},function(err,result){
			db.close();
			var data = {success:true};
			res.send(data);
			res.end();
		});
	});
});

app.post('/deleteNote',function(req,res){
	var postdata = req.body;
	var time = postdata.filename;
	time = parseInt(time);
	//fs.unlink('jsondata/'+delfilename);
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var notes = db.collection('notes');
		notes.deleteOne({"time":time},function(err,result){
			db.close();
			var data = {success:true};
			res.send(data);
			res.end();
		});
	});
});

app.post('/deleteMd',function(req,res){
	var postdata = req.body;
	var time = postdata.time;
	time = parseInt(time);
	//fs.unlink('jsondata/'+delfilename);
	MongoClient.connect(dburl, function(err, db) {
		assert.equal(null, err);
		var mds = db.collection('mds');
		mds.deleteOne({"time":time},function(err,result){
			db.close();
			var data = {success:true};
			res.send(data);
			res.end();
		});
	});
});
app.listen(3000);