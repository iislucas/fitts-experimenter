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

export interface TapPoint {
  x:number;
  y:number;
}

export interface DataSet {
  name: string;

  tapPoints: TapPoint[];
  tapFill: string;
  tapStroke: string;

  effectiveWidth: number;
  effectiveWidthFill: string;
  effectiveWidthStroke: string;
}

type DataGraphSelection =
    d3_selection.Selection<SVGElement,TapPoint,null,undefined>;

// A visualization of all hits on a target.
export class TapsViz {
  public width: number;
  public height: number;
  public data_graph: DataGraphSelection;
  public x_min : number;
  public x_max : number;
  public y_min : number;
  public y_max : number;
  public x : d3.ScaleLinear<number, number>;
  public y : d3.ScaleLinear<number,number>;

  constructor(public dataset : DataSet, parent: HTMLElement) {

    if(dataset.tapPoints.length === 0) {
      d3.select(parent).append('p').text('No taps to draw.');
      return;
    }

    this.x_min = d3_array.min(dataset.tapPoints, (d:TapPoint) => { return d.x; });
    this.x_max = d3_array.max(dataset.tapPoints, (d:TapPoint) => { return d.x; });
    this.y_min = d3_array.min(dataset.tapPoints, (d:TapPoint) => { return d.y; });
    this.y_max = d3_array.max(dataset.tapPoints, (d:TapPoint) => { return d.y; });

    let margin = 5;
    let max_r = Math.max(Math.abs(this.x_max), Math.abs(this.x_min),
                         Math.abs(this.y_max), Math.abs(this.y_min));
    this.width = max_r * 2 + margin * 2;
    this.height = max_r * 2 + margin * 2;

    this.x = d3.scaleLinear().range([margin + max_r + this.x_min, margin + max_r + this.x_max]);
    this.x.domain([this.x_min, this.x_max]);

    this.y = d3.scaleLinear().range([margin + max_r + this.y_min, margin + max_r + this.y_max]);
    this.y.domain([this.y_min, this.y_max]);

    let container = d3.select(parent).append('div');
    container.append('div').text(dataset.name);

    let outer_svg = container.append('svg')
      .attr('width', max_r * 2 + margin * 2)
      .attr('height', max_r * 2 + margin * 2);

    let bound_rect =
      outer_svg.append('rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', '2');

    let target_g = outer_svg.append('circle')
      .attr('r', '2')
      .attr('cx', this.x(0))
      .attr('cy', this.x(0))
      .style('fill', 'rgba(0, 0, 0, 1)')
      .style('stroke', 'rgba(0, 0, 0, 0.5)')
      .style('stroke-width', '1');

    let effective_width_g = outer_svg.append('circle')
      .attr('r', this.dataset.effectiveWidth)
      .attr('cx', this.x(0))
      .attr('cy', this.x(0))
      .attr('stroke-dasharray', '5,5')
      .style('fill', this.dataset.effectiveWidthFill)
      .style('stroke', this.dataset.effectiveWidthStroke)
      .style('stroke-width', '1');

    let main_g = outer_svg.append('g') as DataGraphSelection;
    main_g.selectAll('g')
      .data(dataset.tapPoints)
      .enter()
      .append('circle')
      .attr('r', '2.5')
      .attr('cx', (d) => { return this.x(d.x); })
      .attr('cy', (d) => { return this.y(d.y); })
      .style('fill', dataset.tapFill)
      .style('stroke', dataset.tapStroke)
      .style('stroke-width', '1');
  }
}