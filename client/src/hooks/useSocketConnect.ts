import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

export default function useSocketConnect(){
    const socket = useRef<Socket | null>(null);
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
            // const promiseCallbacksCall = listCallbackAsync.map(async (callbackAsync) => {
            //     return await callbackAsync()
            // });
            // await Promise.all(promiseCallbacksCall)
        });
    }

    const handleSocketOff = () => {
        socket.current!.off("receive-msg");
    }

    useEffect(() => {
        if (user) {
            socket.current = io("http://localhost:1832");
            socket.current.emit("add-user", user.id);
        }
    }, []);

    return {
        //state
        socket : socket.current,
        // function handler
        handleSocketOn,
        handleSocketEmit,
        handleSocketOff
    }
}