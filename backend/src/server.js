const http = require("http");
const app = require("./app");
const initSocket = require("./config/socket");
const { startGenerating } = require("./utils/generateNotifications"); // 👈 add this

const PORT = 5000;

const server = http.createServer(app);

// initialize socket
initSocket(server);

// 👇 start simulation
startGenerating();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
