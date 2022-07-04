# realfagskjelleren.no

The website consists of two parts: a public (more or less static) website, and a restricted part which is a solution for daily operations, in particular inventory and cost management.

## The stack

The stack consists of

- Next.js,
- tRPC,
- TailwindCSS,
- TypeScript,
- Prisma, and
- NextAuth.

## Run (development) application

For development you can use

```
npm run dev

```

or

```
yarn run dev

```

## Git preferences

- There is linting, formatting and build tests run before each attempt at committing.
- We use an automated Kanban board, check out how to commit changes so that it is automated.

## Development

If you wish to contribute, please review the Kanban board and pick a task that is not in progress.

## Future development (after deployment, not currently relevant)

The data stored must be kept safe at all times, deleting it might have big consequences. Therefore, make sure you are not on any production environments. Working on styling and/or adding pages is generally viewed as safe, the same goes for using existing api or server routes. Doing specific server side changes must require some level of development maturity so that the data is kept safe.
