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
    if (id) {
      playlistStore.dispatch('handlePlaySongAction', id)
    }
    //获取全局store数据
    playlistStore.onStates(this.data.stateKey, this.getStateData)
  },
  getStateData(data) {
    const {
      currentTime,
      durationTime,
      currentLyricIndex,
      id,
      currentMode,
      playSongList,
      lyric,
      lyricString,
      isFirstPlay,
      isPlaying,
      song,
      currentPlayIdx
    } = data
    if (currentTime) {
      const sliderValue = this.data.durationTime ? currentTime / this.data.durationTime * 100 : 0
      this.setData({
        currentTime,sliderValue
      })
    }
    if (durationTime) {
      this.setData({
        durationTime
      })
    }
    if (currentLyricIndex !== undefined) {
      this.updateLyric()
      this.setData({
        currentLyricIndex
      })
    }
    if (currentPlayIdx !== undefined) {
      this.setData({
        currentPlayIdx
      })
    }
    if (id) {
      this.setData({
        id
      })
    }
    if (currentMode !== undefined && currentMode >= 0) {
      this.setData({
        currentMode,
        currentModeName: modeMap[currentMode]
      })
    }
    if (playSongList && playSongList.length) {
      this.setData({
        playSongList
      })
    }
    if (lyric && lyric.length) {
      this.setData({
        lyric
      })
    }
    if (lyricString !== undefined) {
      this.setData({
        lyricString
      })
    }
    if (isFirstPlay !== undefined) {
      this.setData({
        isFirstPlay
      })
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying
      })
    }
    if (song) {
      this.setData({
        song
      })
    }
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
    playlistStore.dispatch('updateAudioContextAction', currentTime)
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
    playlistStore.dispatch('handlePlayOrPauseAction', !this.data.isPlaying)
  },
  onItemPrev() {
    this.onItemToggle(false)
  },
  onItemNext() {
    this.onItemToggle(true)
  },
  onItemToggle(isNext) {
    playlistStore.dispatch('handleToggleSong', isNext)
    this.setData({
      sliderValue: 0
    })
  },
  onChangePlayMode() {
    let index = this.data.currentMode + 1
    if (index === modeMap.length) {
      index = 0
    }
    playlistStore.setState('currentMode', index)
  },
  onUnload() {
    playlistStore.offStates(this.data.stateKey, this.getStateData)
  }
})