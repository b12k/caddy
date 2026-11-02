# The missing npm wrapper for [Caddy](https://caddyserver.com)

[Caddy](https://caddyserver.com) is a web server and reverse proxy with automatic HTTPS.

This library is a thin wrapper which automatically downloads the correct Caddy binary for your platform on install, verifies its SHA-512 checksum, and exposes it as a CLI command.

## Installation

Typically installed as a dev dependency:

**Local (project)**

```bash
npm install --save-dev @b12k/caddy
```

Recent npm versions require approving dependency install scripts. Approve this package so its postinstall script can download the Caddy binary:

```bash
npm approve-scripts @b12k/caddy
```

```bash
pnpm add -D --allow-build=@b12k/caddy @b12k/caddy
```

pnpm 11 and later require the `--allow-build` flag so this package's postinstall script can download the Caddy binary.

```bash
yarn add --dev @b12k/caddy
```

**Global**

```bash
npm install -g --allow-scripts=@b12k/caddy @b12k/caddy
```

Global npm installs cannot use `npm approve-scripts`; use `--allow-scripts` instead.

```bash
pnpm add -g --allow-build=@b12k/caddy @b12k/caddy
```

pnpm 11 and later require the `--allow-build` flag during global install as well.

```bash
yarn global add @b12k/caddy
```

The postinstall script downloads the standard Caddy binary for your platform from the [official GitHub release](https://github.com/caddyserver/caddy/releases). Custom builds and additional plugins are not included.

If you already installed with npm or pnpm and the build was blocked, approve and rebuild it:

```bash
npm approve-scripts @b12k/caddy
npm rebuild @b12k/caddy
```

```bash
pnpm approve-builds @b12k/caddy
pnpm rebuild @b12k/caddy
```

## Usage

See the [Caddy CLI documentation](https://caddyserver.com/docs/command-line) for the full list of commands and flags.

**Local install**

```bash
npx caddy run --config Caddyfile
```

```bash
pnpm exec caddy run --config Caddyfile
```

```bash
yarn caddy run --config Caddyfile
```

**Global install**

```bash
caddy run --config Caddyfile
```

**`package.json` script**

```json
{ "scripts": { "serve": "caddy run --config Caddyfile" } }
```

To serve the current directory without a Caddyfile:

```bash
pnpm exec caddy file-server --listen localhost:8080
```

To check the installed binary version:

```bash
pnpm exec caddy version
```

## Troubleshooting

If the binary fails to install, re-run with `--foreground-scripts` to see the postinstall output:

```bash
npm install --save-dev @b12k/caddy --foreground-scripts
```

```bash
pnpm add -D --allow-build=@b12k/caddy @b12k/caddy --foreground-scripts
```

```bash
yarn add --dev @b12k/caddy --foreground-scripts
```

## Supported platforms

- Linux — x64, arm64
- macOS — x64, arm64
- Windows — x64, arm64

## Version

The npm package version mirrors the Caddy release version, with a wrapper revision suffix (for example, `2.11.7-v.0`).

To install a different Caddy release, define it in `.caddy-version` as `v2.11.7` or `2.11.7` before installing the package. The file is read from the install command's initial working directory (`INIT_CWD`), or the current working directory when `INIT_CWD` is unset.

If you add or change `.caddy-version` after installing, run from that directory:

```bash
pnpm exec caddy-install
```
