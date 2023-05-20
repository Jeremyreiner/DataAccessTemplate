import {Injectable} from '@angular/core';
import {Observable, observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {
  Book,
  Course,
  PostCourse,
  SearchModel,
  Student,
  Teacher,
  UniversityModel,
  PaymentMethodModel,
  CardModel,
  Emoji,
  Accolade
} from '../models';
import {StorageService, UserInfoService, ToastService} from './index';
import {Constants} from '../constants';
import {KeyValue} from '@angular/common';
import {ConnectedUrl} from '../models/connectedUrl';

@Injectable()
export class ApiService {

  static baseUrl = 'api/';

  courses: Course[] = [];
  teachers: Teacher[] = [];
  myBooks: Book[] = [];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private userInfoService: UserInfoService,
    private toastService: ToastService,
  ) {}

  //region HTTP_BASE

  async post<T>(url: string, body: any, dontStringify = false, jpeg = false): Promise<T | null> {
    if (!dontStringify) {
      body = JSON.stringify(body);
    }
    const _headers = jpeg ? this.getMultipartHeaders(true) : this.getHeaders();

    return await this.http.post<T>(ApiService.baseUrl + url, body, {headers: _headers, observe: 'response'})
      .toPromise()
      .catch(err => {
        console.log(`Login Error: ${err}`);
        throwError(err || 'Server error');
        return null;
      });
  }

  async put<T>(url: string, body?: any): Promise<T | null> {
    return await this.http.put<T>(ApiService.baseUrl + url, JSON.stringify(body), {headers: this.getHeaders()})
      .toPromise()
      .catch(err => {
        console.log(`Login Error: ${err}`);
        throwError(err || 'Server error');
        return null;
      });
  }

  async get<T>(url: string, urlParams?: HttpParams): Promise<T> {
    const options = {headers: this.getHeaders(), params: urlParams};
    return await this.http.get<T>(ApiService.baseUrl + url, options)
      .toPromise()
      .catch(err => {
        if (err.status === 401 || err.status === 403) {
          throwError(err || 'Server error');
        }
        return null;
      });
  }

  /**
   * Get from other APIs (not ours), doesn't use base url that's the difference
   *
   * @param url
   * @param urlParams
   */
  async getExternal<T>(url: string): Promise<T> {
    return await this.http.get<T>(url)
      .toPromise()
      .catch(err => {
        if (err.status === 401 || err.status === 403) {
          throwError(err || 'Server error');
        }
        return null;
      });
  }

  async delete<T>(url: string, urlParams?: HttpParams): Promise<HttpResponse<T>> {
    const options = {headers: this.getHeaders(), params: urlParams, observe: 'response' as 'response'};
    return await this.http.delete<T>(ApiService.baseUrl + url, options).toPromise();
  }

  getMultipartHeaders(jpeg = false): HttpHeaders {
    let headers = new HttpHeaders();
    const contentType = jpeg ? 'application/octet-stream' : 'multipart/form-data';
    headers = headers.append('Content-Type', contentType);
    return headers;
  }

  getHeaders(): HttpHeaders { // to replace normal headers
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const token = this.userInfoService.getStoredTokenAgain();
    if (token !== null) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  //endregion

  //region UPDATE_UI
  async updateUi() {
    const user = this.storageService.getUser();
    if (user.isTeacher) {
      this.courses = await this.getCourseByTeacher(user.email);
      this.myBooks = await this.getBooksByTeacher(user.email);
    } else {
      this.teachers = await this.getTeachers(user.email);
      this.courses = await this.getCoursesByStudent(user.email);
      this.myBooks = await this.getBooksByStudent();
    }
  }
  //endregion

  //region FILE
  downloadFile(filename: string): any {
    const url = `File/DownloadPdf/${filename}`;
    if (filename) {
      return this.http.get(ApiService.baseUrl + url, {headers: this.getHeaders(), responseType: 'blob'})
        .pipe(
          map((result: any) => result)
        );
    }
  }

  // async uploadPdfBook(form: FormData, email: string, title: string, courseGuid: string): Promise<any> {
  //   if (form && email && title) {
  //     const formData: any = new FormData();
  //     formData.append('file', form.get('file'));
  //     let course = '';
  //     if (courseGuid) {
  //       course = `&courseGuid=${courseGuid}`;
  //     }
  //     return this.http.post(ApiService.baseUrl + `File?email=${email}&title=${title}${course}`, formData).pipe(catchError((err, caught) => {
  //       this.toastService.openToast(`error uploading ${title}`, false);
  //       throwError(err || 'Server error');
  //     })).subscribe(() => {
  //       this.toastService.openToast(`successfully uploaded ${title}`, true);
  //     });
  //   }
  // }

  async uploadPdfBook(form: FormData, email: string, title: string, courseGuid: string) {
    if (form && email && title) {
      const formData: any = new FormData();
      formData.append('file', form.get('file'));
      let course = '';
      if (courseGuid) {
        course = `&courseGuid=${courseGuid}`;
      }
      return this.http.post(ApiService.baseUrl + `File?email=${email}&title=${title}${course}`,
        formData, {observe: 'response'}).toPromise();
    }
  }

  async postBookCover(form: FormData, bookId: string) {
    const formData: any = new FormData();
    formData.append('file', form.get('file'));
    await this.http.post(ApiService.baseUrl + `File/PostBookCover/${bookId}`, formData)
      .toPromise()
      .catch(err => {
        throwError(err || 'Server error');
        return null;
      });
    return 'howdy';
  }

  /**
   * Returns a new guid for the new profile picture
   *
   * @param form
   */
  async postProfilePhoto(form: FormData) {
    const user = this.storageService.getUser();
    user.profilePicture = 'image-loading';
    this.storageService.updateUser(user);
    const formData: any = new FormData();
    formData.append('file', form.get('file'));
    let newGuid;
    const promise = await this.http.post(ApiService.baseUrl + `File/PostProfilePicture/${user.email}`, formData)
      .toPromise()
      .catch(err => {
        newGuid = err.error.text;
      });
    user.profilePicture = newGuid;
    this.storageService.updateUser(user);
    return newGuid;
  }

  async postCoverPhoto(form: FormData) {
    const user = this.storageService.getUser();
    const formData: any = new FormData();
    formData.append('file', form.get('file'));
    let newGuid;
    await this.http.post(ApiService.baseUrl + `File/PostCoverPicture/${user.email}`, formData)
      .toPromise().then(() => this.toastService.openToast(`Cover photo updated`, true))
      .catch(err => {
        this.toastService.openToast('Whoops! Something went wrong...', false);
        newGuid = err.error.text;
      });
    user.coverPicture = newGuid;
    this.storageService.updateUser(user);
    return newGuid;
  }

  async deleteProfilePhoto() {
    const user = this.storageService.getUser();
    if (user.email) {
      await this.get(`File/DeleteProfilePhoto/${user.email}`);
    }
  }

  //endregion

  //region Search

  /**
   *
   *
   * Searches a collection of teachers, courses and books for any indication of matches.
   *
   *
   *
   * @param search - could be potential match for first / last name, course / book title, subject, or book description .
   * @return teacher, course, book.
   */
  async search(search: string): Promise<SearchModel[]> {
    if (search) {
      return await this.get(`General/Search/${search}`);
    }
  }

  async searchUniversities(search: string): Promise<UniversityModel[]> {
    if (search) {
      return await this.get(`General/SearchUniversities/${search}`);
    }
  }

  //endregion

  //region GetBy

  async getTeacher(teacherEmail: string): Promise<Teacher> {
    /**
     * Retrieves teacher model from publifys Db.
     * TODO: Backend teacher is different from ui teacher. Must send same model.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @return {Teacher}
     */
    if (teacherEmail) {
      return await this.get(`Teacher/ByEmail/${teacherEmail}`);
    }
  }

  async getBookById(id: string): Promise<Book> {
    return await this.get(`Publish/ById/${id}`);
  }

  async getCourseById(courseId: string): Promise<Course> {
    if (courseId) {
      return await this.get(`Course/ById/${courseId}`);
    }
  }

  async getAccolades(email?: string, isTeacher?: boolean): Promise<Accolade[]> {
    const controller = isTeacher ? 'Teacher' : 'Student';
    email = email ?? this.storageService.getUser().email;
    if (email) {
      return await this.get(`${controller}/Accolades/${email}`);
    }
  }

  //endregion

  //region GetAllBy
  /**
   * Retrieves a list of teacher models by student email.
   * TODO: Suggestion to rename func name to teachersByStudents for more accurate usage.
   *
   * @param {string} studentEmail - Selected Student.
   * @return {Teacher[]}
   */
  async getTeachers(studentEmail?: string): Promise<Teacher[]> {
    if(!studentEmail) {
      studentEmail = this.storageService.getUser().email;
    }
    if (studentEmail) {
      return await this.get(`Teacher/AllByStudent/${studentEmail}`);
    }
  }

  async getStudentsByTeacher(teacherEmail: string): Promise<Student[]> {
    /**
     * Retrieves a list of student models by teacher email.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @return {Student[]}
     */
    if (teacherEmail) {
      return await this.get(`Student/AllByTeacher/${teacherEmail}`);
    }
  }

  async getStudentsByCourse(courseId: string): Promise<Student[]> {
    /**
     * Retrieves a list of student models by courseId.
     *
     * @param {string} courseId - Selected Course.
     * @return {Student[]}
     */
    if (courseId) {
      return await this.get(`Student/AllByCourse/${courseId}`);
    }
  }

  async getStudentsByPublish(publishId: string): Promise<Student[]> {
    /**
     * Retrieves a list of student models by publishId.
     *
     * @param {string} publishId - Selected Publish.
     * @return {Student[]}
     */
    if (publishId) {
      return await this.get(`Student/AllByPublish/${publishId}`);
    }
  }

  async getCoursesByStudent(studentEmail: string): Promise<Course[]> {
    /**
     * Retrieves a list of course models by student.
     *
     * @param {string} studentEmail - Selected Student.
     * @return {Course[]}
     */
    if (studentEmail) {
      return await this.get(`Course/ByStudent/${studentEmail}`);
    }
  }

  async getCourseByTeacher(teacherEmail: string): Promise<Course[]> {
    /**
     * Retrieves a list of course models by teacher.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @return {Course[]}
     */
    if (teacherEmail) {
      // console.log('teacher email: ' + teacherEmail);
      return await this.get(`Course/ByTeacher/${teacherEmail}`);
    }
  }

  async getCourses(teacherEmail: string) {
    /**
     * TODO: URL Does not exist. Change courses to one of API Call coursesBy..()
     */
    if (teacherEmail) {
      return await this.get(`Course/IndexCourses/${teacherEmail}`);
    }
  }

  async getBooksByCourse(courseId: string): Promise<Book[]> {
    /**
     * Retrieves a list of book models by course.
     *
     * @param {string} courseId - Selected Course.
     * @return {Book[]}
     */
    if (courseId) {
      return await this.get(`Publish/ByCourse/${courseId}`);
    }
  }

  async getBooksByTeacher(teacherEmail: string): Promise<Book[]> {
    /**
     * Retrieves a list of book models by teacher.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @return {Course[]}
     */

    if (teacherEmail) {
      const books = await this.get<Book[]>(`Publish/ByTeacher/${teacherEmail}`);
      if (teacherEmail === this.storageService.getUser().email) {
        this.myBooks = books;
      }
      return books;
    }
  }

  async getBooksByStudent(): Promise<Book[]> {
    /**
     * Retrieves a list of book models by student.
     * TODO: Suggestion: for continuous use of storage service, add email into parameter
     * or convert getAllBy so each func calls storage service. So functions are called with the same convention
     *
     * @return {Book[]}
     */
    return await this.get(`Publish/ByStudent/${this.storageService.getUser().email}`);
  }

  async getSubjects(): Promise<string[]> {
    /**
     * Retrieves all subjects.
     *
     * @return {string[]}
     */
    return await this.get('General/GetAllSubjects');
  }

  async getDegrees(): Promise<string[]> {
    /**
     * Retrieves all Degrees.
     *
     * @return {string[]}
     */
    return await this.get(`General/GetAllDegrees`);
  }

  async getUniversitiesByTeacher(teacherEmail: string): Promise<UniversityModel[]> {
    return await this.get(`Teacher/Universities/${teacherEmail}`);
  }

  //endregion

  //region Subscribe to / Unsubscribe from

  async subscribeToTeacher(teacherEmail: string, studentEmail: string): Promise<boolean> {
    /**
     * Subscribes / unSubscribes the student to a teacher.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @param {string} studentEmail - Selected Student.
     * @return true = subscribed, false = unsubscribed.
     */
    if (studentEmail && teacherEmail) {
      return await this.put(`Teacher/SubscribeTo/${teacherEmail}/${studentEmail}`);
    }
  }

  async getSubscriptionStatus(studentEmail: string, teacherEmail: string): Promise<boolean> {
    /**
     * TODO: Status Path does not exist. Upon subscription returns boolean response
     * Example: if teacher has students In place of querying DB for subscriptions.
     *  Check if student is in list of students. Aka Teacher.Student.Any(student => student.email == email)
     *  if returns true, you know student is subscribed to teacher. This goes with books, courses as well.
     *
     * @param {type} paramName - Description.
     * @return {type} Description.
     */
    if (studentEmail && teacherEmail) {
      return await this.get(`Teacher/SubscriptionStatus/${teacherEmail}/${studentEmail}`);
    }
  }

  async subscribeStudentToCourse(courseId: string): Promise<boolean> {
    /**
     * Subscribe / unSubscribes student to course.
     *
     * @param {string} courseId- Selected course.
     * @return true = subscribed, false = unsubscribed..
     */
    if (courseId) {
      const studentEmail = this.storageService.getUser().email;
      return await this.put(`Course/SubscribeTo/${studentEmail}/${courseId}`);
    }
  }

  async subscribePublishToCourse(courseId: string, publishId: string): Promise<boolean> {
    /**
     * Subscribes / unSubscribes the publish to a course.
     *
     * @param {string} courseId - Selected Course.
     * @param {string} publishId - Selected Publish.
     * @return true = subscribed, false = unsubscribed.
     */
    if (publishId && courseId) {
      return await this.put(`Course/SubscribePublish/${courseId}/${publishId}`);
    }
  }

  async subscribeToBook(bookId: string): Promise<boolean> {
    /**
     * Subscribes / Unsubscribes a student to a publish.
     *
     * @param {string} publishId Selected Publish
     * @return true = subscribed, false = unsubscribed.
     */
    if (bookId) {
      const studentEmail = this.storageService.getUser().email;
      return await this.put(`Publish/StudentSubscribeTo/${studentEmail}/${bookId}`);
    }
  }

  //endregion

  //region Update

  async updateBio(bio: string) {
    const user = this.storageService.getUser();
    const controller = user.isTeacher ? 'Teacher' : 'Student';
    if (bio) {
      await this.put(`${controller}/UpdateBio/${user.email}/${bio}`);
    }
  }

  async updateAccolades(accolade: Accolade) {
    const user = this.storageService.getUser();
    const controller = user.isTeacher ? 'Teacher' : 'Student';
    if (accolade) {
      await this.put(`${controller}/UpdateAccolades/${user.email}`, accolade);
    }
  }

  async updateTeacherDegrees(teacherEmail: string, degrees: string[]) {
    /**
     * Updates the Teachers Degree section,
     * resetting the list of degrees saved in the db to the
     * updated list of degrees from the front end.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @param {string[]} degrees - list of degrees
     * @return {type} null.
     */
    if (teacherEmail && degrees) {
      await this.put(`Teacher/UpdateDegrees/${teacherEmail}`, degrees);
    }
  }

  async updateTeacherSubjects(teacherEmail: string, subjects: string[]) {
    /**
     * Updates the Teachers Subjects section,
     * resetting the list of subjects saved in the db to the
     * updated list of subjects from the front end.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @param {string} Subjects - List of subjects.
     * @return {type} null.
     */
    if (teacherEmail && subjects) {
      await this.put(`Teacher/UpdateSubjects/${teacherEmail}`, subjects);
    }
  }

  /**
   *
   *
   * Updates the Students Degree section,
   *
   * resetting the list of degrees saved in the db to the
   *
   * updated list of degrees from the front end.
   *
   *
   *
   * @param studentEmail - Selected Student.
   * @param degrees - List of degrees
   * @return null.
   */
  async updateStudentDegrees(studentEmail: string, degrees: string[]) {
    if (studentEmail && degrees) {
      await this.put(`Student/UpdateDegrees/${studentEmail}`, degrees);
    }
  }

  /**
   *
   *
   * Updates the Students Subjects section,
   *
   * resetting the list of subjects saved in the db to the
   *
   * updated list of subjects from the front end.
   *
   *
   *
   * @param studentEmail - Selected Student.
   * @param Subjects - List of subjects.
   * @return null.
   */
  async updateStudentSubjects(studentEmail: string, subjects: string[]) {
    if(studentEmail && subjects) {
      await this.put(`Student/UpdateSubjects/${studentEmail}`, subjects);
    }
  }

  /**
   *
   *
   * Updates the Students University section,
   *
   * resetting the list of universities saved in the db to the
   *
   * updated list of universities from the front end.
   *
   *
   *
   * @param studentEmail - Selected Student.
   * @param universities - List of Universities.
   * @return null.
   */
  async updateStudentUniversities(studentEmail: string, universities: UniversityModel[]) {
    if (studentEmail && universities) {
      await this.put(`Student/UpdateUniversity/${studentEmail}`, universities);
    }
  }

  async incrementBookViews(bookId: string): Promise<void> {
    await this.post(`Publish/IncrementView/${bookId}`, null);
    const book = this.myBooks.find(b => b.id === bookId);
    if (book) {
      book.views++;
    }
  }

  async updateMetaData(json: string): Promise<boolean> {
    const user = this.storageService.getUser();
    return await this.put(`General/UpdateMetaData/${user.email}`, json);
  }

  //endregion

  //region Create

  //TODO Create Teacher Request

  //TODO Create Student Request

  async createCourse(course: PostCourse) {
    if (course) {
      const user = this.storageService.getUser();
      if (user.isTeacher) {
        await this.post(`Course/${user.email}`, course).then((res) => {
          // @ts-ignore
          if (res?.status === 200) {
            this.toastService.openToast(`Course "${course.courseId}" created successfully`, true);
          } else {
            this.toastService.openToast(`Whoops! Something went wrong...`, false);
          }
        });
      }
    }
  }

  //TODO Create Book Request

  //endregion

  //region Delete

  async deleteTeacher(teacherEmail: string) {
    /**
     * TODO how to pass string url in as param in delete.
     *
     * @param {string} teacherEmail - Selected Teacher.
     * @return {type} null.
     */
    if (teacherEmail) {
      let success;
      await this.delete(`Teacher/${teacherEmail}`).then((res) => {
        if(res.status === 200) {
          this.toastService.openToast(`Teacher deleted successfully`, true);
          success = res.body;
        } else {
          this.toastService.openToast(`Whoops! Something went wrong...`, false);
        }
      });
      setTimeout(() => {} , 0);
      return success;
    }
  }

  async deleteStudent(studentEmail: string) {
    /**
     * TODO how to pass string url in as param in delete.
     *
     * @param {string} studentEmail - Selected Student.
     * @return {type} null.
     */
    if (studentEmail) {
      let success;
      await this.delete(`Student/${studentEmail}`).then((res) => {
        if (res.status === 200) {
          this.toastService.openToast(`Student deleted successfully`, true);
          success = res.body;
        } else {
          this.toastService.openToast(`Whoops! Something went wrong...`, false);
        }
      });
      setTimeout(() => {} , 0);
      return success;
    }
  }

  /**
   * Deletes a course by id
   *
   * @param courseId - Selected Course.
   * @return boolean.
   */
  async deleteCourse(courseId: string): Promise<boolean> {
    if (!courseId || courseId.length !== Constants.guidNull.length) {return false;}

    let success;
    await this.delete<HttpResponse<boolean>>(`Course/${courseId}`)
      .then((res) => {
        if(res.status === 200) {
          success = res.body;
          this.toastService.openToast(`Course deleted successfully`, true);
        } else {
          this.toastService.openToast('Whoops! Something went wrong...', false);
        }
      });
      setTimeout(() => {}, 0);
      return success;
  }

  async deleteBook(publishId: string): Promise<boolean> {
    if (publishId) {
      let success;
      await this.delete(`File/${publishId}`).then((res) => {
        if(res.status === 200) {
          success = res.body;
          this.toastService.openToast(`File deleted successfully`, true);
        } else {
          this.toastService.openToast(`Whoops! Something went wrong...`, false);
        }
      });
      setTimeout(() => {} , 0);
      return success;
    }
    return false;
  }

  async getEmojibySearch(search: string): Promise<Emoji> {
    return await this.getExternal(`https://api.emojisworld.fr/v1/search?q=${search}&limit=1`);
  }

  async deleteCoverPhoto(): Promise<boolean> {
    const user = this.storageService.getUser();
    let success;
    await this.delete(`File/DeleteCoverPhoto/${user.email}`).then((res) => {
      if (res.status === 200) {
        this.toastService.openToast(`Cover updated successfully`, true);
        success = res.body;
      } else {
        this.toastService.openToast(`Whoops! Something went wrong...`, false);
      }
    });
    setTimeout(() => {} , 0);
    return success;
  }

  //endregion

  //region API CourseModel
  /*
    public string? Id { get; set; }
    public string Title { get; set; } = null!;
    public string CourseId { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public TeacherModel Teacher { get; set; } = null!;
  */
  // endregion

  //region API PublishModel
  /*
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string CoAuthors {get; set; } = null!;
    public TeacherModel Teacher { get; set; } = null!;
  */
  // endregion

  //region API StudentModel && TeacherModel
  /*
  public string Title { get; set; } = null!;
  public string FirstName { get; set; } = null!;
  public string LastName { get; set; } = null!;
  public string Email { get; set; } = null!;
  public string? Bio { get; set; }
  public string? Degrees{ get; set; }
  public string? Subjects { get; set; }
  public bool IsVerified { get; set; } = false;
  public string ProfilePicture { get; set; }
  */
  // endregion

  //region STRIPE
  async checkHasDetailsSubmitted(): Promise<boolean> {
    const email = this.storageService.getUser().email;
    return await this.get(`Stripe/CheckHasDetailsSubmitted/${email}`);
  }

  /**
   * DOES NOT WORK ON HTTP ONLY HTTPS
   */
  async createConnectedAccountLink(): Promise <string>{
    const email = this.storageService.getUser().email;

    const connectedUrl = await this.get<ConnectedUrl>(`Stripe/CreateConnectedAccountLink/${email}`);

    return connectedUrl?.url ?? '';
  }

  //TODO: this is broken
  async createPaymentMethod(model: PaymentMethodModel) {
    await this.post('Stripe/CreatePaymentMethodAsync', model)
      .then((res) => {
        // @ts-ignore
        if (res?.status === 200) {
          this.toastService.openToast(`Payment method added successfully`, true);
        } else {
          this.toastService.openToast(`Whoops! Something went wrong...`, false);
        }
      })
  }

  async getAllCards(): Promise<CardModel[]> {
    const email = this.storageService.getUser().email;
    return await this.get(`Stripe/GetAllCards/${email}`);
  }

  /**
   * Possible options: 'Email', 'DefaultPaymentMethodByLast4Digits', 'Name', 'Phone'
   *
   * @param options
   */
  async updateCustomer(options: KeyValue<any,string>){
   const email = this.storageService.getUser().email;
   await this.put(`Stripe/UpdateCustomer/${email}`, options);
  }

  async DetachPaymentMethod(last4Digits: string): Promise<void> {
    const email = this.storageService.getUser().email;
    await this.post(`Stripe/DetachPaymentMethod/${email}`, last4Digits)
      .then((res) => {
        // @ts-ignore
        if (res?.status === 200) {
          this.toastService.openToast(`Payment method removed successfully`, true);
        } else {
          this.toastService.openToast(`Whoops! Something went wrong...`, false);
        }
      });
  }
  //endregion

  //region EMAIL

  /**
   * Emails us their message
   *
   * @param subject: string
   * @param message: string
   * @param email: string
   */
  async contactUs({subject, message}, email?: string): Promise<boolean> {
    let success;
    if (!email) {
      email = this.storageService.getUser().email;
    }
    await this.post(`Email/ContactUs/${email}/${subject}`, message).then((res) => {
      // @ts-ignore
      if (res?.status === 200) {
        success = res;
        this.toastService.openToast(`Your message has been sent.`, true);
      } else {
        this.toastService.openToast(`Whoops! Something went wrong...`, false);
      }
    });
    return success;
  }

  async joinWaitList(email: string, firstName: string, lastName: string) {
    let success;
    await this.get(`Email/JoinWaitingList/${email}/${firstName}/${lastName}`).then(res => {
      // @ts-ignore
      if (res?.status === 200) {
        success = res;
        this.toastService.openToast(`You have been added to the waiting list!`, true);
      } else {
        this.toastService.openToast(`Whoops! Something went wrong...`, false);
      }
    });
    return success;
  }
  //endregion


}
