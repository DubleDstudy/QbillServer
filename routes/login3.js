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
    var email=req.body.email;
    console.log(email);
    //var token = req.body.token;
    var loginQuery = 'SELECT count(uno),uno FROM user WHERE email=?';
          connection.query(loginQuery,[email],function (error, results, fields){
              if(results[0].length<1){
                console.log('회원정보가 없습니다.');
              }else{
                console.log(results[0].uno);
                res.send(results[0].uno.toString());
                
                console.log('로그인 성공')
              }
              console.log(results);
          });
     });  
     module.exports = router;