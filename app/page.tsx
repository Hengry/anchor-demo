/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import { useState, useMemo, useRef, useEffect, ElementRef } from 'react';
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
  role: 'assistant' | 'user';
  messages: Array<MessageType>;
}

const data: StageType[] = [
  {
    role: 'assistant',
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
        content: 'what should we do next?\n(the 3rd to last before timer end)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'Plant cannabisEarly' },
      { type: 'text', content: 'Plant cannabis222' },
      { type: 'text', content: 'Plant cannabis12314' },
      { type: 'text', content: 'Plant cannabis' },
      { type: 'text', content: 'Plant cannabis444' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'If we sell these, we should temporarily be alleviated of worries about food and clothing.',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/CylKEFg.png',
      },
      {
        type: 'text',
        content:
          'oh? someone is approaching. who could it be?(the second response after 7:07 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'They left as quickly as they came\nbut at least we don’t have to worry about being hungry for the next few days.',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/FgNWGmv.png',
      },
      {
        type: 'text',
        content: 'What should we do next?\n(the first response after 7:22 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      {
        type: 'text',
        content: 'a bunny high on drugs invites you to hololive',
      },
      {
        type: 'text',
        content: 'a bunny high on drugs invites you to hololive',
      },
      {
        type: 'text',
        content: 'a bunny high on drugs invites you to hololive',
      },
      {
        type: 'text',
        content: 'a bunny high on drugs invites you to hololive',
      },
      {
        type: 'text',
        content: 'a bunny high on drugs invites you to hololive',
      },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'with hardworking bunnies’ contribution, the progress on expansion slowly takes shape\nwe now have a home to take shelter in.\npeople role all walks of life started. to notice this deserted plot of land\nelves, knights, warlocks, even pirates\nthe area started to get lively',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/fjgLjX4.png',
      },
      {
        type: 'text',
        content: 'what’s next?\n(the second response after 7:48 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'go on a conquest' },
      { type: 'text', content: 'go on a conquest' },
      { type: 'text', content: 'go on a conquest' },
      { type: 'text', content: 'go on a conquest' },
      { type: 'text', content: 'go on a conquest' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'life is gradually getting on track\nwe also have friends to rely on\nit is time to expand our sphere of influence',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/NeZEQQN.png',
      },
      {
        type: 'text',
        content:
          'so, what is the goal of our conquest?\n(the third response after 8:08 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'the fried chicken shop in a cave' },
      { type: 'text', content: 'the fried chicken shop in a cave' },
      { type: 'text', content: 'the fried chicken shop in a cave' },
      { type: 'text', content: 'the fried chicken shop in a cave' },
      { type: 'text', content: 'the fried chicken shop in a cave' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'image',
        content: 'https://i.imgur.com/iyVvcYy.png',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/LHoDPr2.png',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/TQLIysu.png',
      },
      {
        type: 'text',
        content:
          'we discovered something dangerous\nbut maybe it could be of use in the future\nwhat should we do next?\n(second response after 8:39 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
      { type: 'text', content: 'a group of bunnies' },
    ],
  },
];

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

  return (
    <main className='w-full h-screen relative flex flex-col p-8'>
      <div className='flex-1 overflow-auto' ref={outerRef}>
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
      <div className='w-full flex'>
        {isWaitingForInput ? (
          <TypeAnimation
            sequence={[500, injectedData[currentStage]?.messages[0].content]}
            wrapper='div'
            className='flex-1 text-black bg-white'
            speed={80}
            cursor
          />
        ) : (
          <input className='flex-1 text-black' disabled />
        )}

        <button
          disabled={!isWaitingForInput}
          onClick={() => {
            setIsWaitingForInput(false);
            setActiveIndex(
              (prev) => prev + injectedData[currentStage].messages.length + 1
            );
            setCurrentStage((prev) => prev + 1);
          }}
        >
          <Icon icon='formkit:submit' />
        </button>
      </div>
    </main>
  );
}
