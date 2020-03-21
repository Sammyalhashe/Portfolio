import React, { useState } from 'react';
import Head from 'next/head';
import cmds from '../functions/commands';
import Interpolator from '../components/interpolator';
import Input from '../components/input';

function HomePage() {
  const [interps, setInterps] = useState([]);
  const [legacyInterps, setLegacyInterps] = useState([]);
  const [focused, setFocus] = useState(false);
  // const keyPressHander = (e) => {
  //   setFocus(true);
  // };
  // useEffectListener('keydown', keyPressHander);
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
        ),
    };
  };
  const applyCmd = cmdarr => {
    const cmd = cmdarr[0];
    if (cmd.toLowerCase() === 'clear') {
      setInterps([]);
      setLegacyInterps([...legacyInterps, {cmd: 'clear', result: ''}]);
    } else {
      const f = cmds[cmd.toLowerCase()];
      if (f !== undefined && f !== null) {
        let result;
        if (f.length > 0) {
          result = f(cmdarr.slice(1));
        } else {
          result = f();
        }
        const cmdRes = buildCmdRes(cmdarr.join(' '), result);
        setInterps([...interps, cmdRes]);
        setLegacyInterps([...legacyInterps, cmdRes]);
      } else {
        let cmdRes;
        if (cmd === '') {
          cmdRes = buildCmdRes(cmdarr.join(' '), '');
        } else {
          cmdRes = buildCmdRes(
            cmdarr.join(' '),
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
    <div className="main">
      <Head>
        <title>My profile</title>
      </Head>
      <Interpolator interpolatedResults={interps} />
      <Input cmdFunction={applyCmd} results={legacyInterps} />
    </div>
  );
}

export default HomePage;
