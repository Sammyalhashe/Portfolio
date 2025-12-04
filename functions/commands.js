import React from 'react';
import Link from 'next/link';
import postMap from './post_loader';

const cmds = {
  help: () => {
    return (
      <div className="output">
        <div className="info">
          Enter <span className="highlight">"info"</span> to get my general info
        </div>
        <div className="info">
          Enter <span className="highlight">"ls"</span> to see everything in the directory that you can interact with
        </div>
        <div className="info">
          Enter <span className="highlight">"posts"</span> to see my blog posts
        </div>
        <div className="info">
          Enter <span className="highlight">"right"</span> to split the terminal to the right
        </div>
        <div className="info">
          Enter <span className="highlight">"down"</span> to split the terminal down
        </div>
        <div className="info">
          Enter <span className="highlight">"conf"</span> to configure the terminal
          <br/>
          Usage: <span className="highlight">conf blogView:&lt;inline/popup/page&gt;</span> or <span className="highlight">conf theme:&lt;theme&gt;</span>
          <br/>
          Supported themes: default, gruvbox, nord, nord light, github dark, github light
        </div>
        <div className="info">
            Enter <span className="highlight">"coffee"</span> to send a tip if you want :)
        </div>
        <div className="info">
          Enter <span className="highlight">"project"</span> to see my projects
        </div>
        <div className="info">
          Enter <span className="highlight">"clear"</span> to clear the terminal
        </div>
        <div className="info">
          Enter <span className="highlight">"exps"</span> to see my recent
          industry experience
        </div>
        <div className="info">
          Enter <span className="highlight">"linkedin"</span> to go to my
          LinkedIn
        </div>
        <div className="info">
          Enter <span className="highlight">"github"</span> to go to my Github
        </div>
        <div className="info">
          Enter <span className="highlight">"resume"</span> to open a
          downloadable copy of my resume
        </div>
        <div className="info">
          Enter <span className="highlight">"old"</span> to open my older
          portfolio
        </div>
        <div className="info">
          Enter <span className="highlight">"picture"</span> to see a picture of
          me{' '}
        </div>
      </div>
    );
  },
  info: () => {
    return (
      <div className="output">
        <div className="info">
          Hello!
          <br />
          My name is Sammy Al Hashemi.
          <hr />
          My contact info is as follows:
          <br />
          Phone: <span className="info highlighted-info">647-463-2638</span>
          Email:{' '}
          <span className="info highlighted-info">
            sammy@salh.xyz
          </span>
        </div>
      </div>
    );
  },
  coffee: () => {
    return (
        <div className="wrapper">
            <div id="object">
                <div className="wrapper">
                    <div className="info">
                        Monero address:
                    </div>
                </div>
                <div className="wrapper">
                    <img src="/QR_code.png" alt="Donations are appreciated :)"/>
                </div>
                <div className="wrapper">
                    <div className="longinfo">
                        48bks8r6hSL5thvR6Skrps7jY3itJp4oSGuH9JRTGTz6jUaguqgdMpcgkFa7Tz81LQLLGH1DjaUnn9odXXxFATQVQBLKp1S
                    </div>
                </div>
            </div>
        </div>
    );
  },
  project: (unused, cb) => {
    // Filter postMap for projects (start with projects/)
    const projLinks = Object.keys(postMap)
        .filter(slug => slug.startsWith('projects/'))
        .map((slug) => {
          const attributes = postMap[slug].attributes;
          // Use external link if pageLink not relevant for internal routing via Shell logic?
          // The old logic used pageLink for internal routing via cb and link for external.
          // Here, the project markdown can be viewed internally via /post/projects/xxx
          // OR we can link externally if 'link' attribute is present.
          // BUT 'projects' command usually listed internal links in the old version if pageLink was present.
          // We will make them open internally like posts/exps.

          const link = () => {
            if (cb !== undefined && cb !== null) {
              return (
                <a className="project-link" onClick={cb('/post/' + slug)}>
                  {attributes.title || slug.split('/')[1]}
                </a>
              );
            } else {
              // If inline (no callback), maybe link to external?
              // Or just show title.
              return (
                 <a className="project-link" href={attributes.link} target="_blank">
                    {attributes.title || slug.split('/')[1]}
                 </a>
              );
            }
          };

          return (
            <span key={slug} className="info">
              {link()}
            </span>
          );
        });

    return <div className="output">{projLinks}</div>;
  },
  ls: (unused, cb) => {
    // 1. Resume
    const resume = cmds.resume(true);

    // 2. All items from postMap (projects, exps, posts)
    const allLinks = Object.keys(postMap).map((slug, idx) => {
        const attributes = postMap[slug].attributes;
        const link = () => {
            if (cb !== undefined && cb !== null) {
                return (
                    <a className="project-link" onClick={cb('/post/' + slug)}>
                        {attributes.title || slug.split('/')[1] || slug}
                    </a>
                );
            } else {
                return (
                    <span className="project-link">{attributes.title || slug.split('/')[1] || slug}</span>
                );
            }
        };
        return (
            <span key={'item-' + idx} className="info">
                {link()}
            </span>
        );
    });

    return (
      <div className="output ls-grid">
        {resume}
        {allLinks}
      </div>
    );
  },
  posts: (unused, cb) => {
    const postLinks = Object.keys(postMap)
        .filter(slug => slug.startsWith('posts/'))
        .map((slug) => {
          const attributes = postMap[slug].attributes;

          const link = () => {
            if (cb !== undefined && cb !== null) {
              return (
                <a className="project-link" onClick={cb('/post/' + slug)}>
                  {attributes.title || slug.split('/')[1]}
                </a>
              );
            } else {
              return (
                 <span className="project-link">{attributes.title || slug.split('/')[1]}</span>
              );
            }
          };

          return (
            <div key={slug} className="info">
              {link()}
            </div>
          );
        });

    return <div className="output">{postLinks}</div>;
  },
  exps: (flag, cb) => {
     const expLinks = Object.keys(postMap)
        .filter(slug => slug.startsWith('exps/'))
        .map((slug) => {
          const attributes = postMap[slug].attributes;

          const link = () => {
            if (cb !== undefined && cb !== null) {
              return (
                <a className="project-link" onClick={cb('/post/' + slug)}>
                  {attributes.title || slug.split('/')[1]}
                </a>
              );
            } else {
              return (
                 <span className="project-link">{attributes.title || slug.split('/')[1]}</span>
              );
            }
          };

          return (
            <div key={slug} className="info">
              {link()}
            </div>
          );
        });

    return <div className="output">{expLinks}</div>;
  },
  old: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = 'https://sammyalhashemi.com';
    a.click();
    a.remove();
    return <div className="output info">Website opened on another tab...</div>;
  },
  resume: (inline=false) => {
    const href = "https://firebasestorage.googleapis.com/v0/b/arduinohandler.appspot.com/o/Downloadable%2Fresume.pdf?alt=media&token=c75d66f7-c4bd-4ec8-bed1-9b567e8017f0";
    if (!inline) {
        const a = document.createElement('a');
        a.target = '_blank';
        a.href = href;
        a.click();
        a.remove();

        return <div className="output info">Resume opened on new page</div>;
    } else {
        return (
          <span className="info">
            <a className="project-link" href={href}>
              resume.pdf
            </a>
          </span>
        );
    }
  },
  github: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = 'https://github.com/Sammyalhashe';
    a.click();
    a.remove();
    return <div className="output info">Github opened on new page</div>;
  },
  linkedin: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = 'https://www.linkedin.com/in/sammyalhashemi/';
    a.click();
    a.remove();
    return <div className="output info">LinkedIn opened on new page</div>;
  },
  picture: () => {
    return (
      <div id="object" className="image">
        <img src="/collision_pic.jpg" alt="A picture of me" />
      </div>
    );
  },
  budg: () => {
    return (
      <div style={{width: '100%'}}>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeqxtXSNFg0TB43QKslFEvI0tXnnL9YqkROrDVsPMMnekiW_A/viewform" title="Submit Budget"></iframe>
      </div>
    );
  }
};

export default cmds;
