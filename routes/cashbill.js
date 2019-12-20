var express = require('express');
var router = express.Router();
var popbill = require('popbill');
var mysql      = require('mysql');
var moment = require('moment');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '0000',
    database : 'project'
  });
  connection.connect();

popbill.config({
    LinkID: 'RPSKA',
    SecretKey: '188Ri5WTdWjOia2XB/9iDgiAxVws6HaAO5tyMioLhkM=',
    IsTest: true,
    IPRestrictOnOff: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var cashbillService = popbill.CashbillService();

router.get('/', function (req, res, next) {
    res.render('Cashbill/index', {});
});

//현금영수증 문서번호 중복확인.
router.get('/checkMgtKeyInUse', function (req, res, next) {

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '0000000001';

    // 문서번호
    var mgtKey = '20190109-001';

    cashbillService.checkMgtKeyInUse(testCorpNum, mgtKey,
        function (result) {
            if (result) {
                res.render('result', {path: req.path, result: '사용중'});
            } else {
                res.render('result', {path: req.path, result: '미사용중'});
            }
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
});
//---------------------------------------------------------------------------------------------
//현금영수증 등록
router.get('/registIssue', function (req, res, next) {
    var date = moment().format("YYYYMMDD");
    var registDate = moment().format("YYYY-MM-DD");
    var insertQuery='INSERT INTO receipt ' +
    '(qno, identityNum, kinds, name, supplyPrice, transactionPrice, documentNum, documentForm,taxationForm, cno, date, businessNo,tno) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var insertTranQuery='INSERT INTO transaction ' +
    '(cno, amount, tdate, qno) VALUES (?,?,?,?)';
    var qno = req.body.qno;
    console.log(qno);
    var insertTranParams=[2,8000,registDate,1];

    connection.query(insertTranQuery,insertTranParams,
    function (error, results, fields) {
        connection.query('select q.qno, t.tno, t.cno, q.kinds, q.identityNum, t.amount, u.email, u.name, u.phone, t.cno from qrcode q, user u, transaction t where u.uno=1 AND u.uno=q.uno AND q.qno=t.qno ORDER BY t.tno DESC limit 1', 
        function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            // 사업자번호, '-' 제외 10자리
            var testCorpNum = '0000000001';
            // 아이디
            var testUserID = results[0].email;
            testUserID=testUserID.split('@')[0];
            // 문서번호
            var mgtNum=(100+results[0].tno);
            mgtNum = mgtNum.toString();
            var mgtNum2=date+'-'+mgtNum;
            var MgtKey = mgtNum2;
            // 현금영수증 상태메모
            var stateMemo = '[큐빌]'+results[0].name+'님 모바일 현금영수증이 '+results[0].amount*1.1+'원 발행되었습니다.';
            // 안내메일 제목
            var emailSubject = '모바일 현금영수증 발행 안내';
            // 현금영수증 항목
            var cashbill = {
                // [필수] 문서번호
                mgtKey: MgtKey,
                // [필수] 문서형태, (승인거래, 취소거래) 중 기재
                tradeType: '승인거래',
                // [취소 현금영수증 발행시 필수] 원본 현금영수증 국세청 승인번호
                orgConfirmNum: '',
                // [취소 현금영수증 발행시 필수] 원본 현금영수증 거래일자
                orgTradeDate: '',
                // [필수] 과세형태 (과세, 비과세) 중 기재
                taxationType: '과세',
                // [필수] 거래구분 (소득공제용, 지출증빙용) 중 기재
                tradeUsage: results[0].kinds,
                // 거래유형 (일반, 도서공연, 대중교통) 중 기재
                tradeOpt: '일반',
                // [필수] 거래처 식별번호, 거래유형에 따라 작성
                identityNum: results[0].identityNum,
                // [필수] 가맹점 사업자번호
                franchiseCorpNum: testCorpNum,
                // 가맹점 상호
                franchiseCorpName: '큐빌',
                // 가맹점 대표자성명
                franchiseCEOName: '홍세원',
                // 가맹점 주소
                franchiseAddr: '서울특별시 송파구 중대로 135',
                // 가맹점 연락처
                franchiseTEL: '024157236',
                // [필수] 공급가액
                supplyCost: results[0].amount,
                // [필수] 세액
                tax: results[0].amount*0.1,
                // [필수] 봉사료
                serviceFee: '0',
                // [필수] 거래금액 (공급가액 + 세액 + 봉사료)
                totalAmount: results[0].amount*1.1,
                // 고객명
                customerName: results[0].name,
                // 상품명
                itemName: '상품', 
                // 주문번호
                orderNumber: '172',        
                // 고객 메일주소
                email: results[0].email,     
                // 고객 핸드폰번호
                hp: results[0].phone,
                // 고객 팩스번호
                fax: '000111222',
                // 발행시 알림문자 전송여부
                smssendYN: true,
            };
            console.log(testUserID);
            cashbillService.registIssue(testCorpNum, cashbill, stateMemo, testUserID, emailSubject,
                
                function (result) {
                    res.render('response', {path: req.path, code: result.code, message: result.message});
                    var insertParams =[results[0].qno,cashbill.identityNum,cashbill.tradeUsage,results[0].name,cashbill.supplyCost,transactionPrice,cashbill.mgtKey,cashbill.tradeType,cashbill.taxationType,results[0].cno, registDate, testCorpNum, results[0].tno];
                    console.log(insertParams);
                    connection.query(insertQuery,insertParams,function (error, results, fields) {
                        if (error) throw error;
                        console.log(results);       
                    });    
                },function (Error) {
                    res.render('response', {path: req.path, code: Error.code, message: Error.message});
                });
                var transactionPrice = cashbill.supplyCost+cashbill.tax;
            });  
        });
    });
// --------------------------------------------------------------------------------------------
//발급한 영수증 취소 기능
//영수증 토대로 supplyCost, 발급받은 번호(휴대폰), 날짜 토대로 해당 내역 조회
router.get('/cancelIssue', function (req, res, next) {
    connection.query('SELECT documentNum,businessNo,rno FROM receipt WHERE date=curdate() AND identityNum='+"'01020834245'"+' AND supplyPrice=18000', 
    function (error, results, fields) {
    // 사업자번호
    var testCorpNum = results[0].businessNo;
    // 문서번호
    var mgtKey = results[0].documentNum;
    // 메모
    var memo = '발행이 취소되었습니다.';

    cashbillService.cancelIssue(testCorpNum, mgtKey, memo,
        function (result) {
            res.render('response', {path: req.path, code: result.code, message: result.message});
            //UPDATE 
            var updateQuery = ' UPDATE receipt SET documentForm='+"'취소거래'"+'where rno=?';
            console.log('*************영수증번호::::'+results[0].rno);
            connection.query(updateQuery,[results[0].rno],function (error, results, fields){
                if (error) throw error;
                console.log(results);
            });
        }, function (Error) {
            res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
    });
});

// --------------------------------------------------------------------------------------------------------
// 발급받은 영수증 리스트 확인 기능
router.get('/getInfos', function (req, res, next) {
    connection.query('SELECT rno,businessNo,documentNum FROM qrcode, user, receipt WHERE user.uno=1 AND user.uno=qrcode.qno AND qrcode.qno=receipt.qno', 
    function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        var testCorpNum = results[0].businessNo

        var mgtKeyList=[];
        for (var i = 0; i < results.length; i++) {
               console.log("value : " + results[i].documentNum);
               mgtKeyList.push(results[i].documentNum);
            
          }
        cashbillService.getInfos(testCorpNum, mgtKeyList,
            function (result) {
                res.render('Cashbill/CashbillInfos', {path: req.path, result: result})
            }, function (Error) {
                res.render('response', {path: req.path, code: Error.code, message: Error.message});
        });
    });
});


module.exports = router;
