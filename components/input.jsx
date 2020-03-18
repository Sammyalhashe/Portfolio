import React, { useRef, useEffect } from 'react';
import Proptypes from 'prop-types';

function Input({ cmdFunction }) {
  const textInput = useRef(null);

  const onEnter = e => {
    if (e.key === 'Enter') {
      const cmd = e.target.value.trim();
      cmdFunction(cmd);
      textInput.current.value = '';
      textInput.current.focus();
    }
  };

  // NOTE emulating componentDidMount with useEffect
  useEffect(() => {
    textInput.current.focus();
  }, []);

  return (
    <div>
      <span className="prompt prompt-lg">
        sammyalhashemi1@outlook.com$&nbsp;
      </span>
      <span className="prompt prompt-sm">$ </span>
      <span className="prompt-input">
        <input
          id="current"
          ref={textInput}
          onKeyPress={onEnter}
          type="text"
          placeholder="enter help..."
        />
      </span>
    </div>
  );
}

Input.propTypes = {
  cmdFunction: Proptypes.func.isRequired,
  // focused: Proptypes.bool.isRequired,
};

export default Input;
