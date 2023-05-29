import {
  wxRequest
} from '../index'
export const getMusicBanner = (type = 0) => {
  return wxRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}
export const getPlayListDetail = (id) => {
  return wxRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}
export const getHotPlaylist = (cat = '全部', limit = 6, offset = 0) => {
  return wxRequest.get({
    url: '/top/playlist/',
    data: {
      cat,
      limit,
      offset
    }
  })
}
export const getAllPlayList = () => {
  return wxRequest.get({
    url:'/playlist/hot'
  })
}