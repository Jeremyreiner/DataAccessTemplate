import { Component, OnInit } from '@angular/core';
import {ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
    datasets: [
      {
        data: [94, 143, 177, 179, 70, 14, 60, 124, 170],
        backgroundColor: '#4f46e5',
        borderRadius:0,
        hoverBackgroundColor: '#433cc5',
      }
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.2)',
          borderColor: 'rgba(0,0,0,0.2)',
          borderDash: [2],
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  constructor() { }

  ngOnInit() {}

}
