var express = require('express');
var router = express.Router();
var popbill = require('popbill');
var mysql   = require('mysql');
var moment = require('moment');
var tokenKey = "fintech!@#$%";
var jwt = require('jsonwebtoken');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '0000',
    database : 'project'
});
  connection.connect();

router.post('/', function (req, res) {
    console.log(req.body);
    var uno=req.body.uno;
    uno = parseInt(uno);
    var gender=req.body.gender;
    var phone = req.body.phone;
    var age = parseInt(req.body.age);
    var date = moment().format("YYYY");
    age = (date-age)+1;
    console.log(typeof(age));
    var identityNum=req.body.identityNum;
    var kinds=req.body.kinds;
    console.log("identity:"+identityNum);
    console.log(typeof(kinds));
    var updateQuery = 'UPDATE user SET gender=?,phone=?,age=? where uno=?';
          connection.query(updateQuery,[gender,phone,age,uno],function (error, results, fields){
              var insertTranQuery='INSERT INTO qrcode (identityNum, kinds, uno) VALUES (?,?,?)';
              connection.query(insertTranQuery,[identityNum,kinds,uno],function (error, results, fields){
                if (error) throw error;
                res.send("success");
              });
              console.log(results);
          });
     });  
  

    module.exports = router;