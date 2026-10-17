# template-bun-ts

Personal `bun create` template for TypeScript projects on Bun.

The stack: tsconfig `@tsconfig/strictest` + `@tsconfig/bun`, oxlint + oxfmt via `@yoshintame/ox-config`, git hooks and checks via `hk-config`, CI via `yoshintame/workflows`, `bun test`, knip and dotenvx. The seed is a `Bun.serve` hello world with one test.

## Usage

```sh
bun create yoshintame/template-bun-ts my-app
cd my-app
mise install
bun install
hk install --mise
bun run dev
```

## Scripts

| Script                                | What                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `bun run dev`                         | Run `src/index.ts` in watch mode with `.env.development` through dotenvx |
| `bun run test`                        | `bun test`                                                               |
| `bun run typecheck`                   | `tsc --noEmit` (strictest + bun combo)                                   |
| `bun run depscheck`                   | knip (unused deps / exports)                                             |
| `bun run env:encrypt` / `env:decrypt` | Encrypt or decrypt `.env.*` with dotenvx                                 |

## Development

Tools come from `mise.toml`, checks from the `hk-config` preset in `hk.pkl`. Run `mise install` and `bun install`, then `hk install --mise` once per clone for the git hooks. `hk check --all --slow` runs every check CI runs, `hk fix --all` formats and applies lint fixes.

CI is `.github/workflows/ci.yml` on top of [`yoshintame/workflows`](https://github.com/yoshintame/workflows). The project is an app (`"private": true`); to publish it as a package see [Publishing](#publishing).

Internal imports go through the `#src/*` subpath imports in `package.json` (`#src/index` resolves to `./src/index.ts`), not a tsconfig `paths` alias.

## Publishing

The template is an app. To publish it as a single package:

1. In `package.json` drop `"private": true` and the `preinstall` script (npm runs it on the consumer's install, where `only-allow bun` fails it), set `"version": "0.0.0-development"` (semantic-release sets the real one) and add `exports`, `files`, `repository` and `publishConfig`. A package for Bun consumers can ship its sources as they are: `"exports": { ".": "./src/index.ts" }`, `"files": ["src"]`; the `#src/*` imports travel with it. Drop `src/types/reset.d.ts` and `@total-typescript/ts-reset` too: consumers type-check the shipped sources without ts-reset.
2. Switch `hk.pkl` to the `ts-lib.pkl` preset and add the `lint:package` script it runs: `bun add -d publint @arethetypeswrong/cli`, then `"lint:package": "publint --strict && attw --pack . --profile esm-only"`. A package with a build step prepends `bun run build &&` and adds `"prepack": "bun run build"`: the release job publishes from a clean checkout.
3. `bun add -d semantic-release` and add `"release": { "branches": ["main"] }` to `package.json`.
4. On npmjs a trusted publisher can only be added to an existing package: publish the first version by hand with `version` temporarily set to it, tag that commit `vX.Y.Z`, push the tag, then add the publisher as described in [Registries and permissions](https://github.com/yoshintame/workflows#registries-and-permissions).
5. Add the `release` job from the [`yoshintame/workflows` usage](https://github.com/yoshintame/workflows#usage) to `.github/workflows/ci.yml`, pinned to the same ref as `verify`, with the permissions your registry needs.
