# Lynky

A small and simple URL shortener build on edge technology.

## Getting Started

Clone the repository and install all dependencies using [pnpm](https://pnpm.io/).

```sh
pnpm install
```

Copy `wrangler.example.jsonc` to `wrangler.jsonc`:

```sh
cp wrangler.example.jsonc wrangler.jsonc
```

Create a new [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) namespace and add it to the `wrangler.jsonc`.

```sh
pnpm wrangler kv namespace create LYNKY_DATA
```

Run a development server:

```sh
pnpm dev
```

## Usage

To use the app from the command line you can use a tool like the [httpie CLI](https://httpie.io/cli).

Call the `/shorten` endpoint to generate a new short link.

```sh
http POST :8787/shorten url=https://duckduckgo.com/
```

Entering the returned URL e.g. in the browser will automatically redirect to the original URL.

## Deployment

To deploy the app to Cloudflare, make sure you have created and configured a KV namespace first, then run the `deploy` command.

```sh
pnpm deploy
```

## Development

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```sh
pnpm cf-typegen
```

### Architecture

![Architecture overview](./architecture.png)
