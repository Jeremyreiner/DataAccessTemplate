import {Component, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';

@Component({
  selector: 'app-apex-line-chart',
  templateUrl: './apex-line-chart.component.html',
  styleUrls: ['./apex-line-chart.component.scss'],
})
export class ApexLineChartComponent {

  @ViewChild('chart', { static: false }) chart: ChartComponent;
  public chartOptions;
  public activeOptionButton = 'all';
  public updateOptionsData = {
    '1m': {
      xaxis: {
        min: new Date('28 Jan 2013').getTime(),
        max: new Date('27 Feb 2013').getTime()
      }
    },
    '6m': {
      xaxis: {
        min: new Date('27 Sep 2012').getTime(),
        max: new Date('27 Feb 2013').getTime()
      }
    },
    '1y': {
      xaxis: {
        min: new Date('27 Feb 2012').getTime(),
        max: new Date('27 Feb 2013').getTime()
      }
    },
    '1yd': {
      xaxis: {
        min: new Date('01 Jan 2013').getTime(),
        max: new Date('27 Feb 2013').getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };

  colors = ['#2563EB','#818CF8','#9095EF',];

  constructor() {
    this.initChart();
  }

  initChart(): void {
    this.chartOptions = {
      series: [
        {
          data
        }
      ],
      chart: {
        type: 'area',
        height: 200
      },
      // annotations: {
      //   yaxis: [
      //     {
      //       y: 30,
      //       borderColor: '#999',
      //       label: {
      //         text: 'Support',
      //         style: {
      //           color: '#fff',
      //           background: '#00E396'
      //         }
      //       }
      //     }
      //   ],
      //   xaxis: [
      //     {
      //       x: new Date('14 Nov 2012').getTime(),
      //       borderColor: '#999',
      //       label: {
      //         text: 'Rally',
      //         style: {
      //           color: '#fff',
      //           background: '#775DD0'
      //         }
      //       }
      //     }
      //   ]
      // },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime',
        min: new Date('01 Mar 2012').getTime(),
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      }
    };
  }

  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    this.chart.updateOptions(this.updateOptionsData[option], false, true, true);
  }
}



const data = [
  [1327618800000, 81],
  [2227618800001, 109],
  [3227612800001, 104],
  [5222612800001, 122],
];
