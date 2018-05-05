var express = require('express'),
	router = express.Router(),
	fs = require('fs');
	path = require('path');

module.exports = function (app) {
	app.use('/', router);
};

router.get('/bgvideo.mp4', function (req, res, next) {

	// console.log("xXx")

	const rsPath = path.resolve('./public/assets/bg.mp4')
	// const rsPath = path.resolve('./public/assets/movie.mp4')
	// const rsPath = path.resolve('./public/assets/bg.dev.mp4')
	// console.log(rsPath);
	const stat = fs.statSync(rsPath)
	// console.log(stat);
	const fileSize = stat.size
	// const range = req.header.range
	const range = req.get('Range');

	console.log(range)

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		// const end = start === 0 ? 300 : parts[1] && parseInt(parts[1], 10) < fileSize -1 ? parseInt(parts[1], 10)
		// 	: fileSize -1;
		// const end = start + 511999 < fileSize -1 ? start + 511999 : fileSize -1;
		const end = start + 1048575 < fileSize -1 ? start + 1048575 : fileSize -1;

		// console.log(end)

		const chunksize = (end - start) + 1
		const file = fs.createReadStream(rsPath, { start, end })
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(206, head)
		file.pipe(res)
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(rsPath).pipe(res)
	}
});

// router.post('/download.html', function (req, res) {
// 	var queryParam = req.body.file_name;
// 	if(queryParam != undefined){
// 		res.download('freedom/upload/'+queryParam);
// 	}
// });
