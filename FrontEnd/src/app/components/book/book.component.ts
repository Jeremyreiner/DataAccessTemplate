import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Book, Course, DialogConfig, FileUploadData} from '../../models';
import {DataService, DialogService, StorageService} from '../../services';
import {
  AddFileDialogComponent,
  DeleteBookDialogComponent,
  NotSubscribedWarningDialogComponent
} from '../../dialogs';
import {Constants} from '../../constants';
import {EReaderComponent} from '../../pages';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit{

  static readonly defaultImgPath = '../../assets/book-default-cover.png';

  @Output() deleted = new EventEmitter<boolean>();
  @Output() refreshBooks = new EventEmitter<boolean>();
  @Input() isDisabled = false;
  @Input() book: Book;

  @ViewChild('bookCover', { static: true }) bookCover: ElementRef;
  isTeacher = false;
  _isDisabled = false;
  imagePath: string;

  constructor(
    private dialog: MatDialog,
    private location: Location,
    public storage: StorageService,
    private dataService: DataService,
    private router: Router,
    private dialogService: DialogService,
  ) {}



  async ngOnInit() {
    this.isTeacher = this.storage.getUser().isTeacher;
    this.imagePath = Constants.guidNotEmpty(this.book.id)?
      Constants.cloudinaryUrl +  this.book.id + '.jpeg' :   BookComponent.defaultImgPath;
  }

  openEreader() {
    if (!this.isDisabled) {
      const currentUrl = this.router.url;
      // todo add course id to url param
      this.location.replaceState( `courses/book?=${this.book.id}`);
      this.dataService.bookId = this.book.id;
      const dialogRef = this.dialog.open(EReaderComponent, {
        width: '100vw',
        height: '100vh'
      });
      dialogRef.afterClosed().subscribe(() => this.location.replaceState(currentUrl));
    } else {
      const dialog = new DialogConfig(NotSubscribedWarningDialogComponent);
      this.dialogService.openDialog(dialog);
    }
  }

  openDeleteBookDialog(book: Book) {
    const dialog = new DialogConfig(DeleteBookDialogComponent, book);
    this.dialogService.openDialog(dialog);
  }

  loadDefaultImg(event: any) {
    event.target.src = BookComponent.defaultImgPath;
  }

  cancelClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  openImageUpload() {
    const fileUploadData = new FileUploadData();
    fileUploadData.bookId = this.book.id;
    fileUploadData.imageUpload = true;
    const dialogRef = this.dialog.open(AddFileDialogComponent, {
      data: fileUploadData,
      hasBackdrop: true,
      restoreFocus: false,
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result);
    });
  }
}


