# BT_201509_CDR
BT_201509_CDR

### 前置準備

下載BT_201505_CDR資源

```bash 
$ git clone https://github.com/liyuqi/BT_201509_CDR
```


安裝node_module套件

```bash 
$ sudo npm install
```


開啟mongod，預設27017 port

```bash 
$ mongod --storageEngine wiredTiger
```

修改mongodb設定

```sh
$ vi ./setting.js    # 替換連線DB
```

```js
module.exports = {
	cookie_secret : 'secret_meteoric',
  	db : 'test',
  	host : '192.168.0.190',
	port : 27017
};
```

```sh
$ vi ./app.js       # 替換連線DB
```

```js
var dbfluentd = monk('192.168.0.190/test');
```

### 開始使用CDR CRUD功能

開啟app

```bash
$ node app.js
```

### raw data

查詢 CDR
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/raw_3G_query.png)

顯示 CDR
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/syslog_CRUD_query_result.png)

最新 CDR
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/syslog_CRUD_show_pagging.png)

### agg 統計

基站 3G
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/site_query.png)

基站 2G
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/syslog_ALERT_list.png)

手機型號
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/syslog_ALERT_display.png)

流量 統計
![Image text](https://github.com/liyuqi/BT_201509_CDR/blob/master/example/syslog_ALERT_event.png)
