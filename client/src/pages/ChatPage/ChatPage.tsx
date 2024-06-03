import ContactsComponent from '../../components/ContactsComponent/ContactsComponent'
import WelcomeComponent from '../../components/WelcomeComponent/WelcomeComponent'
import './chat.scss'
import ChatContainerComponent from '../../components/ChatContainerComponent/ChatContainerComponent';
import useContactAction from '../../hooks/useContact';
import useSocketConnect from '../../hooks/useSocketConnect';

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem('user') as string);
  // custom hooks
  const {
    socket,
    handleSocketOn,
    handleSocketEmit,
    handleSocketOff
  } = useSocketConnect(); 

  const {
    currentContact,
    listContacts,
    setCurrentContact,
    setListContacts,
    showListContacts,
    updateCurrentContact
  } = useContactAction();

  const handleChangeCurrentContact = (contact : Contact) => {
    setCurrentContact(contact);
  }

  return (
    <div className='chat-page'>
      <div className="chat-page__container">
        <ContactsComponent 
          user={user} 
          listContacts={listContacts}
          onChangeCurrentContact={handleChangeCurrentContact}
        />
        {(currentContact && socket) ? (
          <ChatContainerComponent
            receiver={currentContact.receiver}
            showListContacts={showListContacts}
            handleSocketOn={handleSocketOn}
            handleSocketEmit={handleSocketEmit}
            handleSocketOff={handleSocketOff}
            updateCurrentContact={updateCurrentContact}
          />
        ) : (
          <WelcomeComponent nameuser={user.username}/>
        )}
      </div>
    </div>
  )
}
