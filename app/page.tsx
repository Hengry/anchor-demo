/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  ElementRef,
  useCallback,
} from 'react';
import { Icon } from '@iconify/react';
import useMessageStorage from '@/app/hooks/useMessageStorage';

const secondsPerStage = 15;

interface MessageProps extends MessageType {
  onFinished: () => void;
}
const AssistantMessage = ({ type, content, onFinished }: MessageProps) => {
  if (type === 'image')
    return (
      <Image
        src={content}
        alt='image'
        className='py-2'
        width={480}
        height={480}
        priority
        onLoadingComplete={() => {
          setTimeout(onFinished, 1000);
        }}
      />
    );
  return (
    <TypeAnimation
      sequence={[1500, content, 500, onFinished]}
      className='whitespace-pre-line'
      wrapper='div'
      speed={80}
      cursor={false}
    />
  );
};
interface StageProps {
  messages: Array<MessageType>;
  onFinished: () => void;
  isLatest?: boolean;
}
const AssistantStage = ({ messages, onFinished }: StageProps) => {
  const [typedIndex, setTypedIndex] = useState(0);
  return (
    <div>
      {messages.map(({ type, content }, index) =>
        index <= typedIndex ? (
          <AssistantMessage
            key={index}
            type={type}
            content={content}
            onFinished={() => {
              if (index === messages.length - 1) onFinished();
              setTypedIndex((prev) => prev + 1);
            }}
          />
        ) : null
      )}
    </div>
  );
};

const UserStage = ({ messages, isLatest }: Omit<StageProps, 'onFinished'>) => (
  <div className='w-full flex flex-col items-end py-2'>
    {messages.map(({ content, userId }, index) => (
      <div
        className={twJoin(
          !isLatest && index !== messages.length - 2 && 'text-gray-600',
          !isLatest && index === messages.length - 2 && 'text-yellow-300'
        )}
        key={index}
      >
        {userId || 'anonymous'}: {content}
      </div>
    ))}
  </div>
);

// const Title = tw.div`p-8`;
export default function Home() {
  const outerRef = useRef<ElementRef<'div'>>(null);
  const innerRef = useRef<ElementRef<'div'>>(null);
  useEffect(() => {
    inputRef?.current?.focus();
    if (!innerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      outerRef.current?.scrollTo(0, outerRef.current?.scrollHeight);
    });
    resizeObserver.observe(innerRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  const { messages, goNextStage, pushMessage } = useMessageStorage();
  const injectedData = useMemo(() => {
    let index = 0;
    return messages.map((stage, stageIndex) => ({
      ...stage,
      stageIndex,
      messages: stage.messages.map((message, i) => ({
        ...message,
        index: index++,
      })),
    }));
  }, [messages]);

  const [time, setTime] = useState(0);
  const timer = useRef<NodeJS.Timeout | undefined>();
  const startTimer = useCallback(() => {
    setTime(secondsPerStage);
    timer.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 0) return prev;
        if (timer.current && prev === 1) {
          clearInterval(timer.current);
          timer.current = undefined;
          goNextStage();
        }
        return prev - 1;
      });
    }, 1000);
  }, [goNextStage]);

  const inputRef = useRef<ElementRef<'input'>>(null);
  const [input, setInput] = useState('');

  const handleSubmitInput = useCallback(() => {
    pushMessage(input);
    setInput('');
  }, [input, pushMessage]);

  return (
    <main className='mx-auto w-[52rem] h-screen relative flex flex-col'>
      <div className='flex-1 overflow-auto p-8' ref={outerRef}>
        <div ref={innerRef}>
          {injectedData.map(({ role, messages, stageIndex }, index) =>
            role === 'assistant' ? (
              <AssistantStage
                key={stageIndex}
                messages={messages}
                onFinished={() => {
                  startTimer();
                }}
              />
            ) : (
              <UserStage
                key={stageIndex}
                messages={messages}
                isLatest={index === injectedData.length - 1}
              />
            )
          )}
        </div>
      </div>
      <div className='px-8'>{time || null}</div>
      <div className='w-full flex pl-8 pb-8 pr-4 no-scrollbar items-center'>
        <input
          ref={inputRef}
          className='flex-1 text-black'
          value={input}
          onBlur={() => {
            inputRef.current?.focus();
          }}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (time !== 0 && e.key === 'Enter') {
              handleSubmitInput();
            }
          }}
        />
        <button
          className='ml-3'
          disabled={time === 0}
          onClick={handleSubmitInput}
        >
          <Icon className='w-8 h-8' icon='formkit:submit' />
        </button>
      </div>
    </main>
  );
}
