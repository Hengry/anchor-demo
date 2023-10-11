interface MessageType {
  type?: 'image' | 'text';
  content: string;
  selected?: boolean;
}

interface StageType {
  role: 'assistant' | 'user';
  messages: Array<MessageType>;
}
