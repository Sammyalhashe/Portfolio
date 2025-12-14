import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import Shell from "../Shell";
import WindowTree from "../classes/WindowTree";
import postMap from "../functions/post_loader";

function HomePage() {
  const [interps, setInterps] = useState("");
  const [renderTree, setRenderTree] = useState(new WindowTree(setInterps));
  const router = useRouter();

  // State for Alt-t sequence (global)
  const [waitingForTabCmd, setWaitingForTabCmd] = useState(false);

  useEffect(() => {
    // Detect theme on mount
    renderTree.detectTheme();
    // Inject neofetch after theme detection
    renderTree.injectNeofetch();

    if (router.isReady && router.query.post) {
      const slug = router.query.post;
      const Post = postMap[slug];
      if (Post) {
        const { attributes, react: Content } = Post;

        // Series Navigation Logic
        let seriesNav = null;
        if (attributes.series) {
            const seriesPosts = Object.keys(postMap)
                .filter(s => postMap[s].attributes.series === attributes.series)
                .sort((a, b) => {
                    const orderA = postMap[a].attributes.seriesOrder || 999;
                    const orderB = postMap[b].attributes.seriesOrder || 999;
                    return orderA - orderB;
                });

            const currentIndex = seriesPosts.indexOf(slug);
            const prevSlug = seriesPosts[currentIndex - 1];
            const nextSlug = seriesPosts[currentIndex + 1];

            seriesNav = (
                <div className="series-nav" style={{marginTop: '40px', borderTop: '1px solid grey', paddingTop: '10px'}}>
                    <h3 style={{fontSize: '1.2em', marginBottom: '10px'}}>Series: {attributes.series}</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        {prevSlug ? (
                            <a href={`/?post=${prevSlug}`} onClick={(e) => {
                                e.preventDefault();
                                router.push(`/?post=${prevSlug}`);
                            }} style={{color: 'cyan', cursor: 'pointer'}}>
                                &larr; {postMap[prevSlug].attributes.title}
                            </a>
                        ) : <div></div>}

                        {nextSlug ? (
                            <a href={`/?post=${nextSlug}`} onClick={(e) => {
                                e.preventDefault();
                                router.push(`/?post=${nextSlug}`);
                            }} style={{color: 'cyan', cursor: 'pointer'}}>
                                {postMap[nextSlug].attributes.title} &rarr;
                            </a>
                        ) : <div></div>}
                    </div>
                </div>
            );
        }

        const Component = () => (
          <div>
            <h1>{attributes.title}</h1>
            <h2>{attributes.date}</h2>
            <Content />
            {seriesNav}
          </div>
        );
        renderTree.setPage(<Component />);
      }
    }
  }, [router.isReady, router.query.post]);

  // Global Keyboard Handling
  useEffect(() => {
    const handleKeyDown = (e) => {
        // Alt + t sequence handling
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            setWaitingForTabCmd(true);
            return;
        }

        if (waitingForTabCmd) {
            e.preventDefault();
            setWaitingForTabCmd(false); // Reset state
            switch (e.key) {
                case 'n':
                    renderTree.handleTabNew();
                    break;
                case 'x':
                    renderTree.handleTabClose();
                    break;
                case '[':
                    renderTree.handleTabPrev();
                    break;
                case ']':
                    renderTree.handleTabNext();
                    break;
                default:
                    // Cancel sequence
                    break;
            }
            return;
        }

        // Ctrl + h/j/k/l navigation
        if (e.ctrlKey) {
            if (e.key === 'h') {
                e.preventDefault();
                renderTree.handleFocusMove('h');
            } else if (e.key === 'j') {
                e.preventDefault();
                renderTree.handleFocusMove('j');
            } else if (e.key === 'k') {
                e.preventDefault();
                renderTree.handleFocusMove('k');
            } else if (e.key === 'l') {
                e.preventDefault();
                renderTree.handleFocusMove('l');
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [waitingForTabCmd, renderTree]);


  return (
    <div className="main">
      <Head>
        <title>My profile</title>
      </Head>
        {renderTree.render()}
    </div>
  );
}

export default HomePage;
