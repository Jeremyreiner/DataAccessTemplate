import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services';
import {MatDialogRef} from "@angular/material/dialog";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
})
export class ChangePasswordDialogComponent implements OnInit {

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    public bottomSheetRef: MatBottomSheetRef<ChangePasswordDialogComponent>,
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (this.newPassword === this.confirmPassword) {
      const success = await this.loginService.changePassword(this.oldPassword, this.newPassword);
      this.message = success ? 'Password changed successfully' : 'Password change failed';
      return;
    }
    this.message = 'Passwords do not match';
  }

  close() {

  }
}
