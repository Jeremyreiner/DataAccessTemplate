import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {StorageService} from '../../services';

@Injectable()
export class AuthService {

  constructor(public jwtHelper: JwtHelperService, private storage: StorageService) {}

  public isAuthenticated(): boolean {
    const token = this.storage.getToken();
    if (token === undefined) {
      return false;
    }
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
