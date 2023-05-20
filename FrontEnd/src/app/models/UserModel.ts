export class UserModel {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  profilePicture?: string;
  isTeacher?: boolean;
  coverPicture?: string;
  metaData?: string;
  isVerified = false;

  constructor(fromStorage?) {
    this.email = fromStorage?.email;
    this.password = fromStorage?.password;
    this.id = fromStorage?.id;
    this.lastName = fromStorage?.lastName;
    this.isTeacher = fromStorage?.isTeacher;
    this.firstName = fromStorage?.firstName;
    this.isTeacher = fromStorage?.isTeacher ?? false;
    this.profilePicture = fromStorage?.profilePicture;
    this.coverPicture = fromStorage?.coverPicture;
    this.metaData = fromStorage?.metaData;
    this.isVerified = fromStorage?.isVerified;
  }

  displayName(): string {
    return this.firstName + ' ' +  this.lastName;
  }

  initials(): string {
    if(this.firstName && this.lastName) {
      return this.firstName[0] + this.lastName[0];
    }
    return '***';
  }

  //methods of classes can only be used if classes is instantiated e.g. const user = new User()
  // not straight inheritance from json

}

