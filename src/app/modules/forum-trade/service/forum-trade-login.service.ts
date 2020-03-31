import { Injectable } from "@angular/core";
import { BrowserService } from "@app/service";
import { HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";


@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(
    private readonly browser: BrowserService,
    private readonly httpClient: HttpClient
  ) {
  }

  private readonly poeLoginURL = 'https://pathofexile.com/login';
  private readonly poeAccountNameURL = 'https://www.pathofexile.com/character-window/get-account-name';

  public openLoginPage() {
    const loginWin = this.browser.openAndGetWindow(this.poeLoginURL);

    loginWin.on('page-title-updated', (e, title) => {
      if (title.startsWith("View Profile - Path of Exile -")) { //successful login
        loginWin.close()
      }
    })
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
}
