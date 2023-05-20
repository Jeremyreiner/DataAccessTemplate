import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, StorageService} from '../../services';
import {FileUploadData, Teacher, UserModel} from "../../models";

@Component({
  selector: 'confirm-subscribe-dialog',
  templateUrl: './confirm-subscribe-dialog.component.html'
})


export class ConfirmSubscribeDialogComponent {
  subscribed = false;
  isLoading = false;
  teacher: Teacher;

  constructor(
    private storage: StorageService,
    public dialogRef: MatDialogRef<ConfirmSubscribeDialogComponent>,
    public sheetRef: MatBottomSheetRef<ConfirmSubscribeDialogComponent>,
    public dialogService: DialogService,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data2: any,
  ){
    this.teacher = new UserModel(data?.teacher?.email? data.teacher : data2.teacher)
    this.subscribed = data.subscribed ?? data2.subscribed;
  }

  async close(subscribed: boolean) {
    await this.dialogService.close(this.dialogRef, this.sheetRef, subscribed, '');
  }

  async subscribe() {
    this.isLoading = true;
    this.subscribed = await this.api.subscribeToTeacher(this.teacher.email, this.storage.getUser().email);
    this.isLoading = false;
    await this.close(this.subscribed);
    await this.api.updateUi();
  }

  getSubscriptionStatus(teacherEmail: string) {
    this.subscribed = this.api.teachers.findIndex(a => a.email === teacherEmail) !== -1;
  }
}
