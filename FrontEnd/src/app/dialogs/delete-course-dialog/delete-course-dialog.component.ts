import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, ToastService} from '../../services';
import {Course} from '../../models';
import {Router} from "@angular/router";
import {RouteNames} from "../../constants";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-delete-course-dialog',
  templateUrl: './delete-course-dialog.component.html',
  styleUrls: ['./delete-course-dialog.component.scss'],
})
export class DeleteCourseDialogComponent implements OnInit {
  course: Course;
  isLoading: boolean;
  message = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteCourseDialogComponent>,
    public bottomSheetRef: MatBottomSheetRef<DeleteCourseDialogComponent>,
    private dialogService: DialogService,
    private toastService: ToastService,
    private api: ApiService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Course,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data2: Course,
  ) {
    this.course = data.title ? data : data2;
  }

  ngOnInit() {
    this.isLoading = false;
  }

  async close(deleted: boolean = false) {
    await this.dialogService.close(this.dialogRef, this.bottomSheetRef, {event: 'courseDeleted', data: deleted});
  }

  async deleteCourse() {
    this.isLoading = true;
    const success = await this.api.deleteCourse(this.course.id);
    if (success) {
      this.api.courses = this.api.courses.filter(c => c.id !== this.course.id);
      await this.router.navigate([RouteNames.dashboard]);
    } else {
      this.message = 'Error deleting course';
    }
    await this.close(true);
    this.isLoading = false;
  }
}
