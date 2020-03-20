import React from 'react';
import Proptypes from 'prop-types';

function Interpolator({ interpolatedResults }) {
  const mappedResults = interpolatedResults.map((res, index) => {
    const ind = res.cmd + res.result + index;
    return (
      <div key={ind}>
        <span className="prompt prompt-lg">
          sammyalhashemi1@outlook.com$&nbsp;
        </span>
        <span className="prompt prompt-sm">$ </span>
        <span>{res.cmd}</span>
        <div>{res.result}</div>
      </div>
    );
  });
  return <div id="interpolator">{mappedResults}</div>;
}

Interpolator.propTypes = {
  interpolatedResults: Proptypes.arrayOf(
    Proptypes.shape({
      cmd: Proptypes.string,
      result: Proptypes.node,
    })
  ).isRequired,
};

export default Interpolator;
