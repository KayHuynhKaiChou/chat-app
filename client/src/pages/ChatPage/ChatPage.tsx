import ContactsComponent from '../../components/ContactsComponent/ContactsComponent'
import WelcomeComponent from '../../components/WelcomeComponent/WelcomeComponent'
import './chat.scss'
import ChatContainerComponent from '../../components/ChatContainerComponent/ChatContainerComponent';
import useContact from '../../hooks/useContact';
import useSocketConnect from '../../hooks/useSocketConnect';
import { useEffect } from 'react';

export default function ChatPage() {
  //store
  const user = JSON.parse(localStorage.getItem('user') as string);
  
  // custom hooks
  const {
    socket,
    userOnlineIds,
    handleSocketOn,
    handleSocketEmit,
    handleSocketOff
  } = useSocketConnect(); 

  const {
    currentContact,
    listContacts,
    isLoadingListContacts,
    setListContacts,
    setCurrentContact,
    showListContacts,
    updateCurrentContact,
    updateContactsOnline
  } = useContact();

  // func change state
  const handleChangeCurrentContact = (contact : Contact) => {
    setCurrentContact(contact);
  }

  const handleChangeListContacts = (listContacts : Contact[]) => {
    setListContacts(listContacts)
  }

  useEffect(() => {
    if(userOnlineIds.length > 0 && listContacts.length > 0){ 
      updateContactsOnline(userOnlineIds)
    }
    // nếu ko có dependency listContacts.length thì lần đầu chạy useEffect này thì listContacts vẫn là []
    // sau khi call API setListContacts thì nên kích hoạt lại useEffect này 1 lần nữa
  },[userOnlineIds , listContacts.length])

  return (
    <div className='chat-page'>
      <div className="chat-page__container">
        <ContactsComponent 
          currentContact={currentContact}
          listContacts={listContacts}
          isLoadingListContacts={isLoadingListContacts}
          onChangeListContacts={handleChangeListContacts}
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
