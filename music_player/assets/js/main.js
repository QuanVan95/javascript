const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'BI_PLAYER'
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
    {
        name: 'OK',
        singer: 'Binz',
        path:  './assets/music/song1.mp3',
        image: './assets/img/song1.png',
    },
    {
        name: 'Anh thanh niên',
        singer: 'HuyR',
        path:  './assets/music/song2.mp3',
        image: './assets/img/song2.png',
    },
    {
        name: 'Bước qua mùa cô đơn',
        singer: 'Vũ',
        path:  './assets/music/song3.mp3',
        image: './assets/img/song3.png',
    },
    {
        name: 'Sinh ra đã là thứ đối lập nhau',
        singer: 'Emcee L (Da Lab)',
        path:  './assets/music/song1.mp3',
        image: './assets/img/song4.png',
    },
    {
        name: 'Cứ chill thôi',
        singer: 'Chillies - Suni',
        path:  './assets/music/song2.mp3',
        image: './assets/img/song5.png',
    },
    {
        name: 'Thanh xuân',
        singer: 'Da Lab',
        path:  './assets/music/song3.mp3',
        image: './assets/img/song6.png',
    },
    {
        name: 'Đi về nhà',
        singer: 'Đen Vâu - JustaTee',
        path:  './assets/music/song2.mp3',
        image: './assets/img/song7.png',
    },
    {
        name: 'Lối nhỏ',
        singer: 'Đen Vâu',
        path:  './assets/music/song1.mp3',
        image: './assets/img/song8.png',
    },
    {
        name: 'Có như không có',
        singer: 'Hiền Hồ',
        path:  './assets/music/song2.mp3',
        image: './assets/img/song9.png',
    },
    {
        name: 'Sau tất cả',
        singer: 'Erik',
        path:  './assets/music/song3.mp3',
        image: './assets/img/song10.png',
    }],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `})
            playlist.innerHTML = htmls.join('')
    },
    //Set default song
    defineProperty: function() {
        Object.defineProperty(this, 'currentSong', {
        get: function() {
            return this.songs[this.currentIndex]
        }
        })
    },

    handleEvents: function() {
        const _this = this
        //Zoom in / zoom out the cover of current song
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        playBtn.onclick = function() {
        if (_this.isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }    
        }
        //Play a song
        audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
        }
        //Pause a song
        audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
        }
        //Update the run time of song
        audio.ontimeupdate = function() {
        if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }        
        }
        //onchange progress
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime      
        }
        //rotate cd (current song image)
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
            ], {
            duration: 10000,
            interations: Infinity})
            cdThumbAnimate.pause();
        //next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        },
        //prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
            _this.playRandomSong()
            } else {
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        },
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        },
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepead', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //Audio is ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click() // #1
            }
        }
        //Click to a song on playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++      
        if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    
    playRandomSong: function() {
        let newIndex
        do {
        newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    start: function() {
        this.loadConfig()
        this.defineProperty()
        this.handleEvents();
        this.loadCurrentSong();
        this.render()
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start();
