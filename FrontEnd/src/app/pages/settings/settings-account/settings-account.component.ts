import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../../services';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss'],
})
export class SettingsAccountComponent implements OnInit {

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';

  constructor(private loginService: LoginService) { }

  ngOnInit() {}

  async onSubmit() {
    if (this.newPassword === this.confirmPassword) {
      const success = await this.loginService.changePassword(this.oldPassword, this.newPassword);
      this.message = success ? 'Password changed successfully' : 'Password change failed';
      return;
    }
    this.message = 'Passwords do not match';
  }
}
