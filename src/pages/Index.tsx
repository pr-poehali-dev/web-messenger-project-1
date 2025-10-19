import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text?: string;
  type: 'text' | 'audio' | 'video';
  sender: 'me' | 'other';
  time: string;
  reactions?: string[];
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
}

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', type: 'text', sender: 'other', time: '14:30' },
    { id: 2, text: 'Отлично! Работаю над новым проектом', type: 'text', sender: 'me', time: '14:32', reactions: ['👍', '🔥'] },
    { id: 3, type: 'audio', sender: 'other', time: '14:35' },
    { id: 4, text: 'Звучит интересно!', type: 'text', sender: 'me', time: '14:36' },
  ]);

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Анна Иванова', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:35', unread: 2, online: true },
    { id: 2, name: 'Дизайн команда', avatar: '', lastMessage: 'Новый макет готов', time: '13:20', unread: 5, online: false },
    { id: 3, name: 'Максим Петров', avatar: '', lastMessage: 'Отправил файлы', time: '12:15', unread: 0, online: true },
    { id: 4, name: 'Проект 2025', avatar: '', lastMessage: 'Встреча завтра в 10:00', time: 'Вчера', unread: 1, online: false },
  ]);

  const [channels] = useState<Chat[]>([
    { id: 5, name: 'Новости компании', avatar: '', lastMessage: 'Итоги квартала опубликованы', time: '16:00', unread: 0 },
    { id: 6, name: 'Разработка', avatar: '', lastMessage: 'Обновление библиотек', time: '15:30', unread: 3 },
    { id: 7, name: 'Дизайн', avatar: '', lastMessage: 'Новый стайлгайд', time: '14:45', unread: 0 },
  ]);

  const [username, setUsername] = useState('@username');
  const [profileName, setProfileName] = useState('Мой Профиль');

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageInput,
      type: 'text',
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const sendAudioMessage = () => {
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'audio',
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
  };

  const sendVideoMessage = () => {
    const newMessage: Message = {
      id: messages.length + 1,
      type: 'video',
      sender: 'me',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        return { ...msg, reactions: [...reactions, emoji] };
      }
      return msg;
    }));
  };

  const renderChatList = (chatList: Chat[]) => (
    <div className="space-y-1">
      {chatList.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setSelectedChat(chat.id)}
          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
            selectedChat === chat.id ? 'bg-accent/20' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-medium">
                  {chat.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 ml-2">
                {chat.unread}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex bg-background">
      <div className="w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Messenger
          </h1>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Settings" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Настройки</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                        {profileName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center w-full space-y-2">
                      <Label>Имя профиля</Label>
                      <Input 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <div className="w-full space-y-2">
                      <Label>Юзернейм</Label>
                      <Input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-center"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Контакты</h3>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="UserPlus" size={18} className="mr-2" />
                      Добавить контакт
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Users" size={18} className="mr-2" />
                      Мои контакты
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Plus" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новый чат</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input placeholder="Введите название чата" />
                  </div>
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Icon name="MessageCircle" size={18} className="mr-2" />
                        Чат
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Icon name="Megaphone" size={18} className="mr-2" />
                        Канал
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="chats" className="flex-1 flex flex-col">
          <TabsList className="w-full grid grid-cols-2 mx-4 mt-2" style={{ width: 'calc(100% - 2rem)' }}>
            <TabsTrigger value="chats">Чаты</TabsTrigger>
            <TabsTrigger value="channels">Каналы</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 px-2 mt-2">
            <TabsContent value="chats" className="mt-0">
              {renderChatList(chats)}
            </TabsContent>
            <TabsContent value="channels" className="mt-0">
              {renderChatList(channels)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {[...chats, ...channels].find(c => c.id === selectedChat)?.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {[...chats, ...channels].find(c => c.id === selectedChat)?.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">онлайн</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Search" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-fade-in ${
                      message.sender === 'me' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.sender === 'me' ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-muted'}>
                        {message.sender === 'me' ? 'Я' : 'А'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col gap-1 max-w-md ${message.sender === 'me' ? 'items-end' : ''}`}>
                      {message.type === 'text' ? (
                        <div
                          className={`p-3 rounded-2xl ${
                            message.sender === 'me'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                              : 'bg-card rounded-tl-sm'
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                      ) : message.type === 'audio' ? (
                        <div
                          className={`p-3 rounded-2xl flex items-center gap-3 ${
                            message.sender === 'me'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                              : 'bg-card rounded-tl-sm'
                          }`}
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Icon name="Play" size={16} />
                          </Button>
                          <div className="flex-1 h-1 bg-white/30 rounded-full">
                            <div className="h-full w-1/3 bg-white rounded-full" />
                          </div>
                          <span className="text-xs">0:15</span>
                        </div>
                      ) : (
                        <div
                          className={`p-3 rounded-2xl flex items-center gap-3 ${
                            message.sender === 'me'
                              ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                              : 'bg-card rounded-tl-sm'
                          }`}
                        >
                          <Icon name="Video" size={20} />
                          <span>Видео сообщение</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Icon name="Play" size={16} />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 bg-muted px-2 py-1 rounded-full">
                            {message.reactions.map((emoji, i) => (
                              <span key={i} className="text-xs">{emoji}</span>
                            ))}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                          onClick={() => addReaction(message.id, '❤️')}
                        >
                          <Icon name="Smile" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2 items-end max-w-4xl mx-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={sendAudioMessage}
                >
                  <Icon name="Mic" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={sendVideoMessage}
                >
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Input
                  placeholder="Написать сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={sendMessage}
                  className="rounded-full h-10 w-10 bg-gradient-to-r from-primary to-secondary text-white"
                  size="icon"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" size={64} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Выберите чат</h2>
              <p className="text-muted-foreground max-w-md">
                Начните общение, выбрав чат слева или создайте новый
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
