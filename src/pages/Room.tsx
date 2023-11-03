import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Chatroom, Message } from '../types/chat';
import { AuthContext } from '../contexts/authContext';
import { createMessage, getRoom } from '../utils/firestore';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../configs/firebase';

export default function Room() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Chatroom>();
  const [value, setValue] = useState<string>('');
  const { id } = useParams();

  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    if (id) {
        const getChatroom = async () => {
            const rooms = await getRoom(id)
            setRoom(rooms[0])
          }
        
        getChatroom()
        const messageRef = collection(db, "chatrooms", id, "room");
        const messageQuery = query(messageRef, orderBy("createdAt", "asc"));
        
        const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
            const message = snapshot.docs.map(doc => doc.data() as Message);
            
            setMessages(message);
        })
        return unsubscribe;
    }
  }, [id])

  const handleInput = (input: string) => {
    setValue(input)
  }

  const generateClassName = (message: Message) => {
    let className = 'p-2 rounded-lg mb-2 max-w-[60%]';
    if (currentUser && message.senderEmail === currentUser.email) {
        className = `${className} bg-purple-500 text-white ml-auto`
    } else {
        className = `${className} bg-gray-800`
    }
    return className
  }

  const sendMessage = () => {
    if (currentUser && currentUser.email && id) {
        const newMessage = {
            roomId: id,
            senderEmail: currentUser.email,
            message: value
        }
        createMessage(newMessage)
    }
  }

  return (
    <div className="p-4">
        <div className="container mx-auto p-4">
            <div className="text-3xl font-bold mb-6">{room?.name}</div>
            <div className="mb-6">
                {
                    messages.length > 0 && messages.map((message) => (
                        <div className={generateClassName(message)} key={message.id}>
                            <p className="text-sm">
                                <strong>{message.senderName}</strong>
                                - 
                                <span>{message.createdAt.toDate().toLocaleDateString()} {message.createdAt.toDate().toLocaleTimeString()}</span>
                            </p>
                            <p>{message.message}</p>
                        </div>
                    ))
                }
            </div>

            <div className="flex">
                <input 
                    type="text"
                    placeholder={currentUser ? '' : "Please log in to chat"}
                    disabled={!currentUser}
                    onChange={(e) => handleInput(e.target.value)}
                    value={value}
                    className="flex-grow p-2 rounded-lg border border-gray-300  text-black mr-2"
                />
                <button 
                    type='button'
                    disabled={!currentUser}
                    onClick={sendMessage}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    </div>
  )
}
