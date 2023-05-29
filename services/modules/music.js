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