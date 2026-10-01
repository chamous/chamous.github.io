# Portfolio — Chames Haj Ayed

Personal portfolio site for **Chames Haj Ayed**, Robotics &amp; Industrial Vision Lead at Hutchinson.

Static HTML / CSS / vanilla JS. No build step, no dependencies, no trackers.

## Structure

```
index.html              # single-page site
assets/resume.pdf       # downloadable CV
assets/css/style.css    # all styling (dark + light themes)
assets/js/main.js       # nav, scroll reveal, canvas background, contact form
assets/img/             # profile photo + favicon
.github/workflows/      # GitHub Pages deployment
```

## Run locally

Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy

The repo ships with `.github/workflows/deploy.yml`, which publishes the site to
GitHub Pages on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push again, or run the `Deploy to GitHub Pages` workflow manually.

The site goes live at `https://<user>.github.io/`.

Afterwards, update the `Sitemap` line in `robots.txt` and `<loc>` in
`sitemap.xml` to your final domain if it differs from the default.

## Update content

All copy lives in `index.html`. Experience, projects, certifications and awards
are plain HTML blocks, so adding an entry means copying an existing card or
timeline item. The contact form opens the visitor's mail client — it has no
backend and needs no configuration.

The CV is served from `assets/resume.pdf`. Replace that file to update the
download; keep the filename so existing links stay valid.

If you later add a form service (Formspree, Web3Forms), change the submit
handler at the bottom of `assets/js/main.js`.

## Contact links

Replace the email in `assets/js/main.js` (`EMAIL`) if you want to change where
the contact form delivers messages. The visible address in the contact section
is in `index.html`.