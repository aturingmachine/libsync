import { LibSyncAboutInfo } from '@/models/about-info'

export class AboutService {
  static info: LibSyncAboutInfo

  static getAboutInfo(): Promise<LibSyncAboutInfo> {
    if (AboutService.info) {
      return Promise.resolve(AboutService.info)
    }

    return fetch('http://localhost:3000/api/about')
      .then(res => {
        return res.json()
      })
      .then(json => {
        AboutService.info = json.about
        return json.about
      })
  }
}
