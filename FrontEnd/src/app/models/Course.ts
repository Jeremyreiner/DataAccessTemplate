import {Teacher, Book} from '../models';

export class Course {
  title?: string;
  courseId?: string;
  subject?: string;
  section?: string;
  description?: string;
  id?: string;
  teacher?: Teacher;
  publishings?: Book[] = [];

  constructor() {}
}

export class PostCourse {
  title?: string;
  courseId?: string;
  subject?: string;
  id?: string;
  teacher?: Teacher;
}

