import { readStaticFile } from "../dataLayer/fileReader.js";

export async function controllerIndex(req, res) {
  const readedFile = await readStaticFile("/index.html");
  if (readedFile.hasError) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(500);
    res.end("Server Error", "utf-8");
    return;
  }
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(readedFile.data, "utf-8");
  return;
}

export async function controllerLogo(req, res) {
  const readedFile = await readStaticFile("/logo.svg");
  if (readedFile.hasError) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(500);
    res.end("Server Error", "utf-8");
    return;
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.writeHead(200);
  res.end(readedFile.data, "utf-8");
  return;
}
