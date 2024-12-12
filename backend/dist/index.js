"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log("Someone is joining");
            allSockets.push({
                socket,
                roomId: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            let currentUserRoom = (_a = allSockets.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.roomId;
            if (!currentUserRoom) {
                console.log("No room ID for the current socket!");
            }
            console.log(parsedMessage.payload.senderId + "sent the message " + parsedMessage.payload.message);
            allSockets.forEach((x) => {
                if (x.roomId == currentUserRoom) {
                    x.socket.send(JSON.stringify({
                        message: parsedMessage.payload.message,
                        senderId: parsedMessage.payload.senderId
                    }));
                }
            });
        }
    });
});
