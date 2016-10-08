var blogEngine = require('../jsondata/data');
//var path = require('path');  
module.exports = function (app) {
//  app.get('/', function (req, res) {
//    res.sendFile(path.join(__dirname, '../public', 'index2.html'));
//  });
  app.post('/customer', function(req, res){
  	var data = blogEngine.getBlogEntry(req.params.id);
  	//res.sendFile(path.join(__dirname, '../public', 'index2.html'));
  	console.log(req.params);
  	console.log(data);
    res.send(data);
  });
  app.get('/admin', function(req, res){
    res.send('admin page');
  });
};