import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-connect-account-dialog',
  templateUrl: './connect-account-dialog.component.html',
  styleUrls: ['./connect-account-dialog.component.scss'],
})
export class ConnectAccountDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConnectAccountDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public connectAccountUrl: string,
  ) { }

  ngOnInit() {}

}
