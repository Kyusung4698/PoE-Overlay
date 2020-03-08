import { Injectable } from '@angular/core';
import * as localForage from 'localforage';

@Injectable({
    providedIn: 'root'
})
export class LocalForageProvider {
    public provide(): LocalForage {
        return localForage;
    }
}
