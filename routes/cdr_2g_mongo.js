/**
 * Created by Yuqi on 2015/2/16.
 */
/*** Created by Yuqi on 2015/1/21.
 *
 */
// var mongodb = require('../models/db.js');
var util = require('util');
_pageunit = 50;
_statInterval = 5*60*1000;

exports.index = function(req, res){
    res.render('cdr_CRUD_2g_show', { title: 'show cdr', resp : false});
};

/*exports.cdr_CRUD_insert = function(mongodb){
    return function(req, res) {
        //fields
        var call = {};

        //insert
        var collection = mongodb.get('cep3g');
        collection.insert(call,{safe: true}, function(err, docs){
            console.log("insert log : " + util.inspect(docs));
            res.render('cdr_CRUD_insert', {title: 'Create log', resp: docs});
        });
    };
};*/

exports.cdr_CRUD_loglist = function(mongodb){
    return function(req, res) {
        var collection = mongodb.get('cep2g_sample');
        collection.col.count({},function(err, count) {
            if(err) res.redirect('cdr_CRUD_2g_query');
            //console.log(format("count = %s", count));
            res.render('cdr_CRUD_2g_query', {title: 'cdr', totalcount : count,resp :null});
        });
    };
};

exports.cdr_CRUD_query = function(mongodb){
    return function(req, res) {

        //field input
        var query = {};

        for (var key in req.body){
            if(req.body[key].length==0);
            else
                query[key] = req.body[key].trim();
        }


        //if(req.body.CALLTRANSACTIONTYPE/*radio_network_type*/){ //1:MOC,2:MTC
        //    query.CALLTRANSACTIONTYPE = req.body.CALLTRANSACTIONTYPE.trim();
        //}

        /*  時間 抓狂???  */
        if(req.body.STARTOFCHARGINGDATE/*date_time*/){
            query.STARTOFCHARGINGDATE = {$regex: new RegExp('^'+req.body.STARTOFCHARGINGDATE.trim())};
        }
        if(req.body.TIMESTAMP/*charging_start_time*/){
            query.TIMESTAMP = {$regex: new RegExp('^'+req.body.TIMESTAMP)};
        }
        //if(req.body.TIMESTAMP){
        //    query.time = {$gte: req.body.TIMESTAMP, $lt: new Date()};
        //}else{
        //    query.time = {$gte: req.body.TIMESTAMP, $lt: new Date()};
        //}
        //if(req.body.SERVEDIMSI/*calling_imsi*/){ //Sim/Usim/ISim
        //    query.SERVEDIMSI = req.body.SERVEDIMSI.trim();
        //}
        //if(req.body.SERVEDMSISDN/*calling_number*/){
        //    query.SERVEDMSISDN = req.body.SERVEDMSISDN.trim();
        //}
        //if(req.body.SERVEDIMEI/*calling_imei*/){
        //    query.SERVEDIMEI = req.body.SERVEDIMEI.trim();
        //}
        //if(req.body.OTHERMSRN/*calling_imei*/){
        //    query.OTHERMSRN = req.body.OTHERMSRN.trim();
        //}
        //
        //if(req.body.EXCHANGEID/*exchange_id*/){
        //    query.EXCHANGEID = req.body.EXCHANGEID.trim();
        //}
        //if(req.body.CAUSEFORTERMINATION/*cause_for_termination*/){
        //    query.CAUSEFORTERMINATION = req.body.CAUSEFORTERMINATION.trim();
        //}
        //if(req.body.MCRDESTINATIONNUMBER/*called_number*/){
        //    query.MCRDESTINATIONNUMBER = req.body.MCRDESTINATIONNUMBER.trim();
        //}
        //if(req.body.CALLDURATION/*orig_mcz_duration*/){
        //    query.CALLDURATION = req.body.CALLDURATION.trim();
        //}
        ////site
        //if (req.body.LASTCELLID_MCCMNC/*calling_subs_last_mnc*/) {
        //    query.LASTCELLID_MCCMNC = req.body.LASTCELLID_MCCMNC.trim();
        //}
        //if(req.body.LASTCELLID_LAC/*calling_subs_last_lac*/){
        //    query.LASTCELLID_LAC = req.body.LASTCELLID_LAC.trim();
        //}
        //if(req.body.LASTCELLID/*calling_subs_last_ci*/){
        //    query.LASTCELLID = req.body.LASTCELLID.trim();
        //}
        //
        //if(req.body.LASTCELLID/*calling_subs_last_ci*/){
        //    query.LASTCELLID = req.body.LASTCELLID.trim();
        //}
/*
 > db.cep2g.findOne()
 {
 "_id" : ObjectId("550be8254a9f862242000001"),
 "RECORDTYPE" : "4",
 "CALLTRANSACTIONTYPE" : "2",
 "SERVEDIMSI" : "466974100114424",
 "SERVEDMSISDN" : "886982927888",
 "SERVEDIMEI" : "3548530608122303",
 "STARTOFCHARGINGDATE" : "2015-01-05",
 "STARTOFCHARGINGTIME" : 1420387200,
 "TIMESTAMP" : "10:10:04",
 "CALLDURATION" : 169,
 "OTHERMSRN" : null,
 "EXCHANGEID" : "JHOMSC3",
 "CAUSEFORTERMINATION" : "0",
 "MCRDESTINATIONNUMBER" : null,
 "LASTCELLID_MCCMNC" : "466 97",
 "LASTCELLID_LAC" : "13201",
 "LASTCELLID" : "12612",
 "path" : "/home/btserver4/tos/cep/2g/JHOMSC3_15010511_2997.csv",
 "time" : ISODate("2015-03-20T09:28:03Z")
 }
*/
        //if(req.body.logid){
        //    query._id = req.body.logid;
        //}
        console.log(query);

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0)
            res.redirect('/cdr_CRUD_2g_query');
        //query
        var collection = mongodb.get('cep2g_sample');
        collection.count({},function(err,db_count){
            collection.count(query, function (err, query_count) {
                collection.find(query, {limit: _max_pageunit}, function (err, docs) {
                    if (query_count) console.log('docs.length: ' + query_count);
                    if (err) res.redirect('/sys_CRUD_2g_query');
                    res.render('cdr_CRUD_2g_result', {
                            title: 'query cdr',
                            db_count:db_count,
                            totalcount:query_count,
                            //page_count:docs.length,
                            resp: docs
                        }
                    );
                });
            });
        });
    };
};

exports.cdr_CRUD_count = function (mongodb) {
    return function (req, res) {
        //var page = req.query.p ? parseInt(req.query.p) : 1;
        console.log('cdr_count');
        var collection = mongodb.get('cep2g_sample');
        collection.count({},function(err,count){
            collection.find({}, {limit : _pageunit ,sort : { _id : -1 }} , function (err, docs) {
                //console.log('cdr: ',docs.length/*,JSON.stringify(docs[0])*/);
                if (err) res.redirect('cdr_CRUD_2g_show');
                res.render('cdr_CRUD_2g_show', {
                    title: 'cdr',
                    totalcount: count,
                    resp: docs
                });
            });
        });
    };
};

exports.cdr_CRUD_show = function (mongodb) {
    return function (req, res) {
        console.log('cdr_show');
        var collection = mongodb.get('cep2g_sample');
        collection.count({}, function (err, count) {
            collection.find({}, {limit: _pageunit, sort: {_id: -1}}, function (e, docs) {
                // console.log("docs data : "+util.inspect(docs));
                var docdetail;
                if (docs.length == 1) docdetail = util.inspect(docs);
                //console.log(docs[0].toJSON());
                res.render('cdr_CRUD_2g_show', {
                    title: 'cdr',
                    totalcount: count,
                    resp: docs,
                    logdetail: docdetail
                });
            });
        });
    };
};

exports.cdr_CRUD_show_pagging = function (mongodb) {
    return function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;

        var collection = mongodb.get('cep2g_sample');
        collection.count({}, function (err, count) {
            collection.find({}, //{/*limit: 20,*/ sort: {_id: -1}}, function (e, docs) {
                {skip : (page - 1) * _pageunit,limit : _pageunit,sort : { _id : -1 }}, function (e, docs) {
                    // console.log("docs data : "+util.inspect(docs));
                    var docdetail;
                    if (docs.length == 1) docdetail = util.inspect(docs);
                    res.render('cdr_CRUD_2g_show', {
                        title: 'cdr',
                        totalcount: count,
                        resp: docs,
                        logdetail: docdetail,
                        page: page,
                        pageTotal: Math.ceil(docs.length / _pageunit),
                        isFirstPage: (page - 1) == 0,
                        isLastPage: ((page - 1) * _pageunit + docs.length) == docs.length
                    });
                });
        });
    };
};

exports.cdr_2g_site_report = function(mongodb){
    return function(req, res) {
        var collection = mongodb.get('cep2g_agg_site');
        collection.col.count({},function(err, count) {
            if(err) res.redirect('cdr_2g_site_query');
            //console.log(format("count = %s", count));
            res.render('cdr_2g_site_query', {title: 'cdr', totalcount : count,resp :null});
        });
    };
};


exports.cdr_2g_site_query = function(mongodb){
    return function(req, res) {

        //field input
        var query={};

        for (var key in req.body){
            if(req.body[key].length==0);
            else
            query[key] = req.body[key].trim();   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
        }

        //if(req.body.DATE){
        //    query.DATE = req.body.DATE.trim();
        //}
        //if(req.body.HOUR){
        //    query.HOUR = req.body.HOUR.trim();
        //}
        //if(req.body.COUNTRY){
        //    query.COUNTRY = req.body.COUNTRY.trim();
        //}
        //if(req.body.DISTRICT){
        //    query.DISTRICT = req.body.DISTRICT.trim();
        //}
        //if(req.body.SITE_NAME){
        //    query.SITE_NAME = req.body.SITE_NAME.trim();
        //}
        //if(req.body.SITE_ID){
        //    query.SITE_ID = req.body.SITE_ID.trim();
        //}
        //if(req.body.END_CODE){
        //    query.END_CODE = req.body.END_CODE.trim();
        //}
        //if(req.body.SIM_TYPE){
        //    query.SIM_TYPE = req.body.SIM_TYPE.trim();
        //}
        //if(req.body.CARRIER){
        //    query.CARRIER = req.body.CARRIER.trim();
        //}

        console.log(util.inspect(query));

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0)
            res.redirect('cdr_2g_site_query');

        //query
        var collection = mongodb.get('cep2g_agg_site');
        collection.count({},function(err,db_count){
            collection.count(query, function (err, query_count) {
                collection.find(query, {limit: _max_pageunit, sort : {  DATE:1, HOUR:1, _id:1 }}, function (err, docs) {
                    if (docs.length) console.log('docs.length: ' + docs.length);

                    res.render('cdr_2g_site_query', {
                            title: 'query cep2g',
                            db_count: db_count,
                            totalcount: query_count,
                            //page_count:docs.length,
                            resp: docs
                        }
                    );
                    //if (err) res.redirect('cdr_CRUD_query');
                });
            });
        });
    };
};

//exports.cdr_2g_site_report = function(mongodb){
//    return function(req, res) {
//
//        var collection = mongodb.get('cep2g_join');
//        var i =0;
//        console.log("flow : ");
//        collection.col.aggregate([
//            {$match: {
//                /*time: interval,up_falg:1,*/
//                CALLTRANSACTIONTYPE:{$in:['1','2']}
//            }}
//            ,{$project:{
//                //time:1,
//                //STATISTIC_DATE : "$time"
//                DATE: "$STARTOFCHARGINGDATE"
//                , HOUR: {$substr:["$TIMESTAMP",0,2]}
//
//                //site
//                , COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市
//                , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
//                , SITE_NAME : "$SITE_NAME"
//                , SITE_ID : "$SITE_ID"
//
//                ////phone_type
//                //, VENDOR : "$VENDOR"
//                //, MODEL : "$MODEL"
//
//                , END_CODE : "$CAUSEFORTERMINATION"
//                , SIM_TYPE : "$SIM_TYPE"
//                , CARRIER : "$CARRIER"
//                //, HO_CALLED_1 : 1
//                , CALLDURATION : "$CALLDURATION"
//            }}
//            ,{$group:{
//                _id: {
//                    STATISTIC_DATE: {
//                        DATE : "$DATE"
//                        , HOUR : "$HOUR"
//                    }
//                    //site
//                    , COUNTY: "$COUNTY" //縣市
//                    , DISTRICT: "$DISTRICT" //地區
//                    , SITE_NAME: "$SITE_NAME"
//                    , SITE_ID: "$SITE_ID"
//
//                    ////phone_type
//                    //, VENDOR: "$VENDOR"
//                    //, MODEL: "$MODEL"
//
//                    , END_CODE: "$END_CODE"
//                    , SIM_TYPE: "$SIM_TYPE"
//                    , CARRIER: "$CARRIER"
//                    //, IMEI: "$IMEI"
//                }
//
//                ,HO_CALLED_COUNT:{$sum:1}
//                ,HO_CALLED_SECOND:{$sum:"$CALLDURATION"}
//            }}
//            ,{$project:{
//                _id:1
//                //,STATISTIC_DATE:"$_id.STATISTIC_DATE"
//
//                ////site
//                //,COUNTY : "$_id.COUNTY"
//                //,SITE_NAME : "$_id.SITE_NAME"
//
//                ////phone_type
//                //,VENDOR : "$_id.VENDOR"
//                //,MODEL : "$_id.MODEL"
//
//                //,SIM_TYPE : "$_id.SIM_TYPE"
//                //,CARRIER : "$_id.CARRIER"
//                ,HO_CALLED_COUNT :1
//                ,HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}
//            }}
//            //,{    $out:"cdr2g_agg"}
//        ], function(err, result) {
//            i++
//            if(err) res.redirect('cdr_CRUD_2g_show');//console.log("err : "+err.message);
//            if(i==5) console.log("result : "+util.inspect(result));
//            res.render('cdr_2g_site_report', {title: 'flow', resp: result });
//        });
//    };
//};
//
//exports.cdr_2g_phone_report = function(mongodb){
//    return function(req, res) {
//
//        var collection = mongodb.get('cep2g_join');
//        var i =0;
//        console.log("flow : ");
//        collection.col.aggregate([
//            {$match: {
//                /*time: interval,up_falg:1,*/
//                CALLTRANSACTIONTYPE:{$in:['1','2']}
//            }}
//            ,{$project:{
//                //time:1,
//                //STATISTIC_DATE : "$time"
//                DATE: "$STARTOFCHARGINGDATE"
//                , HOUR: {$substr:["$TIMESTAMP",0,2]}
//
//                ////site
//                //, COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市
//                //, DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
//                //, SITE_NAME : "$SITE_NAME"
//                //, SITE_ID : "$SITE_ID"
//
//                //phone_type
//                , VENDOR : "$VENDOR"
//                , MODEL : "$MODEL"
//
//                , END_CODE : "$CAUSEFORTERMINATION"
//                , SIM_TYPE : "$SIM_TYPE"
//                , CARRIER : "$CARRIER"
//                //, HO_CALLED_1 : 1
//                , CALLDURATION : "$CALLDURATION"
//            }}
//            ,{$group:{
//                _id: {
//                    STATISTIC_DATE: {
//                        DATE : "$DATE"
//                        , HOUR : "$HOUR"
//                    }
//                    //site
//                    //, COUNTY: "$COUNTY" //縣市
//                    //, DISTRICT: "$DISTRICT" //地區
//                    //, SITE_NAME: "$SITE_NAME"
//                    //, SITE_ID: "$SITE_ID"
//
//                    //phone_type
//                    , VENDOR: "$VENDOR"
//                    , MODEL: "$MODEL"
//
//                    , END_CODE: "$END_CODE"
//                    , SIM_TYPE: "$SIM_TYPE"
//                    , CARRIER: "$CARRIER"
//                    //, IMEI: "$IMEI"
//                }
//
//                ,HO_CALLED_COUNT:{$sum:1}
//                ,HO_CALLED_SECOND:{$sum:"$CALLDURATION"}
//            }}
//            ,{$project:{
//                _id:1
//                //,STATISTIC_DATE:"$_id.STATISTIC_DATE"
//
//                ////site
//                //,COUNTY : "$_id.COUNTY"
//                //,SITE_NAME : "$_id.SITE_NAME"
//
//                ////phone_type
//                //,VENDOR : "$_id.VENDOR"
//                //,MODEL : "$_id.MODEL"
//
//                //,SIM_TYPE : "$_id.SIM_TYPE"
//                //,CARRIER : "$_id.CARRIER"
//                ,HO_CALLED_COUNT :1
//                ,HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}
//            }}
//            //,{    $out:"cdr2g_agg"}
//        ], function(err, result) {
//            i++;
//            if(err) res.redirect('cdr_CRUD_2g_show');//console.log("err : "+err.message);
//            if(i==5) console.log("result : "+util.inspect(result));
//            res.render('cdr_2g_phone_report', {title: 'flow', resp: result });
//        });
//    };
//};

//exports.cdr_2g_site_report = function(mongodb){
//    return function(req, res) {
//
//        //query
//        var collection = mongodb.get('cep2g_mr');
//        collection.count({},function(err,db_count){
//            collection.count({}, function (err, query_count) {
//                collection.find({}, {limit: _max_pageunit}, function (err, docs) {
//                    if (docs.length) console.log('docs.length: ' + docs.length);
//
//                    res.render('cdr_2g_site_report', {
//                        title: 'cep2g site',
//                        db_count: db_count,
//                        totalcount: query_count,
//                        //page_count:docs.length,
//                        resp: docs
//                    });
//                    //if (err) res.redirect('cdr_CRUD_query');
//                });
//            });
//        });
//    };
//};
//
//exports.cdr_2g_phone_report = function(mongodb){
//    return function(req, res) {
//
//        //query
//        var collection = mongodb.get('cep2g_mr');
//        collection.count({},function(err,db_count){
//            collection.count({}, function (err, query_count) {
//                collection.find({}, {limit: _max_pageunit}, function (err, docs) {
//                    if (docs.length) console.log('docs.length: ' + docs.length);
//
//                    res.render('cdr_2g_phone_report', {
//                        title: 'cep2g phone',
//                        db_count: db_count,
//                        totalcount: query_count,
//                        //page_count:docs.length,
//                        resp: docs
//                    });
//                    //if (err) res.redirect('cdr_CRUD_query');
//                });
//            });
//        });
//    };
//};