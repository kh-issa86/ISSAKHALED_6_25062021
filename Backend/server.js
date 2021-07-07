// import the native HTTP package from Node (allows to create a server)
const http = require("http");

// Add the 'express' application
const app = require("./app");

// the normalize Port function returns a valid port, whether it is numeric or string
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  } 
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// the errorHandler function looks for different errors and handles them appropriately. It is then saved in the server.
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// create the server and call the 'Express' application to send arguments
const server = http.createServer(app);

// an event listener is also registered, relating to the port the server is running on in the console.
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
