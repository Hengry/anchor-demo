/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import { useState, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';

interface MessageType {
  type: 'image' | 'text';
  content: string;
  selected?: boolean;
}
interface MessageInjected extends MessageType {
  index: number;
  isLastOfTheStage: boolean;
}

interface StageType {
  from: 'host' | 'user';
  messages: Array<MessageType>;
}

const data: StageType[] = [
  {
    from: 'host',
    messages: [
      {
        type: 'text',
        content: 'The king says, “that plot of land is yours to keep.”',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/FKemFke.png',
      },
      {
        type: 'text',
        content: 'what should we do next?(the 3rd response after 6:50 pm)',
      },
    ],
  },
  {
    from: 'user',
    messages: [
      { type: 'text', content: 'Plant cannabisEarly' },
      { type: 'text', content: 'Plant cannabis222' },
      { type: 'text', content: 'Plant cannabis12314' },
      { type: 'text', content: 'Plant cannabis' },
      { type: 'text', content: 'Plant cannabis444' },
    ],
  },
];

interface MessageProps extends MessageType {
  onFinished: (isTheLast: boolean) => void;
  isLastOfTheStage: boolean;
}
const Message = ({
  type,
  content,
  onFinished,
  isLastOfTheStage,
}: MessageProps) => {
  if (type === 'image')
    return (
      <Image
        // className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
        src={content}
        alt='Next.js Logo'
        width={180}
        height={180}
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
  type: 'host' | 'user';
}
const Stage = ({ type, messages, activeIndex, onFinished }: StageProps) => (
  <div className={type === 'user' ? '' : ''}>
    {messages.map(({ index, type, content, isLastOfTheStage }) =>
      index <= activeIndex ? (
        <Message
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

// const Title = tw.div`p-8`;
export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStage = useRef(0);

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

  return (
    <main className='w-full h-screen relative flex flex-col p-8'>
      <div className='flex-1'>
        {injectedData.map(({ from, messages, stageIndex }) => (
          <Stage
            key={stageIndex}
            type={from}
            messages={messages}
            activeIndex={activeIndex}
            onFinished={(isLast) => {
              if (isLast) {
                setIsWaitingForInput(true);
                currentStage.current++;
              } else setActiveIndex((prev) => prev + 1);
            }}
          />
        ))}
      </div>
      <div className='w-full flex'>
        {isWaitingForInput ? (
          <TypeAnimation
            sequence={[
              1500,
              injectedData[currentStage.current].messages[0].content,
            ]}
            wrapper='div'
            className='flex-1 text-black bg-white'
            speed={80}
            cursor
          />
        ) : (
          <input className='flex-1 text-black' disabled={!isWaitingForInput} />
        )}

        <button disabled={!isWaitingForInput}>
          <Icon icon='formkit:submit' />
        </button>
      </div>
    </main>
  );
}
