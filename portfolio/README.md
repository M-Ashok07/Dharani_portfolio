# Dharani R — Portfolio

Static portfolio site (plain HTML/CSS/JS, no build tooling required), containerized
with nginx and deployable through the included Jenkins pipeline.

## Project structure

```
.
├── index.html          Home — hero, about, skills, education
├── projects.html       Project detail (Arduino health monitor)
├── internship.html     Internship detail (Egrove Systems)
├── schedule.html       Interview-scheduling form for recruiters/HR
├── css/style.css
├── js/script.js
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── Jenkinsfile
└── README.md
```

## Wiring up the "Schedule Interview" form

The site is fully static (no backend server), so `schedule.html` posts to
[Formspree](https://formspree.io) — a free service that forwards form
submissions to your email without you writing any backend code:

1. Sign up at formspree.io and create a new form. It gives you an endpoint
   like `https://formspree.io/f/abc123`.
2. In `schedule.html`, replace `YOUR_FORM_ID` in the `<form action="...">`
   line with that ID.
3. Submissions will land in your inbox, and the page shows an inline
   confirmation message once sent (handled in `js/script.js`).

Alternatives if you'd rather not use Formspree: Netlify Forms (if you ever
host on Netlify), a simple serverless function (AWS Lambda / Cloud Function)
behind an API Gateway, or embedding a Calendly widget instead of a custom
form. The current form degrades gracefully — if the fetch request fails, it
tells the visitor to email you directly instead.

## Run locally (no Docker)

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Run with Docker

```bash
docker build -t dharani-portfolio .
docker run -d -p 8080:80 --name dharani-portfolio dharani-portfolio
# visit http://localhost:8080
```

## CI/CD with Jenkins

The `Jenkinsfile` defines a declarative pipeline:

1. **Checkout** — pulls the repo.
2. **Lint HTML/CSS** — quick sanity check on markup.
3. **Build Image** — `docker build` tagged with the Jenkins build number and `latest`.
4. **Smoke Test** — runs the built image briefly and curls `/` to confirm it serves.
5. **Push Image** — pushes to your container registry.
6. **Deploy** — stops/removes any existing container and runs the new image.

### Before your first run

1. Push this project to a Git repo Jenkins can reach (GitHub, GitLab, etc.) and
   create a Jenkins **Pipeline** job pointing at it (or a **Multibranch Pipeline**
   for PR builds), using this `Jenkinsfile`.
2. In `Jenkinsfile`, set `REGISTRY` and `IMAGE_NAME` to your own registry/namespace.
3. In Jenkins, add a credential (Manage Jenkins → Credentials) of kind
   *Username with password* with the ID `dockerhub-credentials` (or update
   `REGISTRY_CREDS` to match whatever ID you use).
4. Make sure the Jenkins agent has Docker available (either install Docker on the
   agent, or run Jenkins itself as a container with the Docker socket mounted).
5. If you're deploying to a separate server rather than the Jenkins host, swap the
   `Deploy` stage for the commented-out SSH block and add an SSH credential.

### Triggering builds

Add a webhook from your Git host to Jenkins, or configure "Poll SCM" /
"GitHub hook trigger" in the job settings, so pushes to `main` kick off the pipeline
automatically.

## Editing content

All the resume content lives directly in `index.html` — sections for skills,
experience/projects, education, certifications, and contact. Update that file and
redeploy; no rebuild tooling is involved beyond the Docker image itself.
