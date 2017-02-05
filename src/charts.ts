/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as d3 from 'd3';
import * as d3_scale from 'd3-scale';
import * as d3_axis from 'd3-axis';
import * as d3_array from 'd3-array';
import * as d3_selection from 'd3-selection';

export interface Datum {
  x:number;
  y:number;
}

export interface DataSet {
  data: Datum[],
  fill?: string,
  stroke?: string,
}

export interface DataSets {
  [nane:string] : DataSet
}

function* datums_of_dataset(datasets:DataSets) : IterableIterator<Datum> {
  for (let dataset_name in datasets) {
    for (let d of datasets[dataset_name].data) {
      yield d;
    }
  }
}

export interface Bounds {
  x_min ?:number;
  x_max ?:number;
  y_min ?:number;
  y_max ?:number;
}

export interface ChartOptions {
  // draw_x_axis_at_0 ?: boolean;
  bounds ?: Bounds;
}

type DataGraphSelection =
    d3_selection.Selection<SVGElement,Datum,null,undefined>;

export class Chart {
  public width: number;
  public height: number;
  public data_graph: DataGraphSelection;
  public x: d3_scale.ScaleLinear<number, number>;
  public y: d3_scale.ScaleLinear<number, number>;
  public bounds ?: Bounds;

  constructor(width:number, height:number, public datassets : DataSets,
              parent: HTMLElement, public options ?: ChartOptions) {

    if (options) {
      this.bounds = options.bounds;
    }

    // console.log(`drawing data: ${JSON.stringify(datassets)}`);

    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width = width - margin.left - margin.right,
    this.height = height - margin.top - margin.bottom;

    var outer_svg = d3.select(parent).append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);

    var bound_rect =
      outer_svg.append('rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', '2');

    var main_g = outer_svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let data : Datum[] = [];
    for(let d of datums_of_dataset(datassets)) {
      data.push(d);
    }

    if(data.length === 0) {
      main_g.append('text').text('No data');
      return;
    }

    if(!this.bounds) {
      this.bounds = {}
    }
    if (typeof(this.bounds.x_min) === 'undefined') {
      this.bounds.x_min = d3_array.min(data, (d:Datum) => { return d.x; });
    }
    if (typeof(this.bounds.x_max) === 'undefined') {
      this.bounds.x_max = d3_array.max(data, (d:Datum) => { return d.x; });
    }
    if (typeof(this.bounds.y_min) === 'undefined') {
      this.bounds.y_min = d3_array.min(data, (d:Datum) => { return d.y; });
    }
    if (typeof(this.bounds.y_max) === 'undefined') {
      this.bounds.y_max = d3_array.max(data, (d:Datum) => { return d.y; });
    }

    this.x = d3.scaleLinear().range([0, this.width]);
    this.x.domain([this.bounds.x_min, this.bounds.x_max]);
    var xAxis = d3_axis.axisBottom(this.x).ticks(10);

    this.y = d3.scaleLinear().range([this.height, 0]);
    this.y.domain([this.bounds.y_min, this.bounds.y_max]);
    var yAxis = d3.axisLeft(this.y).ticks(10);

    main_g.append('g')            // Add the X Axis
       .attr('class', 'xaxis')
       .attr('transform', `translate(${0},${this.height})`)
       .call(xAxis);

    main_g.append('g')
       .attr('class', 'yaxis')
       .call(yAxis);

    // Adding x-axis through 0
    if(this.bounds.y_min < 0 && this.bounds.y_max > 0) {
      let xaxis_path = d3.path();
      // Note: we have to add 0.5 because the ticks on the left add that too.
      xaxis_path.moveTo(this.x(0), this.y(0) + 0.5);
      xaxis_path.lineTo(this.x(this.bounds.x_max), this.y(0) + 0.5);
      xaxis_path.closePath();
      main_g.append('path')
        .attr('d', xaxis_path.toString())
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', '1')
        .attr('stroke-dasharray', '5,5')
        .attr("fill", "none")
        .attr("stroke", "rgba(0,0,0,1)")
        .attr("stroke-width", 1);
    }

    this.data_graph = main_g.append('g') as DataGraphSelection;

    for (let name in datassets) {
      this.addData(name, datassets[name]);
    }
  }

  addData(name:string, dataset:DataSet) {
    this.data_graph.selectAll('g')
      .data(dataset.data)
      .enter()
      .append('circle')
      .attr('cx', (d) => { return this.x(d.x); })
      .attr('r', '3')
      .attr('cy', (d) => { return this.y(d.y); })
      .style('fill', dataset.fill ? dataset.fill : 'rgba(0,0,0,0.3)')
      .style('stroke', dataset.stroke ? dataset.stroke : 'rgba(0,0,0,0.3)')
      .style('stroke-width', '1')
      .append('text').text((d) => { return d.x + "," + d.y; });
  }

}
