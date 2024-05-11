import { Socket } from "socket.io-client";
import messageServices from "../services/messageServices"
import { ChangeEvent, useEffect, useState } from "react";
import { EmojiClickData } from "emoji-picker-react";

export default function useMessageAction(
    socket : Socket,
    user : User,
    currentContact : User
) {
    const [msgInput , setMsgInput] = useState('');
    const [messages, setMessages] = useState<MessageData[]>([]);

    const msgSend = {
        from : user.id,
        to : currentContact.id,
        message : msgInput
    }
    
    // function handle logic
    const fetchGetMessages = async () => {
        messageServices.getMessageService({
            from : user.id,
            to : currentContact.id,
        }).then(res => {
            setMessages(res.data)
        })
    }
    
    const handleSendMessage = async () => {
        await messageServices.sendMessageService(msgSend);
        setMsgInput('');
        await fetchGetMessages();
        socket.emit("send-msg", msgSend.to);
    }

    const handleDeleteMsg = async (idMsg : string) => {
        await messageServices.deleteMessageService(idMsg);
        await fetchGetMessages();
        socket.emit("send-msg", msgSend.to);
    }

    // function change state
    const handleSelectEmoji = (emojiObject : EmojiClickData) => {
        setMsgInput((prevMsgInput) => prevMsgInput + emojiObject.emoji);
    };

    const handleChangeTextMessage = (e : ChangeEvent<HTMLTextAreaElement>) => {
        setMsgInput(e.target.value)
    }

    // hook useEffect
    useEffect(() => {
        currentContact && fetchGetMessages()
    },[currentContact])
    
    useEffect(() => {
        socket.on("receive-msg", async () => {
            await fetchGetMessages();
        });
        
        return () => {
            // Clean up the event listener when the component unmounts
            socket.off("receive-msg");
        };
    }, []);

    return {
        //state
        messages,
        msgInput,

        // variable public
        msgSend,

        // function handler
        fetchGetMessages,
        handleSendMessage,
        handleDeleteMsg,
        handleSelectEmoji,
        handleChangeTextMessage
    }
}
