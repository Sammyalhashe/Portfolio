import React from 'react';
import Link from 'next/link';
import postMap from './post_loader';

const projects = [
  {
    name: 'atp-scraper',
    pageLink: '/atp_scraper',
    link: 'https://github.com/Sammyalhashe/ATPScraper',
  },
  {
    name: 'atp-commandline',
    pageLink: '',
    link: 'https://github.com/Sammyalhashe/atp-commandline',
  },
  {
    name: 'dashcam-speed visualizer',
    pageLink: '/Dashcam',
    link: 'https://github.com/Sammyalhashe/commai-source',
  },
  {
    name: 'data-analysis and acquisition',
    pageLink: '/Capstone',
    link: 'https://github.com/Sammyalhashe/Charter-cp',
  },
  {
    name: 'popular-movies',
    pageLink: '/PopularMovies',
    link: 'https://github.com/Sammyalhashe/PopularMovies',
  },
];

const work_terms = [
  {
    name: 'Morgan-Stanley',
    file: '/MorganStanley',
  },
  {
    name: 'Microsemi',
    file: `/Microsemi`,
  },
  {
    name: 'Bloomberg',
    file: `/Bloomberg`,
  },
];

function inObjectArray(arr, field, value) {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (value === el[field].toLowerCase().trim()) {
      return [true, i];
    }
  }
  return [false, -1];
}

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
    const projs = projects.map(project => {
      const link = () => {
        if (project.pageLink && cb !== undefined & cb !== null) {
          return (
            <a className="project-link" onClick={cb(project.pageLink)}>
              {project.name}
            </a>
          );
        } else {
          return (
            <a className="project-link" target="_blank" href={project.link}>
              {project.name}
            </a>
          );
        }
      };
      return (
        <span key={project.name + project.link} className="info">
          {link()}
        </span>
      );
    });
    return <div className="output">{projs}</div>;
  },
  ls: (unused, cb) => {
    // 1. Resume
    const resume = cmds.resume(true);

    // 2. Projects
    const projs = projects.map((project, idx) => {
      const link = () => {
        if (project.pageLink && cb !== undefined && cb !== null) {
          return (
            <a className="project-link" onClick={cb(project.pageLink)}>
              {project.name}
            </a>
          );
        } else {
          return (
            <a className="project-link" target="_blank" href={project.link}>
              {project.name}
            </a>
          );
        }
      };
      return (
        <span key={'proj-' + idx} className="info">
          {link()}
        </span>
      );
    });

    // 3. Work Terms (Experiments/Experience)
    const exps = work_terms.map((term, idx) => {
      if (cb !== undefined && cb !== null) {
        return (
          <span key={'exp-' + idx} className="info">
            <a className="project-link" onClick={cb(term.file)}>
              {term.name}
            </a>
          </span>
        );
      } else {
        return (
          <span key={'exp-' + idx} className="info">
            <a className="project-link" href={term.file}>
              {term.name}
            </a>
          </span>
        );
      }
    });

    return (
      <div className="output ls-grid">
        {resume}
        {projs}
        {exps}
      </div>
    );
  },
  posts: (unused, cb) => {
    const postLinks = Object.keys(postMap).map((slug) => {
      const PostContent = postMap[slug].react;
      const attributes = postMap[slug].attributes;

      const link = () => {
        if (cb !== undefined && cb !== null) {
          // Pass a special format that Shell.jsx recognizes for rendering components
          // The format logic in Shell.jsx expects a string starting with "/" to look up in StringToPageComponents
          // But here we want to render the Markdown component directly.
          // We need to adapt Shell.jsx or trick it.
          // Currently Shell.jsx does:
          // result = f("", x => {
          //   const a = x.slice(1);
          //   let Component = StringToPageComponents[a];
          //   ...
          // })

          // Since we can't easily modify StringToPageComponents dynamically in Shell.jsx from here,
          // we can pass a callback that returns the Component directly if we change Shell.jsx logic,
          // OR we can update Shell.jsx to handle a special "post:" prefix or just pass the component itself.

          // Let's look at Shell.jsx logic again:
          // It calls cb(project.pageLink) which is a string.
          // Then Shell.jsx uses that string to look up Component.

          // I will use a different approach. I will modify Shell.jsx to accept an object or a special signal.
          // But wait, the cb in Shell.jsx is:
          // x => { ... }
          // so we call cb("/someString")

          // I'll use a hack: I'll register the posts into a global object that Shell can access,
          // or I'll modify Shell.jsx to look up posts from post_loader as well.

          // Better: Update Shell.jsx to try looking up in StringToPageComponents OR postMap.
          // For now, let's just pass the slug with a prefix "/post/"

          return (
            <a className="project-link" onClick={cb('/post/' + slug)}>
              {attributes.title || slug}
            </a>
          );
        } else {
          return (
             // Fallback if no callback (shouldn't happen in Shell)
             <span className="project-link">{attributes.title || slug}</span>
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
  exps: (flag, cb) => {
    if (flag.length === 0) {
      return (
        <div>
          {work_terms.map((term, idx) => {
            if (cb !== undefined && cb !== null) {
                return (
                  <span key={term + idx} className="info">
                    <a className="project-link" onClick={cb(term.file)}>
                      {term.name}
                    </a>
                  </span>
                );
            }
            else {
                return (
                  <span key={term + idx} className="info">
                    <a className="project-link" href={term.file}>
                      {term.name}
                    </a>
                  </span>
                );
            }
          })}
        </div>
      );
    } else {
      if (flag.length !== 1 || flag[0].length <= 2) {
        return null;
      }
      if (flag[0].substr(0, 2) !== '--') {
        console.log(flag[0].substr(0, 2));
        return null;
      }
      const modifiedFlag = flag[0]
        .substr(2)
        .toLowerCase()
        .trim();
      const ioa = inObjectArray(work_terms, 'name', modifiedFlag);
      if (ioa[0]) {
        return (
          <span className="info">
            <Link className="project-link" href={work_terms[ioa[1]].file}>
              {work_terms[ioa[1]].name}
            </Link>
          </span>
        );
      } else {
        return (
          <div className="output error">
            Undefined project: &nbsp;
            {flag[0]}
          </div>
        );
      }
    }
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
