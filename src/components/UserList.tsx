import { useEffect, useState } from "react";
import { ChatUser } from "../types/chat";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../configs/firebase";

export default function UserList() {
  const [users, setUsers] = useState<ChatUser[]>([])

  useEffect(() => {
    const usersRef = collection(db, "users")

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as ChatUser);
      setUsers(users);
    })
    return unsubscribe;
  }, [])
  
  return (
    <div className="w-full lg:w-64 mt-4 lg:mt-0 lg:ml-4">
      <h2 className="text-3xl font-bold mb-6">Users</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
        {
          users.length > 0 && users.map((user) => (
              <div className="mb-4" key={user.email}>
                <p className="text-lg font-semibold">{user.name}</p>
                <p>{user.email}</p>
                <p className="text-gray-400">
                  Joined: {user.createdAt.toDate().toLocaleDateString()} {user.createdAt.toDate().toLocaleTimeString()}
                </p>
              </div>
          ))
        }
        {
          users.length === 0 && <div>There's no users</div>
        }
      </div>
    </div>
  )
}
