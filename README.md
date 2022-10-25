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
<img width="1135" alt="197812466-f730a85d-dea3-4ac6-b7a3-677ab685e528" src="https://user-images.githubusercontent.com/76580/197813061-d94a75e6-8525-402f-8786-ec9f0bb04b13.png">
