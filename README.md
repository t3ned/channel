<div align="center">
<img src="https://imgur.com/OU9UQJp.png" align="center" width="80%" alt="channel banner">
<br>
<br>
<img src="https://img.shields.io/github/package-json/v/T3NED/channel/main" align="center" alt="">
<img src="https://img.shields.io/npm/dm/@t3ned/channel" align="center" alt="">
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
// index.ts

import { Application } from "@t3ned/channel";
import fastify from "fastify";

const server = fastify();
const app = new Application(server)
	.setRouteDirPath(__dirname, "api")
	.setEnvFilePath(process.cwd(), ".env")
	.setDevelopmentEnvName("DEVELOPMENT")
	.setRoutePrefix("/api")
	.setDefaultVersionPrefix("v")
	.setDefaultVersion(1);

app.listen(3000, "0.0.0.0")
	.then(() => console.log(`Listening on port ${app.port}`))
	.catch((error) => console.error(error));
```

```ts
// api/example.ts

import { HttpStatus, ApiError, Get, env } from "@t3ned/channel";
import { z } from "zod";

const getExampleParamsSchema = z.object({
	id: z.string().uuid(),
});

process.env.AUTHORIZATION = "EXAMPLE";

export const getExample = Get("/:id")
	.version(1)
	.status(HttpStatus.Found)
	.params(getExampleParamsSchema)
	.status(HttpStatus.Ok)
	.preHandler((req, _reply, done) => {
		const { authorization } = req.headers;

		if (authorization !== env("AUTHORIZATION")) {
			throw new ApiError() //
				.setCode(0)
				.setStatus(HttpStatus.Unauthorized)
				.setMessage("Unauthorized");
		}

		return done();
	})
	.handler(({ parsed }) => {
		return {
			id: parsed.params.id,
		};
	});
```
