// 프로젝트 코드
// 대쉬보드 호출

// 프로젝트 코드
// 차트 데이터 가져오는 기능
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

router.get("/db_receipt", function (req, res) {
    res.render('dashboard');
    // res.send(finRes);
  });




  
router.get('/getChartData', function(req, res){
    var resu = "아무것도 없습니다.";
    var idNum = "01020834245";
    var docForm = "승인거래";
    var totAmt =0;

    var finRes = {
        name : "",
        resList  : [],
        total : 0
    }
    connection.query('select r.name, r.cno, c.cname, SUM(r.transactionPrice) as s_amount from project.receipt as r join project.category as c on r.cno = c.cno and r.identityNum = ? and r.documentForm=? group by r.cno order by r.cno', [idNum, docForm], function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        var query = 'select sum(transactionPrice) AS decSum from receipt where qno=1 AND documentForm='+"'승인거래'"+ 'AND date LIKE '+"'2019-12%'";   
        connection.query(query,function (error, results2, fields) {
            finRes.name = results[0].name;
            finRes.decSum = results2[0].decSum;

            for (var i = 0; i < results.length; i++) {
                var tmpObj = {
                    category : "",
                    subTot : ""
                }
                tmpObj.category = results[i].cname;
                tmpObj.subTot = results[i].s_amount;
                finRes.resList.push(tmpObj);
    
                finRes.total += results[i].s_amount;
            }
    
            console.log(finRes);
            res.json(finRes);


        });
    });


})

module.exports = router;