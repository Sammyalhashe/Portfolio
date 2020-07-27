import React, { useState } from "react";
import Interpolator from "./components/interpolator";
import Input from "./components/input";

import cmds from "./functions/commands";

function Shell({ nodeId, splitHandle, removeHandle }) {
  const shellId = nodeId;

  // interpolator related constants
  const [interps, setInterps] = useState([]);
  const [legacyInterps, setLegacyInterps] = useState([]);

  // build commands
  const buildCmdRes = (cmd, result) => {
    return {
      cmd,
      result:
        result !== undefined && result !== null ? (
          result
        ) : (
          <div className="output error">
            Command&nbsp;is not valid:&nbsp;
            {cmd}
          </div>
        )
    };
  };

  const handleEnter = (ref) => {
      ref.current.scrollIntoView();
  }

  // command function
  const applyCmd = cmdarr => {
    const cmd = cmdarr[0];
    if (cmd.toLowerCase() === "clear") {
      setInterps([]);
      setLegacyInterps([...legacyInterps, { cmd: "clear", result: "" }]);
    } else if (cmd.toLowerCase() === "right") {
        splitHandle.handleSplitFromId(shellId, 1);
    } else if (cmd.toLowerCase() === 'down') {
        splitHandle.handleSplitFromId(shellId, 0);
    } else if (cmd.toLowerCase() === 'exit') {

    } else {
      const f = cmds[cmd.toLowerCase()];
      if (f !== undefined && f !== null) {
        let result;
        if (f.length > 0) {
          result = f(cmdarr.slice(1));
        } else {
          result = f();
        }
        const cmdRes = buildCmdRes(cmdarr.join(" "), result);
        setInterps([...interps, cmdRes]);
        setLegacyInterps([...legacyInterps, cmdRes]);
      } else {
        let cmdRes;
        if (cmd === "") {
          cmdRes = buildCmdRes(cmdarr.join(" "), "");
        } else {
          cmdRes = buildCmdRes(
            cmdarr.join(" "),
            <div className="output error">
              Command&nbsp;not found:&nbsp;
              {cmd}
            </div>
          );
        }

        setInterps([...interps, cmdRes]);
        setLegacyInterps([...legacyInterps, cmdRes]);
      }
    }
  };

  return (
      <div style={{width: '100%', height: '100%', overflowY: 'scroll', paddingRight: '17px', boxSizing: 'content-box'}} className="shell" id={shellId}>
      <Interpolator interpolatedResults={interps} />
      <Input cmdFunction={applyCmd} results={legacyInterps} handleEnter={handleEnter} />
    </div>
  );
}

export default Shell;
