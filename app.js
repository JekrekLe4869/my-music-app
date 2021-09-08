const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Jekrek';

const player = $('.player');
const songName = $('header h2');
const singerName = $('header p');

const cd = $('.cd');
const cdThumb = $('.cd-thumb');

const playingTime = $('.playing-time');
const durationTime = $('.duration-time');
const progress = $('#progress');
const audio = $('#audio');
const canvas = $('#canvas');

const playBtn = $('.btn-toggle-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const volumeProgress = $('#volume-progress');
const valueVolumeProgress = $('.volume-value');
const slashVolumeBtn = $('.btn-volume-slash');
const downVolumeBtn = $('.btn-volume-down');
const volumeBtn = $('.btn-volume');
const upVolumeBtn = $('.btn-volume-up');

const playlist = $('.playlist .playlist__list');

// Random lại 1 bài khi đã random hết playlist
let arrayRandom = [];
let arrLengthRandom = 0;

// Chạy một lần AudioContext
let runOnlyOnce = false;

const app = {
  currentIndex: 0,
  currentTime: 0,
  currentVolume: 1,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isMuted: false,
  isMobile: false,
  volumeBeforeMuted: 0,
  isOnMouseAndTouchOnProgress: false,

  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: 'Anh Buồn Em Thương',
      singer: 'Như Quỳnh ft Trường Vũ',
      path: './assets/music/AnhBuonEmThuong-NhuQuynhTruongVu.mp3',
      image: './assets/image/TNCD292.jpg',
    },
    {
      name: 'Bao Giờ Em Quên',
      singer: 'Như Quỳnh ft Trường Vũ',
      path: './assets/music/BaoGioEmQuen-NhuQuynhTruongVu.mp3',
      image: './assets/image/TNCD319.jpg',
    },
    {
      name: 'Chồng Sớm',
      singer: 'Bảo Hân, Loan Châu & Trúc Linh',
      path: './assets/music/ChongSom-LoanChauBaoHanTrucLinh.mp3',
      image: './assets/image/TNCD280.jpg',
    },
    {
      name: 'Chuyện Người Con Gái Hái Sim',
      singer: 'Như Quỳnh',
      path: './assets/music/ChuyenNguoiConGaiHaiSim-NhuQuynh.mp3',
      image: './assets/image/TNCD292.jpg',
    },
    {
      name: 'Con Đê Chung Tình',
      singer: 'Phi Nhung',
      path: './assets/music/ConDeChungTinh-PhiNhung.mp3',
      image: './assets/image/TNCD297.jpg',
    },
    {
      name: 'Duyên Phận',
      singer: 'Như Quỳnh',
      path: './assets/music/DuyenPhan-NhuQuynh.mp3',
      image: './assets/image/TNCD473.jpg',
    },
    {
      name: 'Giấc Ngủ Cô Đơn',
      singer: 'Phương Diễm Hạnh ft Tâm Đoan',
      path: './assets/music/GiacNguCoDon-PhuongDiemHanhTamDoan.mp3',
      image: './assets/image/TNCD329.jpg',
    },
    {
      name: 'Khi Đã Yêu Anh',
      singer: 'Trúc Lam ft Trúc Linh',
      path: './assets/music/KhiDaYeuAnh-TrucLamTrucLinh.mp3',
      image: './assets/image/TNCD307.jpg',
    },
    {
      name: 'Khi Mình Xa Nhau',
      singer: 'Mạnh Đình ft Phương Diễm Hạnh',
      path: './assets/music/KhiMinhXaNhau-PhuongDiemHanhManhDinh.mp3',
      image: './assets/image/TNCD305.jpg',
    },
    {
      name: 'LK Cảm Ơn & Xuân Này Con Không Về',
      singer: 'Phi Nhung, Mạnh Quỳnh, Như Quỳnh, Thế Sơn',
      path: './assets/music/LKCamOnXuanNayConKhongVe-PhiNhungManhQuynhTheSonNhuQuynh.mp3',
      image: './assets/image/TNCD284.jpg',
    },
    {
      name: 'LK Khi Không & Trách Người Trong Mộng',
      singer: 'Như Quỳnh ft Trường Vũ',
      path: './assets/music/LKKhiKhongTrachNguoiTrongMong-NhuQuynhTruongVu.mp3',
      image: './assets/image/TNCD283.jpg',
    },
    {
      name: 'LK Sao Không Thấy Anh Về & Nén Hương Yêu',
      singer: 'Như Quỳnh ft Trường Vũ',
      path: './assets/music/LkSaoKhongThayAnhVeNenHuongYeu-NhuQuynhTruongVu.mp3',
      image: './assets/image/TNCD305.jpg',
    },
    {
      name: 'LK Trúc Phương',
      singer: 'Phương Diễm Hạnh ft Tâm Đoan',
      path: './assets/music/LKTrucPhuong-PhuongDiemHanhTamDoan.mp3',
      image: './assets/image/TNCD283.jpg',
    },
    {
      name: 'Thành Phố Sương Mù',
      singer: 'Như Quỳnh',
      path: './assets/music/ThanhPhoSuongMu-NhuQuynh.mp3',
      image: './assets/image/TNCD196.jpg',
    },
    {
      name: 'Trái Tim Lỡ Lầm',
      singer: 'Minh Tuyết',
      path: './assets/music/TraiTimLoLam-MinhTuyet.mp3',
      image: './assets/image/TNCD280.jpg',
    },
    {
      name: 'Trả Lại Em Yêu',
      singer: 'Loan Châu ft Trần Thái Hòa',
      path: './assets/music/TraLaiEmYeu-TranThaiHoaLoanChau.mp3',
      image: './assets/image/TNCD315.jpg',
    },
    {
      name: 'Trước Giờ Tạm Biệt',
      singer: 'Phương Diễm Hạnh',
      path: './assets/music/TruocGioTamBiet-PhuongDiemHanh.mp3',
      image: './assets/image/TNCD262.jpg',
    },
    {
      name: 'Xin Anh Giữ Trọn Tình Quê',
      singer: 'Phương Diễm Hạnh ft Đặng Trường Phát',
      path: './assets/music/XinAnhGiuTronTinhQue-PhuongDiemHanhDangTruongPhat.mp3',
      image: './assets/image/TNCD262.jpg',
    },
  ],

  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render() {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? 'active' : ''
            }" data-index="${index}">
                <div class="thumb" style="background-image: url('${
                  song.image
                }')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="music-waves ${
                  index === this.currentIndex ? 'active' : ''
                }">  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                </div>
            </div>
        `;
    });
    playlist.innerHTML += html.join('');
  },

  defineProperties() {
    // Getter
    Object.defineProperty(this, 'currentSong', {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000, // 10s
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý thay đổi kích thước màn hình
    window.onresize = function () {
      if (window.innerWidth < 740) {
        _this.isMobile = true;
      } else {
        _this.isMobile = false;
      }
      _this.setConfig('isMobile', _this.isMobile);
    };

    // Xử lý phóng to / thu nhỏ CD khi ở mobile
    document.onscroll = function () {
      if (_this.isMobile) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      } else {
        cd.style.width = '250px';
        cd.style.opacity = '1';
      }
    };

    // Phát / dừng nhạc khi nhấn `space`
    document.onkeydown = function (e) {
      if (e.code === 'Space') {
        e.preventDefault();
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }
    };

    // Xử lý khi nhấn Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi audio phát nhạc
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      playBtn.title = 'Pause';
      cdThumbAnimate.play();
      $$('.music-waves.active span').forEach((span) => {
        span.classList.add('active');
      });
      if (!runOnlyOnce) {
        _this.renderEqualizer();
        runOnlyOnce = true;
      }
    };

    // Khi auto được tải lên
    audio.onloadedmetadata = function () {
      const minSec = _this.formatTime(audio.duration);
      durationTime.textContent = `${minSec[0]}:${minSec[1]}`;
    };

    // Khi audio dừng phát nhạc
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      playBtn.title = 'Play';
      cdThumbAnimate.pause();
      $$('.music-waves.active span.active').forEach((span) => {
        span.classList.remove('active');
      });
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration && !_this.isOnMouseAndTouchOnProgress) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        _this.setConfig('currentTime', audio.currentTime);

        let tmp = _this.formatTime(audio.currentTime);
        playingTime.textContent = `${tmp[0]}:${tmp[1]}`;
      }
    };

    // Chạm chuột
    progress.onmousedown = function () {
      _this.isOnMouseAndTouchOnProgress = true;
    };

    // Chạm
    progress.ontouchstart = function () {
      _this.isOnMouseAndTouchOnProgress = true;
    };

    // Xử lý khi tua nhạc
    progress.oninput = function (e) {
      if (audio.duration) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;
        _this.isOnMouseAndTouchOnProgress = false;
      }
    };

    // Xử lý khi thay đổi âm lượng
    volumeProgress.oninput = function (e) {
      audio.muted = false;
      audio.volume = e.target.value / 100;
      _this.currentVolume = audio.volume;
      valueVolumeProgress.textContent = Math.round(e.target.value);
      _this.changeStyleVolume();
      _this.setConfig('currentVolume', _this.currentVolume);
    };

    // Xử lý tắt / mở tiếng
    upVolumeBtn.onclick = function () {
      _this.muteOrUnmuteVolume();
    };

    downVolumeBtn.onclick = function () {
      _this.muteOrUnmuteVolume();
    };

    volumeBtn.onclick = function () {
      _this.muteOrUnmuteVolume();
    };

    slashVolumeBtn.onclick = function () {
      _this.muteOrUnmuteVolume();
    };

    // Khi nhấn next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };

    // Khi nhấn prev
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.changeTitle();
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // Xử lý bật / tắt repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.changeTitle();
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Xử lý next song khi audio kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lý khi nhấn vào song trong playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        audio.play();
      }
    };
  },

  // Xử lý màn hình kéo đến vị trí nhạc đang phát trong playlist
  scrollToActiveSong() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  },

  renderEqualizer() {
    const _this = this;
    var BAR_PAD = 10;
    var BAR_WIDTH = 5;
    var MAX_BARS = 80;

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Create a MediaElementAudioSourceNode
    // Feed the HTMLMediaElement into it
    var source = audioCtx.createMediaElementSource(audio);

    var analyser = audioCtx.createAnalyser();

    // canvas.width = window.innerWidth * 0.8
    // canvas.height = window.innerHeight * 0.4

    canvas.width = 840;
    canvas.height = 300;

    var ctx = canvas.getContext('2d');

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);
    // console.log(bufferLength)

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      var len = dataArray.length - Math.floor(dataArray.length / MAX_BARS) * 4;
      var maxValue = 255;
      var step = Math.floor(len / MAX_BARS);
      var quantityDot = (WIDTH / MAX_BARS) * 1.2;
      var x = BAR_WIDTH;
      var height = HEIGHT - BAR_PAD * 2;

      for (var i = 0; i < len; i += step) {
        var v = dataArray[i] / maxValue;
        var h = v * height;
        var y = height / 2 - h / 2;
        ctx.beginPath();
        if (_this.config.theme === 'dark') {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        } else {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        }
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        ctx.lineWidth = BAR_WIDTH;
        ctx.lineCap = 'round';
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.stroke();
        x += quantityDot + 1;
      }
    }
    renderFrame();
  },

  loadCurrentSong() {
    songName.textContent = this.currentSong.name;
    singerName.textContent = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    if (this.currentIndex == this.config.currentIndex) {
      audio.currentTime = this.currentTime;
    } else {
      audio.currentTime = 0;
    }

    this.setConfig('currentIndex', this.currentIndex);

    if ($('.song.active')) {
      $('.song.active').classList.remove('active');
      $('.music-waves.active').classList.remove('active');
    }

    const songList = $$('.song');
    const wavesSongList = $$('.music-waves');
    songList.forEach((song, index) => {
      if (Number(song.dataset.index) === this.currentIndex) {
        song.classList.add('active');
        wavesSongList[index].classList.add('active');
      }
    });
  },

  loadConfig() {
    this.isRandom = this.config.isRandom || this.isRandom;
    this.isRepeat = this.config.isRepeat || this.isRepeat;
    this.isMuted = this.config.isMuted || this.isMuted;
    this.isMobile = this.config.isMobile || this.isMobile;
    this.currentIndex = this.config.currentIndex || this.currentIndex;
    this.currentTime = this.config.currentTime || this.currentTime;
    this.currentVolume =
      this.config.currentVolume >= 0
        ? this.config.currentVolume
        : this.currentVolume;
    this.volumeBeforeMuted =
      this.config.volumeBeforeMuted >= 0
        ? this.config.volumeBeforeMuted
        : this.volumeBeforeMuted;
  },

  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong() {
    let newIndex;
    newIndex = Math.floor(Math.random() * this.songs.length);

    if (arrLengthRandom > 0) {
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
        var isExistArrRandom = arrayRandom.includes(newIndex);
      } while (isExistArrRandom);
    }

    arrayRandom[arrLengthRandom] = newIndex;

    this.currentIndex = newIndex;
    this.loadCurrentSong();

    if (arrLengthRandom === this.songs.length - 1) {
      arrayRandom = [];
      arrLengthRandom = -1;
    }

    arrLengthRandom++;
  },

  formatTime(time) {
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    const minutes = mins < 10 ? `0${mins}` : mins;
    const seconds = secs < 10 ? `0${secs}` : secs;
    return [minutes, seconds];
  },

  changeTheme() {
    const _this = this;
    const toggleSwitch = $('.theme-switch input[type="checkbox"]');
    const currentTheme = this.config.theme;

    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
      }
    }

    function switchTheme(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        _this.setConfig('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        _this.setConfig('theme', 'light');
      }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);
  },

  changeStyleVolume() {
    if (this.currentVolume === 0) {
      slashVolumeBtn.style.display = 'flex';
      downVolumeBtn.style.display = 'none';
      volumeBtn.style.display = 'none';
      upVolumeBtn.style.display = 'none';
    } else if (this.currentVolume > 0 && this.currentVolume <= 0.25) {
      slashVolumeBtn.style.display = 'none';
      downVolumeBtn.style.display = 'flex';
      volumeBtn.style.display = 'none';
      upVolumeBtn.style.display = 'none';
    } else if (this.currentVolume > 0.25 && this.currentVolume <= 0.5) {
      slashVolumeBtn.style.display = 'none';
      downVolumeBtn.style.display = 'none';
      volumeBtn.style.display = 'flex';
      upVolumeBtn.style.display = 'none';
    } else {
      slashVolumeBtn.style.display = 'none';
      downVolumeBtn.style.display = 'none';
      volumeBtn.style.display = 'none';
      upVolumeBtn.style.display = 'flex';
    }
  },

  muteOrUnmuteVolume() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.volumeBeforeMuted = this.currentVolume;
      audio.muted = true;
      volumeProgress.value = 0;
      audio.volume = 0;
      this.currentVolume = 0;
    } else {
      audio.muted = false;
      this.currentVolume = this.volumeBeforeMuted;
      volumeProgress.value = this.currentVolume * 100;
      audio.volume = this.currentVolume;
    }
    valueVolumeProgress.textContent = Math.round(this.currentVolume * 100);
    this.setConfig('volumeBeforeMuted', this.volumeBeforeMuted);
    this.setConfig('isMuted', this.isMuted);
    this.setConfig('currentVolume', this.currentVolume);
    this.changeStyleVolume();
  },

  changeTitle() {
    this.isRepeat
      ? (repeatBtn.title = 'Disable repeat')
      : (repeatBtn.title = 'Enable repeat');
    this.isRandom
      ? (randomBtn.title = 'Disable shuffle')
      : (randomBtn.title = 'Enable shuffle');
  },

  start() {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe/ xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Change theme
    this.changeTheme();

    // Hiển thị trạng thái ban đầu của nút repeat, random,
    // Thanh volume
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
    volumeProgress.value = this.currentVolume * 100;
    audio.volume = this.currentVolume;
    valueVolumeProgress.textContent = Math.round(volumeProgress.value);

    this.changeStyleVolume();
    this.changeTitle();
  },
};

// Start the application
app.start();
