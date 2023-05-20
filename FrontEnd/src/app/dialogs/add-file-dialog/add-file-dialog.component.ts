import {Component, Inject, OnInit} from '@angular/core';
import {ApiService, DialogService, StorageService, ToastService} from '../../services';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FileUploadData} from '../../models';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-add-file-dialog',
  templateUrl: './add-file-dialog.component.html',
  styleUrls: ['./add-file-dialog.component.scss'],
})
export class AddFileDialogComponent implements OnInit {

  files: File[] = [];
  names: string[] = [];
  title = '';
  isLoading = false;
  fileType = '';
  fileSent = false;

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddFileDialogComponent>,
    public sheetRef: MatBottomSheetRef<AddFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileUploadData,
    private toastService: ToastService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.fileType = this.data.imageUpload? 'jpeg' : 'pdf';
  }

  onSelect(event: { addedFiles: any}) {
    this.names.push(event.addedFiles[0].name);
    if(this.files && this.files.length >=2) {
      this.onRemove(this.files[0]);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  async closeDialog() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, {event: 'fileSent', data: this.fileSent});
  }

  async sendFile() {
    this.isLoading = true;
    const formData = new FormData();
    for (const item of this.files) {
      formData.append('file', new Blob([item]), 'awsfile.pdf');
    }
    try {
      await this.api.uploadPdfBook(formData, this.storage.getUser().email, this.title, this.data.courseId).then((res) => {
        if (res.status === 200) {
          this.toastService.openToast(`File "${this.title}" uploaded successfully`, true);
        } else {
          throw new Error();
        }
      });
    } catch (error) {
      this.toastService.openToast(`Whoops! Something went wrong...`, false);
    }
    await this.closeDialog();
    this.isLoading = false;
  }

  async sendImage() {
    this.isLoading = true;
    const formData = new FormData();
    for (const item of this.files) {
      formData.append('file', new Blob([item]), 'bookcover.jpeg');
    }
    await this.api.postBookCover(formData, this.data.bookId);
    await this.closeDialog();
    this.isLoading = false;
  }

  async upload() {
    this.fileSent = true;
    if (this.data.imageUpload) {
      await this.sendImage();
      return;
    }
    await this.sendFile();
  }


}
