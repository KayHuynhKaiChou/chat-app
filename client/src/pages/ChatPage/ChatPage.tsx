import { useEffect, useState , useRef} from 'react';
import ContactsComponent from '../../components/ContactsComponent/ContactsComponent'
import WelcomeComponent from '../../components/WelcomeComponent/WelcomeComponent'
import './chat.scss'
import userServices from '../../services/userServices';
import ChatContainerComponent from '../../components/ChatContainerComponent/ChatContainerComponent';
import { Socket, io } from "socket.io-client";

export default function ChatPage() {
  const socket = useRef<Socket | null>(null);
  const [listContacts , setListContacts] = useState<Contact[]>([]); 
  const [currentContact , setCurrentContact] = useState<Contact | null>(null);
  const user = JSON.parse(localStorage.getItem('user') as string);

  const handleChangeCurrentContact = (contact : Contact) => {
    setCurrentContact(contact);
  }

  useEffect(() => {
    userServices.getAllUsersService(user.id).then(res => setListContacts(res.data))
  },[])

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:1832");
      socket.current.emit("add-user", user.id);
    }
  }, []);

  return (
    <div className='chat-page'>
      <div className="chat-page__container">
        <ContactsComponent 
          user={user} 
          listContacts={listContacts}
          onChangeCurrentContact={handleChangeCurrentContact}
        />
        {(currentContact && socket.current) ? (
          <ChatContainerComponent
            receiver={currentContact.receiver}
            socket={socket.current}
          />
        ) : (
          <WelcomeComponent nameuser={user.username}/>
        )}
      </div>
    </div>
  )
}
