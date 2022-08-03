import * as http from "http";
import App from "./app";
require("dotenv").config();

const port = process.env.PORT || 3080;

App.set("port", port);
const server = http.createServer(App);
server.listen(port);

server.on("listening", function (): void {
  const addr = server.address();
  if (!addr) {
    console.log("Server address error");
    return;
  }
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});

module.exports = App;
