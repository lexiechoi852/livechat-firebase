import { useEffect, useState } from "react"
import { Chatroom } from "../types/chat";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebase";

export default function Rooms() {
  const [rooms, setRooms] = useState<Chatroom[]>([]);

  useEffect(() => {
    const chatroomsRef = collection(db, "chatrooms")

    const unsubscribe = onSnapshot(chatroomsRef, (snapshot) => {
      const chatrooms = snapshot.docs.map(doc => doc.data() as Chatroom);
      setRooms(chatrooms);
    })
    return unsubscribe;
  }, [])

  return (
    <div className="flex-grow">
      <h1 className="text-3xl font-bold mb-6">Rooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {
          rooms.length > 0 && rooms.map((room) => (
            <Link
              to={`/room/${room.id}`}
              key={room.id}
              className="p-4 bg-gray-800 rounded-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring focus:border-blue-300 min-h-[100px]"
            >
              <h3 className="text-xl font-semibold mb-2 truncate">{room.name}</h3>
              <p className="text-gray-400">
                {room.createdAt.toDate().toLocaleDateString()} {room.createdAt.toDate().toLocaleTimeString()}
              </p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}
