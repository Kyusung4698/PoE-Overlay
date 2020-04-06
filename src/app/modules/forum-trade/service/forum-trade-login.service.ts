import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly browser: BrowserService
  ) {
  }

  private readonly poeLoginURL = 'https://pathofexile.com/login';
  private readonly poeLogoutURL = 'https://pathofexile.com/logout';

  public openLoginPage() {
    const loginWin = this.browser.openAndGetWindow(this.poeLoginURL);

    return new Promise((resolve) =>
      loginWin.on('page-title-updated', (e, title) => {
        if (title.startsWith('View Profile - Path of Exile -')) { //successful login
          loginWin.close();
          resolve(void 0)
        }
      }))
  }

  public openLogoutPage(): Promise<void> {
    const win = this.browser.openAndGetWindow(this.poeLogoutURL);

    return new Promise((resolve) =>
      win.on('page-title-updated', (e, title) => {
        if (title == 'Path of Exile') {
          win.close();
          resolve(void 0)
        }
      })
    )
  }
}
