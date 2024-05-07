import { useEffect, useState , useRef} from 'react';
import ContactsComponent from '../../components/ContactsComponent/ContactsComponent'
import WelcomeComponent from '../../components/WelcomeComponent/WelcomeComponent'
import './chat.scss'
import userServices from '../../services/userServices';
import ChatContainerComponent from '../../components/ChatContainerComponent/ChatContainerComponent';
import { io } from "socket.io-client";

export default function ChatPage() {
  const socket = useRef<any>(null);
  const [listContacts , setListContacts] = useState([]); 
  const [currentContact , setCurrentContact] = useState<User | null>(null);
  const user = JSON.parse(localStorage.getItem('user') as string);

  useEffect(() => {
    userServices.getAllUsersService(user.id).then(res => setListContacts(res.data))
  },[])

  useEffect(() => {
    if (user) {
      console.log(user.id);
      socket.current = io("http://localhost:1832");
      socket.current.emit("add-user", user.id);
    }
  }, [user]);

  return (
    <div className='chat-page'>
      <div className="chat-page__container">
        <ContactsComponent 
          user={user} 
          listContacts={listContacts}
          setCurrentContact={setCurrentContact}
        />
        {currentContact ? (
          <ChatContainerComponent
            currentContact={currentContact}
            socket={socket}
          />
        ) : (
          <WelcomeComponent nameuser={user.username}/>
        )}
      </div>
    </div>
  )
}
