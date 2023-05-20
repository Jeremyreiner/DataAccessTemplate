import {SubscriptionModel} from '../models';

export class DataModel {
  firstName: string;
  lastName: string;
  email: string;
  isTeacher: string;
  subscribersCount: number;
  bookTitles: string[] = [];
  subscriptions: SubscriptionModel[] = [];
}
