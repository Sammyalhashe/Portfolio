import React from 'react';
import Link from 'next/link';
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
    file: '/pages/ms.html',
  },
  {
    name: 'Microsemi',
    file: `/pages/microsemi.html`,
  },
];
const cmds = {
  help: () => {
    return (
      <div className="output">
        <div className="info">
          Enter <span className="highlight">"info"</span> to get my general info
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
            sammyalhashemi1@outlook.com
          </span>
        </div>
      </div>
    );
  },
  project: () => {
    const projs = projects.map(project => {
      const link = () => {
        if (project.pageLink) {
          return (
            <Link href={project.pageLink}>
              <a className="project-link">{project.name}</a>
            </Link>
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
  old: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = 'https://sammyalhashemi.com';
    a.click();
    a.remove();
    return <div className="output info">Website opened on another tab...</div>;
  },
  resume: () => {
    const a = document.createElement('a');
    a.target = '_blank';
    a.href =
      'https://firebasestorage.googleapis.com/v0/b/arduinohandler.appspot.com/o/Downloadable%2Fresume.pdf?alt=media&token=42bc0b75-770a-48ac-90de-e31703ae4b73';
    a.click();
    a.remove();

    return <div className="output info">Resume opened on new page</div>;
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
      <div id="object" class="image">
        <img src="/collision_pic.jpg" alt="A picture of me" />
      </div>
    );
  },
};

export default cmds;
