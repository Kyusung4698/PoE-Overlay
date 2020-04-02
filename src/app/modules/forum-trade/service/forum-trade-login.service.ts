import { Injectable } from '@angular/core';
import { BrowserService } from '@app/service';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private readonly browser: BrowserService,
    private readonly httpClient: HttpClient
  ) {
  }

  private readonly poeLoginURL = 'https://pathofexile.com/login';
  private readonly poeLogoutURL = 'https://pathofexile.com/logout';
  private readonly poeAccountNameURL = 'https://www.pathofexile.com/character-window/get-account-name';

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

  public getAccountName(): Observable<string> {
    return this.httpClient.get<{ accountName: string }>(this.poeAccountNameURL, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      map((it) => it.accountName),
      catchError(() => of('undefined')) //if there is no session id cookie
    )
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
