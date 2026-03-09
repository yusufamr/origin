# Database Setup & Usage

## 0. Setting Up on a New Laptop

1. Make sure **Node.js** is installed → [nodejs.org](https://nodejs.org) (LTS version)
2. Install **pnpm** if you don't have it:
   ```bash
   npm install -g pnpm
   ```
3. Clone the repo and go into the project folder:
   ```bash
   git clone <your-repo-url>
   cd origin
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Create a `.env` file in the project root and add your database URL (see step 1 below)

---

## 1. Set Up a Free Cloud Database (Neon)

1. Go to [neon.tech](https://neon.tech) and sign up for a free account
2. Click **New Project**, give it a name (e.g. `origin`), and click **Create**
3. Once created, go to the **Dashboard** of your project
4. Find the **Connection String** section and copy the URI — it looks like:
   ```
   postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Create a `.env` file in the project root if it doesn't exist:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

---

## 2. Push Schema to the Database

This creates (or updates) the tables in your database to match your schema files.

```bash
pnpm db:push
```

Run this every time you make changes to your schema files in `src/db/schema/`.

---

## 3. Open Drizzle Studio

Drizzle Studio is a visual UI to browse and edit your database tables.

```bash
pnpm db:studio
```

Then open [https://local.drizzle.studio](https://local.drizzle.studio) in your browser.

> Make sure your `DATABASE_URL` is set in `.env` before running either command.
