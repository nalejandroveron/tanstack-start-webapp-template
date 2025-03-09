# Tanstack Start Webapp Template

This is a template for starting new web applications with the following technologies:
- Tanstack Start.
- Tanstack Forms.
- React.
- TypeScript.
- Drizzle ORM.
- Better Auth (with Organizations Plugin).
- Tailwind v4.
- ArkType.

## Getting Started
I assume you already created your repo and set this base as a template. If not, start from here.

Once that is done, you should check wether you would like to build this using postgres or any other [Drizzle ORM supported database](https://orm.drizzle.team/docs/get-started).

On any case, do the following:
1. Install dependencies with your favorite package manager (example `npm install`).
1. Run the script `./scripts/set_repo.sh` to set required repos configurations.
    - If you are not using postgres, disregard the schema setting.
    - If you are not using postgres, do not generate the authentication schema from the script, instead, modify the following files based on your database:
        - `drizzle.config.ts`
        - `app/lib/auth.server.ts`.
        - `db/columns.helpers.ts`.
        - `db/schema.ts` (Or remove, if your database does not support schemas).
        - `db/index.ts`.

    - After everything is properly set in the step above, run `npm run auth:generate` to generate the user and authentication schema.

1. Generate migrations with `pnpm dz generate --name=InitialMigration`.
1. Run migrations with `npm run dz migrate`.
1. Run the project with `npm run dev`.

## What you get

When cloning this repo, you should get a fully working project with authentication handled by default.
This authentication includes a tentant support for organization or common SaaS products where many users
work behind a common organization, and also, in this user-org relationship, there are roles included.

More information can be found in the [Better Auth documentation](https://www.better-auth.com/docs/plugins/organization).

Also, you get a login, signup and forgot password experience with this template.

## Authentication Setup

There are some part of the authentication process that need to be setup, in the file
`app/lib/auth.server.ts`, you will find the following methods to implement:

- `emailAndPassword.sendResetPassword`: This method should send an email to the user with a link to reset the password.
- `emailVerification.sendVerificationEmail`: This method should send an email to the user with a link to verify the email.

Also, the hook for session creation does the following:

- `databaseHooks.session.create.before`: This hook attaches the user to the organization associated.

## What is still missing:

- [ ] Testing (Vitest).
  - [ ] Coverage of existing code.
  - [ ] Codegen with tests.
- [ ] CI/CD.
- [ ] Dockerfile.