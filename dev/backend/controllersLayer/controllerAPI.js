import { readImageSize } from "../dataLayer/fileReader.js";
import { appReady } from "../servicesLayer/serviceAPIverONE.js";

function sendError400APIres(res) {
  const errorBodyAPI = JSON.stringify({
    ok: false,
    error: "Deceptive API request",
  });
  res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  res.writeHead(400);
  res.end(errorBodyAPI, "utf-8");
  return;
}

function sendError500APIres(res) {
  const errorBodyAPI = JSON.stringify({
    ok: false,
    error: "API service is unavailable",
  });
  res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  res.writeHead(500);
  res.end(errorBodyAPI, "utf-8");
  return;
}

export async function controllerAPI(req, res, HOST) {
  const path = req.url;
  const reqURL = new URL(path, HOST);
  const reqMethod = req.method;

  try {
    if (path === "/api/v1/folders.json") {
      try {
        const result = await appReady.getFoldersList();
        const resBody = JSON.stringify(result);
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        res.writeHead(200);
        res.end(resBody, "utf-8");
        return;
      } catch (error) {
        console.error(error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/get-image-size") {
      const reqImageName = reqURL?.searchParams?.get("image");
      if (!reqImageName) {
        sendError400APIres(res);
        return;
      }
      const imageSize = await readImageSize(reqImageName);
      if (imageSize.hasError) {
        sendError500APIres(res);
        return;
      }
      try {
        const resBody = JSON.stringify({
          ok: true,
          imageSize: imageSize.size,
        });
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        res.writeHead(200);
        res.end(resBody, "utf-8");
        return;
      } catch (error) {
        console.error(error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/v1/get-letters") {
      const reqFolder = reqURL?.searchParams?.get("folder");
      const reqOffset = reqURL?.searchParams?.get("offset");
      const reqLength = reqURL?.searchParams?.get("length");
      if (!reqFolder) {
        sendError400APIres(res);
        return;
      }
      const responseWithLetters = await appReady.getLetters(
        reqFolder,
        reqOffset,
        reqLength
      );
      if (!responseWithLetters.ok) {
        sendError500APIres(res);
        return;
      }
      try {
        const resBody = JSON.stringify(responseWithLetters);
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        res.writeHead(200);
        res.end(resBody, "utf-8");
        return;
      } catch (error) {
        console.error("@controllerAPI @/api/get-letters", error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/v1/income-status") {
      try {
        const incomeStatus = await appReady.getIncomeStatus();
        const resBody = JSON.stringify(incomeStatus);
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        if (incomeStatus.ok) {
          res.writeHead(200);
        } else {
          res.writeHead(500);
        }
        res.end(resBody, "utf-8");
        return;
      } catch (error) {
        console.error("@controllerAPI @/api/v1/income-status ", error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/v1/new-letter" && reqMethod === "POST") {
      try {
        let body = [];
        req.on("error", (error) => {
          console.error("@AppReady @postLetter ", error);
          sendError400APIres(res);
          return;
        });
        req.on("data", async (chunk) => {
          body.push(chunk);
        });
        req.on("end", async () => {
          body = Buffer.concat(body).toString();
          const newLetter = JSON.parse(body);
          const POSTresult = await appReady.postLetter(newLetter);
          const resBody = JSON.stringify(POSTresult);
          res.setHeader(
            "Content-Type",
            "application/javascript; charset=UTF-8"
          );
          if (POSTresult.ok) {
            res.writeHead(200);
          } else {
            res.writeHead(400);
          }
          res.end(resBody, "utf-8");
          return;
        });
        return;
      } catch (error) {
        console.error("@controllerAPI @/api/v1/new-letter ", error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/v1/new-folder" && reqMethod === "POST") {
      try {
        let body = [];
        req.on("error", (error) => {
          console.error("@AppReady @postLetter ", error);
          sendError400APIres(res);
          return;
        });
        req.on("data", async (chunk) => {
          body.push(chunk);
        });
        req.on("end", async () => {
          try {
            body = Buffer.concat(body).toString();
            const newFolderObj = JSON.parse(body);
            const POSTresult = await appReady.createFolder(newFolderObj);
            const resBody = JSON.stringify(POSTresult);
            res.setHeader(
              "Content-Type",
              "application/javascript; charset=UTF-8"
            );
            if (POSTresult.ok) {
              res.writeHead(200);
            } else {
              res.writeHead(400);
            }
            res.end(resBody, "utf-8");
            return;
          } catch (error) {
            console.error("@controllerAPI @/api/v1/new-folder ", error);
            sendError500APIres(res);
            return;
          }
        });
        return;
      } catch (error) {
        console.error("@controllerAPI @/api/v1/new-folder ", error);
        sendError500APIres(res);
        return;
      }
    }

    if (reqURL.pathname === "/api/v1/change-folder" && reqMethod === "POST") {
      try {
        let body = [];
        req.on("error", (error) => {
          console.error("@controllerAPI @/api/v1/change-folder", error);
          sendError400APIres(res);
          return;
        });
        req.on("data", async (chunk) => {
          body.push(chunk);
        });
        req.on("end", async () => {
          try {
            body = Buffer.concat(body).toString();
            const newFolderObj = JSON.parse(body);
            const POSTresult = await appReady.moveLetterToFolder(
              newFolderObj.newLetter,
              newFolderObj.oldFolder
            );
            const resBody = JSON.stringify(POSTresult);
            res.setHeader(
              "Content-Type",
              "application/javascript; charset=UTF-8"
            );
            if (POSTresult.ok) {
              res.writeHead(200);
            } else {
              res.writeHead(400);
            }
            res.end(resBody, "utf-8");
            return;
          } catch (error) {
            console.error("@controllerAPI @/api/v1/change-folder ", error);
            sendError500APIres(res);
            return;
          }
        });
        return;
      } catch (error) {
        console.error("@controllerAPI @/api/v1/change-folder ", error);
        sendError500APIres(res);
        return;
      }
    }

    sendError400APIres(res);
    return;
  } catch (error) {
    console.error("@controllerAPI ", error);
    sendError500APIres(res);
    return;
  }
}
