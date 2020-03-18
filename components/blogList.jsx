import React from 'react';
import Proptypes from 'prop-types';

function BlogList({ blogs }) {
  const links = blogs.map((link) => (
    <li key={link} href={link}>
      {link}
    </li>
  ));
  return <ul>{links}</ul>;
}

BlogList.propTypes = {
  blogs: Proptypes.arrayOf(Proptypes.string).isRequired,
};

export default BlogList;
