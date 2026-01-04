# Agent Context & Operational Guide

## Project Overview

This project is a **Personal Portfolio & Blog** designed as a comprehensive **Linux Terminal Simulation** running in the browser. Unlike standard static sites, this application mimics a real shell environment, allowing users to interact with content via command-line instructions.

**Tech Stack:**
- **Framework:** Next.js (React)
- **Styling:** CSS (Custom themes including Gruvbox, Nord, GitHub)
- **Content:** Markdown/MDX (processed via `frontmatter-markdown-loader`)
- **Environment:** Nix (for reproducible development environments)

## Agent Capabilities & Tools

As an AI agent operating within this environment, I have access to a specific suite of tools and shell commands to assist with development, maintenance, and content creation.

### CLI Tools
I am authorized to execute the following classes of shell commands:
- **Version Control:** `git` (status, add, commit, diff, log).
- **Environment Management:** `nix` (specifically `nix develop --impure` to enter the dev shell).
- **Node.js Runtime:** `npm` (install, run scripts), `node` (execution of build scripts like `generate-rss.js`).
- **System Utilities:** Standard Linux utilities (`ls`, `grep`, `cat`, etc.) for file system exploration.

### Toolset
I utilize the following API tools to interact with the codebase:
- **File Operations:** `read_file`, `write_file`, `replace` (for precise code editing).
- **Navigation:** `list_directory`, `glob`, `search_file_content` (ripgrep-powered).
- **Analysis:** `codebase_investigator` (for high-level architectural understanding).
- **Execution:** `run_shell_command` (executes bash commands).

## Operational Context & Workflow

### "How We Got Here"
1.  **Environment Setup:** The project relies on `nix` to manage dependencies. Attempts to run `node` directly often fail if the nix shell is not active. The standard invocation for running scripts is `nix develop --impure --command <command>`.
2.  **Content Management:** Blog posts are stored in `content/posts/`. New posts require running `scripts/generate-rss.js` to update the RSS feed, though this is often handled by the build process.
3.  **Recent Activities:**
    - Established the protocol for adding new blog content.
    - Documented the "How to Use" guide for the terminal interface.
    - Verified the `nix` wrapper workflow for executing project scripts.

### Key Mandates
- **Nix First:** Always check if a command needs to run inside the `nix develop` environment.
- **Git Hygiene:** Do not commit blindly. Check `git status` and `git diff` before staging. Only commit files explicitly related to the task.
- **Style Consistency:** Mimic existing code styles (ESLint/Prettier configs are present).

## Project Features (The "Simulated" World)

The application implements a virtual file system and window manager:
- **Commands:** `ls`, `posts`, `projects`, `conf`, `tab`, `search`, `neofetch`.
- **View Modes:** Posts can be viewed `inline`, in a `popup`, on a separate `page`, or in a new `tab`.
- **Theming:** Dynamic CSS variable switching (e.g., `conf theme:gruvbox`).
