import {
    collection,
    getDocs,
    Timestamp,
    addDoc,
    query,
    where,
  } from 'firebase/firestore';
import { db } from '../configs/firebase'
import { UserCredential } from 'firebase/auth';
import { nanoid } from 'nanoid'
import { ChatUser, Chatroom } from '../types/chat';

type CreateMessageAttribute = {
  roomId: string;
  senderEmail: string;
  message: string;
}

const getRooms = async () => {
  const roomsSnapshot = await getDocs(collection(db, "chatrooms"));
  return roomsSnapshot.docs.map(doc => doc.data() as Chatroom);
}

const getUsers = async() => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map(doc => doc.data() as ChatUser);
}

export const getRoom = async (roomId: string) => {
  const roomsRef = collection(db, 'chatrooms')
  const roomQuery = query(roomsRef, where('id', '==', roomId))
  const roomSnapshot = await getDocs(roomQuery)
  return roomSnapshot.docs.map(doc => doc.data() as Chatroom);
}

export const createUserProfile = async (user: UserCredential) => {
  let userExists: ChatUser | boolean | undefined = false;
  if (user.user.email) {
    userExists = await findUser(user.user.email)
  }

  if (!userExists) {
    const userCollection = collection(db, "users");
    const createUserData = {
      id: nanoid(),
      name: user.user.displayName,
      email: user.user.email,
      createdAt: Timestamp.now()
    }
    const newDocRef = await addDoc(userCollection, createUserData);
    return newDocRef;
  }
  return 'Users exists'
}

export const createRoom = async (roomName: string) => {
  const chatroomCollection = collection(db, "chatrooms");
  const createRoomData = {
    id: nanoid(),
    name: roomName,
    createdAt: Timestamp.now()
  }
  const newDocRef = await addDoc(chatroomCollection, createRoomData);
  return newDocRef;
}

export const createMessage = async (messageData: CreateMessageAttribute) => {
  const rooms = await getRooms();
  const room = rooms.find((room) => messageData.roomId === room.id);

  const user = await findUser(messageData.senderEmail)

  if (room && user) {
    const messageCollection = collection(db, "chatrooms", messageData.roomId, "room");
    const createRoomData = {
      id: nanoid(),
      roomName: room.name,
      senderEmail: messageData.senderEmail,
      senderName: user.name,
      message: messageData.message,
      createdAt: Timestamp.now()
    }
    const newDocRef = await addDoc(messageCollection, createRoomData);
    return newDocRef;
  }
}

const findUser = async (email: string) => {
  const users = await getUsers();
  return users.find((user) => user.email === email);
}