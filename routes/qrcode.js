var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var popbill = require('popbill');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '0000',
    database : 'project'
  });
  connection.connect();


  // QR코드 생성하기
  router.post('/', function (req, res) {
    var uno=parseInt(req.body.uno);
    
    var selectQuery = "SELECT qno,identityNum,uno FROM qrcode WHERE uno=?";
    connection.query(selectQuery,[uno],
        function (error, results, fields) {
          dd = JSON.stringify(results[0]);
          res.send(dd);
        });
     });  

     
module.exports = router;