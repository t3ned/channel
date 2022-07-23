<div align="center">
<img src="" align="center" width="15%" alt="">

<img src="https://img.shields.io/github/package-json/v/T3NED/channel/main" align="center" alt="">
<img src="https://img.shields.io/npm/dm/channel" align="center" alt="">
<img src="https://img.shields.io/github/license/T3NED/channel" align="center" alt="">
<img src="https://img.shields.io/github/issues/T3NED/channel" align="center" alt="">
<img src="https://img.shields.io/github/issues-pr/T3NED/channel" align="center" alt="">

<br>
<br>

**Ergonomic, chaining-based Typescript framework for quick API development for Fastify**

</div>

## Installation

```shell
> pnpm add @t3ned/channel
```

## Usage

```ts
import { Application } from "@t3ned/channel";
import fastify from "fastify";

const server = fastify();
const app = new Application(server)
	.setRouteDirPath(__dirname, "api")
	.setRoutePrefix("/api")
	.setDefaultVersionPrefix("v")
	.setDefaultVersion(1)
	.setDefaultMiddlewareOrder("pre");

app.listen(3000, "0.0.0.0")
	.then(() => console.log(`Listening on port ${app.port}`))
	.catch((error) => console.error(error));
```
