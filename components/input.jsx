import React, { useRef, useEffect } from 'react';
import Proptypes from 'prop-types';

function Input({ cmdFunction, results, handleEnter, suggestions }) {
  const textInput = useRef(null);
  let index = results.length;
  const onEnter = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentVal = textInput.current.value;
      if (!currentVal) return;

      const matches = suggestions.filter(cmd => cmd.startsWith(currentVal));
      if (matches.length === 1) {
          textInput.current.value = matches[0];
      }
      // Future: handle multiple matches (show list or cycle)
    } else if (e.key === 'Enter') {
      const cmd = e.target.value.trim().split(' ');
      cmdFunction(cmd);
      textInput.current.value = '';
      textInput.current.focus();
    } else if (e.key === 'ArrowUp') {
      if (index - 1 >= 0) {
        index--;
        while (!results[index].cmd && index - 1 >= 0) {
            index--;
        }
        const newText = results[index];
        textInput.current.value = newText.cmd;
      }
    } else if (e.key === 'ArrowDown') {
      if (index + 1 < results.length) {
        index++;
        while (!results[index].cmd && index + 1 < results.length) {
            index++;
        }
        const newText = results[index];
        textInput.current.value = newText.cmd;
      } else {
        if (!(index >= results.length)) {
          index++;
        }
        textInput.current.value = '';
      }
    }
    handleEnter(textInput);
  };

  // NOTE emulating componentDidMount with useEffect
  useEffect(() => {
    textInput.current.focus();
  }, []);

  return (
    <div>
      <span className="prompt prompt-lg">
        sammy@salh.xyz$&nbsp;
      </span>
      <span className="prompt prompt-sm">$ </span>
      <span className="prompt-input">
        <input
          id="current"
          ref={textInput}
          onKeyDown={onEnter}
          type="text"
          placeholder="enter help..."
        />
      </span>
    </div>
  );
}

Input.propTypes = {
  cmdFunction: Proptypes.func.isRequired,
  results: Proptypes.array.isRequired,
  suggestions: Proptypes.array,
  // focused: Proptypes.bool.isRequired,
};

Input.defaultProps = {
    suggestions: []
};

export default Input;
