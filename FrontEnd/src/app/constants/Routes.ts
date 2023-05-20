export class RouteNames {
  static readonly home = '';
  static readonly metrics = 'metrics';
  static readonly settings = 'settings';
  static readonly settingsProfile = 'settings/profile';
  static readonly settingsPayment = 'settings/payment';
  static readonly settingsContact = 'settings/contact';
  static readonly settingsPrivacy = 'settings/privacy';
  static readonly settingsAccount = 'settings/account';
  static readonly dashboard = 'dashboard';
  static readonly courses = 'courses';
  static readonly coursesWithParam = 'courses/:id';
  static readonly course = 'course';
  static readonly studentDashboard = 'student-dashboard';
  static readonly teachersWithParam = 'teachers/:teacherEmail';
  static readonly teachers = 'teachers';
  static readonly login = 'login';
  static readonly register = 'register';
  static readonly eReader = 'EReader';
  static readonly profile = 'profile';
  static readonly landing = 'landing';
  static readonly waitList = 'waiting-list';
  static readonly forgotPassword = 'forgot-password';
  static readonly resetPassword = 'Authentication/ResetPassword/:email/:verificationCode';
  static readonly pageNotFound = 'page-not-found';
  static readonly verifyEmail = 'Email/VerifyEmail/:email/:verificationCode';
  static readonly publishById = 'Publish/ById/{GUID}';
  static readonly accountConnected = 'settings/payment/account-connected';
  static readonly emailVerificationPending = 'verify-email';


  // https://publifysolutions.com/Authentication/ResetPassword/benjaminbrookarsh@gmail.com/f72f9a3d-3390-49d9-9b40-9c40bcba077a

  static dynamicRoute(isTeacher: boolean) {
    return  isTeacher ? RouteNames.dashboard : RouteNames.studentDashboard;
  }
}

export class MetaDataProperties {
  static readonly coverColor = 'coverColor';
}



