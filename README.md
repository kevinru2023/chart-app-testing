# Chart App: Test Suite (CS 362 team project)

Team project for **CS 362 (Software Engineering II) at Oregon State University**, Spring 2025. Our team ("Los Tres Leches Amigos") was given a SvelteKit charting app and built a full testing pipeline around it: **unit tests (Vitest), integration tests, end-to-end tests (Playwright), and CI with GitHub Actions**. Mirrored here from the course organization with full commit history.

**My contributions (Kevin Rubio):** set up the CI/CD workflow (`.github/workflows/build-and-test.yaml`, `test-on-push.yaml`), project dependencies and test scripts, the Playwright configuration, and fixed the pipeline so E2E tests run against a built preview server in CI.

---

## The app under test

This simple charts creation app allows user to:

- create line, scatter, and bar charts/plots
- specify `x` and `y` values to be plotted
- specify labels for the `x` and `y` axis
- clear chart data
- save chart to local storage
- visualize saved graphs in gallery view
- re-open saved graphs
- delete saved graphs

This app uses local storage.

This app is designed for software testing purposes, ideally using Vitest and Playwright. The software testing dependencies are not included.

Install dependencies with:

```sh
npm install
```

Run the development server with:

```sh
npm run dev -- --open
```

> The development server can be accessed at [localhost:5173/](http://localhost:5173/).

To build the app, run:

```sh
npm run build
```

Preview your production build locally with:

```sh
npm run preview -- --open
```

> The local production build can be accessed at [localhost:4173/](http://localhost:4173/).

This app uses [QuickChart](https://quickchart.io/), Vite, SvelteKit/Svelte 5, TailwindCSS, and HeroIcons.
