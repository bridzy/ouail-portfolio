# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page personal portfolio for Ouail Lekhchine (Data Analyst / Data Scientist / Consultant Data & IA), deployed on GitHub Pages at https://bridzy.github.io/ouail-portfolio/. Plain static site: no framework, no build step, no package manager, no tests or linter. All user-facing content is in **French** (`<html lang="fr">`); keep new copy in French.

## Running locally

```
python -m http.server 8000
```

The visitor counter fetches from GoatCounter, so open via a server rather than `file://`.

## Architecture

- `index.html` — all content. Sections are `<section id="..." class="section ...">`: hero (no `.section` class), about, experience, projects, skills, education (includes certifications), interests, contact, then the footer. Headings use a numbered `<span class="section-number">NN.</span>`; inserting/removing a section means renumbering the following ones. The page background is one solid blue (`--bg`), with no gradients, bands or scroll animations; keep it static.
- `script.js` — one `DOMContentLoaded` handler calls `init*()` functions. Behavior is wired by ids/classes in the HTML:
  - `initActiveNavLink()` highlights nav links by matching `#hero, .section` ids against `href="#id"`.
- `style.css` — all colors are CSS variables in `:root`. The site has a single fixed navy theme (no light/dark toggle) and nothing moves: no background animation, scroll reveals, hover lifts or animated counters — keep it static. Breakpoints: 1024px, 768px, 480px at the end of the file.
- `experiences_projets_ouail.md` — source-of-truth CV text. Not loaded by the site; use it when adding or rewording content.
- `assets/` — images, `CV_Ouail_Lekhchine.pdf` (linked by the "Télécharger mon CV" buttons; replace this file to update the CV), and `og-image.png` (1200×630 LinkedIn/Open Graph preview, referenced by absolute URL in `<head>`). Some filenames contain spaces/accents.

## Projects section

Four featured `.project-card`s mirror the four projects on the CV; everything else goes in the compact `.other-projects` list. To link a project's code, add `<a class="project-link" href="..." target="_blank" rel="noopener">Voir le code →</a>` at the end of its `.project-card-body` (see the comment above the section).

## Analytics

GoatCounter (`https://ouail.goatcounter.com`) is loaded at the bottom of `index.html`. `initVisitorCounter()` reads `/counter/TOTAL.json` (falls back to the home-page counter); this requires "Allow adding visitor counts on your website" to stay enabled in GoatCounter settings.
