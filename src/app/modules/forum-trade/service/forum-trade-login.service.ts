import { Injectable } from "@angular/core";
import { BrowserService } from "@app/service";


@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(
    private readonly browser: BrowserService
  ) {
  }

  private readonly poeLoginURL = 'https://pathofexile.com/login';

  public openLoginPage() {
    const loginWin = this.browser.openAndGetWindow(this.poeLoginURL);

    loginWin.on('page-title-updated', (e, title) => {
      if (title.startsWith("View Profile - Path of Exile -")) { //successful login
        loginWin.close()
      }
    })
  }
}
