import {Component, OnInit} from '@angular/core';
import {IDashboardComponent} from '../../idashboard';

@Component({
  selector: 'app-teachers-dashboard',
  templateUrl: './teachers-dashboard.component.html',
  styleUrls: ['./teachers-dashboard.component.scss'],
})

export class TeachersDashboardComponent extends IDashboardComponent implements OnInit{

  async ngOnInit() {
    super.ngOnInit();
    this.colors = this.repeatColors(this.api.teachers.length + 5);
    await super.initLastReadBooks();
    this.isLoading = false;
  }
}
