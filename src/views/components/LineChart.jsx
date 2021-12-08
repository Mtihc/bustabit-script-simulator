import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from "react-dom";
import * as d3 from 'd3';

import './LineChart.sass';

class LineChart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tooltipData: undefined
    }

    this.handleTooltipChange    = this.handleTooltipChange.bind(this)
    this.shouldUpdateLineChart  = this.shouldUpdateLineChart.bind(this)
    this.updateLineChart        = this.updateLineChart.bind(this)
  }

  componentDidMount () {
    this.container = ReactDOM.findDOMNode(this)
    this.updateLineChart()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.shouldUpdateLineChart(prevProps)) {
      this.updateLineChart()
    }
  }

  render () {
    const {
      viewBoxWidth, viewBoxHeight,
      data, xAccessor, yAccessor,
      crosshairEnabled, crosshairClassName,
      className = '', ...rest } = this.props
    return (
      <div {...rest} className={`LineChart ${className}`}>
        <svg preserveAspectRatio="xMinYMin meet"></svg>
        <div className="tooltip-container" style={{ visibility: (this.state.tooltipData ? undefined : 'hidden')}}>
          <Tooltip className="tooltip" data={this.state.tooltipData}/>
        </div>
      </div>
    )
  }

  handleTooltipChange ({ data }) {
    this.setState({ tooltipData: data })
  }

  shouldUpdateLineChart(prevProps) {
    const didChange = (propName) => {
      let prev = prevProps[propName],
          current = this.props[propName];
      return prev !== current || (Array.isArray(prev) && prev.length !== current.length);
    }
    const lineChartProps = [
      'viewBoxWidth', 'viewBoxHeight',
      'data', 'xAccessor', 'yAccessor'
    ]
    return lineChartProps.some(didChange)
  }

  updateLineChart () {
    d3LineChart({
      container: this.container,

      viewBoxWidth: this.props.viewBoxWidth,
      viewBoxHeight: this.props.viewBoxHeight,

      onTooltipChange: this.handleTooltipChange,

      data: this.props.data,
      xAccessor: this.props.xAccessor,
      yAccessor: this.props.yAccessor,

      crosshairEnabled: this.props.crosshairEnabled,
      crosshairClassName: this.props.crosshairClassName,
    })
  }
}

LineChart.propTypes = {
  viewBoxWidth: PropTypes.number.isRequired,
  viewBoxHeight: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  xAccessor: PropTypes.func.isRequired,
  yAccessor: PropTypes.func.isRequired,
  crosshairEnabled: PropTypes.bool,
  crosshairClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
}

class Tooltip extends Component {
  render () {
    const { data, ...wrapper} = this.props
    const { id, hash, bust, wager, payout, cashedAt, profit, balance } = data || {}
    return (
      <div  {...wrapper}>
        {data && (
          <table className="table is-hoverable is-transparent">
            <tbody>
              <tr>
                <th>Game ID</th>
                <td>{id}</td>
              </tr>
              <tr>
                <th>Hash</th>
                <td><input className="input" type="text" value={hash} readOnly={true}/></td>
              </tr>
              <tr>
                <th>Bust</th>
                <td>{`${bust}x`}</td>
              </tr>
              <tr>
                <th>Bet</th>
                <td>{wager === 0 ? 'Didn\'t play' : `${payout}x ${Math.round(wager)/100} bits`}</td>
              </tr>
              <tr>
                <th>Cashed At</th>
                <td>{cashedAt > 0 ? `${cashedAt}x` : '-'}</td>
              </tr>
              <tr>
                <th>Profit</th>
                <td className={profit === 0 ? 'has-text-warning' : (profit > 0 ? 'has-text-success' : 'has-text-danger')}>{Math.round(profit)/100} bits</td>
              </tr>
              <tr>
                <th>Balance</th>
                <td>{Math.round(balance)/100} bits</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    )
  }
}

function d3LineChart ({
  container,
  viewBoxWidth,
  viewBoxHeight,
  data,
  xAccessor,
  yAccessor,
  onTooltipChange,
  crosshairEnabled,
  crosshairClassName
}) {
  if (!container) {
    throw new TypeError('container should be an HTMLElement')
  }
  if (isNaN(viewBoxWidth) || isNaN(viewBoxHeight)) {
    throw new TypeError('viewBoxWidth and viewBoxHeight should be numbers')
  }
  if (!xAccessor || !yAccessor || typeof(xAccessor) !== 'function' || typeof(yAccessor) !== 'function') {
    throw new TypeError('xAccessor and yAccessor should be functions')
  }
  if (!data || !Array.isArray(data)) {
    throw new TypeError('data should be an array')
  }
  if (onTooltipChange && typeof(onTooltipChange) !== 'function') {
    throw new TypeError('onTooltipChange should be a function')
  }
  if (crosshairEnabled && crosshairClassName
    && typeof(crosshairClassName) !== 'string'
    && typeof(crosshairClassName) !== 'function') {
    throw new TypeError('crosshairClassName should be a string or a function')
  }

  container = d3.select(container)
  const svgElement = container.select('svg')
  if (!svgElement) { throw new TypeError('container should have a child <svg></svg>'); }
  let tooltipElement = container.select('.tooltip')

  svgElement
    .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

  const margin = {top: 20, right: 20, bottom: 110, left: 40},
        margin2 = {top: 430, right: 20, bottom: 30, left: 40},
        width = +viewBoxWidth - margin.left - margin.right,
        height = +viewBoxHeight - margin.top - margin.bottom,
        height2 = +viewBoxHeight - margin2.top - margin2.bottom;

  svgElement.selectAll('*').remove()

  const xScale  = d3.scaleLinear().range([0, width]),
        xScale2 = d3.scaleLinear().range([0, width]),
        yScale  = d3.scaleLinear().range([height, 0]),
        yScale2 = d3.scaleLinear().range([height2, 0]);

  const xAxis = d3.axisBottom(xScale),
        xAxis2 = d3.axisBottom(xScale2),
        yAxis = d3.axisLeft(yScale).tickFormat(function (n) { return (Math.round(n)/100) });

  // line
  var lineX = function (d) { return xScale(xAccessor(d)); }
  var lineY = function (d) { return yScale(yAccessor(d)); }
  var line = d3.line().x(lineX).y(lineY);

  var line2X = function (d) { return xScale2(xAccessor(d)); }
  var line2Y = function (d) { return yScale2(yAccessor(d)); }
  var line2 = d3.line().x(line2X).y(line2Y);

  var selected;
  var brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on("brush end", brushed);

  var zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on("zoom", zoomed);



  // create svg elements

  svgElement.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);


  var g_lines = svgElement.append("g")
      .attr("class", "data-lines")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("clip-path", "url(#clip)");

  var crosshairElement;
  if (crosshairEnabled) {
    crosshairElement = svgElement.append("g")
    crosshairElement.attr("class", "crosshair")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("clip-path", "url(#clip)");
    crosshairElement.append("line")
                    .attr("class", "crosshair-line crosshair-line-x")
    crosshairElement.append("line")
                    .attr("class", "crosshair-line crosshair-line-y")
  }

  var g_axes = svgElement.append("g")
      .attr("class", "axes")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svgElement.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


  var overlay = svgElement.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  withData(data)

  function withData(data) {

    xScale.domain(d3.extent(data, xAccessor));
    yScale.domain(d3.extent(data, yAccessor));
    xScale2.domain(xScale.domain());
    yScale2.domain(yScale.domain());

    g_axes.append("g")
          .attr("class", "axis axis-x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    g_axes.append("g")
          .attr("class", "axis axis-y")
          .call(yAxis);


    g_lines.append("path")
           .datum(data)
           .attr("class", "data-line")
           .attr("d", line);

    g_lines.selectAll(".data-point")
           .data(data)
           .enter().append("circle")
           .attr("class", function (d) { return "data-point " + (d.profit === 0 ? 'is-warning' : (d.profit > 0 ? 'is-success' : 'is-danger')) })
           .attr("cx", lineX)
           .attr("cy", lineY)
           .attr("r", 0)

    context.append("path")
           .datum(data)
           .attr("class", "data-line")
           .attr("d", line2);

    context.append("g")
           .attr("class", "axis axis-x")
           .attr("transform", "translate(0," + height2 + ")")
           .call(xAxis2);

    context.append("g")
           .attr("class", "brush")
           .call(brush)
           .call(brush.move, xScale.range());

    overlay.call(zoom);
    overlay.on("mousemove",mousemove)
      .on("mouseover", function () {
        if (tooltipElement) {
          tooltipElement.style("opacity", 1);
        }
        if (crosshairElement) {
          crosshairElement.style("opacity", 1);
        }
      })
      .on("mouseout", function () {
        if (tooltipElement) {
          tooltipElement.style("opacity", 0);
        }
        if (crosshairElement) {
          crosshairElement.style("opacity", 0);
        }
        g_lines.selectAll('.data-point')
         .classed('hover', false)
      });

    let bisect = d3.bisector(function (d, dx) { return dx - xAccessor(d) }).left

    function mousemove () {

      const mousex = d3.mouse(this)[0],
            dx = xScale.invert(mousex),
            i = bisect(data, dx),
            d0 = data[i - 1],
            d1 = data[i];

      let d;
      if (!d1) d = d0;
      else if (!d0) d = d1;
      else d = Math.abs(dx - xAccessor(d1)) > Math.abs(dx - xAccessor(d0)) ? d0 : d1;

      selected = d

      g_lines.selectAll('.data-point')
         .classed('hover', (d) => xAccessor(d) === xAccessor(selected))
      moveCrosshair(selected)
      moveTooltip(d)
    }
  }

  function moveTooltip (d) {
    if (tooltipElement && svgElement && container && viewBoxWidth && viewBoxHeight) {
      let svgMouse = d3.mouse(svgElement.node()),
          containerMouse = d3.mouse(container.node());

      let tooltipX, tooltipY;
      const tooltipOffset = {
        left: 25,
        top: 25
      }
      const tooltipSize = tooltipElement.node().getBoundingClientRect()
      if (svgMouse[0] > viewBoxWidth - tooltipSize.width) {
        tooltipX = containerMouse[0] - tooltipSize.width - tooltipOffset.left
      } else {
        tooltipX = containerMouse[0] + tooltipOffset.left
      }

      if (svgMouse[1] > viewBoxHeight - tooltipSize.height) {
        tooltipY = containerMouse[1] - tooltipSize.height - tooltipOffset.top
      } else {
        tooltipY = containerMouse[1] + tooltipOffset.top
      }
      /*
      if (overlayMouse[0] > width/2) {
        tooltipX = containerMouse[0] - tooltipElement.node().getBoundingClientRect().width - tooltipOffset.left
      } else {
        tooltipX = containerMouse[0] + tooltipOffset.left
      }
      if (overlayMouse[1] > height/2) {
        tooltipY = containerMouse[1] + tooltipOffset.top
      } else {
        tooltipY = containerMouse[1] - tooltipElement.node().getBoundingClientRect().height - tooltipOffset.top
      }*/


      tooltipElement
        .style('top', tooltipY + 'px')
        .style('left', tooltipX + 'px')

      if (onTooltipChange) {
        onTooltipChange({ data: d })
      }
    }
  }

  function moveCrosshair(d) {
    let xdomain = xScale.domain()
    let ydomain = yScale.domain()
    crosshairElement
      .select('.crosshair-line-x')
      .transition()
      .ease(d3.easeLinear)
      .attr('x1', lineX(d)).attr('y1', yScale(ydomain[0]))
      .attr('x2', lineX(d)).attr('y2', yScale(ydomain[1]))
      .duration(100);
    crosshairElement
      .select('.crosshair-line-y')
      .transition()
      .ease(d3.easeLinear)
      .attr('x1', xScale(xdomain[0])).attr('y1', lineY(d))
      .attr('x2', xScale(xdomain[1])).attr('y2', lineY(d))
      .duration(100);
  }


  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || xScale2.range();
    xScale.domain(s.map(xScale2.invert, xScale2));

    g_lines.select(".data-line")
      .attr("d", line);
    g_lines.selectAll(".data-point")
      .attr("cx", lineX)
      .attr("cy", lineY);

    if (selected) moveCrosshair(selected);

    g_axes.select(".axis-x").call(xAxis);
    svgElement.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    xScale.domain(t.rescaleX(xScale2).domain());

    g_lines.select(".data-line")
      .attr("d", line);
    g_lines.selectAll(".data-point")
      .attr("cx", lineX)
      .attr("cy", lineY)

    if (selected) moveCrosshair(selected);

    g_axes.select(".axis-x").call(xAxis);
    context.select(".brush").call(brush.move, xScale.range().map(t.invertX, t));
  }

}

export default LineChart
