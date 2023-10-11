import { useRef, useState, useCallback } from 'react';
import data from '@/app/data';

export default function useMessageStorage() {
  const [messages, setMessages] = useState<StageType[]>([
    data[0],
    { role: 'user', messages: [] },
  ]);
  // const [currentStage, setCurrentStage] = useState(0);
  const stage = useRef(0);
  const goNextStage = useCallback(() => {
    stage.current += 2;
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages.push(...data.slice(stage.current - 1, stage.current + 1), {
        role: 'user',
        messages: [],
      });
      return newMessages;
    });
  }, []);
  const pushMessage = useCallback((newMessage: string) => {
    setMessages((prev) => {
      const newMessages = [
        ...prev[prev.length - 1].messages,
        {
          content: newMessage,
        },
      ];
      const newPrev = [...prev];
      newPrev[prev.length - 1] = {
        ...newPrev[prev.length - 1],
        messages: newMessages,
      };
      return newPrev;
    });
  }, []);
  return {
    messages,
    goNextStage,
    pushMessage,
  };
}