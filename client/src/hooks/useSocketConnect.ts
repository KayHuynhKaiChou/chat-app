import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export default function useSocketConnect(){
    const socket = useRef<Socket | null>(null);
    const [userOnlineIds , setUserOnlineIds] = useState<User['id'][]>([])
    const user = JSON.parse(localStorage.getItem('user') as string);

    const handleSocketEmit = (idReceiver : string , sentMessage : MessageData) => {
        socket.current!.emit("send-msg", idReceiver, sentMessage);
    }
    //Array<() => Promise<void>>
    const handleSocketOn = (listCallback : Array<(newMessage : MessageData) => void>) => {
        socket.current!.on("receive-msg", (newMessage : MessageData) => {
            listCallback.forEach(callback => {
                callback(newMessage);
            })
        });
    }

    const handleSocketOff = () => {
        socket.current!.off("receive-msg");
    }

    useEffect(() => {
        if (user) {
            socket.current = io(import.meta.env.VITE_SOCKET_IO_URL);
            socket.current.emit("add-user", user.id);
            socket.current.on("get-users-online" , (onlineUserIds) => {
                console.log({onlineUserIds})
                setUserOnlineIds(onlineUserIds)
            })
        }
    }, []);

    // useEffect(() => {
    //     if(socket.current){
    //         socket.current.on("get-users-online" , (onlineUserIds) => {
    //             console.log({onlineUserIds})
    //             setUserOnlineIds(onlineUserIds)
    //         })
    //     }
    // }, [])

    return {
        //state
        socket : socket.current,
        userOnlineIds,
        // function handler
        handleSocketOn,
        handleSocketEmit,
        handleSocketOff
    }
}