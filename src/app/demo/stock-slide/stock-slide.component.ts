import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import 'rxjs/add/operator/first';
import { StockJSON } from 'shared.model/stock-json.model';
import { DemoStoreService } from 'src/app/demo/demo-store.service';
import { Month } from 'src/app/shared/const/month.enum';

@Component({
  selector: 'app-stock-slide',
  templateUrl: './stock-slide.component.html',
  styleUrls: ['./stock-slide.component.css']
})
export class StockSlideComponent implements OnInit, AfterViewInit {
  data: Array<StockJSON>;
  endpoint: string;
  chartWidth: number;
  chartHeight: number;
  graph: any;
  parseTime: Function;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  xAxis: d3.Axis<number | Date | { valueOf(): number; }>;
  yAxis: d3.Axis<number | { valueOf(): number; }>;
  line: any;
  transistionTime = 1000;
  lastDateString: string;

  constructor(private demoStoreService: DemoStoreService) {
    this.parseTime = d3.timeParse('%d-%b-%y');
    this.endpoint = 'app/shared/fake/stock.json';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setupChart();
    this.readJSON();
  }

  setupChart() {
    const svg = d3.select('svg');
    const chartMargin = {top: 20, right: 20, bottom: 30, left: 50};
    this.chartWidth = +svg.attr('width') - chartMargin.left - chartMargin.right;
    this.chartHeight = +svg.attr('height') - chartMargin.top - chartMargin.bottom;
    this.graph = svg.append('g').attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);
    this.x = d3.scaleTime().rangeRound([0, this.chartWidth]);
    this.y = d3.scaleLinear().rangeRound([this.chartHeight, 0]);
    this.line = d3.line<StockJSON>()
      .x(d => this.x(this.parseTime(d.date)))
      .y(d => this.y(d.close));
  }

  readJSON() {
    this.demoStoreService.loadJSON(this.endpoint).first().subscribe(response => {
      this.data = JSON.parse(response);
      this.data = this.data.slice(this.data.length - 21, this.data.length - 1);
      this.setDomain();
      this.setAxis();
      this.initializeChart();
      this.tick();
    });
  }

  setDomain() {
    this.x
      .domain(d3.extent(this.data, d => this.parseTime(d.date)))
      .range([0, this.chartWidth]);
    this.y
      .domain(d3.extent(this.data, d => d.close))
      .range([this.chartHeight, 0]);
  }

  setAxis() {
    this.xAxis = d3.axisBottom(this.x)
      .ticks(d3.timeMonth.every(1));
    this.yAxis = d3.axisLeft(this.y);
  }

  initializeChart() {
    console.log('this.data', this.data.length);
    this.lastDateString = this.getDateString();

    this.graph.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);

    this.graph.append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .call(this.xAxis);

    this.graph.append('g')
      .attr('class', 'y-axis')
      .call(this.yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Price ($)');

    this.graph.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', '1.5')
      .attr('d', this.line);
  }

  getDateString(): string {
    return this.data[this.data.length - 1].date;
  }

  tick() {
    console.log('tick');
    console.log(this.lastDateString);
    let startTick = this.x(this.parseTime(this.data[0].date));
    const tickDistance = this.determineTickDistance();

    const lastDate: Date = this.parseTime(this.lastDateString);
    setInterval(
      () => {
        this.prepareData(lastDate);

        const stock: StockJSON = {
          close: 550 + Math.random() * 50,
          date: this.lastDateString
        };

        this.data.push(stock);
        startTick += tickDistance;
        this.updateLine(startTick);
        this.data.shift();
      },
      this.transistionTime
    );
  }

  determineTickDistance() {
    let tickDistance;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i + 1]) {
        const d0 = this.parseTime(this.data[i].date);
        const d1 = this.parseTime(this.data[i + 1].date);
        const days = d1.getDay() - d0.getDay();
        if (days === 1) {
          tickDistance =  this.x(d0) - this.x(d1);
          break;
        }
      }
    }
    return tickDistance;
  }

  prepareData(lastDate: Date) {
    const day = lastDate.getDay();
    // Skip weekend
    if (day === 5) {
      lastDate.setDate(lastDate.getDate() + 3);
    } else {
      lastDate.setDate(lastDate.getDate() + 1);
    }
    console.log(typeof(lastDate), lastDate);
    this.lastDateString = `${lastDate.getDate().toString()}-${this.formatMonth(lastDate)}-${this.formatYear(lastDate)}`;
    console.log(this.lastDateString);
  }

  formatMonth(lastDate): string {
    return Month[lastDate.getMonth().toString()];
  }

  formatYear(lastDate): string {
    return lastDate.getFullYear().toString().substring(2);
  }

  updateLine(_startTick) {
    this.setDomain();
    const svg = d3.select('svg');

    svg.select('.line')   // change the line
      .attr('d', this.line(this.data))
      .attr('transform', null);

    svg.select('.line')
      .transition()
      // .attr('transform', `translate(${startTick}, 0)`)
      .ease(d3.easeLinear)
      .duration(this.transistionTime);

    svg.select('.x-axis') // change the x axis
      .call(this.xAxis)
      .transition()
      .ease(d3.easeLinear)
      .duration(this.transistionTime);

    svg.select('.y-axis') // change the y axis
      .call(this.yAxis)
      .transition()
      .ease(d3.easeLinear)
      .duration(this.transistionTime);
  }
}
