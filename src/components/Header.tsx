import { Link, Outlet } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { auth } from '../configs/firebase'
import { useContext, useState } from "react";
import { Modal } from "flowbite-react";
import { createRoom, createUserProfile } from "../utils/firestore";
import { AuthContext } from "../contexts/authContext";


export default function Header() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { currentUser, signOut } = useContext(AuthContext)
  
  const provider = new GoogleAuthProvider();

  const signIn = async () => {
    const userCredential = await signInWithPopup(auth, provider)
    createUserProfile(userCredential)
  }

  const handleInput = (input: string) => {
    setValue(input);

    if (!value) {
      generateClassName()
    }
  }

  const generateClassName = () => {
    let className = 'px-4 py-2 rounded text-white'

    if (!value) {
      className = `${className} bg-purple-300 cursor-not-allowed`
    } else {
      className = `${className} bg-purple-500`
    }
    return className;
  }

  const createChatroom = async () => {
    const room = await createRoom(value);
    if (room) {
      setOpenModal(false)
    }
  }
   
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <nav className="border-b border-purple-700 p-4 flex justify-between">
        <Link to="/" className="text-purple-500 hover:text-purple-700">Rooms</Link>
        { currentUser && 
        (<button 
          type="button" 
          onClick={() => setOpenModal(true)} 
          className="text-purple-500 hover:text-purple-700"
          >
            Create Room
          </button>)}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Create Room</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
             <input 
              placeholder="Room name" 
              className="p-2 rounded w-full text-black" 
              onChange={(e) => handleInput(e.target.value)} 
              value={value}
            />
             <button type="button" onClick={createChatroom} className={generateClassName()}>Create Room</button>
            </div>
          </Modal.Body>
        </Modal>
        { currentUser ? (<button 
          type="button" 
          className="text-purple-500 hover:text-purple-700" 
          onClick={signOut}
        >
          Sign out
        </button>)  
        : (<button 
            type="button" 
            className="text-purple-500 hover:text-purple-700" 
            onClick={signIn}
          >
            Sign in
          </button>)
        }
      </nav>
      <Outlet />
    </div>
  )
}
