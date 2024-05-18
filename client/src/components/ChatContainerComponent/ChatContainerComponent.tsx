import "./chatContainer.scss";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Tooltip } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import useMessageAction from "../../hooks/useMessage";
import { formatDateBetweenMsg } from "./ChatContainer.util";

interface chatContainerProps {
  receiver: User;
  showListContacts: () => Promise<void>;
  handleSocketOn: (listCallbackAsync: Array<(newMessage : MessageData) => void>) => void
  handleSocketEmit: (idReceiver : string , sentMessage : MessageData) => void;
  handleSocketOff: () => void;
  updateCurrentContact: (newMessage : MessageData) => void
}

export default function ChatContainerComponent(props: chatContainerProps) {
  const { 
    receiver,
    showListContacts, 
    handleSocketOn,
    handleSocketEmit,
    handleSocketOff,
    updateCurrentContact
  } = props;
  const user = JSON.parse(localStorage.getItem("user") as string);
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
  const [percentRowGridFooter, setPercentRowGridFooter] = useState(10);
  const scrollRef = useRef<any>();
  const textArea = useRef<any>();
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

  // function handler
  const handleEnterPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    textArea.current.style.height = "auto";
    const textAreaElementHtml = event.target as HTMLTextAreaElement;
    let scHeight = textAreaElementHtml.scrollHeight;
    textArea.current.style.height = `${scHeight}px`;
    if (scHeight <= 230) {
      textArea.current.style.overflowY = "hidden";
      setPercentRowGridFooter(Math.ceil((scHeight / 622) * 100) + 4);
    } else {
      textArea.current.style.overflowY = "auto";
    }
  };

  const handleClickOutsidePicker = (event: MouseEvent) => {
    const elementHtml = event.target as HTMLElement;
    if (
      !elementHtml.closest(".EmojiPickerReact") &&
      !elementHtml.closest(".chat-footer__emoji svg")
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
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div
      className="chat"
      style={{
        gridTemplateRows: `10% ${
          100 - 10 - percentRowGridFooter
        }% ${percentRowGridFooter}%`,
      }}
    >
      <div className="chat-header">
        <img
          src={`data:image/svg+xml;base64,${receiver.avatarImage}`}
          alt="avatar"
        />
        <h3>{receiver.username}</h3>
      </div>
      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="chat-body__empty">
            Hiện ko có tin nhắn trong cuộc trò truyện này
          </div>
        ) : (
          messages.map((msg, index, allMsg) => {
            const isOneSelf = msg.sender === user.id;

            let dateFormat = formatDateBetweenMsg(
              index ? allMsg[index - 1].createdAt : null,
              msg.createdAt
            );

            return (
              <>
                {dateFormat && (
                  <div style={{ textAlign: "center" }}>{dateFormat}</div>
                )}
                <div
                  key={uuidv4()}
                  ref={scrollRef}
                  className={finalClassNameMessage(msg.isDeleted, isOneSelf)}
                >
                  {isOneSelf && !msg.isDeleted && (
                    <Tooltip title="Delete this message">
                      <IconButton onClick={() => handleDeleteMessageBefore(msg._id)}>
                        <AiOutlineDelete />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!isOneSelf && (
                    <img
                      src={`data:image/svg+xml;base64,${receiver.avatarImage}`}
                      alt=""
                    />
                  )}
                  <h3>{showFinalMessage(msg, isOneSelf)}</h3>
                </div>
              </>
            );
          })
        )}
      </div>
      <div className="chat-footer">
        <div className="chat-footer__emoji">
          <BsEmojiSmileFill
            onClick={() => setIsShowEmojiPicker(!isShowEmojiPicker)}
          />
          <Picker open={isShowEmojiPicker} onEmojiClick={handleSelectEmoji} />
        </div>
        <div className="chat-footer__act">
          <textarea
            rows={1}
            ref={textArea}
            placeholder="type your message here"
            onChange={handleChangeTextMessage}
            onKeyUp={handleEnterPress}
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
  );
}
