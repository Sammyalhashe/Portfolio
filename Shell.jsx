import React, { useState, useEffect, useRef } from "react";
import Interpolator from "./components/interpolator";
import Input from "./components/input";
import Microsemi from "./pages/Microsemi";
import MorganStanley from "./pages/MorganStanley";
import Capstone from "./pages/Capstone";
import PopularMovies from "./pages/PopularMovies";
import Dashcam from "./pages/Dashcam";
import AtpScraper from "./pages/atp_scraper";
import Bloomberg from "./pages/Bloomberg";
import cmds from "./functions/commands";
import postMap from "./functions/post_loader";

const StringToPageComponents = {
    "Microsemi": Microsemi,
    "MorganStanley": MorganStanley,
    "Dashcam": Dashcam,
    "PopularMovies": PopularMovies,
    "Capstone": Capstone,
    "atp_scraper": AtpScraper,
    "Bloomberg": Bloomberg
};

function Shell({ nodeId, splitHandle, removeHandle, interps, setInterps, legacyInterps, setLegacyInterps, blogView, setBlogView, setModal, setPage, setTheme }) {
  const shellId = nodeId;
  const shellRef = useRef(null);

  // Auto-scroll to bottom when interps change
  useEffect(() => {
    if (shellRef.current) {
        shellRef.current.scrollTop = shellRef.current.scrollHeight;
    }
  }, [interps, legacyInterps]);

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
		splitHandle.handleRemoveFromId(shellId);
    } else if (cmd.toLowerCase() === 'conf') {
        const arg = cmdarr[1];
        if (arg && arg.startsWith('blogView:')) {
            const mode = arg.split(':')[1];
            if (mode === 'inline' || mode === 'popup' || mode === 'page') {
                setBlogView(mode);
                const cmdRes = buildCmdRes(cmdarr.join(" "), <div className="output info">Blog view set to {mode}</div>);
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            } else {
                const cmdRes = buildCmdRes(cmdarr.join(" "), <div className="output error">Invalid mode. Use inline, popup, or page</div>);
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            }
        } else if (arg && arg.startsWith('theme:')) {
            const themeName = cmdarr.slice(1).join(' ').replace('theme:', '');
            if (setTheme(themeName)) {
                const cmdRes = buildCmdRes(cmdarr.join(" "), <div className="output info">Theme set to {themeName}</div>);
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            } else {
                const cmdRes = buildCmdRes(cmdarr.join(" "), <div className="output error">Invalid theme. Check help for options</div>);
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            }
        } else {
            const cmdRes = buildCmdRes(cmdarr.join(" "), <div className="output error">Usage: conf blogView:&lt;inline/popup/page&gt; or conf theme:&lt;theme&gt;</div>);
            setInterps([...interps, cmdRes]);
            setLegacyInterps([...legacyInterps, cmdRes]);
        }
    } else {
      const f = cmds[cmd.toLowerCase()];
      if (f !== undefined && f !== null) {
        let result;
        if (cmd.toLowerCase() === "exps" || cmd.toLowerCase() === "ls" || cmd.toLowerCase() === "project" || cmd.toLowerCase() === "posts") {
            result = f("", x => {
                const a = x.slice(1); // remove the '/'
                return y => {
                    let Component;
                    if (a.startsWith('post/')) {
                        const slug = a.replace('post/', '');
                        const Post = postMap[slug];
                        if (Post) {
                           const { attributes, react: Content } = Post;
                           Component = () => (
                             <div>
                               <h1>{attributes.title}</h1>
                               <h2>{attributes.date}</h2>
                               <Content />
                             </div>
                           );

                           // Handle popup mode for posts
                           if (blogView === 'popup') {
                               setModal(<Component />);
                               return; // Don't add to interps
                           } else if (blogView === 'page') {
                               // Update URL
                               const url = new URL(window.location);
                               url.searchParams.set('post', slug);
                               window.history.pushState({}, '', url);
                               setPage(<Component />);
                               return; // Don't add to interps
                           }

                        } else {
                            Component = () => <div>Post not found</div>;
                        }
                    } else {
                        Component = StringToPageComponents[a];
                    }

                    const cmdRes = buildCmdRes(cmdarr.join(" "), (() => {
                        return (
                            <div className="output info">
                                <Component/>
                            </div>
                        );
                    })());

                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                };
            });
        }
        else if (f.length > 0) {
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
      <div ref={shellRef} style={{width: '100%', height: '100%', overflowY: 'scroll', paddingRight: '17px', boxSizing: 'content-box'}} className="shell" id={shellId}>
      <Interpolator interpolatedResults={interps} />
      <Input cmdFunction={applyCmd} results={legacyInterps} handleEnter={handleEnter} />
    </div>
  );
}

export default Shell;
