# Nuxt Comments App

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Create a local Cloudflare D1 database:

```bash
pnpm wrangler d1 migrations apply nuxt-comments --local
```

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Migrations

> https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#migration-workflows

## Production

Create a remote Cloudflare D1 database:

```bash
npx wrangler d1 migrations apply nuxt-comments --remote
```
