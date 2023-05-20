import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService, StorageService} from '../../../services';
import {UserModel} from '../../../models';
import {RouteNames} from '../../../constants';
import {EnvironmentVariables} from '../../../../environments';
import {CredentialResponse} from 'google-one-tap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Output() userModel = new EventEmitter<UserModel>();

  username = '';
  password = '';
  loginFailed = false;
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private location: Location,
    public storageService: StorageService,
  ) { }

  ngOnInit() {
    this.location.replaceState('/'); // blocks user pressing back after login and taking them back to login screen

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: EnvironmentVariables.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        auto_select: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        cancel_on_tap_outside: true
      });
      const googleButton = document.getElementById('buttonDiv');
      const googleButtonParent = document.getElementById('buttonParent');
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        googleButton,
        {
          theme: 'outline',
          size: 'large',
          width: googleButtonParent.clientWidth,
          text: 'signin_with',
          shape: 'pill',
          type:'standard',
          logo_alignment: 'left',
        },
      );
        // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async login() {
    this.isLoading = true;
    if (this.username !== '' && this.password !== '') {
      this.loginFailed = !(await this.loginService.login(this.username, this.password));
      this.isLoading = false;
      return;
    }
    this.loginFailed = true;
    this.isLoading = false;
  }

  async handleCredentialResponse(response: CredentialResponse) {
    const success = await this.loginService.loginWithGoogle(response.credential);
  }

  async openRegistration() {
    await this.router.navigate([RouteNames.register]);
  }

  onSignIn(googleUser) {
    const idToken = googleUser.getAuthResponse().id_token;
    console.log(idToken);
  }


  async openWaitList() {
    await this.router.navigate([RouteNames.waitList]);
  }

  async openLanding() {
    await this.router.navigate([RouteNames.landing]);
  }

  async openForgotPassword() {
    await this.router.navigate([RouteNames.forgotPassword]);
  }
}
