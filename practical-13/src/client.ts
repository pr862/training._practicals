import { io } from "socket.io-client";
import { formatTime } from "./utils.js";

const socket = io();

const joinScreen = document.getElementById('joinScreen') as HTMLElement;
const joinForm = document.getElementById('joinForm') as HTMLFormElement;
const chatScreen = document.getElementById('chatScreen') as HTMLElement;
const messageForm = document.getElementById('messageForm') as HTMLFormElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const roomInput = document.getElementById('room') as HTMLInputElement;
const chatDisplay = document.getElementById('chatDisplay') as HTMLDivElement;
const roomDisplay = document.getElementById('roomDisplay') as HTMLParagraphElement;
const userDisplay = document.getElementById('userDisplay') as HTMLParagraphElement;
const userList = document.getElementById('userList') as HTMLDivElement;
const activity = document.getElementById('activity') as HTMLParagraphElement;
const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
const avatarDisplay = document.getElementById('avatarDisplay') as HTMLDivElement;

let userName = '';
let roomName = '';

function getAvatarColor(name: string): string {
    const colors = [
        'from-red-500 to-pink-500',
        'from-orange-500 to-yellow-500',
        'from-green-500 to-emerald-500',
        'from-teal-500 to-cyan-500',
        'from-blue-500 to-indigo-500',
        'from-indigo-500 to-purple-500',
        'from-purple-500 to-pink-500'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function joinRoom(e: SubmitEvent) {
    e.preventDefault();

    userName = nameInput.value.trim();
    roomName = roomInput.value.trim();

    if (userName && roomName) {
        socket.emit('enterRoom', { name: userName, room: roomName });

        roomDisplay.textContent = `Room: ${roomName}`;
        userDisplay.textContent = userName;
        avatarDisplay.textContent = getInitials(userName);

        avatarDisplay.className = 'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ' + getAvatarColor(userName);

        joinScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        chatScreen.classList.add('flex');
    }
}

function leaveRoom() {
    chatDisplay.innerHTML = '';
    userList.innerHTML = '';
    activity.textContent = '';

    nameInput.value = '';
    roomInput.value = '';

    chatScreen.classList.add('hidden');
    chatScreen.classList.remove('flex');
    joinScreen.classList.remove('hidden');
}

function sendMessage(e: SubmitEvent) {
    e.preventDefault();

    const text = messageInput.value.trim();
    if (text && userName && roomName) {
        socket.emit('message', {
            name: userName,
            text: text,
            room: roomName
        });
        messageInput.value = '';
    }
    messageInput.focus();
}

function renderMessage(data: { name: string, text: string, time?: string, type?: string }) {
    const isCurrentUser = data.name === userName;
    const time = data.time || formatTime();

    const div = document.createElement('div');

    if (data.type === 'system') {
        div.className = 'flex justify-center my-4';
        div.innerHTML = `
            <div class="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                <span class="font-medium">${data.text}</span>
                <span class="text-gray-400 ml-2">${time}</span>
            </div>
        `;
    } else {
        div.className = `flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`;
        div.innerHTML = `
            ${!isCurrentUser ? `
                <div class="w-8 h-8 rounded-full bg-gradient-to-r ${getAvatarColor(data.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ${getInitials(data.name)}
                </div>
            ` : ''}
            
            <div class="flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]">
                ${!isCurrentUser ? `
                    <span class="text-xs font-semibold text-gray-600 mb-1">${data.name}</span>
                ` : ''}
                <div class="relative px-4 py-2 rounded-2xl shadow-sm ${isCurrentUser
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }">
                    <p class="text-sm leading-relaxed">${data.text}</p>
                </div>
                <span class="text-[10px] text-gray-400 mt-1">${time}</span>
            </div>
        `;
    }

    chatDisplay.appendChild(div);
    chatDisplay.scrollTo({ top: chatDisplay.scrollHeight, behavior: 'smooth' });
}

joinForm.addEventListener('submit', joinRoom);
messageForm.addEventListener('submit', sendMessage);
backBtn.addEventListener('click', leaveRoom);

socket.on('message', (data: { name: string, text: string, time: string, type?: string }) => {
    renderMessage(data);
});

socket.on('activity', (name: string) => {
    if (name !== userName) {
        activity.textContent = `${name} is typing...`;
        setTimeout(() => {
            activity.textContent = '';
        }, 3000);
    }
});

socket.on('userList', ({ users }: { users: { name: string }[] }) => {
    const count = users.length;
    document.getElementById('userCount')!.textContent = `${count} online`;

    userList.innerHTML = users.map(user => `
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md cursor-default group">
            <div class="relative">
                <div class="w-9 h-9 rounded-full bg-gradient-to-r ${getAvatarColor(user.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm group-hover:shadow transition-shadow">
                    ${getInitials(user.name)}
                </div>
                <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div class="flex-1 min-w-0">
                <span class="text-sm ${user.name === userName ? 'font-semibold text-indigo-600' : 'text-gray-700 font-medium'} truncate block">
                    ${user.name === userName ? 'You' : user.name}
                </span>
            </div>
            ${user.name === userName ? `
                <span class="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                    You
                </span>
            ` : ''}
        </div>
    `).join('');
});

socket.on('disconnect', () => {
    leaveRoom();
});

