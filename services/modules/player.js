import {
  wxRequest
} from '../index'
export const getMusicDetail = (ids) => {
  return wxRequest.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}
export const getMusicLyric = (id) => {
  return wxRequest.get({
    url:"/lyric",
    data:{id}
  })
}