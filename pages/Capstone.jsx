import React from 'react';
import { attributes, react as CapstoneContent } from '../content/capstone.md';

function Capstone() {
    let { title, date } = attributes;
  return (
      <div className="main">
          <CapstoneContent />
          {title}
          {date}
      </div>
  );
}

export default Capstone;
