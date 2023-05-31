import {
  HYEventStore
} from 'hy-event-store'
const playlistStore = new HYEventStore({
  state: {
    playSongList: [],
    currentPlayIdx: 0
  }
})
export {
  playlistStore
}