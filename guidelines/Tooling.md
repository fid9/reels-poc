## Tooling

### Yarn 2

#### Workspaces

Monorepos might use the same packages, use workspaces to share them.

https://yarnpkg.com/features/workspaces

#### Linker

[PNP](https://yarnpkg.com/features/pnp) promises a faster and smarter process, makes deployments instant and saves space. It however does not work with many packages we rely on.
Until that changes, the guideline is to use the [`node_modules`](https://github.com/yarnpkg/berry/tree/master/packages/plugin-node-modules) linker.

#### Overrides

If a package has an issue that is unresolved on upstream, you may use `yarn patch`.

https://yarnpkg.com/cli/patch

#### Installation

See [official docs](https://yarnpkg.com/getting-started/install).

```shell script
# install yarn 1.x globally
npm install -g yarn

cd ~/path/to/project

# install yarn 2 to the project
yarn set version berry

# set node_modules linker
echo "nodeLinker: node-modules" >> .yarnrc.yml

# install packages
yarn
```

#### CI Usage

Make sure the CI is installing the exact packages we used in development.

```shell script
yarn install --frozen-lockfile
```
