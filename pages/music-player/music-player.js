// pages/music-player/music-player.js

import {
  playlistStore
} from '../../store/playlistStore'
const app = getApp()
const modeMap = ['order', 'random', 'repeat']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    song: {},
    currentTime: 0,
    durationTime: 0,
    lyric: [],
    lyricString: '',
    currentMode: 0,
    isFirstPlay: true,
    isPlaying: true,
    currentLyricIndex: -1,
    currentPlayIdx: 0,
    playSongList: [],
    // ----------------------
    currentModeName: modeMap[0],
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSlidering: false,
    scrollTop: 0,
    stateKey: ['playSongList', 'currentPlayIdx', 'id', 'song', 'currentTime', 'durationTime', 'lyric', 'lyricString', 'currentMode', 'isFirstPlay', 'isPlaying', 'currentLyricIndex']
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
    playlistStore.dispatch('handlePlaySongAction', id)
    //获取全局store数据
    playlistStore.onStates(this.data.stateKey, this.getStateData)
    //处理歌曲播放
    // this.handlePlaySong()
  },
  getStateData(data) {
    const {
      currentTime,
      durationTime,
      currentLyricIndex,
      id,
      currentMode
    } = data
    if (currentTime) {
      this.setData(currentTime)
    }
    if (durationTime) {
      this.setData({
        durationTime
      })
    }
    if (currentLyricIndex) {
      this.updateLyric()
      this.setData({
        currentLyricIndex
      })
    }
    if(id){
      this.setData({id})
    }
    if(currentMode !== undefined && currentMode >= 0){
      this.setData({currentMode,currentModeName:modeMap[currentMode]})
    }
    this.setData({
      ...data
    })
  },
  updateLyric() {
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
    playlistStore.dispatch('updateAudioContextAction',currentTime)
    this.updateLyric()
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
   playlistStore.dispatch('handlePlayOrPauseAction',!this.data.isPlaying)
  },
  
  onItemPrev() {
    this.onItemToggle(false)
  },
  onItemNext() {
    this.onItemToggle(true)
  },
  onItemToggle(isNext) {
    playlistStore.dispatch('handleToggleSong',isNext)
    this.setData({sliderValue:0})
  },
  onChangePlayMode() {
    let index = this.data.currentMode + 1
    if (index === modeMap.length) {
      index = 0
    }
    playlistStore.setState('currentMode',index)
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
      audioContext.onEnded(() => {
        this.onItemNext()
      })
    }

  },
  onUnload() {
    playlistStore.offStates(this.data.stateKey, this.getStateData)
  }
})