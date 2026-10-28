# aksharaje.github.io

Personal academic site. Static HTML/CSS/JS, no build step. Hosted on GitHub Pages.

## Deploy

1. Create a public repo on GitHub named **exactly** `aksharaje.github.io`.
2. From this folder:
   ```
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin git@github.com:aksharaje/aksharaje.github.io.git
   git push -u origin main
   ```
3. Visit https://aksharaje.github.io (first deploy takes 1–2 minutes).

## Edit

| What you want to change        | File                                           |
| ------------------------------ | ---------------------------------------------- |
| Name, bio, photo, contact      | `index.html`: hero section                    |
| Rotating tagline               | `rotating.js`: `lines` array                  |
| "How I got here" Sankey        | `sankey.js`: `data.nodes` and `data.links`    |
| "Research threads" Sankey      | `papers.html`: inline `data` block            |
| Papers listed on home          | `index.html`: `.papers` section               |
| Full papers list               | `papers.html`                                  |
| News                           | `index.html`: `.news` section                 |
| CV                             | `cv.html`                                      |
| Colors / fonts                 | `styles.css`: `:root` variables               |

### Adding your photo
Drop a square image at `assets/photo.jpg`. Recommended ~400×400px.

### Adding your papers
Put PDFs in `papers/` and link to them like `<a href="papers/your-paper.pdf">pdf</a>`.

## Sankey editing tips

Nodes have `col` (0–4 on home, 0–2 on papers): this fixes which column they live in.
Links have `value`: bigger values make thicker ribbons. Rough weights (1–5) are fine.
Make sure every node id in `links` exists in `nodes`.
