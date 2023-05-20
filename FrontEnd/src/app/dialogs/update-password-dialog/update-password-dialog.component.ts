import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService, LoginService} from '../../services';

@Component({
  selector: 'update-password-dialog',
  templateUrl: './update-password-dialog.component.html'
})

export class UpdatePasswordDialogComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<UpdatePasswordDialogComponent>,
    public sheetRef: MatBottomSheetRef<UpdatePasswordDialogComponent>,
    public dialogService: DialogService,
  ){}

  async onSubmit() {
    if (this.newPassword === this.confirmPassword) {
      const success = await this.loginService.changePassword(this.oldPassword, this.newPassword);
      this.message = success ? 'Password changed successfully' : 'Password change failed';
      return;
    }
    this.message = 'Passwords do not match';
  }

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, '', '');
  }
}
