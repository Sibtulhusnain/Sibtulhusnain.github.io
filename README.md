# Sibtul Husnain’s portfolio

The portfolio is a static HTML, CSS, and JavaScript site hosted at [sibtulhusnain.github.io](https://sibtulhusnain.github.io/).

| Path | What to edit |
| --- | --- |
| `index.html` | Homepage, selected work, video feature, bio, experience, and contact |
| `rider.html`, `snap-lancer.html`, `mcp-2.html`, `mustang.html` | Individual project pages |
| `assets/css/style.css` | Shared styles and responsive layout |
| `assets/js/` | Project filtering, motion controls, and the contact brief |
| `assets/images/` | Portrait, favicon, and tool logos |
| `assets/projects/<project>/` | Images and video for each project |

To add a project, create its page at the repository root, add its media under `assets/projects/`, and link it from the selected-work section in `index.html`. Keep existing page filenames so shared case-study links continue to work.

Open `index.html` in a browser to preview the static pages. The YouTube embed and hosted fonts need internet access. The contact brief opens an email draft in the visitor’s mail app.

GitHub Pages publishes from the root of `main`. Commit and push changes using GitHub Desktop, then check the deployment under **Actions** in the repository.
