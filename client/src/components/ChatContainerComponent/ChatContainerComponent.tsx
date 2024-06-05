import "./chatContainer.scss";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { useState, useEffect, useRef, useMemo, useLayoutEffect} from "react";
import { v4 as uuidv4 } from "uuid";
import { Badge, IconButton } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import useMessageAction from "../../hooks/useMessage";
import { formatDateBetweenMsg } from "./ChatContainer.util";
import CaTooltip from "../common/CaTooltip";
import CaLoading from "../common/CaLoading";

interface chatContainerProps {
  receiver: User;
  showListContacts: () => Promise<void>;
  handleSocketOn: (listCallbackAsync: Array<(newMessage : MessageData) => void>) => void
  handleSocketEmit: (idReceiver : string , sentMessage : MessageData) => void;
  handleSocketOff: () => void;
  updateCurrentContact: (newMessage : MessageData) => void
}

const DEFAULT_PERCENT_ROW_CHAT_HEADER = 10 as const

// .chat-footer-inner is padding in .chat-footer
const PADDING_TOP_CHAT_FOOTER = 20 as const

const DEFAULT_HEIGHT_CHAT_CONTAINER = 650 as const

const MAX_WIDTH_CHAT_FOOTER = 230 as const

export default function ChatContainerComponent(props: chatContainerProps) {
  const { 
    receiver,
    showListContacts, 
    handleSocketOn,
    handleSocketEmit,
    handleSocketOff,
    updateCurrentContact
  } = props;
  // store
  const user = JSON.parse(localStorage.getItem("user") as string);
  
  //state
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
  const [isLoading , setIsLoading] = useState<boolean>(true);

  //useRef
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  
  //custom hook
  const {
    msgSend,
    msgInput,
    messages,
    handleSendMessage,
    handleDeleteMessage,
    handleSelectEmoji,
    handleChangeTextMessage,
    updateMessages
  } = useMessageAction(receiver);
  
  //useMemo
  const MessagesEmpty = useMemo(() => {
    return () => (
      <div className="chat-body__empty">
        Hiện ko có tin nhắn trong cuộc trò truyện này
      </div>
    ) 
  },[])

  const MessagesData = useMemo(() => {
    return () => messages.map((msg, index, allMsg) => {
      const isOneSelf = msg.sender === user.id;

      let dateFormat = formatDateBetweenMsg(
        index ? allMsg[index - 1].createdAt : null,
        msg.createdAt
      );

      return (
        <div className="chat-body-inner" key={uuidv4()}>
          {dateFormat && (
            <div className="chat-body__date">{dateFormat}</div>
          )}
          <div
            key={uuidv4()}
            ref={chatBodyRef}
            className={finalClassNameMessage(msg.isDeleted, isOneSelf)}
          >
            {isOneSelf && !msg.isDeleted && (
              <CaTooltip 
                id={`icon-tooltip-${uuidv4()}`}
                title={<div>Delete this message</div>}
                placement="bottom"
              >
                <IconButton onClick={() => handleDeleteMessageBefore(msg._id)}>
                  <AiOutlineDelete />
                </IconButton>
              </CaTooltip>
            )}
            {!isOneSelf && (
              <img
                src={`data:image/svg+xml;base64,${receiver.avatarImage}`}
                alt=""
              />
            )}
            <h3>{showFinalMessage(msg, isOneSelf)}</h3>
          </div>
        </div>
      );
    })
  },[messages])

  // function handler
  const renderMessages = () => {
    if(isLoading){
      return (
        <CaLoading/>
      )
    }else{
      if(messages.length === 0){
        return <MessagesEmpty />
      }else{
        return <MessagesData />
      }
    }
  }

  const handleClickOutsidePicker = (event: MouseEvent) => {
    const elementHtml = event.target as HTMLElement;
    if (
      !elementHtml.closest(".EmojiPickerReact") &&
      !elementHtml.closest(".chat-footer-inner__emoji svg")
    ) {
      setIsShowEmojiPicker(false);
    }
  };

  const handleSendMessageBefore = async () => {
    const sentMessage = await handleSendMessage();
    await showListContacts();
    handleSocketEmit(msgSend.to , sentMessage);
  }

  const handleDeleteMessageBefore = async (idMessage : MessageData['_id']) => {
    const deletedMessage = await handleDeleteMessage(idMessage); 
    await showListContacts();
    handleSocketEmit(msgSend.to , deletedMessage);
  }

  const showFinalMessage = (msgData: MessageData, isOneSelf: boolean) => {
    if (msgData.isDeleted) {
      const subject = isOneSelf ? "You" : receiver.username;
      return subject + " has deleted this message.";
    } else {
      return msgData.message;
    }
  };

  const finalClassNameMessage = (isMsgDeleted: boolean, isOneSelf: boolean) => {
    let classNameOrigin = `chat-body__message`;
    let classNameFinal = `${classNameOrigin} ${classNameOrigin}__${
      isOneSelf ? "sended" : "received"
    }`;
    if (isMsgDeleted) {
      return classNameFinal.concat(` ${classNameOrigin}__deleted`);
    } else {
      return classNameFinal;
    }
  };

  // hook useEffect
  useLayoutEffect(() => {
    setIsLoading(true)
  },[messages])

  useEffect(() => {
      setTimeout(() => {
          setIsLoading(false);
      }, 2000);
  },[isLoading])
  
  useEffect(() => {
    chatBodyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(chatBodyRef.current && textAreaRef.current){
      // height textArea change base on scrollHeight textArea
      textAreaRef.current.style.height = "auto";
      let scHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${scHeight}px`;
      
      // handle change height chat footer , chat body base on scrollHeight textArea
      if (scHeight <= MAX_WIDTH_CHAT_FOOTER) {
        textAreaRef.current.style.overflowY = "hidden"; // ẩn scroll
        // calculate percent row grid
        const percentRowChatFooter = (scHeight + PADDING_TOP_CHAT_FOOTER) / DEFAULT_HEIGHT_CHAT_CONTAINER * 100;
        const percentRowChatBody = 100 - DEFAULT_PERCENT_ROW_CHAT_HEADER - percentRowChatFooter
        // update grid-template-row for chat container
        const chatContainer = document.querySelector('.chat') as HTMLElement;
        chatContainer.style.gridTemplateRows = `10% ${percentRowChatBody}% ${percentRowChatFooter}%`
        // khi height của chat footer change thì chat body cũng change , do đó scroll cần trượt xuống bottom của chat body IMMEDIATELY (do đó dùng 'auto')
        chatBodyRef.current?.scrollIntoView({ behavior: "auto" });
      } else {
        textAreaRef.current.style.overflowY = "auto"; // hiện scroll
      }
    }
  },[msgInput])

  useEffect(() => {
    document.addEventListener("click", handleClickOutsidePicker);
    return () => {
      document.removeEventListener("click", handleClickOutsidePicker);
    };
  }, []);

  useEffect(() => {
    handleSocketOn([
      updateCurrentContact,
      updateMessages
    ])
    
    return () => {
      // Clean up the event listener when the component unmounts
      handleSocketOff()
    };
  }, [receiver , messages]);
  // lý do có dependence messages là để useEffect này chạy lại sau khi send msg để đăng kí tham chiếu mới
  // cho updateCurrentContact, updateMessages hay nói cách khác 2 hàm update này sẽ nhận đc state mới 

  return (
    <div className="chat">
      <div className="chat-header">
        <Badge invisible={!receiver.isOnline} color="success" overlap="circular" badgeContent=" ">
          <img src={`data:image/svg+xml;base64,${receiver.avatarImage}`} alt="" />
        </Badge>
        <div className="chat-header__infor">
          <div className="infor-name">{receiver.username}</div>
          <div className="infor-status">{receiver.isOnline ? 'đang hoạt động' : 'đã dừng hoạt động'}</div>
        </div>
      </div>
      <div className="chat-body">
        {renderMessages()}
      </div>
      <div className="chat-footer">
        <div className="chat-footer-inner">
          <div className="chat-footer-inner__emoji">
            <BsEmojiSmileFill
              onClick={() => setIsShowEmojiPicker(!isShowEmojiPicker)}
            />
            <Picker open={isShowEmojiPicker} onEmojiClick={handleSelectEmoji} />
          </div>
          <div className="chat-footer-inner__act">
            <textarea
              rows={1}
              ref={textAreaRef}
              placeholder="type your message here"
              onChange={handleChangeTextMessage}
              // onKeyUp={handleEnterPress}
              value={msgInput}
            />
            <div className="btn-send">
              <button onClick={handleSendMessageBefore}>
                <IoMdSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
