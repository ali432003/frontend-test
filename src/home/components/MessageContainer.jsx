import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../Zustan/userConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MdDelete, MdEmojiEmotions } from "react-icons/md";

const MessageContainer = ({ onBackUser }) => {
  const { selectedConversation, message, setMessages } = userConversation();
  const { socket, onlineUser } = useSocketContext();
  const id = selectedConversation?._id;
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const leastMessageRef = useRef();
  const [sendData, setSendData] = useState("");
  const [isPickerVisible, setisPickerVisible] = useState(false);
  const [currentEmoji, setcurrentEmoji] = useState("");

  //socketIo
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...message, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, message]);

  //scroller
  useEffect(() => {
    setTimeout(() => {
      leastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [message]);

  //getMessages
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        if (selectedConversation === null) return "Waitting for id";
        const msg = await axios.get(`/api/message/${id}`);
        const data = await msg.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.messages);
        }

        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (id) getMessages();
  }, [id, setMessages]);

  //send messages
  const hadelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sendMsg = await axios.post(`/api/message/send/${id}`, {
        messages: sendData,
      });
      const data = sendMsg.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.messages);
      }
      setLoading(false);
      setSendData("");
      setMessages([...message, data]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSendData((prevSendData) => prevSendData + emoji.native);
    setisPickerVisible(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const openModal = (msgId) => {
    setMessageToDelete(msgId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(messageToDelete);
    closeModal();
  };


  return (
    <div className="md:min-w-[500px] h-full flex flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center hh" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1  md:px-2  rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className=" md:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white rounded-full px-2 py-1 self-center"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>

              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center ">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation?.profilepic}
                  />
                </div>
                <span className="text-gray-950 self-center text-sm  md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent ">
                <div className="loading loading-spinner"></div>
              </div>
            )}
            {!loading && message?.length === 0 && (
              <p className="text-center text-white items-center">
                Send a message to start Conversation
              </p>
            )}
            <div>
              {!loading &&
                message?.length > 0 &&
                message?.map((msg) => (
                  <div
                    className="text-white"
                    key={msg?._id}
                    ref={leastMessageRef}
                  >
                    <div
                      className={`chat ${
                        msg.senderId === authUser._id
                          ? "chat-end"
                          : "chat-start"
                      }`}
                    >
                      <div className="chat-image avatar"></div>
                      <div
                        className={`chat-bubble ${
                          msg.senderId === authUser._id ? "bg-sky-600" : ""
                        }`}
                      >
                        {msg?.message}
                        <button
                          data-ripple-light="true"
                          data-dialog-target="dialog-xs"
                          className="ms-6 select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          onClick={() => openModal(msg?._id)}
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                      <div className="chat-footer text-[10px] opacity-80">
                        {new Date(msg?.createdAt).toLocaleDateString("en-IN")}
                        {new Date(msg?.createdAt).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))}

              {isModalOpen && (
                <div
                  data-dialog-backdrop="dialog-xs"
                  data-dialog-backdrop-close="true"
                  className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
                >
                  <div
                    data-dialog="dialog-xs"
                    className="relative m-4 w-1/4 min-w-[25%] max-w-[25%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
                  >
                    <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                      Confirm Delete
                    </div>
                    <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
                      Are you sure you want to delete this message?
                    </div>
                    <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                      <button
                        data-ripple-dark="true"
                        data-dialog-close="true"
                        className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        data-ripple-light="true"
                        data-dialog-close="true"
                        className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        onClick={confirmDelete}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={hadelSubmit} className=" rounded-full text-black">
            <div className="w-full rounded-full flex  items-center bg-gray-300">
              <input
                value={sendData + currentEmoji}
                required
                onChange={(e) => setSendData(e.target.value)}
                id="message"
                type="text "
                className="w-full bg-transparent outline-none px-4 rounded-full"
              />
              <div className="flex gap-x-[1rem] relative">
                <div
                  className="flex justify-center place-items-center"
                  onClick={() => setisPickerVisible(!isPickerVisible)}
                >
                  <MdEmojiEmotions size={30} />
                </div>
                {isPickerVisible && (
                  <div className="absolute bottom-10 right-0">
                    <EmojiPicker
                      data={data}
                      previewPosition="bottom"
                      onEmojiSelect={handleEmojiSelect}
                    />
                  </div>
                )}
                <button type="submit">
                  {loading ? (
                    <div className="loading loading-spinner"></div>
                  ) : (
                    <IoSend
                      size={25}
                      className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                      onClick={() => setisPickerVisible(false)}
                    />
                  )}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
