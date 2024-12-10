'use client';
import { selectMessageOpened, setMessageOpened } from '@/store/MessageStore';
import { selectUser } from '@/store/UserStore/slice';
import { formatDate } from '@/utils/formatDate';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from '@nextui-org/react';
import axios from 'axios';
import {
  ChevronLeft,
  MessageSquare,
  Search,
  Send,
  ShieldBanIcon,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Loading from '../loading';

const FloatingMessageWidget = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const messageData = useSelector(selectMessageOpened);
  const me = useSelector(selectUser);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  console.log('selectedUser', selectedUser);
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [newMessage, setNewMessage] = useState<any>('');
  const [messageList, setMessageList] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [openDeleteMessage, setOpenDeleteMessage] = useState<boolean>(false);
  const totalMessageCount = messageList.filter((i: any) => !i.isRead).length;

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
      const { data } = await axios(`${BASE_URL}/message/userList`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessageList(data.data);
    } catch (error) {}
  };

  const getMessageRead = async (messageRowId: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      await axios(`${BASE_URL}/message/user/readMessage/${messageRowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {}
  };

  const loadMessageData = async (user: any) => {
    setSelectedUser(user);
    await getMessage(user.messageRowId);
    await getMessageRead(user.messageRowId);
  };

  const getMessage = async (messageRowId: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      const { data } = await axios(`${BASE_URL}/message/user/${messageRowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      await getMessageList();
      setMessages(data.data);
    } catch (error) {}
  };
  const deleteMessage = async (messageRowId: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    try {
      const { data } = await axios(
        `${BASE_URL}/message/delete/${messageRowId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setMessages(null);
      await getMessageList();
      setMessages(data.data);
    } catch (error) {}
  };

  const handleSendMessage = async (receiver: string) => {
    if (selectedUser.isBlocked) {
      toast.error('Engellenmiş kullanıcıya mesaj gönderemezsiniz');
      return;
    }
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
    } catch (error) {}
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
  }, [me]);

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
                            onClick={() => loadMessageData(user)}
                            className={`p-3 flex gap-3 hover:bg-default-50 cursor-pointer relative ${
                              selectedUser?._id === user?._id
                                ? 'bg-default-100'
                                : ''
                            }
                               ${user.isBlocked && 'bg-danger/20 hover:bg-danger/30'} `}
                          >
                            {user.isBlocked && (
                              <div className="absolute top-1 left-1">
                                <ShieldBanIcon
                                  size={16}
                                  className="text-danger"
                                />
                              </div>
                            )}
                            <div className="relative">
                              <img
                                src={user?.image ?? '/assets/avatar.png'}
                                alt={user?.userName}
                                className="w-10 h-10 rounded-full"
                              />

                              {/* {!user?.isRead && (
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                              )} */}
                            </div>
                            {!selectedUser && (
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="">
                                    <p className="font-medium text-sm truncate">
                                      {user?.firstName + ' ' + user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {user?.lastMessage &&
                                      user?.lastMessage.length > 25
                                        ? user?.lastMessage.slice(0, 22) + '...'
                                        : user?.lastMessage}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <p className="text-xs text-gray-500">
                                      {formatDate(user?.createdAt)}
                                    </p>
                                    {!user.isRead && (
                                      <Chip
                                        className="bg-green-500/20"
                                        size="sm"
                                      >
                                        <p className="text-xs text-green-700">
                                          Yeni Mesaj
                                        </p>
                                      </Chip>
                                    )}
                                  </div>
                                </div>
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
                            setOpenDeleteMessage(false);
                          }}
                        >
                          <ChevronLeft />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
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
                        <Button
                          size="sm"
                          className="px-2 min-w-6 bg-danger/20"
                          onClick={() => setOpenDeleteMessage(true)}
                        >
                          <Trash2 className="text-danger" size={16} />
                        </Button>
                      </div>

                      <div
                        ref={scrollRef}
                        className="scroll-container flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative"
                      >
                        {openDeleteMessage && (
                          <div
                            className="absolute left-0 top-0 flex justify-center items-center z-50 bg-default-200/20"
                            style={{
                              width: scrollRef.current?.clientWidth,
                              height: scrollRef.current?.clientHeight,
                            }}
                          >
                            <Card className="bg-default-100 w-3/4 h-3/4">
                              <CardHeader className="border-b border-b-default-200">
                                Bu Mesajı silmek istediğinizden emin misiniz?
                              </CardHeader>
                              <CardBody className="flex-1 h-full self-stretch text-center text-default-900 flex justify-center items-center">
                                Mesajlar geri alınamayacak şekilde silinecektir
                              </CardBody>
                              <CardFooter className="border-t border-t-default-200 flex justify-center items-center gap-2">
                                <Button size="sm">İptal</Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    deleteMessage(selectedUser.messageRowId)
                                  }
                                  className="bg-danger/20 text-danger"
                                >
                                  Sil
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        )}
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
                            <div
                              className={`flex flex-col gap-2 ${message.isMe ? 'justify-end items-end' : 'justify-start items-start'}`}
                            >
                              <div
                                className={`p-2 rounded-2xl max-w-fit ${
                                  message.isMe
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-default-100 rounded-bl-none'
                                } `}
                              >
                                <p className="text-sm break-words text-end">
                                  {message.message}
                                </p>
                              </div>
                              <div
                                className={`flex items-center ${message.isMe ? 'self-end' : 'self-start'}`}
                              >
                                {/* {!message.isMe && (
                                  <Image
                                    src={
                                      message.sender.image ??
                                      '/assets/avatar.png'
                                    }
                                    width={30}
                                    height={30}
                                    alt="sender image"
                                    className="rounded-full"
                                  />
                                )} */}
                                <p className="text-xs text-gray-500">
                                  {formatDate(message.createdAt, 'dateTime')}
                                </p>
                                {/* {message.isMe && (
                                  <Image
                                    src={
                                      message.sender.image ??
                                      '/assets/avatar.png'
                                    }
                                    width={30}
                                    height={30}
                                    alt="sender image"
                                    className="rounded-full"
                                  />
                                )} */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t">
                        {selectedUser?.isBlocked && (
                          <p className="self-end items-end text-sm text-danger">
                            Bu kullancıya mesaj gönderemezsiniz.
                          </p>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Mesaj yazın..."
                            className="flex-1 p-2 border rounded-lg text-sm disabled:bg-default-300"
                            readOnly={selectedUser?.isBlocked}
                            disabled={selectedUser?.isBlocked}
                            onKeyPress={(e) => {
                              if (
                                e.key === 'Enter' &&
                                !selectedUser?.isBlocked
                              ) {
                                handleSendMessage(selectedUser._id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleSendMessage(selectedUser._id)}
                            disabled={selectedUser?.isBlocked}
                            className="p-2 bg-primary/80 text-white rounded-lg hover:bg-primary disabled:bg-danger disabled:cursor-not-allowed"
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
            className={`p-3 rounded-full shadow-lg transition-colors ${
              messageData.isOpenMessage
                ? 'bg-gray-200 hover:bg-gray-300 ring-'
                : 'bg-primary/80 hover:bg-primary text-white'
            }
             ${
               totalMessageCount > 0 &&
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
