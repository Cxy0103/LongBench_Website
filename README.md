# LongBench Website

LongBench evaluation portal static website.

## Deploy On GitHub Pages

This website is a static site. GitHub Pages can serve it directly from the repository root.

1. Create a new GitHub repository, for example `LongBench_Website`.
2. Push this local repository to GitHub.
3. Open the GitHub repository page.
4. Go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. Save the settings.

The website will be available at:

```text
https://<your-github-username>.github.io/LongBench_Website/
```

If you use a different repository name, replace `LongBench_Website` in the URL.

## Run On Server

Start the static web server from the server:

```bash
cd /home/xueyao/LongBench_Website
./command.sh
```

Default port is `5174`. If that port is already in use, the script automatically tries the next ports and prints the final URL. To request a specific starting port:

```bash
PORT=5180 ./command.sh
```

If the server port is directly reachable from your local machine, open the printed network URL, for example:

```text
http://<server-ip>:5174
```

If direct access is blocked, use SSH port forwarding from your local machine:

```bash
ssh -L 5174:127.0.0.1:5174 <user>@<server>
```

Then open this in your local browser:

```text
http://127.0.0.1:5174
```

No build step is required. The current preview stores local submissions and generated leaderboard rows in browser `localStorage`.

## Structure

- `index.html`: page structure.
- `assets/css/styles.css`: visual styles.
- `assets/js/app.js`: form flow, leaderboard rendering, export, and local evaluation simulation.
- `data/leaderboard.js`: official seed leaderboard rows.
- `docs/architecture.md`: recommended backend API and data model.

## Current Capabilities

- Submit a policy package form with model file validation.
- Simulate evaluation and append the result to the leaderboard.
- Filter open-source policies.
- Switch leaderboard views between overview, task scores, and capability scores.
- Export the merged leaderboard as JSON.

## Backend Handoff

For real deployment, use the API boundary in `docs/architecture.md`. The frontend storage functions in `assets/js/app.js` are the replacement points for server calls.
