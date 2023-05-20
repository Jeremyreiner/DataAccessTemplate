import {Component, Input, OnInit} from '@angular/core';
import {Course} from '../../models';
import {IDashboardComponent} from '../../pages';

@Component({
  selector: 'app-course-carousel',
  templateUrl: './course-carousel.component.html',
  styleUrls: ['./course-carousel.component.scss'],
})
export class CourseCarouselComponent extends IDashboardComponent implements OnInit {

  @Input() courses: Course[];
  @Input() simple: boolean;

  carouselId: string;

  ngOnInit() {
    super.ngOnInit();
    this.colors = this.repeatColors(this.courses.length + 5);
    this.carouselId = Math.random().toString();
    this.isLoading = false;
  }


}
