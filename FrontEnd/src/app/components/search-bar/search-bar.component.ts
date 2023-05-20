import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../services';
import {SearchModel} from '../../models';
import {RouteNames} from '../../constants';
import {Location} from '@angular/common';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {

  searchTerm = '';
  searchResults: SearchModel[] = [];

  @Output() select = new EventEmitter();

  constructor(
    private api: ApiService,
    private location: Location,
    private router: Router,
  ) {}

  async searchTeachers(search: string) {
    if (search) {
      this.searchResults = await this.api.search(this.searchTerm);
      return;
    }
    this.searchResults = [];
    if(search !== '') {
      setTimeout(() => {
        this.select.emit();
      }, 300);
    }
  }

  iconName(item1: string): string {
    switch (item1) {
      case 'course':
        return 'collections_bookmark';
      case 'teacher':
        return 'person';
      case 'publish':
        return 'import_contacts';
      default:
        return 'import_contacts';
    }
  }

  dynamicName(item2: any): string {
    if (item2.firstName || item2.lastName) {
      return `${item2.firstName} ${item2.lastName}`;
    }
    return item2.title;
  }

  async determineRoute(result: SearchModel) {
    let route;
    switch (result.item1) {
      case 'teacher':
        route = [RouteNames.teachers,result.item2.email];
        break;
      case 'course':
        route = [RouteNames.dashboard,result.item2.id];
        break;
      case 'publish':
        // todo navigate to book page
        route = `whenLifeGivesYouLemonsMakeBooks`;
        break;
    }
    await this.router.navigate(route);
  }
}
