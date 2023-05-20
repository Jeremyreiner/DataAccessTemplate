import {UserModel} from '../models';

export class Token {
  token: string;
  user: UserModel;
  isTeacher: boolean;
  constructor(user?: UserModel) {
    this.user = user;
  }
}


