import {Component, OnInit} from '@angular/core';
import {IDashboardComponent} from '../../idashboard';

@Component({
  selector: 'app-courses-dashboard',
  templateUrl: './courses-dashboard.component.html',
  styleUrls: ['./courses-dashboard.component.scss'],
})
export class CoursesDashboardComponent extends IDashboardComponent implements OnInit{

  async ngOnInit() {
    super.ngOnInit();
    await super.initLastReadBooks();
    this.isLoading = false;
  }
}
