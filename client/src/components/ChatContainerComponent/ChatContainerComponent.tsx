import "./chatContainer.scss";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Tooltip } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { Socket } from "socket.io-client";
import useMessageAction from "../../hooks/useMessageAction";
import { formatDateBetweenMsg } from "./ChatContainer.util";

interface chatContainerProps {
  receiver: User;
  socket: Socket;
}

export default function ChatContainerComponent(props: chatContainerProps) {
  const { receiver, socket } = props;
  const user = JSON.parse(localStorage.getItem("user") as string);
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
  const [percentRowGridFooter, setPercentRowGridFooter] = useState(10);
  const scrollRef = useRef<any>();
  const textArea = useRef<any>();
  const {
    msgInput,
    messages,
    handleSendMessage,
    handleDeleteMsg,
    handleSelectEmoji,
    handleChangeTextMessage,
  } = useMessageAction(socket, user, receiver);

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
                      <IconButton onClick={() => handleDeleteMsg(msg._id)}>
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
            <button onClick={handleSendMessage}>
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
