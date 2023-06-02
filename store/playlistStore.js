import {
  HYEventStore
} from 'hy-event-store'
import {
  lyricParse
} from '../utils/lyric-parse'
import {
  getMusicDetail,
  getMusicLyric
} from '../services/modules/player'
const audioContext = wx.createInnerAudioContext()
const playlistStore = new HYEventStore({
  state: {
    playSongList: [],
    currentPlayIdx: 0,
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
  },
  actions: {
    handlePlaySongAction(ctx, id) {
      ctx.id = id
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.currentLyricIndex = -1
      ctx.lyric = []
      ctx.lyricString = ''
      getMusicDetail(id)
        .then(res => {
          ctx.song = res.songs[0],
            ctx.durationTime = res.songs[0].dt
        })
      //歌词信息
      getMusicLyric(id)
        .then(res => {
          const lyricInfo = lyricParse(res.lrc.lyric)
          ctx.lyric = lyricInfo

        })

      //加载歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      //开启自动播放
      audioContext.autoplay = true
      //监听播放
      //第一次播放监听
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false
        audioContext.onTimeUpdate(() => {
          //更新时间
          ctx.currentTime = audioContext.currentTime * 1000
          if (!ctx.lyric.length) return;
          let index = ctx.lyric.findIndex(item => {
            return item.time > ctx.currentTime
          })
          index = (index === -1) ? ctx.lyric.length - 1 : index - 1
          if (index >= 0 && (index !== ctx.currentLyricIndex)) {

            ctx.lyricString = ctx.lyric[index].text
            ctx.currentLyricIndex = index
          }

        })
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        audioContext.onCanplay(() => {
          audioContext.autoplay && ctx.isPlaying && audioContext.play()
        })
        audioContext.onEnded(() => {
          const listLen = ctx.playSongList.length
          switch (ctx.currentMode) {
            case 0:
              let idx = ctx.currentPlayIdx + 1
              idx = idx === listLen ? 0 : idx
              break
            case 1:
              idx = Math.floor(Math.random() * listLen)
              while (idx === ctx.currentPlayIdx) {
                idx = Math.floor(Math.random() * listLen)
              }
              ctx.currentPlayIdx = idx
              break
          }
        })
      }
    },
    updateAudioContextAction(ctx, currentTime) {
      audioContext.seek(currentTime / 1000)
    },
    handlePlayOrPauseAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    handleToggleSong(ctx,isNext) {
      //判断模式
      //根据模式切换索引
      const len = ctx.playSongList.length
      let idx = ctx.currentPlayIdx
      switch (ctx.currentMode) {
        case 0:
          idx = isNext ? idx + 1 : idx - 1
          idx >= len && (idx = 0)
          idx < 0 && (idx = len - 1)
          break
        case 1:
          idx = Math.floor(Math.random()* len)
          while(idx === ctx.currentPlayIdx){
            idx = Math.floor(Math.random() * len)
          }
          break
      }
      console.log(idx);
      ctx.currentPlayIdx = idx
      const id = ctx.playSongList[idx].id
      playlistStore.dispatch('handlePlaySongAction',id)
    }
  }
})
export {
  playlistStore
}