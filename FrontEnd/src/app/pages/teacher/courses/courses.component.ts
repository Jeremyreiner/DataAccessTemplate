import {Component, OnInit} from '@angular/core';
import {DeleteCourseDialogComponent, AddFileDialogComponent} from '../../../dialogs';
import {Course, Book, FileUploadData, DialogConfig} from '../../../models';
import {IDashboardComponent} from '../../idashboard';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent extends IDashboardComponent implements OnInit{

  course: Course;
  books: Book[]=[];
  initCourseId = '';
  isScrolled = false;

  async ngOnInit() {
    super.ngOnInit();
    if(!this.user.isVerified) {return;}
    this.activatedRoute.params.subscribe(async (params) => {
      this.initCourseId = params.id;
      if(this.initCourseId) {
        await this.update();
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.user = this.storage.getUser();
    await this.update();
    this.isLoading = false;
    document.addEventListener('scroll', (event) => {
      this.handleScroll(event);
    });
  }

  async update() {
    this.isLoading = true;
    this.course = await this.api.getCourseById(this.initCourseId);
    this.books = await this.api.getBooksByCourse(this.initCourseId);
    this.isLoading = false;
  }

  async openUploadBookDialog() {
    const fileUploadData = new FileUploadData();
    fileUploadData.courseId = this.initCourseId;
    fileUploadData.imageUpload = false;
    const dialog = new DialogConfig(AddFileDialogComponent, fileUploadData);
    dialog.afterClosed = (result) => {
      if (result?.data) {
        this.update();
      }

    };
    this.dialogService.openDialog(dialog);
  }

  openConfirmDeleteDialog(selectedCourse: Course) {
    const dialog = new DialogConfig(DeleteCourseDialogComponent, selectedCourse);
    this.dialogService.openDialog(dialog);
  }

  async deleteBook(book: Book) {
    await this.api.deleteBook(book.id);
    this.books = this.books.filter((b) => b.id !== book.id);
  }

  async handleScroll(event: Event) {
    this.isScrolled = await event.target['scrollTop'] > 10;
  }
}
