import { Component, OnInit } from '@angular/core';
import {RouteNames} from '../../../constants';
import {Router} from '@angular/router';
import {LoginService} from '../../../services';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  message = '';
  spinner = false;

  constructor(private router: Router, private login: LoginService) { }

  ngOnInit() {}

  async openRegistration() {
    await this.router.navigate([RouteNames.register]);
  }

  async openLogin() {
    await this.router.navigate([RouteNames.login]);
  }

  async forgotPassword() {
    this.spinner = true;
    const success =  await this.login.forgotPassword(this.email);
    this.spinner = false;
    if (success) {
      this.message = `An email has been sent to ${this.email} with a link to reset your password`;
      return;
    }
    this.message = `No account was found with the email ${this.email}`;
  }
}
