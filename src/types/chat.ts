import { Timestamp } from "firebase/firestore";

export type ChatUser = {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
}
export type Chatroom = {
    id: string;
    name: string;
    createdAt: Timestamp;
}

export type Message = {
    id: string;
    roomName: string;
    senderName: string;
    senderEmail: string;
    message: string;
    createdAt: Timestamp;
}