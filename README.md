# INSTALL

Pre-requisites:

- Node

```sh
$ npm ci
```

# Dev

```sh
$ npm start
```

# Build

```sh
$ npm run build
```

A Github Actions [deploy](.github/workflows/deploy.yml) task will build and deploy to `gh-pages` branch when pushing on `main`. Resulting app will be available at: https://{username}.github.io/{reponame}

NB: Make sure you have Github Pages enabled in your project's settings.
