/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import { useState, useMemo } from 'react';

interface MessageType {
  type: 'image' | 'text';
  content: string;
}

interface Stage {
  from: 'host' | 'user';
  messages: Array<MessageType>;
}

const data: Stage[] = [
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
];

interface MessageProps extends MessageType {
  onFinished: () => void;
}
const Message = ({ type, content, onFinished }: MessageProps) => {
  if (type === 'image')
    return (
      <Image
        // className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
        src={content}
        alt='Next.js Logo'
        width={180}
        height={180}
        priority
        onLoadingComplete={onFinished}
      />
    );
  return (
    <TypeAnimation
      sequence={[1500, content, 500, onFinished]}
      wrapper='div'
      speed={80}
      cursor={false}
    />
  );
};

const Title = tw.div`p-8`;
export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const injectedData = useMemo(() => {
    let index = 0;
    return data.map((stage) => ({
      ...stage,
      messages: stage.messages.map((message) => ({
        ...message,
        index: index++,
      })),
    }));
  }, []);
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {injectedData[0].messages.map(({ index, type, content }) =>
        index <= activeIndex ? (
          <Message
            key={index}
            type={type}
            content={content}
            onFinished={() => {
              setActiveIndex((prev) => prev + 1);
            }}
          />
        ) : null
      )}
      {/* <Image
        className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
        src='/next.svg'
        alt='Next.js Logo'
        width={180}
        height={37}
        priority
      /> */}
    </main>
  );
}
