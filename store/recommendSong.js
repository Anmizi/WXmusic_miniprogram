import {HYEventStore} from 'hy-event-store'
import {getPlayListDetail} from '../services/modules/music'
const recommendStore = new HYEventStore({
  state: {
    recommendSongs: []
  },
  actions:{
    fetchRecommendSongsAction(ctx){
      getPlayListDetail(3778678)
        .then(res=>{
          ctx.recommendSongs = res.playlist.tracks
        })
    }
  }
}) 

export {
  recommendStore
}