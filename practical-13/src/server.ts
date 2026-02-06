import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from "./config/firebase.js";
import { formatTime } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname)));

const PORT = 3500;
const expressServer = app.listen(3500, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

const io = new Server(expressServer, {
    cors: { origin: "*" }
});

interface User {
    id: string;
    name: string;
    room: string;
}

const usersState: User[] = [];

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('enterRoom', async ({ name, room }: { name: string, room: string }) => {
        const roomRef = db.collection("rooms").doc(room);
        const roomSnap = await roomRef.get();

        if (!roomSnap.exists) {
            await roomRef.set({
                createdAt: new Date()
            });
        }

        const prevRoom = usersState.find(user => user.id === socket.id)?.room;
        if (prevRoom) {
            socket.leave(prevRoom);
        }

        const userIndex = usersState.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
            usersState[userIndex].room = room;
            usersState[userIndex].name = name;
        } else {
            usersState.push({ id: socket.id, name, room });
        }

        socket.join(room);

        const messagesSnap = await db.collection("rooms").doc(room).collection("messages").orderBy("time").limit(50).get();



        messagesSnap.forEach(doc => {
            socket.emit("message", {
                ...doc.data(),
                time: new Date(doc.data().time.seconds * 1000)
                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        });

        socket.emit('message', {
            text: `Welcome to the ${room} chat room, ${name}!`,
            time: formatTime(),
            type: 'system'
        });

        socket.to(room).emit('message', {
            text: `${name} has joined the room`,
            time: formatTime(),
            type: 'system'
        });

        io.to(room).emit('userList', {
            users: usersState.filter(user => user.room === room)
        });
    });

    socket.on('message', async ({ name, text, room }) => {
        const messageData = {
            name,
            text,
            type: "user",
            time: new Date()
        };

        await db
            .collection("rooms")
            .doc(room)
            .collection("messages")
            .add(messageData);

        io.to(room).emit('message', {
            name,
            text,
            time: formatTime(),
            type: "user"
        });
    });
    socket.on('activity', (name: string) => {
        const room = usersState.find(user => user.id === socket.id)?.room;
        if (room) {
            socket.to(room).emit('activity', name);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);

        const user = usersState.find(u => u.id === socket.id);
        if (user) {
            const index = usersState.indexOf(user);
            usersState.splice(index, 1);

            io.to(user.room).emit('message', {
                text: `${user.name} has left the room`,
                time: formatTime(),
                type: 'system'
            });

            io.to(user.room).emit('userList', {
                users: usersState.filter(u => u.room === user.room)
            });
        }
    });
});