import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Constants, MetaDataProperties} from '../../constants';
import {ApiService, DialogService, StorageService, ToastService} from '../../services';
import {MatDialogRef} from '@angular/material/dialog';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

class ImageUpdateModel {
  color?: string;
  guid?: string;
}

@Component({
  selector: 'app-cover-dialog',
  templateUrl: './cover-dialog.component.html',
  styleUrls: ['./cover-dialog.component.scss'],
})
export class CoverDialogComponent implements OnInit {

  @Output() colorSelected = new EventEmitter<ImageUpdateModel>();

  colors = Constants.colors;
  files: File[] = [];
  fileAdded = false;
  uploading = false;

  constructor(
    private api: ApiService,
    public storage: StorageService,
    public dialogRef: MatDialogRef<CoverDialogComponent>,
    private sheetRef: MatBottomSheetRef<CoverDialogComponent>,
    private toastService: ToastService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {}

  async setCoverColor(color: string) {
    const user = this.storage.getUser();
    this.storage.setNewMetaDataProperty(MetaDataProperties.coverColor, color);
    if (Constants.guidNotEmpty(this.storage.getUser().coverPicture)) {
      await this.deletePhoto();
    }
    await this.api.updateMetaData(user.metaData);
  }

  onSelect(event: { addedFiles: any}) {
    this.files.push(...event.addedFiles);
    this.fileAdded = true;
  }

  async uploadPhoto() {
    this.uploading = true;
    const formData = new FormData();
    if (this.files.length) {
      for (const item of this.files) {
        formData.append('file', new Blob([item]), 'cover.jpeg');
      }
      await this.deletePhoto();
      if (formData.get('file') === null) {
        return;
      }
      const success = await this.api.postCoverPhoto(formData);

      const imageModel = new ImageUpdateModel();
      imageModel.guid = 'guidOnUser';
      this.colorSelected.emit(imageModel);
    }
    this.files = [];
    this.uploading = false;
    await this.close();
  }

  async deletePhoto(close = false) {
    this.storage.deleteCoverImg();
    await this.api.deleteCoverPhoto()
    await this.close();
  }

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef);
  }
}
