

var popbill = require('popbill');

popbill.config({
    LinkID: 'RPSKA',
    SecretKey: '188Ri5WTdWjOia2XB/9iDgiAxVws6HaAO5tyMioLhkM=',
    // 연동환경 설정값, (true-개발용, false-상업용)
    IsTest: true
});
 
var cashbillService = popbill.CashbillService();

var express = require('express');
app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');



// Router handler
var cashbill = require('./routes/cashbill');
var login=require('./routes/login');
var login2=require('./routes/login2');
var login3=require('./routes/login3');
var qrcode=require('./routes/qrcode');
var dashboard=require('./routes/dashboard');
var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var port = process.env.PORT || 3000;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);		// Direct ./routes/index.js
app.use('/login',login);
app.use('/login2',login2);
app.use('/login3',login3);
app.use('/qrcode',qrcode);
app.use('/dashboard',dashboard);
//app.use(route URI Schema, route handler)
// app.use('/TaxinvoiceService', taxinvoice);
// app.use('/StatementService', statement);
app.use('/CashbillService', cashbill);




// app.use('/MessageService', message);
// app.use('/KakaoService', kakao);
// app.use('/FaxService', fax);
// app.use('/HTTaxinvoiceService', htTaxinvoice);
// app.use('/HTCashbillService', htCashbill);
// app.use('/ClosedownService', closedown);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
var port = process.env.PORT || 3000;
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


app.listen(port);

console.log("Listening on port ", port);
