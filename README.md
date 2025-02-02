# platvids

A video platform designed to help you develop new skills.

## Local development

1. Install dependencies

```sh
npm install
```

2. Copy [.env.example](./.env.example) file into [.env](./.env) and update values accordingly.

```sh
cp .env.example .env
```

3. Start the database.

```sh
docker compose up
```

4. Create and/or migrate database schemas.

TBD

5. Start the application.

```sh
npm run dev
```

## Database scripts

- Generate table changes.

```sh
npm run db:generate
```

- Apply table changes/migration.

```sh
npm run db:migrate
```

- Open database in the browser.

```sh
npm run db:studio
```

## Database CLI helpers

- Connect to docker database.

```
docker exec -it platvids-db-1 psql --host=localhost --dbname=${DB_NAME} --username=${DB_USER}
```

- View current user.

```sql
platvids=# SELECT current_user;
```

- Connect to database name.

```sql
platvids=# \c platvids;
```
