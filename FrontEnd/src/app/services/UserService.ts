import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {UserModel, Teacher, Student, Course, DataModel} from '../models';
import {ApiService} from './index';

@Injectable(
)
export class UserService {

  student: Student;
  teacher: Teacher;
  courses: Course[] = [];
  teachers: Teacher[] = [];
  data: DataModel;
  selectedTeacherProfile: Teacher;

  constructor(private api: ApiService) {
  }

  // async ngOnInit() {
  //   this.user = await this.api.getUser();
  // }

  async getCourses() {
    const url = 'Course';
    this.courses = await this.api.get(url);
    return this.courses;
  }

  async getSubscribedTeachers() {
    const url = 'Teacher';
    this.courses = await this.api.get(url);
    return this.courses;
  }

  async subscribeToTeacher(teacherMail: string, studentMail: string) {
    const url = 'Student/SubscribeToTeacher';
    const params = new HttpParams();
    params.set('teacherEMail',teacherMail );
    params.set('studentEMail',studentMail );
    const body = {teacherEmail: teacherMail, studentEmail: studentMail};
    await this.api.put(url, params);
  }


}
