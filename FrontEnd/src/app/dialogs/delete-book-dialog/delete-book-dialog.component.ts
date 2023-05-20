import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, ToastService} from '../../services';
import {Book} from '../../models';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-delete-book-dialog',
  templateUrl: './delete-book-dialog.component.html',
  styleUrls: ['./delete-book-dialog.component.scss'],
})
export class DeleteBookDialogComponent implements OnInit {
  book: Book;
  isLoading: boolean;

  @Output() bookDeleted = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteBookDialogComponent>,
    public bottomSheetRef: MatBottomSheetRef<DeleteBookDialogComponent>,
    private dialogService: DialogService,
    private toastService: ToastService,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Book,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data2: Book,
  ) {
    this.book = data?.title ? data : data2;
  }

  ngOnInit() {
    this.isLoading = false;
  }

  async close(deleted: boolean = false) {
    await this.dialogService.close(this.dialogRef, this.bottomSheetRef, {event: 'bookDeleted', data: deleted});
  }

  async deleteBook() {
    this.isLoading = true;
    await this.api.deleteBook(this.book.id);
    await this.close(true);
    this.isLoading = false;
  }

}
