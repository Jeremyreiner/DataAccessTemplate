import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, StorageService, ToastService} from '../../services';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-bio-dialog',
  templateUrl: './bio-dialog.component.html',
  styleUrls: ['./bio-dialog.component.scss'],
})
export class BioDialogComponent implements OnInit {

  bio = '';
  isLoading: boolean;

  constructor(private storage: StorageService,
    public dialogRef: MatDialogRef<BioDialogComponent>,
    private toastService: ToastService,
    private api: ApiService,
    private dialogService: DialogService,
    private sheetRef: MatBottomSheetRef<BioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: string,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.bio = this.data;
    }
    this.isLoading = false;
  }

  async close(updated: boolean = false) {
    await this.dialogService.close(this.dialogRef, this.sheetRef, updated, 'updated');
  }

  async addBio() {
    this.isLoading = true;
    const user = this.storage.getUser();
    await this.api.updateBio(this.bio)
      .then(() => this.toastService.openToast(`Bio updated`, true))
      .catch(() => this.toastService.openToast(`Whoops, something went wrong...`, false, 3600 * 10));
    await this.close(true);
    this.isLoading = false;
  }
}
