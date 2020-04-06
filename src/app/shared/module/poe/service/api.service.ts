import { Observable } from 'rxjs';
import { first, flatMap, map, toArray } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Language, League } from '@shared/module/poe/type';
import { LeaguesService } from '@shared/module/poe/service/leagues.service';
import { fromArray } from 'rxjs/internal/observable/fromArray';
import { Injectable } from '@angular/core';

export enum CharacterClass {
  Scion,
  Marauder,
  Ranger,
  Witch,
  Duelist,
  Templar
}

export interface CharacterData {
  name: string,
  league: League
  class: CharacterClass,
  ascendancyClass: 1 | 2 | 3 | 0,
  level: number,
  experience: number
}

export interface TabInfo {
  n: string,
  i: number,
  type: string //TODO add enum for all types
}

export interface Stash {
  numTabs: number,
  tabs: TabInfo[]
}

interface RawCharacterData {
  name: string,
  league: string,
  classId: number,
  ascendancyClass: 1 | 2 | 3 | 0,
  class: string,
  level: number,
  experience: number
}

interface AccountName {
  accountName: string
}

@Injectable({
  providedIn: 'root'
})
export class PoeAPIService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly leaguesService: LeaguesService
  ) {
  }

  private readonly poeAccountNameURL = 'https://www.pathofexile.com/character-window/get-account-name';
  private readonly poeCharacterURL = 'https://www.pathofexile.com/character-window/get-characters';
  private readonly poeStashURL = 'https://www.pathofexile.com/character-window/get-stash-items';

  public getAccountName(): Observable<string> {
    return this.httpClient.get<AccountName>(this.poeAccountNameURL, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(map((it) => it.accountName))
  }

  public getCharacters(): Observable<CharacterData[]> {
    return this.httpClient.get<RawCharacterData[]>(this.poeCharacterURL, {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      flatMap((it) => fromArray(it)),
      flatMap((it: RawCharacterData) => this.leaguesService.get(Language.English).pipe(
        flatMap((leagues) => fromArray(leagues)),
        first((league: League) => league.text == it.league),
        map<League, CharacterData>((league) => new class implements CharacterData {
          ascendancyClass: 1 | 2 | 3 | 0 = it.ascendancyClass;
          class: CharacterClass = it.classId;
          experience: number = it.experience;
          league: League = league;
          level: number = it.level;
          name: string = it.name;
        })
      )),
      toArray()
    )
  }

  public getCharacter(name: string): Observable<CharacterData | undefined> {
    return this.getCharacters().pipe(
      map((it) => it.find((character) => character.name == name))
    )
  }

  public getStashTabs(leagueId: string): Observable<TabInfo[]> {
    return this.getAccountName().pipe(
      flatMap((name) => this.httpClient.get<Stash>(this.poeStashURL, {
        withCredentials: true,
        responseType: 'json',
        params: new HttpParams()
          .set('league', leagueId)
          .set('tabs', '1')
          .set('accountName', name)
      })),
      map((it: Stash) => it.tabs)
    )
  }
}
