export default {
  description: "Lists all the endpoints, returns 200 on success",
  execute(req, res) {
    const data = [];

    req.app.methods.forEach((methodValue,methodKey) => {
      data.push(`<font size="50"><b>${methodKey}</b></font>`);
      methodValue.forEach((routeValue,routeKey) => {
        data.push(`<b>${methodKey}</b> - <a href="${routeKey}"><code>${routeKey}</code></a>`);
        data.push(`${routeValue.requireAuth ? "Requires authorization - " : ""}${routeValue.description ?? "No description"}<br>`);
      });
      data.push("<br>");
    });
    res.writeHead(200, {"Content-Type": "text/html"}).end(data.join("<br>"));
  }
}