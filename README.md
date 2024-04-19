## Getting Started

- Install `Node v18.19.0`

- `npm install`

### SQLite:
- `npm run migrate-deploy:sqlite`
- `npm run dev`

### Postgres:
- Create a `.env.local` file in root and add `NEXT_PUBLIC_APP_DATABASE_PROVIDER=postgres`
- Create a `.env` file inside `prisma-postgres` folder
- Add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` with the URL of your postgres database
- `npm run migrate-deploy:postgres`
- `npm run dev:postgres`

## Updating DB schema migration steps
The app is using Prisma with two different providers: **SQLite** and **Postgres**. 

There are two different folders for each `prisma_postgres` and `prisma_sqlite`. Whenever you run an individual prisma command to have to specify which schema to use with `--schema=./prisma_postgres/schema.prisma` or `--schema=./prisma_sqlite/schema.prisma`

### Steps for Schema Changes
1. Make the schema change in both folders.
2. `npm run create-migration:postgres` and `npm run create-migration:sqlite`
3. Modify the generated migrations
    - Remove SQL instructions to drop the dynamic tables
    - Modify the rest of the instructions to try to avoid unnecessary table drops
4. `npm run migrate-deploy:postgres` or `npm run migrate-deploy:postgres`
5. `npm run dev` or `npm run dev:postgres`

If the Migration deploy fails, a failed migration record will be generated in the `_prisma_migrations` table. Re-running the deploy command will fail even if the migration error is fixed. In order to resolve this there are two options:
1. Remove the record from the table and re-run the deploy command
2. Run the following command which will mark the broken record as rolled-back and allow us to insert a new record with the same name. Don't forget to replace the name of the migration folder and the database provider accordingly
`npx prisma migrate resolve --rolled-back ${MIGRATION_FOLDER_NAME} --schema=./prisma_${postgres or sqlite}/schema.prisma`

### Disable Authentication
1. The `.env` file should be set for running the project locally with authentication disabled. This means:
    - **NEXT_PUBLIC_AUTHENTICATION**=disabled
    - **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**=pk_test_cHJvcGVyLWR1Y2stOTQuY2xlcmsuYWNjb3VudHMuZGV2JA
    - **CLERK_SECRET_KEY**=CLERK_SECRET_KEY

### Enable Authentication with Clerk

Make sure NEXT_PUBLIC_AUTHENTICATION is 'enabled'

1. Create a Clerk organization and navigate to the API Keys page
2. Create a `.env.local` file in root and add `NEXT_PUBLIC_AUTHENTICATION=enabled`
3. Add the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` variables with their respective Clerk values, to the .env.local file
4. `npm run dev` or `npm run dev:postgres`
5. [Download/Install ngrok]
6. Open command line, run `ngrok http 3000` and copy URL
7. Navigate to Clerk Webhooks page, add the `<ngrok_url>/api/webhook/clerk/user`, with user filter
8. Access http://localhost:3000/ and log in

### Logging 

To change log level set the LOG_LEVEL value inside the env file to one of: error, warn, info, debug