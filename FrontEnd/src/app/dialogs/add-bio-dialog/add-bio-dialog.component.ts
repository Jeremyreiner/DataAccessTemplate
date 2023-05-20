import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, StorageService} from '../../services';

@Component({
  selector: 'add-bio-dialog',
  templateUrl: './add-bio-dialog.component.html'
})

export class AddBioDialogComponent {

  bio = '';
  isLoading: boolean;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    public dialogRef: MatDialogRef<AddBioDialogComponent>,
    public sheetRef: MatBottomSheetRef<AddBioDialogComponent>,
    public dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data?: string,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data2?: string,
  ){}

  ngOnInit() {
    if (this.data) {
      this.bio = this.data;
    }
    this.isLoading = false;
  }

  async addBio() {
    this.isLoading = true;
    const user = this.storage.getUser();
    await this.api.updateBio(this.bio)
    await this.close();
    this.isLoading = false;
  }

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, this.bio, 'updated');
  }
}
