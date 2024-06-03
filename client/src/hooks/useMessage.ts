import messageServices from "../services/messageServices"
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { EmojiClickData } from "emoji-picker-react";

export default function useMessageAction(
    currentContact : User
) {
    const user = JSON.parse(localStorage.getItem('user') as string);
    const [msgInput , setMsgInput] = useState('');
    const [messages, setMessages] = useState<MessageData[]>([]);

    // hook useMemo
    const msgSend = useMemo(() => {
        return {
            from : user.id,
            to : currentContact.id,
            message : msgInput
        }
    },[user , currentContact , msgInput])
    
    // function handle logic and change state
    const showMessagesConversation = async () => {
        const res = await messageServices.getMessageService({
            from : user.id,
            to : currentContact.id,
        });
        setMessages(res.data);
    }
    
    const handleSendMessage = async () => {
        const res = await messageServices.sendMessageService(msgSend);
        setMsgInput('');
        // await showMessagesConversation();
        setMessages([
            ...messages,
            res.data
        ]);
        return res.data
    }

    const handleDeleteMessage = async (idMessage : string) => {
        await messageServices.deleteMessageService(idMessage);
        // sau khi xóa msg , tìm lại msg đã bị xóa và update state messages
        const messagesClone = [...messages];
        const deletedMessage = messagesClone.find(msg => msg._id == idMessage);
        if(deletedMessage) { deletedMessage.isDeleted = true };
        setMessages(messagesClone);
        return deletedMessage!
    }

    const handleSelectEmoji = (emojiObject : EmojiClickData) => {
        setMsgInput((prevMsgInput) => prevMsgInput + emojiObject.emoji);
    };

    const handleChangeTextMessage = (e : ChangeEvent<HTMLTextAreaElement>) => {
        setMsgInput(e.target.value)
    }

    /**
     * update lại messages (conversation) cho receiver khi socket.on()
     * ko nên call API ở func này sẽ làm cho quá trình real-time bị chậm giữa sender and receiver
     * @param newMessage có thể là msg được gửi hoặc msg đã bị xóa từ sender
     */
    const updateMessages = (newMessage : MessageData) => {
        if(newMessage.sender == currentContact.id){
            // when delete message
            if(newMessage.isDeleted){
                const messagesClone = [...messages];
                const deletedMessage = messagesClone.find(msg => msg._id == newMessage._id)
                if(deletedMessage) {
                    deletedMessage.isDeleted = true
                }
                setMessages(messagesClone)
            // when send new message
            }else{
                setMessages([...messages , newMessage])
            }
        }
    }

    // hook useEffect
    useEffect(() => {
        currentContact && showMessagesConversation()
    },[currentContact])

    return {
        //state
        messages,
        msgInput,

        // variable public
        msgSend,

        // function handler
        showMessagesConversation,
        handleSendMessage,
        handleDeleteMessage,
        handleSelectEmoji,
        handleChangeTextMessage,
        updateMessages
    }
}
