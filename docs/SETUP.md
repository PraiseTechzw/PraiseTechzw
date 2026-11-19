# Setup and Customization Guide

This repository is organized to keep the public profile clean while still making it easy to maintain and fork.

## Repository Structure

```text
.
|-- .github/
|   |-- CODEOWNERS
|   |-- ISSUE_TEMPLATE/
|   |   |-- bug_report.md
|   |   |-- config.yml
|   |   `-- template_request.md
|   |-- pull_request_template.md
|   `-- workflows/
|       |-- pages.yml
|       `-- signals.yml
|-- assets/
|   |-- signals-dark.svg
|   `-- signals-light.svg
|-- docs/
|   `-- SETUP.md
|-- scripts/
|   `-- signals.mjs
|-- site/
|   |-- 404.html
|   |-- index.html
|   |-- plates/
|   |-- preview.png
|   |-- robots.txt
|   |-- sitemap.xml
|   `-- styles.css
|-- templates/
|   |-- README.md
|   |-- profile-template.md
|   |-- founder-story.md
|   |-- minimal-signal.md
|   |-- open-source-maintainer.md
|   |-- student-standout.md
|   |-- creative-tech.md
|   |-- neon-command-center.md
|   `-- executive-bento.md
|-- CODE_OF_CONDUCT.md
|-- CONTRIBUTING.md
|-- LICENSE
|-- SECURITY.md
|-- SUPPORT.md
`-- README.md
```

## What Lives Where

- `README.md`: the live GitHub profile README shown on the profile page
- `site/`: the GitHub Pages showcase source
- `site/plates/`: real product screenshots used by the showcase, stored as WebP
- `assets/signals-light.svg` and `assets/signals-dark.svg`: committed figures plate for the profile README, one per GitHub theme
- `scripts/signals.mjs`: renders the signals plate from live GitHub data; no dependencies
- `.github/workflows/signals.yml`: refreshes the signals plate daily and commits it when the figures change
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow
- `.github/ISSUE_TEMPLATE/`: issue templates for bugs and template requests
- `.github/pull_request_template.md`: pull request checklist
- `.github/CODEOWNERS`: default ownership for the repository
- `templates/README.md`: premium template gallery and selection guide
- `templates/profile-template.md`: balanced premium portfolio template
- `templates/founder-story.md`: founder and product-led template
- `templates/minimal-signal.md`: elegant low-noise engineering template
- `templates/open-source-maintainer.md`: maintainer template with stronger trust signals
- `templates/student-standout.md`: polished student and early-career template
- `templates/creative-tech.md`: expressive design-forward template
- `templates/neon-command-center.md`: futuristic dashboard-style template
- `templates/executive-bento.md`: high-end senior and consultant template
- `docs/SETUP.md`: maintenance notes and structure guidance
- `CONTRIBUTING.md`: contribution expectations
- `CODE_OF_CONDUCT.md`: contribution behavior expectations
- `SECURITY.md`: private reporting guidance for security issues
- `SUPPORT.md`: support routing for questions and issues
- `LICENSE`: reuse rules

## Customization Order

If you are adapting this for yourself, update things in this order:

1. headline and one-sentence positioning
2. contact links and handles
3. selected projects
4. mission and "why I build" copy
5. toolbox and current focus

## Choosing a Template

Use the template gallery in `templates/README.md` to pick a direction before editing.

- Choose one template as your base.
- Customize it deeply instead of mixing every section from every file.
- Remove anything you cannot maintain.
- If you use external SVG widgets, verify that the services are stable enough for your profile.

## Quality Rules

- Keep the top of the README scannable.
- Lead with identity and proof, not with metrics.
- Prefer a few strong projects over a long project wall.
- Remove any section you will not maintain.
- Use dynamic widgets sparingly.

## Signals Plate

The figures under the headline are not a third-party widget. They are two committed SVGs rendered from the GitHub API, so they load on every theme and never rate-limit into a broken image.

Refresh them by hand:

```bash
GITHUB_TOKEN=... node scripts/signals.mjs
```

Without a token the script still runs, minus the contribution count. The `Refresh signals` workflow does the same thing on a daily schedule and commits only when a figure changes.

## GitHub Profile Notes

For the profile README to display on GitHub, the repository must:

- match the GitHub username
- be public
- contain a root `README.md`

GitHub reference:
- https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme

## GitHub Pages Notes

This repository includes a dedicated Pages site in `site/` and a deployment workflow in `.github/workflows/pages.yml`.

Recommended homepage after Pages is enabled:

- `https://praisetechzw.github.io/PraiseTechzw/`

## Recommended Pinned Repositories

GitHub allows up to six pinned items. Keep the pinned list aligned with the "Selected Work" section for a more consistent profile story.
