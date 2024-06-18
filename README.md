# Superpipe Studio - experimentation and optimization for LLM pipelines

_Build, evaluate and optimize your LLM pipelines to increase accuracy and reduce cost. Use with [Superpipe](https://github.com/villagecomputing/superpipe) or with your favorite LLM framework. Easily deploy it on your own infra._

---
<div align="center">

[![Superpipe](http://img.youtube.com/vi/fKKmUm12LDY/0.jpg)](http://www.youtube.com/watch?v=fKKmUm12LDY "Superpipe")

</div>

## Getting Started

Superpipe Studio is built with Next JS and can be run locally or deployed on Vercel. It requires a database and can optionally provide authentication via Clerk. It works with both SQLite and Postgres. When running locally we recommend using SQLite for simplicity, and in production via recommend using Postgres.

## Running Studio locally

First, setup your environment checking out the repo, installing Node JS v18 or later, and running `npm install`.

Create a `.env.local` file in the project root directory by copying and renaming the `.env` file.

### Running with SQLite:
- `npm run migrate-deploy:sqlite`
- `npm run dev`

### Running with Postgres:
- In `.env.local` set `NEXT_PUBLIC_APP_DATABASE_PROVIDER=postgres`
- Create a `.env` file inside `prisma-postgres` folder
- Add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` with the URL of your postgres database
- `npm run migrate-deploy:postgres`
- `npm run dev:postgres`

## Authentication

Studio can be used without any authentication (for local testing) or with Clerk authentication.

Authentication is disabled by default by setting `NEXT_PUBLIC_AUTHENTICATION=disabled` in the `.env`/`.env.local` file.

### Enable Authentication with Clerk

To enable Clerk authentication while running locally:

1. Create a Clerk organization and from the Clerk dashboard, grab your publishable key and secret key.
2. Create a `.env.local` file in the project root by copying `.env` and set `NEXT_PUBLIC_AUTHENTICATION=enabled`
3. Add the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` variables with their respective Clerk values, to the `.env.local` file
4. `npm run dev` or `npm run dev:postgres`
5. Download and install ngrok
6. Open command line, run `ngrok http 3000` and copy URL
7. Navigate to Webhooks page in the Clerk dashboard, add the `<ngrok_url>/api/webhook/clerk/user`, with user filter
8. Navigate to Studio (default [http://localhost:3000/](http://localhost:3000/)) and log in

If you're looking to enable auth in a Vercel deployment, follow the Vercel deployment instructions below.

### Authenticating Superpipe Studio requests

Once you've enabled authentication in Studio, any programmatic requests to the Studio API need to be authenticated with an API key. This includes requests made automatically by the Superpipe SDK.

To get your Studio API key:

1. Login to your Studio instance
2. In the account menu (top right corner), click "Manage Account"
3. Grab your API key from the "API Management" section

If you're using Studio with the Superpipe SDK, set the `SUPERPIPE_API_KEY` environment variable to your API key. If you're using Studio via REST API, set the `x-api-key` header to your API key.

## Basic Usage

Studio integrates with Superpipe SDK, allowing you to log pipelines, create datasets and run experiments on them with minimal effort if you're already using Superpipe SDK to build your pipelines.

For details on how to use Studio with Superpipe SDK and advanced usage details, see the [Superpipe Studio docs](https://docs.superpipe.ai/studio/).

### Usage Examples

**Logging**

```python
input = {
  ...
}
pipeline.run(data=input, enable_logging=True)
```

**Datasets**

```python
from studio import Dataset
import pandas as pd

df = pd.DataFrame(...)
dataset = Dataset(data=df, name="furniture", ground_truths=["brand_name"])
```

**Experiments**

```python
import pandas as pd

df = pd.DataFrame(...)
pipeline.run_experiment(data=df)
```

## Deploying Studio with Vercel

Studio is a Next JS app and can be easily deployed on Vercel or other hosting solutions compatible with Next JS. Hosting Studio on Vercel requires a Vercel account, a postgres database URL and optionally, a Clerk account for authentication.

**A. Setup your Postgres database**

You can use any Postgres provider as long as it provides you an authenticated database URL that is accessible from Vercel.

**B. (Optional) Setup Clerk authentication**

1. Create a Clerk organization and from the Clerk dashboard, grab your publishable key and secret key.
2. Navigate to Webhooks page in the Clerk dashboard, add the `<your_studio_url>/api/webhook/clerk/user`, with user filter

**C. Deploy superpipe-studio to Vercel**

1. Create a new Vercel project
2. Set env vars:
   1. `POSTGRES_PRISMA_URL` = your full DB url
   2. `POSTGRES_URL_NON_POOLING` = your full DB url
   3. `CLERK_SECRET_KEY` (from your Clerk project)
   4. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from your Clerk project)
   5. `NEXT_PUBLIC_AUTHENTICATION` = `enabled`
   6. `NEXT_PUBLIC_APP_DATABASE_PROVIDER` = `postgres`
3. Checkout or fork the repo & go through the standard Vercel deployment flow
4. Once deployed, navigate to your Studio URL, login and grab your API key

## Development - making DB schema changes

The app is using Prisma with two different providers: **SQLite** and **Postgres**. 

There are two different folders for each `prisma_postgres` and `prisma_sqlite`. Whenever you run an individual prisma command you have to specify which schema to use with `--schema=./prisma_postgres/schema.prisma` or `--schema=./prisma_sqlite/schema.prisma`

### Steps for Schema Changes

Superpipe studio uses dynamically generated tables to store pipeline logs, datasets and experiments. When you make schema changes, Prisma will try to drop the dynamic tables. It is very important that you manually remove these drop statements from the generated migrations.

1. Make the schema change in both folders.
2. `npm run create-migration:postgres` and `npm run create-migration:sqlite`
3. Modify the generated migrations
    - Remove SQL instructions to drop the dynamic tables
    - Modify the rest of the instructions to try to avoid unnecessary table drops
4. `npm run migrate-deploy:postgres` or `npm run migrate-deploy:sqlite`
5. `npm run dev` or `npm run dev:postgres`

If the Migration deploy fails, a failed migration record will be generated in the `_prisma_migrations` table. Re-running the deploy command will fail even if the migration error is fixed. In order to resolve this there are two options:
1. Remove the record from the table and re-run the deploy command
2. Run the following command which will mark the broken record as rolled-back and allow us to insert a new record with the same name. Don't forget to replace the name of the migration folder and the database provider accordingly
`npx prisma migrate resolve --rolled-back ${MIGRATION_FOLDER_NAME} --schema=./prisma_${postgres or sqlite}/schema.prisma`

## Logging 

To change log level set the `LOG_LEVEL` environment variable to one of: `error`, `warn`, `info`, `debug` (default is error)