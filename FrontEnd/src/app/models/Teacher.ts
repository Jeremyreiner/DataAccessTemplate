import {Achievement, Course} from '../models';
import {UserModel} from "./UserModel";

export class Teacher extends UserModel{
  title?: string;
  courses?: Course[] = [];
  description?: string;
  bio?: string;
  affiliatedUniversities?: string;
  degrees?: Achievement[] = [];
  subjects?: string[];

  constructor(user?: UserModel) {
    super();
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
    this.email = user?.email;
  }
}

