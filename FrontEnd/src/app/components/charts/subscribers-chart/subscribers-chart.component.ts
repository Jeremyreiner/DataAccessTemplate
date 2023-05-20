import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-subscribers-chart',
  templateUrl: './subscribers-chart.component.html',
  styleUrls: ['./subscribers-chart.component.scss'],
})
export class SubscribersChartComponent implements OnInit {

  @Input() data: number[] = [];
  //current subscribers
  @Input() subscribers: number[] = [];
  //trailing twelve months subscriptions
  @Input() ttmSubscriptions: number[] = [];

  constructor() { }

  ngOnInit() {}

}
