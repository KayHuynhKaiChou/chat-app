import { useEffect, useState } from "react";
import userServices from "../services/userServices";
import messageServices from "../services/messageServices";

export default function useContactAction() {
    //store
    const user = JSON.parse(localStorage.getItem('user') as string);
    //state
    const [listContacts , setListContacts] = useState<Contact[]>([]);
    const [currentContact , setCurrentContact] = useState<Contact | null>(null);
    const [isLoadingListContacts , setIsLoadingListContacts] = useState<boolean>(true);
    // function handle logic and change state
    const showListContacts = async () => {
        const res = await userServices.getListContactsService(user.id);
        if(res.status == 200){
            setIsLoadingListContacts(false);
        }
        let listContactsData : Contact[] = res.data;
        listContactsData = listContactsData.map(con => {
            return {
                ...con,
                receiver : {
                    ...con.receiver,
                    isOnline : false
                }
            }
        })
        setListContacts(listContactsData)
    }

    const updateContactsOnline = (userOnlineIds : User['id'][]) => {
        const mapListContacts = listContacts.map(con => {
            const isOnline = userOnlineIds.includes(con.receiver.id)
            return {
                ...con,
                receiver : {
                    ...con.receiver,
                    isOnline : isOnline
                }
            }
        })
        setListContacts(mapListContacts)
        // cần update lại current contact khi list contacts đc updated
        const foundCurrentContact = mapListContacts.find((con) => {
            return con.receiver.id == currentContact?.receiver.id
        })
        if(foundCurrentContact){
            setCurrentContact(foundCurrentContact)
        }
    }

    const updateViewersMessage = (newMessage : MessageData) => {
        if(currentContact?.receiver.id == newMessage.sender){
          newMessage.viewers.push(user.id)
        }
        return newMessage
    }

    const sortListContacts = () => {
        const listContactsNotMessage = listContacts.filter(con => !con.newMessage)
        const listContactsHasMessage = listContacts.filter(con => con.newMessage)
        listContactsHasMessage.sort((conPrev , conNext) => {
            const datePrev = new Date(conPrev.newMessage.createdAt).getTime();
            const dateNext = new Date(conNext.newMessage.createdAt).getTime();
            return dateNext - datePrev
        })
        setListContacts([...listContactsHasMessage , ...listContactsNotMessage])
    }

    /**
     * update lại listContacts và current contact cho receiver khi socket.on()
     * ko nên call API ở func này sẽ làm cho quá trình real-time bị chậm giữa sender and receiver
     * @param newMessage có thể là msg được gửi hoặc msg đã bị xóa từ sender
     */
    const updateCurrentContact = async (newMessage : MessageData) => {
        const listContactsClone = [...listContacts];
        const foundSenderContact = listContactsClone.find(contact => contact.receiver.id == newMessage.sender);
        if(foundSenderContact){ // ở màn hình chính của receiver
            newMessage = updateViewersMessage(newMessage)
            foundSenderContact.newMessage = newMessage
            if(newMessage.sender == currentContact?.receiver.id){
                setCurrentContact(foundSenderContact)
                if(newMessage.viewers.length == 2){
                    await messageServices.updateViewersMessage(newMessage)
                }
            }
        }else{ // ở màn hình chính của sender , don't need to update viewers
            const foundCurrentContact = listContactsClone.find(contact => contact.receiver.id == currentContact?.receiver.id)
            if(foundCurrentContact){
                foundCurrentContact.newMessage = newMessage;
                setCurrentContact(foundCurrentContact)
            }
        }
        sortListContacts()
    }

    // hook useEffect
    useEffect(() => {
        // đi lấy last msg
        if(currentContact && currentContact.newMessage){
            updateCurrentContact(currentContact.newMessage);
        }
    },[currentContact])

    useEffect(() => {
        showListContacts();
    },[])

    return {
        //state
        currentContact,
        listContacts,
        isLoadingListContacts,
        // function handler
        setCurrentContact,
        setListContacts,
        showListContacts,
        updateCurrentContact,
        updateContactsOnline
    }
}