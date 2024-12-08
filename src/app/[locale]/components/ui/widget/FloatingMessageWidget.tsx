'use client';
import { selectMessageOpened, setMessageOpened } from '@/store/MessageStore';
import { selectUser } from '@/store/UserStore/slice';
import axios from 'axios';
import { ChevronLeft, MessageSquare, Search, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../loading';
import { formatDate } from '@/utils/formatDate';
import { selectNotification } from '@/store/NotificationStore/slice';

const FloatingMessageWidget = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const messageData = useSelector(selectMessageOpened);
  const messageCounts = useSelector(selectNotification);
  const me = useSelector(selectUser);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [newMessage, setNewMessage] = useState<any>('');
  const [messageList, setMessageList] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const totalMessageCount = messageCounts?.notifications?.totalMessageCount;
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  }
  if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://bookarchive-production.up.railway.app';
  }
  const getMessageList = async () => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      const { data } = await axios(`http://${BASE_URL}/message/userList`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

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
        `${BASE_URL}/message/user/${messageRowId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      await axios(`${BASE_URL}/notification/read/${messageRowId}`);
      setMessages(data.data);
    } catch (error) { }
  };

  const handleSendMessage = async (receiver: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];
    try {
      await axios.post(
        `${BASE_URL}/message/create`,
        {
          receiver,
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      await getMessage(selectedUser.messageRowId);
      setNewMessage('');
    } catch (error) { }
  };

  useEffect(() => {
    if (messageData.messageRow._id) {
      setSelectedUser({
        ...messageData.user,
        messageRowId: messageData.messageRow._id,
      });
      getMessage(messageData.messageRow._id);
    } else {
      if (me) {
        getMessageList();
      }
    }
  }, [messageData]);

  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser.messageRowId);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    me && (
      <div className="fixed bottom-4 right-4 z-50">
        {/* Ana konteyner */}
        <div className="flex flex-col items-end relative">
          {!messageData.isOpenMessage &&
            totalMessageCount &&
            totalMessageCount > 0 ? (
            <div className="absolute top-0 right-0 bg-green-500 w-4 h-4 rounded-full flex justify-center items-center text-[9px] p-1 text-white leading-0">
              {totalMessageCount &&
                totalMessageCount < 10 &&
                totalMessageCount > 0
                ? totalMessageCount
                : '9+'}
            </div>
          ) : (
            ''
          )}
          {messageData.isOpenMessage && (
            <div className="bg-default-50 rounded-lg shadow-xl mb-4 w-96 flex flex-col">
              {/* Başlık */}
              <div className="bg-primary/10 p-4 py-2 rounded-t-lg flex justify-between items-center border-b">
                <h3 className="font-medium">Mesajlaşma</h3>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    dispatch(
                      setMessageOpened({
                        status: false,
                        messageRow: {},
                        user: {},
                      }),
                    );
                  }}
                  className="text-default-700 hover:text-default-900"
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
                        className="absolute left-2 top-2 text-default-900"
                      />
                    </div>
                  </div>

                  {/* Kullanıcı listesi */}
                  <div
                    className={`overflow-y-auto ${!selectedUser && 'flex-1'}`}
                  >
                    {messageList.length > 0 ? (
                      messageList.map((user: any) => {
                        return (
                          <div
                            key={user?.messageRowId}
                            onClick={() => setSelectedUser(user)}
                            className={`p-3 flex gap-3 hover:bg-default-50 cursor-pointer ${selectedUser?._id === user?._id
                              ? 'bg-default-100'
                              : ''
                              }`}
                          >
                            <div className="relative">
                              <img
                                src={user?.image ?? '/assets/avatar.png'}
                                alt={user?.userName}
                                className="w-8 h-8 rounded-full"
                              />

                              {user?.isRead && (
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full border border-white" />
                              )}
                            </div>
                            {!selectedUser && (
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium text-sm truncate">
                                    {user?.firstName + ' ' + user?.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(user?.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                  {user?.lastMessage}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 h-full self-stretch flex items-center justify-center text-primary">
                        <Loading width={150} height={40} />
                      </div>
                    )}
                  </div>
                </div>
                {/* Mesajlaşma */}
                <div
                  className={`w-1/2 flex flex-col ${!selectedUser ? 'hidden ' : 'w-full'}`}
                >
                  {messages ? (
                    <>
                      <div className="p-3 border-b bg-default-50 flex items-center">
                        <div
                          className="cursor-pointer mr-2"
                          onClick={() => {
                            setSelectedUser(null);
                            setMessages([]);
                          }}
                        >
                          <ChevronLeft />
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedUser?.image ?? '/assets/avatar.png'}
                            alt={selectedUser?.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium text-sm">
                            {selectedUser?.firstName +
                              ' ' +
                              selectedUser?.lastName}
                          </span>
                        </div>
                      </div>

                      <div
                        ref={scrollRef}
                        className="scroll-container flex-1 overflow-y-auto p-4 flex flex-col gap-3"
                      >
                        {messages.map((message: any, index: number) => (
                          <div
                            key={message._id}
                            ref={
                              index === messages.length - 1
                                ? lastMessageRef
                                : null
                            }
                            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex flex-col gap-1">
                              <div
                                className={`p-2 rounded-lg  max-w-[200px] ${message.isMe
                                  ? 'bg-primary text-white rounded-br-none'
                                  : 'bg-default-100 rounded-bl-none'
                                  }`}
                              >
                                <p className="text-sm">{message.message}</p>
                              </div>
                              <span className="text-xs text-gray-500 self-end">
                                {formatDate(message.createdAt, 'dateTime')}
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
                            className="p-2 bg-primary/80 text-white rounded-lg hover:bg-primary"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-default-900">
                      <Loading width={150} height={40} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle butonu */}
          <button
            aria-label="Messages"
            onClick={() => {
              setSelectedUser(null);
              dispatch(
                setMessageOpened({
                  status: !messageData.isOpenMessage,
                  messageRow: {},
                  user: {},
                }),
              );
            }}
            className={`p-3 rounded-full shadow-lg transition-colors ${messageData.isOpenMessage
              ? 'bg-gray-200 hover:bg-gray-300 ring-'
              : 'bg-primary/80 hover:bg-primary text-white'
              }
             ${totalMessageCount > 0 &&
              'ring-2 ring-transparent ring-offset-1  animate-scale-pulse'
              }
            `}
          >
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
    )
  );
};

export default FloatingMessageWidget;
