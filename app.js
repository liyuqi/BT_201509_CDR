/**
 * Module dependencies.
 */

var fs = require('fs');
var logFile = fs.createWriteStream('./nodeLogFile.log', {flags: 'a'});

var express = require('express');
var routes = require('./routes');

//var mongodbAlert = require('./routes/mongodbAlert');
//var mongoStatus = require('./routes/sys_mongoShell');
//var sys_mongo = require('./routes/sys_mongo');
//var sys_alert = require('./routes/sys_alert');
var cdr_mongo = require('./routes/cdr_mongo');
var cdr_2g_mongo = require('./routes/cdr_2g_mongo');
//var cdr_gprs_mongo = require('./routes/cdr_gprs_mongo');

var util = require('util');
var http = require('http');
var path = require('path');

var settings = require('./settings');

//純粹當 session store，因為 monk 不知如何設定成express session
var MongoStore = require('connect-mongo')(express);

var monk = require('monk');
//var dbevents = monk('192.168.0.190/events');
//var dbalerts = monk('192.168.0.190/alerts');
//var dbfluentd = monk('127.0.0.1/fluentd');
//var dbfluentd = monk('192.168.0.196/fluentd');
//var dbCDR = monk('172.17.24.196:27017/cdr');
//var dbCDR = monk('192.168.0.196:40000/cdr');
var dbCDR = monk('127.0.0.1:27017/cdr');


var partials = require('express-partials');
var flash = require('connect-flash');

var sessionStore = new MongoStore({
	host: settings.host, //define this, otherwise it throws "Error: failed to connect to [1276.0.0.1:27017]"
	port: settings.port,
	db: settings.db
}, function () {
	console.log('connect mongodb success...');
});

var app = express();
//app.locals.inspect = require('util').inspect;
app.locals.util = require('util');
// all environments
app.set('port', process.env.PORT || 8009);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(partials());
app.use(flash());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
//app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookie_secret,
	cookie: {
		maxAge: 60000 * 20	//20 minutes
	},
	store: sessionStore
}));

app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');
app.use(express.logger({stream: logFile}));  //========logging========
app.use(app.router);


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

//================================================= C D R 2g ============================
//app.get('/cdr_CRUD_insert', cdr_2g_mongo.index);
//app.post('/cdr_CRUD_insert',cdr_mongo.cdr_CRUD_insert(dbCDR));
app.get('/cdr_CRUD_2g_query', 		cdr_2g_mongo.cdr_CRUD_loglist(dbCDR));
app.post('/cdr_CRUD_2g_query', 	cdr_2g_mongo.cdr_CRUD_query(dbCDR));
app.get('/cdr_CRUD_2g_show', 		cdr_2g_mongo.cdr_CRUD_count(dbCDR));

//app.get('/cdr_2g_site_query', 	cdr_2g_mongo.cdr_2g_site_report(dbCDR));
//app.post('/cdr_2g_site_query', 	cdr_2g_mongo.cdr_2g_site_query(dbCDR));
//app.use('/cdr_3g_phone_report', cdr_mongo.cdr_3g_phone_report(dbCDR));


//================================================= C D R 3g ============================
app.get('/cdr_CRUD_insert', cdr_mongo.index);
//app.post('/cdr_CRUD_insert',cdr_mongo.cdr_CRUD_insert(dbCDR));
app.get('/cdr_CRUD_query', 		cdr_mongo.cdr_CRUD_loglist(dbCDR));
app.post('/cdr_CRUD_query', 	cdr_mongo.cdr_CRUD_query(dbCDR));
app.get('/cdr_CRUD_show', 		cdr_mongo.cdr_CRUD_count(dbCDR));

app.get('/cdr_3g_site_query', 	cdr_mongo.cdr_3g_site_report(dbCDR));
app.post('/cdr_3g_site_query', 	cdr_mongo.cdr_3g_site_query(dbCDR));
//app.use('/cdr_3g_phone_report', cdr_mongo.cdr_3g_phone_report(dbCDR));


//app.get('/mongoStatus',mongoStatus.page);
//app.post('/mongoStatus',mongoStatus.child());

//app.get('/mongodbSetting', mongodbAlert.page);
//app.post('/mongodbSetting', mongodbAlert.alertSetting(dbalerts));
//app.get('/mongodbAlert', mongodbAlert.alertPush(dbevents,dbalerts));
//app.get('/mongodbAlertPage', mongodbAlert.alertPushAll(dbevents,dbalerts));
//
//app.get('/mongoStatus',mongoStatus.page);
//app.post('/mongoStatus',mongoStatus.child());

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
