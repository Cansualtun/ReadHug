'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Search, Send, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { LoaderIcon } from 'react-hot-toast';

const FloatingMessageWidget = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  console.log("selectedUser", selectedUser);

  const [searchQuery, setSearchQuery] = useState<any>('');
  const [newMessage, setNewMessage] = useState<any>('');
  const [messageList, setMessageList] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const getMessageList = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      const { data } = await axios(
        'http://localhost:4000/message/userList',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setMessageList(data.data);
    } catch (error) { }

  };

  const getMessage = async (messageRowId: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      const { data } = await axios(
        `http://localhost:4000/message/user/${messageRowId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setMessages(data.data)
    } catch (error) {

    }

  }

  const handleSendMessage = async (receiver: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      await axios.post(
        `http://localhost:4000/message/create`,
        {
          receiver,
          message: newMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      await getMessage(selectedUser.messageRowId)
      setNewMessage("")
    } catch (error) {

    }
  }

  useEffect(() => {
    if (isOpen) {
      getMessageList()
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser.messageRowId)
    }
  }, [selectedUser]);

  useEffect(() => {
    // Son mesajın görünürlüğünü sağla ve smooth scroll ekle
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Mesajlar değiştiğinde tetiklenir

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Ana konteyner */}
      <div className="flex flex-col items-end">
        {isOpen && (
          <div className="bg-white rounded-lg shadow-xl mb-4 w-96 flex flex-col">
            {/* Başlık */}
            <div className="bg-gray-100 p-4 rounded-t-lg flex justify-between items-center border-b">
              <h3 className="font-medium">Mesajlaşma</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[32rem]">
              {/* Sol panel - Kullanıcı listesi */}
              <div
                className={`border-r flex flex-col ${!selectedUser ? 'w-full' : 'hidden'}`}
              >
                {/* Arama */}
                <div className="p-2 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 border rounded-lg text-sm"
                    />
                    <Search
                      size={16}
                      className="absolute left-2 top-2 text-gray-400"
                    />
                  </div>
                </div>

                {/* Kullanıcı listesi */}
                <div className={`overflow-y-auto ${!selectedUser && 'flex-1'}`}>
                  {messageList.length > 0 ? messageList.map((user: any) => {
                    return <div
                      key={user?.messageRowId}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 flex gap-3 hover:bg-gray-50 cursor-pointer ${selectedUser?._id === user?._id ? 'bg-gray-100' : ''
                        }`}
                    >
                      <div className="relative">
                        <img
                          src={user?.image ?? "/assets/avatar.png"}
                          alt={user?.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        {/* {user?.receiver?.isOnline && (
                                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                                              )} */}
                        {user?.isRead && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full border border-white" />
                        )}
                      </div>
                      {!selectedUser && (
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm truncate">
                              {user?.firstName + " " + user?.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user?.createdAt}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.lastMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  }) :
                    <div className="flex-1 h-full self-stretch flex items-center justify-center text-gray-500">
                      <LoaderIcon />
                    </div>
                  }
                </div>
              </div>
              {/* Sağ panel - Mesajlaşma */}
              <div
                className={`w-1/2 flex flex-col ${!selectedUser ? 'hidden ' : 'w-full'}`}
              >
                {messages.length > 0 ? (
                  <>
                    <div className="p-3 border-b bg-gray-50 flex items-center">
                      <div
                        className="cursor-pointer mr-2"
                        onClick={() => {
                          setSelectedUser(null)
                          setMessages([])
                        }}
                      >
                        <ChevronLeft />
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedUser.image ?? "/assets/avatar.png"}
                          alt={selectedUser.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium text-sm">
                          {selectedUser.firstName + " " + selectedUser.lastName}
                        </span>
                      </div>
                    </div>


                    <div ref={scrollRef} className="scroll-container flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                      {messages.map((message: any, index: number) => (
                        <div
                          key={message._id}
                          ref={index === messages.length - 1 ? lastMessageRef : null}
                          className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex flex-col gap-1">
                            <div
                              className={`p-2 rounded-lg  max-w-[200px] ${message.isMe
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 rounded-bl-none'
                                }`}
                            >
                              <p className="text-sm">{message.message}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {message.createdAt}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>


                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Mesaj yazın..."
                          className="flex-1 p-2 border rounded-lg text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage(selectedUser._id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSendMessage(selectedUser._id)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <LoaderIcon />
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Toggle butonu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-full shadow-lg transition-colors ${isOpen
            ? 'bg-gray-200 hover:bg-gray-300'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default FloatingMessageWidget;
