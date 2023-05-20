import {Component, OnInit} from '@angular/core';
import {DialogConfig, Teacher, UniversityModel, UserModel} from '../../../models';
import {IDashboardComponent} from '../../idashboard';
import {ConfirmSubscribeDialogComponent, PaymentMethodRequiredDialogComponent} from "../../../dialogs";

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})

export class TeachersComponent extends IDashboardComponent implements OnInit {

  teacher: Teacher;
  currentUniversity: UniversityModel[];
  subscribed = false;
  viewMore = false;
  hasPaymentMethod: boolean;

  async ngOnInit() {
    super.ngOnInit();
    let cards;
    try {
      cards = await this.api.getAllCards();
    } catch (err) {
      cards = [];
    }
    this.hasPaymentMethod = Boolean(cards);
    let teacherEmail = '';
    this.activatedRoute.params.subscribe(async params => {
      teacherEmail = params.teacherEmail;
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    // above line waits for the teacher email to be retrieved from the url, async in next event loop
    this.teacher = await this.api.getTeacher(teacherEmail);
    this.teacher = new UserModel(this.teacher);
    // this.currentUniversity = await this.api.getUniversitiesByTeacher(teacherEmail);
    this.courses = await this.api.getCourseByTeacher(teacherEmail);
    this.getSubscriptionStatus(teacherEmail);
    this.isLoading = false;
  }

  openConfirmDialog(){
    const dialog = new DialogConfig(ConfirmSubscribeDialogComponent);
    dialog.data = { teacher: this.teacher, subscribed: this.subscribed };
    dialog.afterClosed = async (res) => {
      const message = res.data? `successfully subscribed to ${this.teacher.displayName()}`:'Subscription cancelled';
      this.subscribed = res.data;
      this.toastService.openToast(message, true);
    }
    this.dialogService.openDialog(dialog);
  }

  openPaymentMethodRequiredDialog() {
    const dialog = new DialogConfig(PaymentMethodRequiredDialogComponent);
    dialog.data = { teacher: this.teacher, subscribed: this.subscribed };
    dialog.afterClosed = () => {
      this.getSubscriptionStatus(this.teacher.email);
    }
    this.dialogService.openDialog(dialog);
  }

  getSubscriptionStatus(teacherEmail: string) {
    this.subscribed = this.api.teachers.findIndex(a => a.email === teacherEmail) !== -1;
  }
}
