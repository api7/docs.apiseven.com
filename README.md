# API7.ai's Documentation Website

This repository contains the source content and codes for [API7.ai](https://docs.apiseven.com/)'s documentation website. It's built using [Docusaurus 2](https://docusaurus.io/) and deployed with API7.ai's infrastructure.

### Run Locally

```
$ npm i

$ npm run start

$ npm run build
```

### How to add new project?

Refer to https://github.com/api7/docs/pull/45

### How to add new document?

> Docusaurus's Official Documents: https://docusaurus.io/docs/create-doc

1. Git clone this repository.

```bash
git clone git@github.com:api7/docs.apiseven.com.git
```

2. Create a new branch.

```bash
# Replace $BRANCH_NAME with your branch name

git checkout -b $BRANCH_NAME
```

3. Create a new file in the corresponding directory, for example, `enterprise_versioned_docs/version-xxx/xxx.md`. For the markdown format, please refer to `docs/enterprise/demo.md`.

4. Add the file to the corresponding sidebar, for example, `enterprise_versioned_sidebars/version-xxx-sidebars.json`. If the sidebar does not exist, create a new one.

5. Commit and push your changes.


