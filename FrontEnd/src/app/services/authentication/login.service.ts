import {Injectable} from '@angular/core';
import {ApiService, StorageService} from '../../services';
import {RegisterModel, Token} from '../../models';
import {RouteNames} from '../../constants';
import {Router} from '@angular/router';
import {HttpResponse} from "@angular/common/http";

export interface LoginModel {
  email: string;
  password: string;
}

@Injectable(
)

export class LoginService {

  constructor(private api: ApiService, private storage: StorageService, private router: Router) {}

  async loginWithGoogle(credentials: string): Promise<boolean> {
    const body = {idToken: credentials};
    let user;
    await this.api.post<Token>('Authentication/LoginWithGoogle',body).then((res) => {
      user = res;
    });
    if(!user) { return false; }
    this.storage.setUser(user);
    return await this.handleLoginRoute(user.isTeacher, true);
  }

  async refreshToken(): Promise<boolean> {
    try {
      const token = this.storage.getToken();
      if(!token) { // user is not authenticated
        throw new Error('User is not authenticated');
      }
      let res;
      await this.api.post<any>('Authentication/RefreshToken', token).then((response) => {
        res = response.body;
      });
      if(!res) {
        throw new Error('Failed to refresh token');
      }
      const tempToken = new Token(res.user);
      this.storage.setUser(tempToken, true);
      this.storage.setToken(res.token);
      this.storage.setIsTeacher(res.isTeacher);

      return await this.handleLoginRoute(res.isTeacher);
    } catch(error) {
      console.log('navigate to login catch error');
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const bodyData: LoginModel = {
      email,
      password,
    };
    let user;
    await this.api.post<HttpResponse<Token>>('Authentication/Login', bodyData).then((res) => {
      user = res.body;
    });
    if(!user) {return false;}
    this.storage.setUser(user);
    return await this.handleLoginRoute(user.isTeacher, true);
  }

  async handleLoginRoute(isTeacher: boolean, dynamicNav = false): Promise<boolean> {
    if (dynamicNav) {
      await this.router.navigate([RouteNames.dynamicRoute(isTeacher)]);
    }
    await this.api.updateUi();
    // note that navigate to route needs to happen before this
    // so that there's no weird login glitch
    return true;
  }

  async registerUser(registerModel: RegisterModel): Promise<boolean> {
    if (registerModel) {
      let user;
      await this.api.post<HttpResponse<Token>>('Authentication/Register', registerModel).then((res) => {
        user = res.body;
      });
      if(!user) { return false; }
      this.storage.setUser(user);
      StorageService.firstTimeLogin = true;
      return await this.handleLoginRoute(user.isTeacher, true);
    }
  }

  async resetPassword(password: string, email: string, verificationCode: string): Promise<boolean> {
    const bodyData: LoginModel = {
      email,
      password,
    };
    let success;
    await this.api.post<HttpResponse<boolean>>(`Authentication/ResetPassword/${verificationCode}`, bodyData).then((res) => {
      success = res.body;
    });

    if (success) {
      await this.login(email, password);
    }
    return success;
  }

  async forgotPassword(email: string): Promise<boolean> {
    let success;
    await this.api.post<any>(`Authentication/ForgotPassword/${email}`, null).then((res) => {
      success = res.body;
    });
    setTimeout(() => {}, 0);
    return success;
  }

  async changePassword(password: string, newPassword: string): Promise<boolean> {
    const email = this.storage.getUser().email;
    const bodyData = {email, password, newPassword};
    let success;
    await this.api.post<any>('Authentication/ChangePassword', bodyData).then((res) => {
      success = res.body;
    });
    setTimeout(() => {}, 0);
    return success;
  }
}
