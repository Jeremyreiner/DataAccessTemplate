import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services';

@Component({
  selector: 'search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
})

export class SearchDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    public sheetRef: MatBottomSheetRef<SearchDialogComponent>,
    public dialogService: DialogService,
  ){}

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, '', '');
  }
}
