import React, { useState } from 'react';
import './Chart.scss';

const Chart = (props) => {
  const [hoverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const { svgHeight, svgWidth } = props;
  // GET X & Y || MAX & MIN
  const getX = () => {
    const { data } = props;
    return {
      min: data[0].x,
      max: data[data.length - 1].x,
    };
  };

  const getY = () => {
    const { data } = props;
    return {
      min: data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y),
      max: data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y),
    };
  };
  // GET SVG COORDINATES
  const getSvgX = (x) => {
    const { svgWidth, yLabelSize } = props;
    return yLabelSize + (x / getX().max) * (svgWidth - yLabelSize);
  };

  const getSvgY = (y) => {
    const { svgHeight, xLabelSize } = props;
    const gY = getY();
    return (
      ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) /
      (gY.max - gY.min)
    );
  };
  // BUILD SVG PATH
  const makePath = () => {
    const { data, color } = props;
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data
      .map((point, i) => {
        return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
      })
      .join('');

    return (
      <path className='linechart_path' d={pathD} style={{ stroke: color }} />
    );
  };
  // BUILD SHADED AREA
  const makeArea = () => {
    const { data } = props;
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data
      .map((point, i) => {
        return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
      })
      .join('');

    const x = getX();
    const y = getY();
    pathD +=
      'L ' +
      getSvgX(x.max) +
      ' ' +
      getSvgY(y.min) +
      ' ' +
      'L ' +
      getSvgX(x.min) +
      ' ' +
      getSvgY(y.min) +
      ' ';

    return <path className='linechart_area' d={pathD} />;
  };
  // BUILD GRID AXIS
  const makeAxis = () => {
    const { yLabelSize } = props;
    const x = getX();
    const y = getY();

    return (
      <g className='linechart_axis'>
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.min)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.min)}
          strokeDasharray='5'
        />
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.max)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.max)}
          strokeDasharray='5'
        />
      </g>
    );
  };
  const makeLabels = () => {
    const { svgHeight, svgWidth, xLabelSize, yLabelSize } = props;
    const padding = 5;
    return (
      <g className='linechart_label'>
        {/* Y AXIS LABELS */}
        <text
          transform={`translate(${yLabelSize / 2}, 20)`}
          textAnchor='middle'
        >
          {getY().max.toLocaleString('us-EN', {
            style: 'currency',
            currency: 'USD',
          })}
        </text>
        <text
          transform={`translate(${yLabelSize / 2}, ${
            svgHeight - xLabelSize - padding
          })`}
          textAnchor='middle'
        >
          {getY().min.toLocaleString('us-EN', {
            style: 'currency',
            currency: 'USD',
          })}
        </text>
        {/* X AXIS LABELS */}
        <text
          transform={`translate(${yLabelSize}, ${svgHeight})`}
          textAnchor='start'
        >
          {props.data[0].d}
        </text>
        <text
          transform={`translate(${svgWidth}, ${svgHeight})`}
          textAnchor='end'
        >
          {props.data[props.data.length - 1].d}
        </text>
      </g>
    );
  };
  // FIND CLOSEST POINT TO MOUSE
  const getCoords = (e) => {
    const { svgWidth, data, yLabelSize } = props;
    const svgLocation = document
      .getElementsByClassName('linechart')[0]
      .getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    let svgData = [];
    data.forEach((point, i) => {
      svgData.push({
        svgX: getSvgX(point.x),
        svgY: getSvgY(point.y),
        d: point.d,
        p: point.p,
      });
    });

    let closestPoint = {};
    for (let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - hoverLoc) <= c) {
        c = Math.abs(svgData[i].svgX - hoverLoc);
        closestPoint = svgData[i];
      }
    }

    if (relativeLoc - yLabelSize < 0) {
      stopHover();
    } else {
      setHoverLoc(relativeLoc);
      setActivePoint(closestPoint);
      props.onChartHover(relativeLoc, closestPoint);
    }
  };
  // STOP HOVER
  const stopHover = () => {
    setHoverLoc(null);
    setActivePoint(null);
    props.onChartHover(null, null);
  };

  // MAKE ACTIVE POINT
  const makeActivePoint = () => {
    const { color, pointRadius } = props;
    return (
      <circle
        className='linechart_point'
        style={{ stroke: color }}
        r={pointRadius}
        cx={activePoint.svgX}
        cy={activePoint.svgY}
      />
    );
  };
  // MAKE HOVER LINE
  const createLine = () => {
    const { svgHeight, xLabelSize } = props;
    return (
      <line
        className='hoverLine'
        x1={hoverLoc}
        y1={-8}
        x2={hoverLoc}
        y2={svgHeight - xLabelSize}
      />
    );
  };
  
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={'linechart'}
      onMouseLeave={() => stopHover()}
      onMouseMove={(e) => getCoords(e)}
    >
      <g>
        {makeAxis()}
        {makePath()}
        {makeArea()}
        {makeLabels()}
        {hoverLoc ? createLine() : null}
        {hoverLoc ? makeActivePoint() : null}
      </g>
    </svg>
  );
};

Chart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80,
};

export default Chart;
