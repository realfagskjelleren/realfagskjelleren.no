# realfagskjelleren.no

The website aims to be a traditional website giving information about the organization, booking of the venue and a calendar view of upcoming events, and behind-the-scenes it aims to simplify daily operations, usually for accounting, but also for assigning our volunteers' work-schedules.

The application uses a variety of technologies including:
- Node.js
- React
- TypeScript
- GraphQL
- TypeGraphQL
- URQL/Apollo
- TypeORM
- PostgreSQL
- Redis
- Next.js
- ChakraUI

## How to install dependencies
In both directories, run:
```
npm i

yarn
```

You need a Redis server and a PostgreSQL database running. Then you setup your environment-variables according to the examples. If you *only* want to work on the server-side you have update your Cors-origin-url to the Apollo-studio link.

If development is the only concern, then the Dockerfiles can ignored.

To install install all of the above, google will help more than trying to explain it here.

On the client side there is *currently* a moderate RegExp error in one of the dev-dependencies, but since it is only for dev, we ignore the error. Also, *currently*, updating certain packages on the client-side kills everything, so beware of that. 

## How to setup
In the server, in separate terminals, run:
```
npm run watch
npm run dev
// or
yarn dev
yarn watch
```
In the client, run:
```
npm run dev
// or
yarn dev
```

## How to develop in full-stack
We usually start in the server where you proceed as usual. Afterwards, you create GraphQl queries or mutations in the `graphql` folder located in the client. Then you generate types for those (in the client) by running:
```
npm run gen
// or
yarn gen
```
(and refresh IDE-window to update the types). Then you proceed as usual by using these generated types and functions.