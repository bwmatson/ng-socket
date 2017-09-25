import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/first';

import { Stock } from 'shared.model/stock.model';
import { DemoStoreService } from 'src/app/demo/demo-store.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, AfterViewInit, OnDestroy {
  stockSubscription: Subscription;
  data: Array<Stock>;
  chartWidth: number;
  chartHeight: number;
  graph: any;
  parseTime: Function;
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
  xAxis: d3.Axis<number | Date | { valueOf(): number; }>;
  yAxis: d3.Axis<number | { valueOf(): number; }>;
  line: any;
  pointsToDisplay = 50;
  transistionTime = 1000;
  haveData = false;
  pageReady = false;
  chartSetup = false;
  lastDateString: string;

  constructor(private demoStoreService: DemoStoreService) {
    this.parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
  }

  ngOnInit() {
    this.stockSubscription = this.demoStoreService.stockConnect().subscribe(stock => {
      console.log('component receive', stock);
      if (!this.data) {
        this.backFillChart(stock);
      }
      this.data.push(stock);
      if (this.data.length >= this.pointsToDisplay) {
        this.data.shift();
      }
      this.haveData = true;
      this.setupChart();
      this.updateLine();
    });
  }

  ngAfterViewInit() {
    this.pageReady = true;
    this.setupChart();
  }

  ngOnDestroy() {
    if (this.stockSubscription) {
      this.stockSubscription.unsubscribe();
    }
    this.demoStoreService.stockDisconnect();
  }

  backFillChart(stock: Stock) {
    this.data = new Array<Stock>();
    for (let i = 0; i < this.pointsToDisplay; i++) {
      const dateTime = new Date(stock.dateTime);
      dateTime.setSeconds(dateTime.getSeconds() - (this.pointsToDisplay - i));
      const emptyStock = new Stock();
      emptyStock.dateTime = dateTime.toISOString();
      this.data.push(emptyStock);
    }
  }

  setupChart() {
    if (this.pageReady && this.haveData && !this.chartSetup) {
      this.chartSetup = true;
      console.log('setupChart');
      this.setChartVariables();
      this.setDomain();
      this.setAxis();
      this.insertElementsIntoSVG();
    }
  }

  setChartVariables() {
    const svg = d3.select('svg');
    const chartMargin = {top: 20, right: 20, bottom: 30, left: 50};
    this.chartWidth = +svg.attr('width') - chartMargin.left - chartMargin.right;
    this.chartHeight = +svg.attr('height') - chartMargin.top - chartMargin.bottom;
    this.graph = svg.append('g').attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);
    this.x = d3.scaleTime().rangeRound([0, this.chartWidth]);
    this.y = d3.scaleLinear().rangeRound([this.chartHeight, 0]);
    this.line = d3.line<Stock>()
      .defined(d => typeof(d.close) !== 'undefined' ? true : false)
      .x(d => this.x(this.parseTime(d.dateTime)))
      .y(d => this.y(d.close));
  }

  setDomain() {
    this.x
      .domain(d3.extent(this.data, d => this.parseTime(d.dateTime)))
      .range([0, this.chartWidth]);
    this.y
      .domain(d3.extent(this.data, d => d.close))
      .range([this.chartHeight, 0]);
  }

  setAxis() {
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
  }

  insertElementsIntoSVG() {
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

  updateLine() {
    this.setDomain();
    const svg = d3.select('svg');

    svg.select('.line')   // change the line
      .attr('d', this.line(this.data))
      .attr('transform', null);

    svg.select('.x-axis') // change the x axis
      .call(this.xAxis);

    svg.select('.y-axis') // change the y axis
      .call(this.yAxis);
  }
}
