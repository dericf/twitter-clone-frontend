# Twitter Clone Frontend

## Project Description

My own take on a Twitter web app. Built with NextJS and TailwindCSS and works with my FASTApi backend that I built here (https://github.com/dericf/twitter-clone-server-fastapi).

## Overview

This is built to work on desktop and mobile (with some bugs surely expected on mobile)

Everything was written in Typescript from the start and uses `async`/`await` wherever possible.

I did not try and actually "clone" twitter and all of its functionality or designs. Instead, I designed my own take on it from scratch.

### User Authentication/Authorization

The server is set up to handle JWT Tokens via http-only cookies or Authorization header.
Cookies are used to keep things simple.

Every `fetch` request that requires auth sends the `credentials: "include"` option.

Authorization is very basic - there is only 1 user type and the server ensures users only ever access/modify/delete resources they actually own.

### Tweets

A user can create, edit and delete tweets, as well as see tweets posted by other users. Currently the tweets only support text. Rich text, images, live link previews, etc. might be implemented in the future.  

### Tweet Likes

A user can like and un-like any tweet (including your own for simplicity)

### Comments

A user can create, edit and delete comments on any tweet (including your own)

### Comment Likes

A user can like and un-like any comment (including your own for simplicity)

### Following

A user can follow and un-follow other users and see a list of users they are currently following

### Followers

a user can see a list of all users that currently follow them

### Chat

I implemented a real-time chat using websockets and react hooks/context. It currently doesn't support group chats but that may be implemented in the future.
The chat is modal-based so it doesn't interupt your flow at all, simply open/close the chat modal from any page without ever redirecting.


### Schema

I used Typescript to define a strict schema for data flowing to and from the server.

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

## Testing

### Component Testing

TODO

## Technologies

### NextJS

[https://nextjs.org/](https://nextjs.org/)

### TailwindCSS (with JIT)

[https://tailwindcss.com/](https://tailwindcss.com/)

### Moment

[https://momentjs.com/](https://momentjs.com/)

### react-toast-notifications

[https://github.com/jossmac/react-toast-notifications](https://github.com/jossmac/react-toast-notifications)

## react-select
[https://github.com/jedwatson/react-select](https://github.com/jedwatson/react-select)

## Local Development

create a `.env` file and add the following variable:

```
NEXT_PUBLIC_API_URL="http://localhost:<SERVER_PORT>"
NEXT_PUBLIC_API_WS_URL="ws://localhost:<SERVER_PORT>/ws"
```

run `npm install` then run `npm run dev` to start the next development server

Make sure your backend server is running (default port 8001)

## Deploy

Easiest way to deploy is on Vercel.
Just create a new Vercel project linked to the git repo and add the `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_WS_URL` that points to your hosted API server.

To deploy a new version just git push to master/main for a production deployment or push to any non-master/main branch for a preview/staging deployment.

Eventually I'd like to develop a smooth workflow for deploying the NextJS with docker. It should be straightforward since no serverless functions are currently being used.
