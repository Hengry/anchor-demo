import { useRef, useState, useCallback } from 'react';
import data from '@/app/data';

export default function useMessageStorage() {
  const [messages, setMessages] = useState<StageType[]>([data[0]]);
  // const [currentStage, setCurrentStage] = useState(0);
  const stage = useRef(0);
  const goNextStage = useCallback(() => {
    stage.current += 2;
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages.push(...data.slice(stage.current - 1, stage.current + 1));
      return newMessages;
    });
  }, []);
  const pushMessage = useCallback((newMessage: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[prev.length - 1].messages.push({ content: newMessage });
      return newMessages;
    });
  }, []);
  return {
    messages,
    goNextStage,
    pushMessage,
  };
}
