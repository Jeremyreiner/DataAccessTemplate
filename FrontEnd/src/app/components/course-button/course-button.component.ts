import {Component, Input, OnInit} from '@angular/core';
import {Course, Teacher, UserModel} from '../../models';
import {RouteNames} from '../../constants';
import {ApiService} from '../../services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-course-button',
  templateUrl: './course-button.component.html',
  styleUrls: ['./course-button.component.scss'],
})
export class CourseButtonComponent implements OnInit{

  @Input() course: Course;
  @Input() colors: string[];
  _teacher: Teacher;
  hover = false;
  myEmoji = '';
  // eslint-disable-next-line max-len
  buttonStyle = 'text-left flex items-start justify-center flex-col text-white p-4 rounded-xl h-36 w-64 active:scale-95 duration-150 shrink-0';

  constructor(private api: ApiService, private router: Router) { }

  get teacher(): Teacher {
    return this._teacher;
  }

  @Input() set teacher(teacher: Teacher) {
    this._teacher = new UserModel(teacher);
  };


  async ngOnInit() {
    if (this.course) {
      // const byTitle = await this.api.getEmojibySearch(this.course.title);
      // if (byTitle?.results) {
      //   this.myEmoji = byTitle.results[0]?.emoji;
      //   return;
      // }
      this.myEmoji = '📚';
    }
  }

  async dynamicNav() {
    if (this.course) {
      await this.router.navigate([RouteNames.courses, this.course.id]);
      return;
    }
    await this.router.navigate([RouteNames.teachers,this.teacher.email]);
  }
}
