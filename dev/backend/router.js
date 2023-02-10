import {
  controllerIndex,
  controllerLogo,
} from "./controllersLayer/controllerIndex.js";
import { controllerAssets } from "./controllersLayer/controllerAssets.js";
import { controllerImages } from "./controllersLayer/controllerImages.js";
import { controllerAPI } from "./controllersLayer/controllerAPI.js";

export async function router(req, res, HOST) {
  const requestPath = req.url;

  if (requestPath === "/" || requestPath === "/index.html") {
    await controllerIndex(req, res);
    return;
  }

  if (requestPath === "/logo.svg") {
    await controllerLogo(req, res);
    return;
  }

  if (requestPath.startsWith("/assets/")) {
    await controllerAssets(req, res);
    return;
  }

  if (requestPath.startsWith("/images/")) {
    await controllerImages(req, res);
    return;
  }

  if (requestPath.startsWith("/api/")) {
    await controllerAPI(req, res, HOST);
    return;
  }

  res.setHeader("Content-Type", "text/html");
  res.writeHead(404);
  res.end("Not found", "utf-8");
}
