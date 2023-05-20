import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  selectedButton = 'bg-slate-900 text-white border';
  otherButton = 'text-slate-200 bg-transparent hover:bg-slate-900/20 active:bg-slate-900/30';

  route = '';
  isStudent = false;
  topButtons = [];

  constructor(public router: Router) {
    this.route = router.url;
  }

  @Input() set buttons(buttons: string[]) {
    this.topButtons = buttons;
  }

  async navigate(route: string[]) {
    this.route = route[0].toLowerCase();
    await this.router.navigate([this.route]);
  }

}
