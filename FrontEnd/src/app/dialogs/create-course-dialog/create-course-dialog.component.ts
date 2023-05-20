import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PostCourse} from '../../models';
import {ApiService, DialogService, ToastService} from '../../services';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-create-course-dialog',
  templateUrl: './create-course-dialog.component.html',
  styleUrls: ['./create-course-dialog.component.scss'],
})

export class CreateCourseDialogComponent {

  postCourse = new PostCourse();
  courseCreated = false;
  isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreateCourseDialogComponent>,
    public sheetRef: MatBottomSheetRef<CreateCourseDialogComponent>,
    private api: ApiService,
    private toastService: ToastService,
    private dialogService: DialogService
  ) {
  }

  async createCourse() {
    this.isLoading = true;
    this.postCourse.teacher = null;
    await this.api.createCourse(this.postCourse);
    await this.api.updateUi();
    await this.close();
    this.courseCreated = true;
    this.isLoading = false;
  }

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, this.postCourse.title, 'courseCreated');
  }
}
