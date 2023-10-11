/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import { useState, useMemo, useRef, useEffect, ElementRef } from 'react';
import { Icon } from '@iconify/react';
import data from './data';

interface MessageInjected extends MessageType {
  index: number;
  isLastOfTheStage: boolean;
}

interface MessageProps extends MessageType {
  onFinished: (isTheLast: boolean) => void;
  isLastOfTheStage: boolean;
}
const AssistantMessage = ({
  type,
  content,
  onFinished,
  isLastOfTheStage,
}: MessageProps) => {
  if (type === 'image')
    return (
      <Image
        src={content}
        alt='image'
        width={480}
        height={480}
        priority
        onLoadingComplete={() => {
          onFinished(isLastOfTheStage);
        }}
      />
    );
  return (
    <TypeAnimation
      sequence={[
        1500,
        content,
        500,
        () => {
          onFinished(isLastOfTheStage);
        },
      ]}
      className='whitespace-pre-line'
      wrapper='div'
      speed={80}
      cursor={false}
    />
  );
};
interface StageProps {
  messages: Array<MessageInjected>;
  activeIndex: number;
  onFinished: (isTheLast: boolean) => void;
}
const AssistantStage = ({ messages, activeIndex, onFinished }: StageProps) => (
  <div>
    {messages.map(({ index, type, content, isLastOfTheStage }) =>
      index <= activeIndex ? (
        <AssistantMessage
          key={index}
          type={type}
          content={content}
          onFinished={onFinished}
          isLastOfTheStage={isLastOfTheStage}
        />
      ) : null
    )}
  </div>
);

const UserStage = ({
  messages,
  activeIndex,
}: Pick<StageProps, 'messages' | 'activeIndex'>) => (
  <div className='w-full flex flex-col items-end'>
    {messages.map(({ index, type, content, isLastOfTheStage }) =>
      index <= activeIndex ? <div key={index}>{content}</div> : null
    )}
  </div>
);

// const Title = tw.div`p-8`;
export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const outerRef = useRef<ElementRef<'div'>>(null);
  const innerRef = useRef<ElementRef<'div'>>(null);
  useEffect(() => {
    if (!innerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      outerRef.current?.scrollTo(0, outerRef.current?.scrollHeight);
    });
    resizeObserver.observe(innerRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  const injectedData = useMemo(() => {
    let index = 0;
    return data.map((stage, stageIndex) => ({
      ...stage,
      stageIndex,
      messages: stage.messages.map((message, i) => ({
        ...message,
        isLastOfTheStage: i === stage.messages.length - 1,
        index: index++,
      })),
    }));
  }, []);

  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  // useMessageStorage()
  const [messages, setMessages] = useState<StageType[]>([]);
  const goNextStage = () => {};

  return (
    <main className='w-full h-screen relative flex flex-col'>
      <div className='flex-1 overflow-auto p-8' ref={outerRef}>
        <div ref={innerRef}>
          {injectedData.map(({ role, messages, stageIndex }) =>
            role === 'assistant' ? (
              <AssistantStage
                key={stageIndex}
                messages={messages}
                activeIndex={activeIndex}
                onFinished={(isLast) => {
                  if (isLast) {
                    setIsWaitingForInput(true);
                    setCurrentStage((prev) => prev + 1);
                  } else setActiveIndex((prev) => prev + 1);
                }}
              />
            ) : (
              <UserStage
                key={stageIndex}
                messages={messages}
                activeIndex={activeIndex}
              />
            )
          )}
        </div>
      </div>
      <div className='w-full flex pl-8 pb-8 pr-4 no-scrollbar items-center'>
        {isWaitingForInput ? (
          <TypeAnimation
            sequence={[500, injectedData[currentStage]?.messages[0].content]}
            wrapper='div'
            className='flex-1 text-black bg-white h-6'
            speed={80}
            cursor
          />
        ) : (
          <input className='flex-1 text-black' disabled />
        )}

        <button
          className='ml-2'
          disabled={!isWaitingForInput}
          onClick={() => {
            setIsWaitingForInput(false);
            setActiveIndex(
              (prev) => prev + injectedData[currentStage].messages.length + 1
            );
            setCurrentStage((prev) => prev + 1);
          }}
        >
          <Icon className='w-8 h-8' icon='formkit:submit' />
        </button>
      </div>
    </main>
  );
}
