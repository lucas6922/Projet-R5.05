
# Project R5.05

## Database schema

<img width="2960" height="1456" alt="image" src="https://github.com/user-attachments/assets/96cad476-9c21-4c83-8ade-4a239f7e88d7" />

## Environment variables

Create a `.env` file at the root of the project before running the API.

### Example `.env` file

```env
DB_FILE=file:local.db
JWT_SECRET=6b78512e50e08b651ae3ce7b352ca06f
MAIL_HOST=mailpit
MAIL_PORT=1025
```

- `DB_FILE`: SQLite database file path
- `JWT_SECRET`: Secret key used to sign JWT tokens
- `MAIL_HOST`: SMTP server hostname
- `MAIL_PORT`: SMTP server port

## Run locally (with docker)

Clone the project

```bash
  git clone https://github.com/lucas6922/Projet-R5.05/
```

Start the API and Mailpit(local mail serve) using:
```bash
  docker-compose up 
```

- The API will be available at: `http://localhost:3000`
- Mailpit (web UI) will be available at: `http://localhost:8025`





## Run Locally without docker

Install dependencies

```bash
  npm install
```

Create local database

```bash
  npm run db:push
```

Seed database

```bash
  npm run db:seed
```

Start the server

```bash
  npm run dev
```

> **Note:** No mail server is provided when running without Docker.  
> To receive emails, you must configure a valid SMTP server using `MAIL_HOST` and `MAIL_PORT` in the `.env` file.


## API Documentation

The API documentation is available at `https://lucas6922.github.io/Projet-R5.05
## Mail testing (Mailpit)

When running with Docker Compose, the project includes Mailpit for testing outgoing emails.

After creating a user account:
1. Open the Mailpit web UI at `http://localhost:8025`
2. Look for the verification email
3. Open the email and click the verification link to validate the account