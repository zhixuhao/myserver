var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
//var routes = require('./routes/zhi.js')(app);
var blogEngine = require('./jsondata/data');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

// 运行hbs模块
app.engine('html', hbs.__express);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
   res.render(__dirname+'/public/index',{title:""});
});

app.get('/detail/:id', function(req, res){
  	var data = blogEngine.getBlogEntry(req.params.id);
  	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
  	console.log(req.params);
  	console.log(data);
    res.render('note',data);
  });
app.post('/customer', upload.array(),function(req, res){
  	var data = blogEngine.getBlogEntry(req.body.id);
  	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
  	console.log(req.body);
  	console.log(data);
    res.json(data);
  });
app.listen(3000);