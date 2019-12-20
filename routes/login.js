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
  //회원가입
router.post('/', function (req, res) {
  console.log(req.body);
  var name=req.body.name;
  console.log("이름:::"+name);
  var email=req.body.email;
  console.log("이메일:::"+email);
  
  jwt.sign(
    {
        name : name,  
        email : email
    },
    tokenKey,
    {
        expiresIn : '10d',
        issuer : 'project.admin',
        subject : 'user.login.info'
    },
    function(err, token){
      var token2=token;
      var insertQuery='INSERT INTO user '+'(name,email,token) VALUES (?,?,?)';
        connection.query(insertQuery,[name,email,token2],
            function (error, results, fields) {
                connection.query('select uno from user where token=?',[token2],
                function (error, results,fields) {
                    if (error) throw error;              
                    console.log('+++++++++++'+token2);
                    //console.log(this.sql);
                    console.log("버노"+results[0].uno);
                    res.send(results[0].uno.toString()); 
                     //res.sendStatus(1);
                    // res.send(results[0].uno+"");
                    console.log("타입확인!!!!"+typeof(results[0].uno.toString()));
                 });
            });  
      });    
    }
  )

module.exports = router;
//상세정보 입력


