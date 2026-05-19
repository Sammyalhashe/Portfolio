---
title: "How to Use This Terminal Blog"
date: "2026-01-04"
tags: ["meta", "guide", "terminal"]
description: "A comprehensive guide to navigating, customizing, and reading on this CLI-based portfolio."
---

Welcome to my portfolio! If you're reading this, you've likely realized this isn't a standard website. It's a simulated Linux terminal running in your browser, designed to give you a more interactive way to explore my work and thoughts.

While you can click around like a normal website, the real power lies in the command line interface. Here is a guide on how to get the most out of it.

## Navigation & Discovery

Just like a real terminal, everything starts with exploration.

- **`ls`**: The classic command. Lists everything in the current directory, including blog posts, projects, and my resume.
- **`posts`**: Lists all my blog posts.
  - Want to filter? Use `posts --series <name>` or `posts --tag <tag>`.
- **`projects`**: Lists my coding projects.
- **`search <query>`**: Can't find what you're looking for? Type `search` followed by a keyword (e.g., `search react`) to search through post titles and content.

## Customizing Your Reading Experience

One of the unique features of this site is the ability to change how you consume content. By default, posts might open in a way you didn't expect, but you have full control over this.

Use the `conf` command to configure the viewer:

```bash
conf blogView:<mode>
```

Available modes:

1.  **`inline`**: Renders the post content directly in the terminal feed. This is great for maintaining the CLI immersion.
2.  **`popup`**: Opens the post in a modal overlay (like a traditional "Quick View").
3.  **`page`**: Navigates to a full dedicated page for the post. This is the best mode if you want to bookmark or share the specific URL.
4.  **`tab`**: Opens the post in a new terminal tab within the simulation (see "Multitasking" below).

For example, if you prefer reading in a popup, just type:
`conf blogView:popup`

## Theming

Don't like the colors? I've included several popular color schemes.

Use the command:
```bash
conf theme:<theme_name>
```

Supported themes include:
- `default`
- `gruvbox`
- `nord` (and `nord light`)
- `github dark` (and `github light`)

Check `help` or `conf` to see the full list of up-to-date themes.

## Multitasking (Tabs & Splits)

Since this is a terminal simulation, you aren't limited to a single view.

- **Tabs**: You can manage multiple sessions using `tab`.
  - `tab new`: Opens a fresh terminal tab.
  - `tab close`: Closes the current one.
  - If you set your blog view to `tab` (`conf blogView:tab`), clicking a post link will automatically open it in a new tab, keeping your current workspace clean.

- **Splits**: You can split the viewport to view multiple things at once.
  - `right`: Splits the terminal vertically.
  - `down`: Splits the terminal horizontally.

## Sharing Posts

If you find a post you want to share, the best way is to open it in **page** mode or simply copy the link if you are already on a dedicated URL (e.g., `/post/how-to-use-this-blog`). Direct links work even if the user lands on them without navigating through the terminal first.

Happy hacking!
