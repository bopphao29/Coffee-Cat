const config = require("./config");
const http = require("http");
const app = require("./app.js");

const PORT = process.env.PORT;
app.set("port", PORT);

const server = http.createServer(app);
server.listen(PORT);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${PORT}/`);
});
server.timeout = 300000;
