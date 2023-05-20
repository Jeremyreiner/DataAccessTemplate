import { Component, OnInit } from '@angular/core';
import {RouteNames} from '../../constants';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuthService, DialogService, StorageService} from '../../services';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-confirm-logout-dialog',
  templateUrl: './confirm-logout-dialog.component.html',
  styleUrls: ['./confirm-logout-dialog.component.scss'],
})
export class ConfirmLogoutDialogComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public storageService: StorageService,
    public router: Router,
    public dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>,
    public sheetRef: MatBottomSheetRef<ConfirmLogoutDialogComponent>,
    public dialogService: DialogService,
  ) {}

  ngOnInit() {}

  async close() {
    await this.dialogService.close(this.dialogRef,this.sheetRef, {event: 'close'});
  }

  async logout() {
    this.storageService.logout();
    await this.router.navigate([RouteNames.login]);
    await this.close();
  }
}
