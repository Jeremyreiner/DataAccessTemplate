import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services';
import {Book} from '../../models';
import {PreviewPdfDialogComponent} from '../../dialogs';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-book-tab',
  templateUrl: './book-tab.component.html',
  styleUrls: ['./book-tab.component.scss'],
})
export class BookTabComponent implements OnInit {

  books: Book[] = [];

  constructor(private api: ApiService, private dialog: MatDialog) { }

  async ngOnInit() {
   // this.books = await this.api.getBooks();
  }

  openBook(book: Book) {
    console.log('opening preview pdf dialog');
    const dialogRef = this.dialog.open(PreviewPdfDialogComponent, {
      data: {fileName: book.id},
      hasBackdrop: true,
      restoreFocus: false,
      height: '90%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
