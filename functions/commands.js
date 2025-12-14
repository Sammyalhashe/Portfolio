import React from 'react';
import Link from 'next/link';
import postMap from './post_loader';
import Typewriter from '../components/Typewriter';

const cmds = {
  help: () => {
    return (
      <div className="output">
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"info"</span>
          <Typewriter text=" to get my general info" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"ls"</span>
          <Typewriter text=" to see everything in the directory that you can interact with" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"posts"</span>
          <Typewriter text=" to see my blog posts" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"right"</span>
          <Typewriter text=" to split the terminal to the right" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"down"</span>
          <Typewriter text=" to split the terminal down" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"conf"</span>
          <Typewriter text=" to configure the terminal" />
          <br />
          <Typewriter text="Usage: " />
          <span className="highlight">conf blogView:&lt;inline/popup/page&gt;</span>
          <Typewriter text=" or " />
          <span className="highlight">conf theme:&lt;theme&gt;</span>
          <br />
          <Typewriter text="Supported themes: default, gruvbox, nord, nord light, github dark, github light" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"coffee"</span>
          <Typewriter text=" to send a tip if you want :)" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"project"</span>
          <Typewriter text=" to see my projects" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"clear"</span>
          <Typewriter text=" to clear the terminal" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"exps"</span>
          <Typewriter text=" to see my recent industry experience" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"linkedin"</span>
          <Typewriter text=" to go to my LinkedIn" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"github"</span>
          <Typewriter text=" to go to my Github" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"resume"</span>
          <Typewriter text=" to open a downloadable copy of my resume" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"old"</span>
          <Typewriter text=" to open my older portfolio" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"neofetch"</span>
          <Typewriter text=" to see system info" />
        </div>
        <div className="info">
            <Typewriter text="Enter " />
            <span className="highlight">"tags"</span>
            <Typewriter text=" to see available tags" />
        </div>
        <div className="info">
            <Typewriter text="Enter " />
            <span className="highlight">"search"</span>
            <Typewriter text=" to search posts" />
        </div>
        <div className="info">
          <Typewriter text="Enter " />
          <span className="highlight">"picture"</span>
          <Typewriter text=" to see a picture of me" />
        </div>
      </div>
    );
  },
  info: () => {
    return (
      <div className="output">
        <div className="info">
          <Typewriter text="Hello!" />
          <br />
          <Typewriter text="My name is Sammy Al Hashemi." />
          <hr />
          <Typewriter text="My contact info is as follows:" />
          <br />
          Phone:
          <span className="info highlighted-info">
            <Typewriter text="647-463-2638" />
          </span>
          Email:
          {' '}
          <span className="info highlighted-info">
            <Typewriter text="sammy@salh.xyz" />
          </span>
        </div>
      </div>
    );
  },
  neofetch: (unused1, unused2, context) => {
    const { theme } = context || {};
    // Calculate uptime
    let uptime = "Unknown";
    if (typeof window !== 'undefined' && window.performance && window.performance.timing) {
      const up = Date.now() - window.performance.timing.navigationStart;
      const seconds = Math.floor(up / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      uptime = `${hours ? hours + 'h ' : ''}${minutes % 60}m ${seconds % 60}s`;
    }

    const platform = (typeof navigator !== 'undefined') ? navigator.platform : 'Unknown';

    const asciiArt = `
      .::-
    .::.
   .::
  .::   .:::.
 .::  .::. .::
 .:: .::
 .::.::
  .::.::
    .:::.
      .:::
    .::..::
   .::    .::
  .::      .::
 .::        .::
`.split('\n');

    return (
      <div className="output" style={{ display: 'flex', gap: '20px' }}>
        <div className="ascii-art" style={{ color: 'var(--highlight-color)', whiteSpace: 'pre', lineHeight: '1.2' }}>
          {asciiArt.map((line, i) => <div key={i}>{line}</div>)}
        </div>
        <div className="system-info">
          <div className="info">
            <span className="highlight">visitor@salh.xyz</span>
          </div>
          <div className="info">----------------</div>
          <div className="info">
            <span className="highlight">Host</span>
            :
            <Typewriter text="salh.xyz" />
          </div>
          <div className="info">
            <span className="highlight">OS</span>
            :
            <Typewriter text={platform} />
          </div>
          <div className="info">
            <span className="highlight">Uptime</span>
            :
            <Typewriter text={uptime} />
          </div>
          <div className="info">
            <span className="highlight">Shell</span>
            :
            <Typewriter text="React-Terminal" />
          </div>
          <div className="info">
            <span className="highlight">Theme</span>
            :
            <Typewriter text={theme || 'default'} />
          </div>
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
            <img src="/QR_code.png" alt="Donations are appreciated :)" />
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
        const link = () => {
          if (cb !== undefined && cb !== null) {
            return (
              <a className="project-link" onClick={cb('/post/' + slug)}>
                {attributes.title || slug.split('/')[1]}
              </a>
            );
          } else {
            return (
              <a className="project-link" href={attributes.link} target="_blank" rel="noreferrer">
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
    const resume = cmds.resume(true);
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
  posts: (args, cb) => {
    // Handling "posts --tag <tagname>"
    let filterTag = null;
    if (args && args.length >= 2 && args[0] === '--tag') {
        filterTag = args[1];
    }

    const postLinks = Object.keys(postMap)
      .filter(slug => slug.startsWith('posts/'))
      .filter(slug => {
          if (!filterTag) return true;
          const attributes = postMap[slug].attributes;
          return attributes.tags && attributes.tags.includes(filterTag);
      })
      .map((slug) => {
        const attributes = postMap[slug].attributes;
        const readingTime = attributes.readingTime || "";

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
            {link()} <span style={{opacity: 0.7, fontSize: '0.9em', marginLeft: '10px'}}>{readingTime}</span>
          </div>
        );
      });

    if (postLinks.length === 0) {
        return <div className="output info">No posts found{filterTag ? ` with tag "${filterTag}"` : ""}.</div>;
    }

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
  tags: () => {
      const allTags = new Set();
      Object.keys(postMap).forEach(slug => {
          if (slug.startsWith('posts/')) {
              const tags = postMap[slug].attributes.tags;
              if (Array.isArray(tags)) {
                  tags.forEach(tag => allTags.add(tag));
              }
          }
      });

      const tagList = Array.from(allTags).map(tag => (
          <span key={tag} className="info">
              <span className="project-link">{tag}</span>
          </span>
      ));

      if (tagList.length === 0) return <div className="output info">No tags found.</div>;

      return (
          <div className="output ls-grid">
              {tagList}
          </div>
      );
  },
  search: (args, cb) => {
      if (!args || args.length === 0) {
          return <div className="output error">Usage: search &lt;query&gt;</div>;
      }
      const query = args.join(" ").toLowerCase();

      const results = Object.keys(postMap).filter(slug => {
          const post = postMap[slug];
          const title = (post.attributes.title || "").toLowerCase();
          // We added body in previous steps
          const body = (post.body || "").toLowerCase();

          return title.includes(query) || body.includes(query);
      }).map(slug => {
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

      if (results.length === 0) {
          return <div className="output info">No matching posts found.</div>;
      }

      return <div className="output">{results}</div>;
  },
  old: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = 'https://sammyalhashemi.com';
    a.click();
    a.remove();
    return <div className="output info">Website opened on another tab...</div>;
  },
  resume: (inline = false) => {
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
      <div style={{ width: '100%' }}>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeqxtXSNFg0TB43QKslFEvI0tXnnL9YqkROrDVsPMMnekiW_A/viewform" title="Submit Budget" />
      </div>
    );
  }
};

export default cmds;
