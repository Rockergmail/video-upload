var express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	multiparty = require('multiparty'),
	util = require('util'),
	fs = require('fs');

const UPLOADPATH = "./upload/";

module.exports = function (app) {
	app.use('/', router);
};

router.post('/uploadvideo', function (req, res) {

	// 解析一个文件上传
	var form = new multiparty.Form({ uploadDir: UPLOADPATH });
	//设置编辑
	form.encoding = 'utf-8';
	// //设置文件存储路径
	// form.uploadDir = "freedom/";
	//设置单文件大小限制 
	form.maxFilesSize = 300 * 1024 * 1024;  //300M
	//form.maxFields = 1000;  设置所以文件的大小总和
	form.parse(req, function (err, fields, files) {
		if (err) {
			console.log(err);
		} else {

			console.log(fields)
			var username = fields.username[0];
			var city = fields.city[0];
			var phone = fields.phone[0];
			var fileName = (files.file[0]).originalFilename;
			var fileExt = fileName.split('.').pop();
			var filePath = (files.file[0]).path;
			var newFilePath = `${UPLOADPATH}${username}-${city}-${phone}-${new Date().getTime()}.${fileExt}`
			//同步重命名文件名
			fs.renameSync(filePath, newFilePath);
			// res.render('pages/upload',{});
			res.json({ success: true });
		}
	});
});