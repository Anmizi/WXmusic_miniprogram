// pages/music-player/music-player.js
import {
  getMusicDetail,
  getMusicLyric
} from '../../services/modules/player'
import {
  lyricParse
} from '../../utils/lyric-parse'
import {
  playlistStore
} from '../../store/playlistStore'
const app = getApp()
const audioContext = wx.createInnerAudioContext()
const modeMap = ['order','random','repeat']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    song: {},
    lyric: [],
    lyricString: '',
    currentTime: 0,
    durationTime: 0,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSlidering: false,
    isPlaying: true,
    scrollTop: 0,
    currentLyricIndex: -1,
    playSongList: [],
    currentPlayIdx: 0,
    isFirstPlay: true,
    currentMode:0,
    currentModeName:modeMap[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.playerContentHeight
    })
    const {
      id
    } = options
    this.data.id = id
    //获取全局store数据
    playlistStore.onStates(['playSongList', 'currentPlayIdx'], ({
      playSongList,
      currentPlayIdx
    }) => {
      if (playSongList) {
        this.setData({
          playSongList
        })
      }
      if (currentPlayIdx !== undefined) {
        this.setData({
          currentPlayIdx
        })
      }
    })
    //处理歌曲播放
    this.handlePlaySong()
  },
  //请求相关
  fetchSongDetail() {
    //歌曲信息
    getMusicDetail(this.data.id)
      .then(res => {
        this.setData({
          song: res.songs[0],
          durationTime: res.songs[0].dt
        })
      })
    //歌词信息
    getMusicLyric(this.data.id)
      .then(res => {

        const lyricInfo = lyricParse(res.lrc.lyric)
        this.setData({
          lyric: lyricInfo
        })
      })
  },
  //事件处理
  onSwiperChange(e) {
    this.setData({
      currentPage: e.detail.current
    })
  },
  onSliderChange(e) {
    this.data.isSlidering = false
    const currentTime = e.detail.value / 100 * this.data.durationTime
    audioContext.seek(currentTime / 1000)
    this.setData({
      currentTime
    })
  },
  onSliderChanging(e) {
    this.data.isSlidering = true

  },
  onNavClick(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },
  onPlayOrPause() {
    if (this.data.isPlaying) {
      this.setData({
        isPlaying: false
      })
      audioContext.pause()
    } else {
      this.setData({
        isPlaying: true
      })
      audioContext.play()
    }
  },
  //其他方法
  async updateLyric(currentTime) {
    if (!this.data.lyric.length) return;
    let index = this.data.lyric.findIndex(item => {
      return item.time > currentTime
    })
    index = (index === -1) ? this.data.lyric.length - 1 : index - 1
    if (index >= 0 && (index !== this.data.currentLyricIndex)) {
      this.setData({
        lyricString: this.data.lyric[index].text,
        currentLyricIndex: index
      })
      const query = this.createSelectorQuery()
      query.select('.lyric-list .item.active').boundingClientRect()
      query.select('.lyric-list').scrollOffset()
      query.exec(res => {
        const [rect, scrollRect] = res
        let top = (rect && rect.top) || 0
        let scrollTop = (scrollRect && scrollRect.scrollTop) || 0
        const offsetTop = scrollTop + top
        this.setData({
          scrollTop: offsetTop - this.data.contentHeight / 2
        })
      })

    }





  },
  onItemPrev() {
    this.onItemToggle(false)
  },
  onItemNext() {
    this.onItemToggle(true)
  },
  onItemToggle(isNext) {
    const length = this.data.playSongList.length
    let index = this.data.currentPlayIdx
    switch(this.data.currentMode){
      case 0:
        index = isNext ? this.data.currentPlayIdx + 1 : this.data.currentPlayIdx - 1
        break;
      case 1:
        let newIdx = Math.floor(Math.random() * length);
        while(newIdx === index){
          newIdx = Math.floor(Math.random() * length);
        }
        index = newIdx
        break
      case 2:
        break;
    }
    if (index >= length) {
      index = 0
    } else if (index < 0) {
      index = length - 1
    }
    const song = this.data.playSongList[index]
    this.setData({
      currentPlayIdx: index,
      id: song.id,
      song: {},
      currentTime: 0,
      durationTime: 0,
      lyric: []
    })
    playlistStore.setState('currentPlayIdx', index)
    this.handlePlaySong()
  },
  onChangePlayMode(){
    let index = this.data.currentMode + 1
    if(index === modeMap.length){
      index = 0
    }
    this.setData({currentModeName:modeMap[index],currentMode:index})
  },
  handlePlaySong() {
    //获取歌曲相关信息
    this.fetchSongDetail()
    //开始加载歌曲
    this.handleLoadSong()

  },
  handleLoadSong() {
    //加载歌曲
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
    //开启自动播放
    audioContext.autoplay = true
    //监听播放
    //第一次播放监听
    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false
      audioContext.onTimeUpdate(() => {
        if (!this.data.isSlidering) {
          const sliderValue = this.data.currentTime / this.data.durationTime * 100
          this.setData({
            currentTime: audioContext.currentTime * 1000,
            sliderValue
          })

          this.updateLyric(audioContext.currentTime * 1000)
        }

      })
      audioContext.onWaiting(() => {
        audioContext.pause()
      })
      audioContext.onCanplay(() => {
        audioContext.autoplay && this.data.isPlaying && audioContext.play()
      })
      audioContext.onEnded(()=>{
        this.onItemNext()
      })
    }

  }
})