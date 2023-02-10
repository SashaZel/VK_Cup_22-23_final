import http from "node:http";
import { router } from "./backend/router.js";

const HOST = "http://localhost:3000/";

http
  .createServer(async function (req, res) {
    await router(req, res, HOST);
  })
  .listen(3000);

console.log(`server started at ${HOST}`);
