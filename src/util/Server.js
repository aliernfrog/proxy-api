import fs from "fs";
import http from "http";
import path from "path";
import { listFilesRecursively, tryParseJson } from "./GeneralUtil.js";

const port = process.env.PORT;
const methods = new Map();

export async function start() {
  if (!port) return console.warn("[SERVER] Port not specified, not starting");
  await getMethods();
  const server = http.createServer((req,res) => getBody(req, res));
  server.listen(port, () => {
    console.log(`[SERVER] Running on port: ${port}`);
    process.on("uncaughtException", console.error);
  });
}

async function getMethods() {
  const methodFiles = fs.readdirSync("./src/api");
  for (const file of methodFiles) {
    methods.set(file, await getMethodRoutes(file));
  }
}

async function getMethodRoutes(method) {
  const routeFiles = listFilesRecursively(`./src/api/${method}`);
  const routes = new Map();
  for (const file of routeFiles) {
    const routePath = file.replace(`./src/api/${method}`,"").replace("ROOT.js","").replace(/\.[^/.]+$/, "");
    const route = (await import("../../"+file)).default;
    route.method = method;
    routes.set(routePath, route);
  }
  console.log(`[SERVER] Loaded ${method}, ${routes.size} routes`);
  return routes;
}

function getBody(req, res, callback = onRequest) {
  let body = "";
  req.on("data", data => body += data);
  req.on("end", () => {
    req.body = tryParseJson(body);
    req.app = { methods }
    callback(req, res);
  });
}

async function onRequest(req, res) {
  const routes = methods.get(req.method);
  if (!routes) return res.writeHead(501).end("Not Implemented");
  if (req.url.includes("?")) {
    const rawUrl = req.url;
    const qIndex = rawUrl.indexOf("?");
    req.url = rawUrl.substring(0, qIndex);
    req.params = new URLSearchParams(rawUrl.substring(qIndex+1));
  }
  
  const route = routes.get(req.url);
  if (!route) return res.writeHead(404).end("Not Found");
  
  if (route.requireAuth && process.env.AUTH) {
    if (!req.headers?.authorization) return res.writeHead(401).end("Unauthorized");
    if (req.headers.authorization !== process.env.AUTH) return res.writeHead(403).end("Forbidden");
  }
  if (route.requireFields) {
    const missing = route.requireFields.find(f => !req.body[f]);
    if (missing) return res.writeHead(400).end(`'${missing}' field is required, but its missing`);
  }
  
  try {
    await route.execute(req, res);
  } catch (e) {
    console.log(e);
    return res.writeHead(500).end("Internal Server Error");
  }
}