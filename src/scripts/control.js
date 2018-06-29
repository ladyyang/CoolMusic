const Song = require('./song.js');

'use strict';

var song = new Song();

window.doJSON = function doJSON(data) {
    cb.call(song, data);
}

// callback of jsonp 
function cb(data) {
    // // 搜索的所有歌曲信息 songList
    this.songList = data.data.lists;

    if (this.songList.length) {
        createDom(this.targetDom, this.songList);
    }
}

// create song list
function createDom(obj, songList) {
    var str = '';

    songList.forEach(function (ele) {
        var itemStr = `<li class="song_item"> 
                                <div class="singer_name">${ele.SongName}</div>
                        </li>`;
        str += itemStr;
    });

    obj.innerHTML = str;
}

// 防抖
function debounce(handle, delay) {
    var timer = null;

    return function (e) {
        var args = arguments;
        clearTimeout(timer);

        timer = setTimeout(() => {
            handle.apply(this, args);
        }, delay)
    }
}

function clickSongList(e) {
    var singerName = Array.from(document.getElementsByClassName('singer_name'));
    var target = e.target;

    // Select a song to display the play Ui
    if (target.className === 'singer_name') {
        this.inputDom.value = '';
        this.index = singerName.indexOf(target);

        let hash = this.songList[this.index].FileHash;

        // this.songHash
        if (this.songHash.indexOf(hash) === -1) {
            this.songHash.unshift(hash);
            localStorage.hash = JSON.stringify(this.songHash);
        }

        this.loadSong(hash);

        console.log('click');
        // Switch interface ct between play
        switchPlayUI.call(this);

        cancleSOSO.call(this);

    }
}

function switchPlayUI() {
    this.playUiDom.style.top = '0';
    this.rightWrapDom.style.display = 'none';
}

// jsonp 加载歌曲资源
function loadSongList() {
    var searchUrl = 'http://songsearch.kugou.com/song_search_v2?callback=doJSON&keyword=';
    // this---> this.input
    if (this.value) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = searchUrl + this.value;
        // script.src = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?ct=24&qqmusic_ver=1298&new_json=1&remoteplace=txt.yqq.center&searchid=49493059975831973&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&p=1&n=20&w=${this.value}&g_tk=1175838790&jsonpCallback=cb&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0`;
        document.body.appendChild(script);
        document.body.removeChild(script);
    }
}


song.extend({
    inputDom: document.querySelector('input'),
    targetDom: document.querySelector('.song_wrapper .song_list'),
    imgDom: document.querySelector('.play-main .dial .zz'),
    songNameDom: document.querySelector('.play-nav .name'),
    authorDom: document.querySelector('.play-nav .author'),
    endTimeDom: document.querySelector('.play-UI .play-bottom .progress-bar .end-time'),
    startTimeDom: document.querySelector('.play-UI .play-bottom .progress-bar .start-time'),
    lyricUiDom: document.querySelector('.play-main .ly-list'),
    dialDom: document.querySelector('.play-main .dial'),
    playUiBackBtn: document.querySelector('.play-nav .back'),
    playBtn: document.querySelector('.play-UI .play-bottom .state'),
    playBtn2: document.querySelector('.p-bottom .state'),
    playUiDom: document.querySelector('.play-UI'),
    pImg: document.querySelector('.p-bottom .p-img'),
    pBottom: document.querySelector('.p-bottom'),
    rightWrapDom: document.querySelector('.right-wrapper'),
    isPlay: false,

    bindEvent: bindEvent,
    init: init
});

function triggerPlayBtn() {
    if (this.isPlay) {
        this.isPlay = false;
        this.dialDom.classList.add('paused');
        this.pImg.classList.add('paused');
        this.playBtn.classList.remove('pause-btn');
        this.playBtn2.classList.remove('pause-btn');
        this.pause();
    } else {
        this.isPlay = true;
        this.play();
        this.dialDom.classList.remove('paused');
        this.pImg.classList.remove('paused');
        this.playBtn.classList.add('pause-btn');
        this.playBtn2.classList.add('pause-btn');
    }
}

var nav = document.getElementsByClassName('nav')[0],
    content = document.getElementsByClassName('content')[0];

function cancleSOSO() {
    nav.classList.remove('active');
    content.style = '';
    this.targetDom.parentElement.style.display = '';
    this.pBottom.style = '';
    this.inputDom.value = '';
    this.targetDom.innerHTML = '';
}

function bindEvent() {
    var self = this,
        nextBtn = document.querySelector('.play-bottom .next'),
        prevBtn = document.querySelector('.play-bottom .prev'),
        singer = document.getElementsByClassName('song_list')[0];

    // 播放界面的播放按钮
    this.playBtn.onclick = () => {
        // this ==> song
        triggerPlayBtn.call(this);
    }

    // 底部小界面的播放按钮
    this.playBtn2.onclick = () => {
        // this ==> song
        triggerPlayBtn.call(this);
    }

    this.inputDom.addEventListener('input', debounce(loadSongList, 300));

    // Click on a single song
    this.songHash = [];
    singer.addEventListener('click', clickSongList.bind(this));

    this.pImg.addEventListener('click', switchPlayUI.bind(this));

    nextBtn.onclick = () => {
        this.next();
    }

    prevBtn.onclick = () => {
        this.prev();
    }

    // click input
    this.inputDom.onclick = function () {
        nav.classList.add('active');
        content.style.display = 'none';
        self.targetDom.parentElement.style.display = 'block';
        self.pBottom.style.bottom = '-50px';
    }

    // cancle click
    this.inputDom.nextElementSibling.onclick = cancleSOSO.bind(this);

        // Play screen return button
        this.playUiBackBtn.onclick = () => {
            this.rightWrapDom.style.display = '';
            this.playUiDom.style = '';
        }

    // click show lyrics
    this.dialDom.onclick = function () {
        this.style.opacity = 0;
        this.style.display = 'none';
        self.lyricUiDom.parentNode.style.display = 'block';
        self.lyricUiDom.parentNode.style.opacity = 1;
    }

    // click show dial
    this.lyricUiDom.parentNode.onclick = function () {
        this.style.opacity = 0;
        this.style.display = 'none';
        self.dialDom.style.display = 'block';
        self.dialDom.style.opacity = 1;
    }

}


function init() {
    if (localStorage.length > 0) {
        this.songHash = JSON.parse(localStorage.hash);
        this.loadSong(this.songHash[0]);
    } else {
        this.pBottom.style.bottom = '-50px';
    }
    this.bindEvent();
}

module.exports = song