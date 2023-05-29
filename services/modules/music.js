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
    url:'/playlist/detail',
    data:{id}
  })
}