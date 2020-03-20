import React, { useState } from 'react';
import Head from 'next/head';
import cmds from '../functions/commands';
import Interpolator from '../components/interpolator';
import Input from '../components/input';

function HomePage() {
  const [interps, setInterps] = useState([]);
  const [focused, setFocus] = useState(false);
  // const keyPressHander = (e) => {
  //   setFocus(true);
  // };
  // useEffectListener('keydown', keyPressHander);
  const applyCmd = cmd => {
    if (cmd.toLowerCase() === 'clear') {
      setInterps([]);
    } else {
      const f = cmds[cmd.toLowerCase()];

      if (f !== undefined && f !== null) {
        const result = f();
        const cmdRes = {
          cmd,
          result,
        };
        setInterps([...interps, cmdRes]);
      } else {
        let cmdRes;
        if (cmd === '') {
          cmdRes = {
            cmd,
            result: '',
          };
        } else {
          cmdRes = {
            cmd,
            result: (
              <div className="output error">
                Command&nbsp;not found:&nbsp;
                {cmd}
              </div>
            ),
          };
        }

        setInterps([...interps, cmdRes]);
      }
    }
  };
  return (
    <div className="main">
      <Head>
        <title>My profile</title>
      </Head>
      <Interpolator interpolatedResults={interps} />
      <Input cmdFunction={applyCmd} />
    </div>
  );
}

export default HomePage;
