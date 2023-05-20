import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService} from '../../services';
import {Teacher} from '../../models';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-not-subscribed-warning-dialog',
  templateUrl: './not-subscribed-warning-dialog.component.html',
  styleUrls: ['./not-subscribed-warning-dialog.component.scss'],
})
export class NotSubscribedWarningDialogComponent implements OnInit {
  teacher: any;

  constructor(
    public dialogRef: MatDialogRef<NotSubscribedWarningDialogComponent>,
    public bottomSheetRef: MatBottomSheetRef<NotSubscribedWarningDialogComponent>,
    private api: ApiService,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: Teacher,
  ) { }

  ngOnInit() {}

  async close() {
    await this.dialogService.close(this.dialogRef, this.bottomSheetRef, this.data);
  }

}
