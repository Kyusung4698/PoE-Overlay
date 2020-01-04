import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Release } from '../schema/releases.type';

@Injectable({
    providedIn: 'root'
})
export class ReleasesHttpService {
    private readonly apiUrl = `${environment.github.baseUrl}/releases/latest`;

    constructor(private readonly httpClient: HttpClient) { }

    public getLatestRelease(): Observable<Release> {
        return this.httpClient.get<Release>(this.apiUrl).pipe(
            retry(3)
        );
    }
}
