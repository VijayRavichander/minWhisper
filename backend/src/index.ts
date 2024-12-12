import { WebSocketServer, WebSocket } from "ws";

interface User {
    roomId: string, 
    socket: WebSocket
}

const wss = new WebSocketServer({port: 8080})

let allSockets: User[] = []

wss.on("connection", (socket) => {
    
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type == "join"){
            console.log("Someone is joining");
            allSockets.push({ 
                socket, 
                roomId: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){
            
            let currentUserRoom = allSockets.find((x) => x.socket == socket)?.roomId;
            if(!currentUserRoom){
                console.log("No room ID for the current socket!")
            }

            console.log(parsedMessage.payload.senderId + "sent the message " + parsedMessage.payload.message)
            allSockets.forEach((x) => {
                if(x.roomId == currentUserRoom){
                    x.socket.send(JSON.stringify({
                        message: parsedMessage.payload.message,
                        senderId: parsedMessage.payload.senderId
                    }))
                }
            })
        }

    })
})