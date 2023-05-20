import {Component, OnInit} from '@angular/core';
import {RegisterModel} from '../../../models';
import {LoginService, StorageService} from '../../../services';
import {Router} from '@angular/router';
import {RouteNames, Regex} from '../../../constants';
import {EnvironmentVariables} from '../../../../environments';
import {CredentialResponse} from 'google-one-tap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerModel = new RegisterModel();
  isLoading = false;
  isTeacher = false;
  passwordText = [];
  errorMessage = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private storageService: StorageService,
    ) { }

  ngOnInit() {
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
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
        {
          theme: 'outline',
          size: 'large',
          width: 1000,
          text: 'signup_with',
          shape: 'pill',
          type:'standard',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          logo_alignment: 'left',
        },
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    //const success = await this.loginService.loginWithGoogle(response.credential);
  }

  async register() {
    if(!Regex.isValidEmail(this.registerModel.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
    if(!Regex.isValidPassword(this.registerModel.password)) {
      this.errorMessage =
        'Password must be at least 8 characters long and contain at least one uppercase letter and one number';
      return;
    }
    if(!this.registerModel.firstName || !this.registerModel.lastName) {
      this.errorMessage = 'Please enter a valid first and last name';
      return;
    }
    const success = await this.loginService.registerUser(this.registerModel);

  }

  async openLogin() {
    await this.router.navigate([RouteNames.login]);
  }

  async openLanding() {
    await this.router.navigate([RouteNames.landing]);
  }

  checkPasswordValid() {
    const strength = Regex.getPasswordStrength(this.registerModel.password);
    switch (strength) {
      case 1:
        this.passwordText = ['its like you`re trying to get hacked', 'orange'];
        break;
      case 2:
        this.passwordText = ['better i guess', 'darkgoldenrod'];
        break;
      case 3:
        this.passwordText = ['nice', 'green'];
        break;
    }
  }
}
