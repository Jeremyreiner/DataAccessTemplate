import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {RouteNames} from '../../../constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  firstPassword = '';
  secondPassword = '';

  email = '';
  verificationCode = '';
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.email = params.email;
      this.verificationCode = params.verificationCode;
    });
  }

  async resetPassword() {
    if (this.firstPassword === this.secondPassword) {
      const success  = await this.loginService.resetPassword(this.firstPassword, this.email, this.verificationCode);
      this.message = success ? 'Password reset successfully' : 'Password reset failed try request a new reset email';
      return;
    }
    this.message = 'Passwords do not match';
  }

  async navToForgotPw() {
    await this.router.navigate([RouteNames.forgotPassword]);
  }
}
