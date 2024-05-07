import './chatContainer.scss'
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { useState , useEffect , useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import messageServices from '../../services/messageServices';
import { IconButton, Tooltip } from '@mui/material';
import { AiOutlineDelete } from "react-icons/ai";

interface chatContainerProps {
  currentContact : User,
  socket : any
}

export default function ChatContainerComponent(props : chatContainerProps) {

  const {currentContact , socket} = props;
  const user = JSON.parse(localStorage.getItem('user') as string);
  const [messages, setMessages] = useState<any>([]);
  const [isShowEmojiPicker , setIsShowEmojiPicker] = useState(false);
  const [msgInput , setMsgInput] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState<any>({});
  const scrollRef = useRef<any>();
  const textArea = useRef<any>();
  const [percentRowGridFooter , setPercentRowGridFooter] = useState(10);

  const fetchGetMessages = async () => {
    messageServices.getMessageService({
      from : user.id,
      to : currentContact.id as string,
    }).then(res => setMessages(res.data))
  }

  useEffect(() => {
    currentContact && fetchGetMessages()
  },[currentContact])

  const handleSendMessage = async () => {
    const msgSend = {
      from : user.id,
      to : currentContact.id as string,
      message : msgInput
    }
    socket.current.emit("send-msg", msgSend);
    const res = await messageServices.sendMessageService(msgSend);
    setMsgInput('');
    await fetchGetMessages();
    // setMessages([...messages , {
    //   users : [user.id , currentContact.id],
    //   sender : user.id,
    //   message : msgInput
    // }])
  }

  const handleEmojiClick = (emojiObject : any) => {
    console.log(emojiObject)
    setMsgInput((prevMsgInput) => prevMsgInput + emojiObject.emoji);
  };

  const handleEnterPress = (event : any) => {
    textArea.current.style.height = 'auto';
    let scHeight = event.target.scrollHeight;
    textArea.current.style.height = `${scHeight}px`;
    if(scHeight <= 230){
      textArea.current.style.overflowY = 'hidden'
      setPercentRowGridFooter(Math.ceil(scHeight/622 * 100)+4);
    }else{
      textArea.current.style.overflowY = 'auto'
    }
  }

  const handleDeleteMsg = (idMsg : string) => {
    messageServices.deleteMessageService(idMsg)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (message : any) => {
        console.log({ message })
        setArrivalMessage({
          message,
          from : currentContact.id,
          to : user.id
        });
      });
    }

    return () => {
      // Clean up the event listener when the component unmounts
      socket.current.off("msg-recieve");
    };
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev : any) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="chat" 
      style={{gridTemplateRows:`10% ${100-10-percentRowGridFooter}% ${percentRowGridFooter}%`}}
    >
      <div className="chat-header">
        <img src={`data:image/svg+xml;base64,${currentContact.avatarImage}`} alt="avatar" />
        <h3>{currentContact.username}</h3>
      </div>
      <div className="chat-body">
        {messages.length===0 ? (
          <div className='chat-body__empty'>Hiện ko có tin nhắn trong cuộc trò truyện này</div>
        ) : messages.map((msg : any) => {
          const isOneSelf = msg.sender === user.id;
          return (
            <div 
              key={uuidv4()}
              ref={scrollRef}
              className={`chat-body__message ${isOneSelf ? 'sended' : 'received'}`}
            >
              {isOneSelf && (
                <Tooltip title="Delete this message">
                  <IconButton onClick={() => handleDeleteMsg(msg._id)}>
                    <AiOutlineDelete />
                  </IconButton>
                </Tooltip>
              )}
              {!isOneSelf && (
                <img src={`data:image/svg+xml;base64,${currentContact.avatarImage}`} alt="" />
              )}
              <h3>{msg.message}</h3>
            </div>
          )         
        })}
      </div>
      <div className="chat-footer">
        <div className="chat-footer__emoji">
          <BsEmojiSmileFill onClick={() => setIsShowEmojiPicker(!isShowEmojiPicker)}/>
          {isShowEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
        </div>
        <div className="chat-footer__act">
          <textarea
            rows={1}
            ref={textArea}
            placeholder="type your message here"
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyUp={handleEnterPress}
            value={msgInput}
          />
          <div className='btn-send'>
            <button onClick={handleSendMessage}>
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
