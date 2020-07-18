import React from 'react';
import './ToolTip.scss';

const ToolTip = (props) => {
  const { hoverLoc, activePoint } = props;
  const svgLocation = document
    .getElementsByClassName('linechart')[0]
    .getBoundingClientRect();

  let placementStyles = {};
  let width = 100;
  placementStyles.width = width + 'px';
  placementStyles.left = hoverLoc + svgLocation.left - width / 2;
  return (
    <div className='tool-tip' style={placementStyles}>
      <div className='tool-tip__date'>{activePoint.d}</div>
      <div className='tool-tip__price'>{activePoint.p}</div>
    </div>
  );
};

export default ToolTip;
