interface MessageType {
  type?: 'image' | 'text';
  userId?: string;
  content: string;
  selected?: boolean;
}

interface StageType {
  role: 'assistant' | 'user';
  messages: Array<MessageType>;
}
