# Twitter Clone Frontend

## Project Description

This is a NextJS Application built to work with this backend server [ (twitter-clone-server-fastapi)](https://github.com/dericf/twitter-clone-server-fastapi) that I built.

Everything was written in Typescript from the start and uses async/await wherever possible.

### User Authentication/Authorization

The server is set up to handle JWT Tokens via http-only cookies or Authorization header
so I chose to use cookies to keep things simple.

Every fetch request that requires authorization sends the `credentials: "include"` option.

### Schema

I used Typescript to define a strict schema for data flowing to and from the server.

Every Response

An example of a schema is as follows for a tweet

```Typescript
import { APIResponse } from "./API";
import { EmptyResponse } from "./General";

export interface Tweet {
  tweetId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

export interface TweetCreateRequestBody {
  content: string;
}

export interface TweetUpdateRequestBody {
  newContent: string;
}

export type TweetResponse = APIResponse<Array<Tweet>>;
export type TweetCreateResponse = APIResponse<Tweet>;
export type TweetUpdateResponse = APIResponse<EmptyResponse>;
export type TweetDeleteResponse = APIResponse<EmptyResponse>;

```

`interface APIResponse<T>` is a custom generic interface that each response returns - replacing
the generic type `T` with the appropriate return type of that endpoint in a property
called `value`.

For Example:

```Typescript
// T could be something like Array<CommentLike> or EmptyResponse
export interface APIResponse<T> {
  value?: T;
  error?: APIResponseError;
}
```

`class APIResponseError` is a wrapper class that gets instantiated only when there
is an error (non-200 response status or a TypeScript Error was thrown). The class
provides an object method `.errorMessageUI` to have the appropriate text to show the
user in a toast notification or popup.

`interface EmptyResponse` is only used to represent the return type of endpoints which are defined
to explicitly not return anything - usually after deleting or updating a record.
I could have probably just used `null` but I wanted to be explicit
and to eliminate any guessing.

---

## Technologies

### NextJS

[https://nextjs.org/](https://nextjs.org/)

### TailwindCSS (with JIT)

[https://tailwindcss.com/](https://tailwindcss.com/)

### Moment

[https://momentjs.com/](https://momentjs.com/)

### react-toast-notifications

[https://github.com/jossmac/react-toast-notifications](https://github.com/jossmac/react-toast-notifications)

## Local Development

run `npm install` then run `npm run dev` to start the next development server

Make sure your backend server is running (default port 8001)

## Deploy

Easiest way to deploy is on Vercel.
Just git push to master for a production deploy or push to any non-master branch for a preview deployment.
