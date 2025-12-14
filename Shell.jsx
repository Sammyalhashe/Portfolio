import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import Interpolator from './components/interpolator';
import Input from './components/input';
import Microsemi from './pages/Microsemi';
import MorganStanley from './pages/MorganStanley';
import Capstone from './pages/Capstone';
import PopularMovies from './pages/PopularMovies';
import Dashcam from './pages/Dashcam';
import AtpScraper from './pages/atp_scraper';
import Bloomberg from './pages/Bloomberg';
import cmds from './functions/commands';
import postMap from './functions/post_loader';

const StringToPageComponents = {
    Microsemi,
    MorganStanley,
    Dashcam,
    PopularMovies,
    Capstone,
    atp_scraper: AtpScraper,
    Bloomberg,
};

function Shell({
    nodeId, splitHandle, removeHandle, interps, setInterps, legacyInterps, setLegacyInterps,
    blogView, setBlogView, setModal, setPage, setTheme, theme, windowTree, isFocused, onFocus,
}) {
    const shellId = nodeId;
    const shellRef = useRef(null);

    // Auto-scroll to bottom when interps change
    useEffect(() => {
        if (shellRef.current) {
            shellRef.current.scrollTop = shellRef.current.scrollHeight;
        }
    }, [interps, legacyInterps]);

    // Handle Focus
    useEffect(() => {
        if (isFocused && shellRef.current) {
        // Find input element and focus it
            const input = shellRef.current.querySelector('input');
            if (input) {
                input.focus();
            }
        }
    }, [isFocused]);

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
        ),
        };
    };

    const handleEnter = (ref) => {
        ref.current.scrollIntoView();
    };

    // command function
    const applyCmd = (cmdarr) => {
        const cmd = cmdarr[0];
        if (cmd.toLowerCase() === 'clear') {
            setInterps([]);
            setLegacyInterps([...legacyInterps, { cmd: 'clear', result: '' }]);
        } else if (cmd.toLowerCase() === 'right') {
            splitHandle.handleSplitFromId(shellId, 1);
        } else if (cmd.toLowerCase() === 'down') {
            splitHandle.handleSplitFromId(shellId, 0);
        } else if (cmd.toLowerCase() === 'exit') {
            removeHandle.handleRemoveFromId(shellId);
        } else if (cmd.toLowerCase() === 'tab') {
            const arg = cmdarr[1];
            if (arg === 'new') {
                if (windowTree.handleTabNew()) {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output info">New tab created</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                } else {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output error">Max tabs reached</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                }
            } else if (arg === 'close') {
                if (windowTree.handleTabClose()) {
                    // If we closed the current tab, this component might unmount,
                    // but if we are still here (e.g. only 1 tab left), show msg.
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output info">Tab closed</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                } else {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output error">Cannot close last tab</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                }
            } else {
                const cmdRes = buildCmdRes(
                    cmdarr.join(' '),
                    <div className="output error">Usage: tab &lt;new/close&gt;</div>,
                );
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            }
        } else if (cmd.toLowerCase() === 'conf') {
            const arg = cmdarr[1];
            if (arg && arg.startsWith('blogView:')) {
                const mode = arg.split(':')[1];
                if (mode === 'inline' || mode === 'popup' || mode === 'page' || mode === 'tab') {
                    setBlogView(mode);
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output info">Blog view set to {mode}</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                } else {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output error">Invalid mode. Use inline, popup, page, or tab</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                }
            } else if (arg && arg.startsWith('theme:')) {
                const themeName = cmdarr.slice(1).join(' ').replace('theme:', '');
                if (setTheme(themeName)) {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output info">Theme set to {themeName}</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                } else {
                    const cmdRes = buildCmdRes(
                        cmdarr.join(' '),
                        <div className="output error">Invalid theme. Check help for options</div>,
                    );
                    setInterps([...interps, cmdRes]);
                    setLegacyInterps([...legacyInterps, cmdRes]);
                }
            } else {
                const cmdRes = buildCmdRes(
                    cmdarr.join(' '),
                    <div className="output error">Usage: conf blogView:&lt;mode&gt; or conf theme:&lt;theme&gt;</div>,
                );
                setInterps([...interps, cmdRes]);
                setLegacyInterps([...legacyInterps, cmdRes]);
            }
        } else {
            const f = cmds[cmd.toLowerCase()];
            if (f !== undefined && f !== null) {
                let result;
                if (cmd.toLowerCase() === 'neofetch') {
                    result = f(null, null, { theme });
                } else if (cmd.toLowerCase() === 'search') {
                    result = f(cmdarr.slice(1), (x) => {
                        const a = x.slice(1);
                        return () => {
                            // Similar logic to below, but for search results links
                            let Component;
                            if (a.startsWith('post/')) {
                                const slug = a.replace('post/', '');
                                const Post = postMap[slug];
                                if (Post) {
                                    const { attributes, react: Content } = Post;
                                    if (typeof Content === 'function') {
                                        Component = () => {
                                            useEffect(() => {
                                                Prism.highlightAll();
                                            }, []);
                                            return (
                                                <div>
                                                    <h1>{attributes.title}</h1>
                                                    <h2>{attributes.date}</h2>
                                                    <Content />
                                                </div>
                                            );
                                        };
                                    } else {
                                        Component = () => (
                                            <div>
                                                <h1>{attributes.title}</h1>
                                                <h2>{attributes.date}</h2>
                                                <p className="error">Error: Post content format is invalid.</p>
                                            </div>
                                        );
                                    }
                                    if (blogView === 'popup') {
                                        setModal(<Component />);
                                        return;
                                    }
                                    if (blogView === 'page') {
                                        const url = new URL(window.location);
                                        url.searchParams.set('post', slug);
                                        window.history.pushState({}, '', url);
                                        setPage(<Component />);
                                        return;
                                    }
                                    if (blogView === 'tab') {
                                        setPage(<Component />); // setPage handles tab logic if blogView is tab
                                        return;
                                    }
                                } else {
                                    Component = () => <div>Post not found</div>;
                                }
                            } else {
                                Component = StringToPageComponents[a];
                            }

                            const cmdRes = buildCmdRes(cmdarr.join(' '), (() => (
                                <div className="output info">
                                    <Component />
                                </div>
                            ))());

                            setInterps([...interps, cmdRes]);
                            setLegacyInterps([...legacyInterps, cmdRes]);
                        };
                    });
                } else if (cmd.toLowerCase() === 'exps' || cmd.toLowerCase() === 'ls' || cmd.toLowerCase() === 'project' || cmd.toLowerCase() === 'posts') {
                    // handle arguments for posts
                    let args = '';
                    if (cmd.toLowerCase() === 'posts') {
                        args = cmdarr.slice(1);
                    }

                    // Define navCallback before using it
                    const navCallback = (x) => {
                        const a = x.slice(1); // remove the '/'
                        return (e) => { // e is event, unused but we need to return a handler
                            // Prevent default if it's an event (though <a> without href might not need it, but good practice)
                            if (e && e.preventDefault) e.preventDefault();

                            let Component;
                            if (a.startsWith('post/')) {
                                const slug = a.replace('post/', '');
                                const Post = postMap[slug];
                                if (Post) {
                                    const { attributes, react: Content } = Post;

                                    // Determine Next and Previous Posts
                                    const allPosts = Object.keys(postMap)
                                        .filter((k) => k.startsWith('posts/'))
                                        .sort((alpha, beta) => new Date(postMap[beta].attributes.date) - new Date(postMap[alpha].attributes.date));

                                    const currentIndex = allPosts.indexOf(slug);
                                    const nextSlug = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
                                    const prevSlug = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

                                    const Navigation = () => (
                                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid gray', paddingTop: '20px' }}>
                                            {prevSlug ? (
                                                <a className="project-link" style={{ cursor: 'pointer' }} onClick={navCallback(`/post/${prevSlug}`)}>
                                                    &larr; {postMap[prevSlug].attributes.title}
                                                </a>
                                            ) : <span />}

                                            {nextSlug ? (
                                                <a className="project-link" style={{ cursor: 'pointer' }} onClick={navCallback(`/post/${nextSlug}`)}>
                                                    {postMap[nextSlug].attributes.title} &rarr;
                                                </a>
                                            ) : <span />}
                                        </div>
                                    );

                                    if (typeof Content === 'function') {
                                        Component = () => {
                                            useEffect(() => {
                                                Prism.highlightAll();
                                            }, []);
                                            return (
                                                <div>
                                                    <h1>{attributes.title}</h1>
                                                    <h2>{attributes.date}</h2>
                                                    <Content />
                                                    <Navigation />
                                                </div>
                                            );
                                        };
                                    } else {
                                        Component = () => (
                                            <div>
                                                <h1>{attributes.title}</h1>
                                                <h2>{attributes.date}</h2>
                                                <p className="error">Error: Post content format is invalid.</p>
                                            </div>
                                        );
                                    }

                                    // Handle popup mode for posts
                                    if (blogView === 'popup') {
                                        setModal(<Component />);
                                        return; // Don't add to interps
                                    }
                                    if (blogView === 'page') {
                                    // Update URL
                                        const url = new URL(window.location);
                                        url.searchParams.set('post', slug);
                                        window.history.pushState({}, '', url);
                                        setPage(<Component />);
                                        return; // Don't add to interps
                                    }
                                    if (blogView === 'tab') {
                                        setPage(<Component />); // setPage handles tab logic
                                        return;
                                    }
                                } else {
                                    Component = () => <div>Post not found</div>;
                                }
                            } else {
                                Component = StringToPageComponents[a];
                            }

                            const cmdRes = buildCmdRes(cmdarr.join(' '), (() => (
                                <div className="output info">
                                    <Component />
                                </div>
                            ))());

                            setInterps([...interps, cmdRes]);
                            setLegacyInterps([...legacyInterps, cmdRes]);
                        };
                    };

                    result = f(args, navCallback);
                } else if (f.length > 0) {
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

    const commandList = Object.keys(cmds).concat(['clear', 'right', 'down', 'exit', 'conf', 'tab']);

    return (
        <div
            ref={shellRef}
            style={{
                width: '100%',
                height: '100%',
                overflowY: 'scroll',
                paddingRight: '17px',
                boxSizing: 'content-box',
                border: isFocused ? '1px solid var(--info-color)' : 'none',
            }}
            className={`shell ${isFocused ? 'focused' : ''}`}
            id={shellId}
            onClick={onFocus}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onFocus();
                }
            }}
        >
            <Interpolator interpolatedResults={interps} />
            <Input cmdFunction={applyCmd} results={legacyInterps} handleEnter={handleEnter} suggestions={commandList} />
        </div>
    );
}

export default Shell;
