var callbackTimes = 0;
function lightLoader(c, cw, ch, callback) {

    var _this = this;
    this.c = c;
    this.ctx = c.getContext('2d');
    this.cw = cw;
    this.ch = ch;

    this.loaded = 0;
    this.loaderHeight = 4;
    this.loaderWidth = cw * 0.95;
    this.loader = {
        x: (this.cw / 2) - (this.loaderWidth / 2),
        y: (this.ch / 2) - (this.loaderHeight / 2)
    };
    this.particles = [];
    this.particleLift = 180;
    this.hueStart = 0
    this.hueEnd = 120;
    this.hue = 0;
    this.gravity = .15;
    this.particleRate = 10;

    /*========================================================*/
	/* Initialize
	/*========================================================*/
    this.init = function () {
        this.loop();
    };

    /*========================================================*/
	/* Utility Functions
	/*========================================================*/
    this.rand = function (rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi); };
    this.hitTest = function (x1, y1, w1, h1, x2, y2, w2, h2) { return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1); };

    /*========================================================*/
	/* Update Loader
	/*========================================================*/
    this.updateLoader = function () {
        if (this.loaded > 99 && typeof callback === 'function') {

            if (callbackTimes === 0) {

                callbackTimes += 1;
                callback();
            }
        }
    };

    this.setLoaded = function (loaded) {

        this.loaded = loaded;
    }

    /*========================================================*/
	/* Render Loader
	/*========================================================*/
    this.renderLoader = function () {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight);

        this.hue = this.hueStart + (this.loaded / 100) * (this.hueEnd - this.hueStart);

        var newWidth = (this.loaded / 100) * this.loaderWidth;
        this.ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 40%, 1)';
        this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight);

        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight / 2);
    };

    /*========================================================*/
	/* Particles
	/*========================================================*/
    this.Particle = function () {
        this.x = _this.loader.x + ((_this.loaded / 100) * _this.loaderWidth) - _this.rand(0, 1);
        this.y = _this.ch / 2 + _this.rand(0, _this.loaderHeight) - _this.loaderHeight / 2;
        this.vx = (_this.rand(0, 4) - 2) / 100;
        this.vy = (_this.rand(0, _this.particleLift) - _this.particleLift * 2) / 100;
        this.width = _this.rand(1, 4) / 2;
        this.height = _this.rand(1, 4) / 2;
        this.hue = _this.hue;
    };

    this.Particle.prototype.update = function (i) {
        this.vx += (_this.rand(0, 6) - 3) / 100;
        this.vy += _this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y > _this.ch) {
            _this.particles.splice(i, 1);
        }
    };

    this.Particle.prototype.render = function () {
        _this.ctx.fillStyle = 'hsla(' + this.hue + ', 100%, ' + _this.rand(50, 70) + '%, ' + _this.rand(20, 100) / 100 + ')';
        _this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.createParticles = function () {
        var i = this.particleRate;
        while (i--) {
            this.particles.push(new this.Particle());
        };
    };

    this.updateParticles = function () {
        var i = this.particles.length;
        while (i--) {
            var p = this.particles[i];
            p.update(i);
        };
    };

    this.renderParticles = function () {
        var i = this.particles.length;
        while (i--) {
            var p = this.particles[i];
            p.render();
        };
    };


    /*========================================================*/
	/* Clear Canvas
	/*========================================================*/
    this.clearCanvas = function () {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.ctx.globalCompositeOperation = 'lighter';
    };

    /*========================================================*/
	/* Animation Loop
	/*========================================================*/
    this.loop = function () {
        var loopIt = function () {
            requestAnimationFrame(loopIt, _this.c);
            _this.clearCanvas();

            _this.createParticles();

            _this.updateLoader();
            _this.updateParticles();

            _this.renderLoader();
            _this.renderParticles();

        };
        loopIt();
    };

};

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

function setupRAF() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    };

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    };
};

var eleLoadingNow = $('.page__loading-now.loading'),
    eleUploadNow = $('.page__loading-now.uploading'),
    eleMoveday = $('.page__img.moveday'),
    elePageLoading = $(".page__loading"),
    elePageVideo = $(".page__video"),
    elePageInput = $(".page__input"),
    elePageEnd = $(".page__end"),
    eleActionWrap = $('.page__img-placeholder.action'),
    eleAction = $('.page__img.action'),
    eleVideoInput = $('.page__upload-img-wrap'),
    eleVideoWrap = null,
    eleVideo = null,
    eleSubmit = $('.page__input-submit'),
    eleInputName = $('#inputName'),
    eleInputPhone = $('#inputPhone'),
    eleInputCity = $('#inputCity'),
    eleError = $('.tips'),
    canPlay = false,
    canPlay2 = false,
    hasClick = false,
    hasClick2 = false,
    submitFlag = true,
    tapAnimationTime = 500,
    uploader = null,
    cl = null,
    eleSVideo = $("video.snapshot-generator"),
    eleSCanvas = $("canvas.snapshot-generator").get(0),
    step_2_events_fired = 0,
    mp4 = null,
    uploadSuccess = false,
    dev = true,
    // dev = false,
    videoPath = dev ? './assets/bg.dev.mp4' : './assets/bg.mp4',
    // videoPath = dev ? './assets/bg.dev.mp4' : '/bgvideo.mp4',
    // videoPath = './assets/bg.dev.mp4',
    uploadPath = dev ? 'http://dev.diaosaas.com:8080/uploadvideo' : 'http://diaosaas.com/uploadvideo';

// 初始化
function init() {

    var loadingCb = null;

    if (isCanvasSupported()) {

        $(".canvas-loading").show();
        var c = document.querySelector('.canvas-loading');
        c.width = c.getBoundingClientRect().width;
        c.height = c.getBoundingClientRect().height;
        var cw = c.width;
        var ch = c.height;
        cl = new lightLoader(c, cw, ch);

        setupRAF();
        cl.init();

    } else {

        $(".native-loading").show();
    }

    if (dev) {

        // FIXME:

        // goSecond();
        // goThird();
        // initUpLoader();
        // renderVideo();
        goPreload();
    } else {

        // renderVideo();
        goPreload();
    }
}

// 预加载
function goPreload(loadingCb) {

    mp4 = new preload({
        items: ['./assets/poster.png', './assets/1.png', './assets/3.png', './assets/4.png', './assets/5.png', './assets/6.png', videoPath] // 需要加载的图片列表
        // items: ['./assets/poster.png', './assets/1.png', './assets/3.png', './assets/4.png', './assets/5.png', './assets/6.png'] // 需要加载的图片列表
        , prefix: ''              // 如有需要可以更改图片路径的前缀
        , timeout: 60             // 默认当加载超过60s时会强制执行回调
        , callback: function () {

            goSecond();
        }
        , process: function (val) {

            if (isCanvasSupported()) {

                cl.setLoaded(val);
            } else {

                eleLoadingNow.css("width", val + "%");
            }

            if (val == 100) {

                goSecond();
            }
        }
    });
}

// 第二场景过渡 
function goSecond() {

    renderVideo();
    elePageVideo.addClass('active');
    eleMoveday.addClass('play');

    setTimeout(function () {

        elePageLoading.addClass("leave");

        setTimeout(function () {

            elePageLoading.removeClass("active");

        }, 1000)


    }, tapAnimationTime)

}

// 渲染视频
function renderVideo() {

    let vW = 368,
        vH = 640,
        cW = document.body.clientWidth,
        cH = document.body.clientHeight,
        classString = 'class';

    if (vH * cW / vW < cH) {

        classString += '="height" '
    } else {

        classString += ' '
    }

    var tempHtml =
        '<video' +
        ' id="video"' +
        'src="' + videoPath + '"' +
        'style="object-fit:fill"' +
        'playsinline="true"' +
        'poster="./assets/poster.png"' +
        'webkit-playsinline="true"' +
        'x-webkit-airplay="true" ' +
        'x5-video-orientation="h5"' +
        'muted ' +
        'x5-video-player-fullscreen="false"' +
        'x5-video-player-type="h5" ' +
        classString +
        'crossorigin="anonymous" ' +
        'preload="auto">' +
        '</video>'

    eleVideoWrap = $('.page__video-wrap');
    eleVideoWrap.html(tempHtml);

    setTimeout(function () {

        eleVideo = $("#video").get(0);
        eleVideo.addEventListener('ended', function () {

            eleActionWrap.show();
            // $(eleVideo).remove();
        });
    }, 0);
}

$('.img-play').one('tap', function () {

    $('audio').get(0).play();

    $(this).hide()
    eleVideo.play()

    if (canPlay) {
        eleVideo.play()
    } else {
        hasClick = true;
    }

    var intervalId = setInterval(function () {
        var readyState = eleVideo.readyState;
        console.log(readyState)
        if (readyState >= 3) {
            canPlay = true;
            clearInterval(intervalId);
            if (hasClick) {
                eleVideo.play();
            }
        }
    }, 1000);

    eleSVideo.get(0).play().catch(function(err){console.log(err)})

    if (canPlay2) {
        eleSVideo.get(0).play().catch(function(err){console.log(err)})
    } else {
        hasClick2 = true;
    }

    var intervalId2 = setInterval(function () {
        var readyState = eleSVideo.get(0).readyState;
        console.log(readyState)
        if (readyState >= 3) {
            canPlay2 = true;
            clearInterval(intervalId2);
            if (hasClick2) {
                eleSVideo.get(0).play().catch(function(err){console.log(err)});
            }
        }
    }, 1000);

    var intervalId3 = setInterval(function () {
        var readyState = $('audio').get(0).readyState;
        console.log(readyState)
        if (readyState >= 3) {
            // canPlay2 = true;
            clearInterval(intervalId3);
            // if (hasClick2) {
            $('audio').get(0).play();
            // }
        }
    }, 1000);

    // var intervalId


})

eleAction.one('tap', function () {

    $(this).addClass('play');

    setTimeout(function () {

        goThird();
        initUpLoader();
        eleActionWrap.hide();
    }, tapAnimationTime);
})

// 第三场景过渡
function goThird() {

    //跳转
    elePageInput.addClass('active');

    setTimeout(function () {

        $(eleVideo).remove();
        elePageVideo.addClass("leave");

        setTimeout(function () {

            elePageVideo.removeClass("active");
        }, 1000)


    }, 500)
}

function toast(text, red) {
    if (red) {
        eleError.text(text).css('color', 'red');
    } else {
        eleError.text(text).css('color', '#666');
    }

}

function resetFlag(resetUploader) {

    uploadSuccess = false;
    toast("视频大小限制300M以下");
    submitFlag = true;
    resetUploader && uploader.reset();
    eleSubmit.one('tap', dealSubmit);
    console.log(uploader.getFiles())
}

function dealSubmit() {

    if (!eleInputName.val().trim()) {

        resetFlag()
        toast("未填写昵称，请填写", true);
        return false;
    }

    if (!eleInputPhone.val().trim()) {

        resetFlag()
        toast("未填写联系方式，请填写", true);
        return false;
    }

    if (!/^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.exec(eleInputPhone.val().trim())) {

        resetFlag()
        toast("联系手机格式错误，请重新填写", true);
        return false;
    }

    if (!eleInputCity.val().trim()) {

        resetFlag()
        toast("未填写城市，请填写", true);
        return false;
    }

    if (!uploader.getFiles().length) {

        resetFlag()
        toast("未选择文件，请选择", true);
        return false;
    }


    if (dev) {

        // console.log(uploader.getFiles());
        // uploader.md5File(uploader.getFiles()[0].source.source)
        //     .progress(function (percentage) {
        //         console.log('Percentage:', percentage);
        //     })
        //     .then(function (val) {
        //         console.log(val);
        //         uploader.on('uploadBeforeSend', function (block, data) {

        //             console.log('uploadBeforeSend');
        //             var file = block.file;
        //             data.username = eleInputName.val().trim();
        //             data.city = eleInputCity.val().trim();
        //             data.phone = eleInputPhone.val().trim();
        //             data.md5 = val;
        //         });
        //         uploader.upload();
        //     })
    } else {

        // uploader.on('uploadBeforeSend', function (block, data) {

        //     console.log('uploadBeforeSend');
        //     var file = block.file;
        //     data.username = eleInputName.val().trim();
        //     data.city = eleInputCity.val().trim();
        //     data.phone = eleInputPhone.val().trim();
        // });
    }
    uploader.upload();
}


function initUpLoader() {


    uploader = WebUploader.create({

        auto: false,
        server: uploadPath,

        pick: '.page__upload-img-wrap',

        // chunked: dev ? true : false,
        fileSizeLimit: 300 * 1024 * 1024,
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,

        accept: {
            // title: '',
            mimeTypes: 'video/*'
        }
    });

    eleSubmit.one('tap', dealSubmit);

    // uploader.on('uploadComplete', function(){
    //     console.log('uploadComplete')
    //     resetFlag();
    // });
    // uploader.on('error', function(){
    //     console.log('error')
    //     resetFlag();
    // });
    // uploader.on('uploadInterrupt', function(){
    //     console.log('uploadInterrupt')
    //     resetFlag();
    // });
    // uploader.on('uploadInvalid', function(){
    //     console.log('uploadInvalid')
    //     resetFlag();
    // });
    // uploader.on('uploadCancelled', function(){
    //     console.log('uploadCancelled')
    //     resetFlag();
    // });
    uploader.on('beforeFileQueued', function (file) {

        console.log('beforeFileQueued')

        if (file.size > 300 * 1024 * 1024) {
            toast("文件大小超过300M，不能上传", true);
        }
    })
    uploader.on('fileQueued', function (file) {

        // console.log(file)
        // console.log(window.URL.createObjectURL(file.source.source));

        // console.log("==================")
        // console.log(uploader.getFiles());

        if (uploader.getFiles().length === 2) {

            uploader.removeFile(uploader.getFiles()[0].id, true)
            console.log("file fucked")
        };

        // console.log(uploader.getFiles());
        // console.log("==================")

        toast('已选择文件: ' + file.name);

        step_2_events_fired = 0;

        eleSVideo.on('loadedmetadata loadeddata suspend canplay', function () {

            // console.log("video event");

            if (++step_2_events_fired == 3) {

                console.log(step_2_events_fired);

                eleSVideo.on('seeked', function () {

                    // var eleSCanvas = document.createElement('canvas');
                    // eleSCanvas.className = "snapshot-generator";
                    // document.body.append(eleSCanvas);

                    eleSCanvas.width = this.videoWidth;
                    eleSCanvas.height = this.videoHeight;
                    eleSCanvas.getContext('2d').drawImage(this, 0, 0);
                    var snapshot = eleSCanvas.toDataURL();
                    // $('.page__upload-img').attr('src', snapshot);
                    $('.page__upload-img').hide();
                    $('.webuploader-pick').css('border', '4px solid black').html("<img width='100%' src='" + snapshot + "' >")

                    // Delete the elements as they are no longer needed
                    // eleSVideo.remove();
                    // $(eleSCanvas).remove();

                    // console.log(snapshot);

                }).prop('currentTime', 0);
            }
        }).prop('src', window.URL.createObjectURL(file.source.source)).get(0).load( window.URL.createObjectURL(file.source.source));
    })


    uploader.on('uploadProgress', function (file, percentage) {

        console.log('uploadProgress');

        eleUploadNow.css('width', percentage * 100 + '%');
    });
    uploader.on('uploadFinished', function () {

        console.log(uploadSuccess);

        if (!uploadSuccess) {

            resetFlag();
            toast("上传失败，请再试", true)
            eleUploadNow.css('width', '0');
        }
        console.log('uploadFinished');

    });
    uploader.on('uploadSuccess', function () {

        uploadSuccess = true;
        console.log('uploadSuccess')
        goFourth();
    });

    uploader.on('uploadBeforeSend', function (block, data) {

        console.log('uploadBeforeSend');
        var file = block.file;
        data.username = eleInputName.val().trim();
        data.city = eleInputCity.val().trim();
        data.phone = eleInputPhone.val().trim();
    });

    elePageInput.on('tap', function () {

        toast("视频请控制在三分钟以内");
    })
}

function goFourth() {

    setTimeout(function () {

        elePageInput.addClass("leave");
        elePageEnd.addClass('active');

        setTimeout(function () {

            elePageInput.removeClass("active");

        }, 1000)

    }, 500)


    resetFlag();

}

document.addEventListener('WeixinJSBridgeReady', function () {

    $('audio').get(0).play();
    eleSVideo.get(0).play().catch(function(err){console.log(err)});
}, false);

document.addEventListener('ontouchstart', function () {

    $('audio').get(0).play();
    eleSVideo.get(0).play().catch(function(err){console.log(err)});
})


// if (dev) {
//     elePageVideo.on('tap', function () {
//         // goThird();
//     })
// }

init();