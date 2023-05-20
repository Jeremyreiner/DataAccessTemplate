import {Injectable} from '@angular/core';
import {LastReadBook, Token, UserModel} from '../models';
import {WelcomeDialogComponent} from '../dialogs';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from 'rxjs';
import {Constants} from '../constants';

@Injectable()
export class StorageService {

  static firstTimeLogin: boolean;
  static readonly tokenKey = 'TOKEN';
  private static readonly lastRead = 'LAST_READ';
  private static user: UserModel;
  rememberMe = true;
  private storage: Storage = window.localStorage; // sessionStorage; <--- you may switch between sessionStorage or
  private userSubject = new BehaviorSubject<UserModel>(StorageService.user);

  constructor(
    public dialog: MatDialog,
  ) {}

  setItem(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  setLastRead(lastRead: LastReadBook[]) {
    this.setItem(StorageService.lastRead, JSON.stringify(lastRead));
  }

  getLastRead(): LastReadBook[] {
    return JSON.parse(this.getItem(StorageService.lastRead)) ?? [];
  }

  getItem(key: string): string {
    return this.storage.getItem(key);
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  logout() {
    this.storage.clear();
  }

  setUser(token: Token, refreshToken = false) {
    //console.log('SET USER ' + token.user.firstName );
    // user only exists as variable in storage service, only token is stored in local storage
    if(!refreshToken) {
      token.user.isTeacher = token.isTeacher;
    }
    StorageService.user = new UserModel(token.user);
    if(token.token) {
      this.setToken(token.token);
    }
    this.updateUser(StorageService.user);
  }

  updateUser(user: UserModel) {
    StorageService.user = new UserModel(user);
    this.userSubject.next(user);
  }

  setToken(token: string) {
    // debug test if token is updated
    // const oldToken = this.getToken();
    // const eqality = oldToken === token;
    // console.log('Tokens are equal: ' + eqality);
    if (token) {
      this.setItem(StorageService.tokenKey, token);
    }
  }

  getUser(): UserModel {
    const user =  new UserModel(StorageService.user);
    return user.email? user : null;
  }

  getToken() {
    return this.getItem(StorageService.tokenKey);
  }

  setIsTeacher(isTeacher: boolean) {
    StorageService.user.isTeacher = isTeacher;
  }

  getUserObservable(): Observable<UserModel> {
    return this.userSubject.asObservable();
  }

  setNewMetaDataProperty(key: string, value: string) {
    const metaData = this.getUser().metaData;
    if (metaData) {
      const parsed = JSON.parse(metaData);
      parsed[key] = value;
      StorageService.user.metaData = JSON.stringify(parsed);
    } else {
      StorageService.user.metaData = JSON.stringify({[key]: value});
    }
    this.updateUser(StorageService.user);
  }

  deleteMetaDataProperty(key: string) {
    const metaData = this.getUser().metaData;
    if (metaData) {
      const parsed = JSON.parse(metaData);
      delete parsed[key];
      StorageService.user.metaData = JSON.stringify(parsed);
    }
    this.updateUser(StorageService.user);
  }

  deleteCoverImg() {
    StorageService.user.coverPicture = Constants.guidNull;
    this.updateUser(StorageService.user);
  }
}
