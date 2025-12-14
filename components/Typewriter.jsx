import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Typewriter = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

Typewriter.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number,
  onComplete: PropTypes.func,
};

export default Typewriter;
