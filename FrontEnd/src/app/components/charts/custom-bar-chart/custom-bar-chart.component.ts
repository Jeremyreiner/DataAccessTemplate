import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-bar-chart',
  templateUrl: './custom-bar-chart.component.html',
  styleUrls: ['./custom-bar-chart.component.scss'],
})
export class CustomBarChartComponent implements OnInit {

  @Input() data: number[] = [];

  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  ticks = [];

  constructor() { }

  ngOnInit() {
    this.createYAxis();
  }

  calcHeight(value): number {
    const max = Math.max(...this.data);
    return (value / max) * 100;
  }

  private createYAxis() {
    const max = Math.max(...this.data);
    const noOfTicks = 5;
    const tickInterval = Math.ceil(max / noOfTicks);
    this.ticks = Array.from({length: noOfTicks}, (_, i) => (i + 1) * tickInterval).reverse();
  }


}
