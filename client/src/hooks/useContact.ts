import { useEffect, useState } from "react";
import userServices from "../services/userServices";

export default function useContactAction() {
    const [currentContact , setCurrentContact] = useState<Contact | null>(null);
    const [listContacts , setListContacts] = useState<Contact[]>([]);
    const user = JSON.parse(localStorage.getItem('user') as string);
  
    // function handle logic and change state
    const showListContacts = async () => {
        const res = await userServices.getListContactsService(user.id);
        setListContacts(res.data)
    }

    /**
     * update lại listContacts và current contact cho receiver khi socket.on()
     * ko nên call API ở func này sẽ làm cho quá trình real-time bị chậm giữa sender and receiver
     * @param newMessage có thể là msg được gửi hoặc msg đã bị xóa từ sender
     */
    const updateCurrentContact = (newMessage : MessageData) => {
        const isDeletedNotLastMessage = currentContact!.newMessage._id != newMessage._id && newMessage.isDeleted

        if(isDeletedNotLastMessage) return;

        const updatedCurrentContact = {
            ...currentContact,
            newMessage
        } as Contact

        setCurrentContact(updatedCurrentContact)
        
        const listContactsClone = [...listContacts]
        const foundCurrentContact = listContactsClone.find(cont => cont.receiver.id == updatedCurrentContact.receiver.id)       
        
        if(foundCurrentContact){
            foundCurrentContact.newMessage = newMessage
        }

        setListContacts(listContactsClone)
    }

    // hook useEffect
    useEffect(() => {
        showListContacts()
    },[])

    return {
        //state
        currentContact,
        listContacts,
        // function handler
        setCurrentContact,
        setListContacts,
        showListContacts,
        updateCurrentContact
    }
}