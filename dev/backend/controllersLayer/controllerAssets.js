import { readStaticFile } from "../dataLayer/fileReader.js";

export async function controllerAssets(req, res) {
  const path = req.url;
  const readedFile = await readStaticFile(path);
  if (readedFile.hasError) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(500);
    res.end("Server Error", "utf-8");
    return;
  }
  if (path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(readedFile.data, "utf-8");
    return;
  }
  if (path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(readedFile.data, "utf-8");
    return;
  }
  if (path.endsWith(".svg")) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.writeHead(200);
    res.end(readedFile.data, "utf-8");
    return;
  }
  if (path.endsWith(".png")) {
    res.setHeader("Content-Type", "image/png");
    res.writeHead(200);
    res.end(readedFile.data, "utf-8");
    return;
  }
  res.setHeader("Content-Type", "text/html");
  res.writeHead(404);
  res.end("Not found", "utf-8");
  return;
}
