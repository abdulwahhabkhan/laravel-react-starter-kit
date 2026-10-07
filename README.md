# Laravel React Starter Kit

An opinionated Laravel starter kit with React, Inertia, and TypeScript, preconfigured with roles, strict defaults, and a full quality toolchain.

## Stack

- **Backend:** PHP 8.4, Laravel 13, Fortify (login, password reset, email verification, 2FA, passkeys)
- **Frontend:** React 19, Inertia v3, TypeScript, Tailwind CSS v4, shadcn/ui, lucide + Iconify icons
- **Routing:** Laravel Wayfinder (typed route helpers for the frontend)
- **Package manager:** Bun

## Features

- Split-screen authentication pages
- User roles (`admin`, `user`) backed by the `App\Enums\Role` enum
- One-click demo login buttons per role on the login page (local environment only, via `spatie/laravel-login-link`)
- Seeded demo users for each role
- Strict model defaults: `Model::shouldBeStrict()`, automatic eager loading, enforced morph map
- Destructive DB commands blocked in production, HTTPS forced in production
- Query builder macros: `filterWhere`, `filterStartWith`, `filterContain`, `filterDate`
- Laravel Debugbar for local debugging
- `laravel/vet` Composer plugin for dependency supply-chain auditing

## Create a new project

With the Laravel installer:

```bash
laravel new my-app --using=abdulwahhabkhan/laravel-react-starter-kit
```

With Composer:

```bash
composer create-project abdulwahhabkhan/laravel-react-starter-kit my-app
```

Or from the GitHub template:

```bash
gh repo create my-app --template abdulwahhabkhan/laravel-react-starter-kit --private --clone
cd my-app
composer setup
```

## Requirements

- PHP 8.4+
- Composer 2
- Bun

## Setup

```bash
composer setup        # install deps, create .env, generate key, migrate, build assets
php artisan db:seed   # create demo users
composer run dev      # start the development servers
```

## Demo users

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | `admin@example.com` | `password` |
| User  | `user@example.com`  | `password` |

The one-click login buttons only appear in the `local` environment. Seeded users keep these passwords wherever you seed them, so change them before seeding any shared or production server.

## Quality checks

| Command                  | What it runs                                        |
|--------------------------|-----------------------------------------------------|
| `composer lint`          | Rector and Pint (fixes code)                        |
| `composer lint:check`    | Pint and Rector in check mode                       |
| `composer types:check`   | PHPStan (Larastan, level 7)                         |
| `composer test`          | Lint check, PHPStan, type coverage, and Pest suite  |
| `composer ci:check`      | Frontend check, TypeScript check, and `composer test` |
| `bun run check`          | Vite+ format and lint for the frontend              |
| `bun run types:check`    | TypeScript type check                               |

## Dependency auditing

Create the trust file once, then commit `vet.json`:

```bash
vendor/bin/vet --init
```

## License

MIT
