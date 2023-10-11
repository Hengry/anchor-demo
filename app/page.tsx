/** @jsxImportSource @emotion/react */
'use client';
import Image from 'next/image';
import tw from 'twin.macro';
import { twJoin } from 'tailwind-merge';
import { TypeAnimation } from 'react-type-animation';
import { useState, useMemo, useRef, useEffect, ElementRef } from 'react';
import { Icon } from '@iconify/react';

interface MessageType {
  type?: 'image' | 'text';
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
      { type: 'text', content: 'large dimsum of the universe' },
      { type: 'text', content: 'large dimsum of the universe' },
      { type: 'text', content: 'large dimsum of the universe' },
      { type: 'text', content: 'large dimsum of the universe' },
      { type: 'text', content: 'large dimsum of the universe' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'the development of the village is according to plan\nin addition to food and clothing\nwe also can also reward hard-working villagers with occasional indulgence in luxury',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/EUd3whX.png',
      },
      {
        type: 'text',
        content:
          'new families continue to expand\nwhat should we do next?\n(first response after 9:05 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      {
        type: 'text',
        content:
          'time to allocate tasks and responsibilities: food group, construction group, dimsum eating group...etc',
      },
      {
        type: 'text',
        content:
          'time to allocate tasks and responsibilities: food group, construction group, dimsum eating group...etc',
      },
      {
        type: 'text',
        content:
          'time to allocate tasks and responsibilities: food group, construction group, dimsum eating group...etc',
      },
      {
        type: 'text',
        content:
          'time to allocate tasks and responsibilities: food group, construction group, dimsum eating group...etc',
      },
      {
        type: 'text',
        content:
          'time to allocate tasks and responsibilities: food group, construction group, dimsum eating group...etc',
      },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'everyone rolled up their sleeves and tapped into their talents\ndedicated to the prosperity of the village\neven the occasional slackers who are lazy and do not work quickly became affected by the atmosphere of dedication.\nand just like that, day by day, the village grew',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/MYjfq2z.png',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/qqa8j8o.png',
      },
      {
        type: 'text',
        content:
          'by the time you realize, the village is now a decent sized town\none day, something happened\nthat day, OOO appeared\nOOO = ?\n(first response after 9:35 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      {
        type: 'text',
        content: 'man-eating giants! celestial beings! the king!',
      },
      {
        type: 'text',
        content: 'man-eating giants! celestial beings! the king!',
      },
      {
        type: 'text',
        content: 'man-eating giants! celestial beings! the king!',
      },
      {
        type: 'text',
        content: 'man-eating giants! celestial beings! the king!',
      },
      {
        type: 'text',
        content: 'man-eating giants! celestial beings! the king!',
      },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          "“i changed my mind, give me back that plot of land” says the king\njust a few days after receiving the king's order\na huge monster appears over the town\nalthough the monster did not attack\nthe occasional horrifying roars seem to announce that the town can be wiped out at any time",
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/Wyirxkj.png',
      },
      {
        type: 'text',
        content:
          'suppose this is who the king sends\nwhat do we do next?\n(third response after 10 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'crown yourself king' },
      { type: 'text', content: 'crown yourself king' },
      { type: 'text', content: 'crown yourself king' },
      { type: 'text', content: 'crown yourself king' },
      { type: 'text', content: 'crown yourself king' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'this is neither my town\nnor the king’s territory\nit is the irreplaceable home of the people who live on this land.\nit is our duty to protect our family\nso under the protection of the people',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/Ib0pnAa.png',
      },
      {
        type: 'text',
        content:
          'the Southern Kingdom raiser their flag against the Middle Kingdom\nwhat will happen next?\n(second response after 10:22 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'a sanitary napkin elf appeared' },
      { type: 'text', content: 'a sanitary napkin elf appeared' },
      { type: 'text', content: 'a sanitary napkin elf appeared' },
      { type: 'text', content: 'a sanitary napkin elf appeared' },
      { type: 'text', content: 'a sanitary napkin elf appeared' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          '"The dark sword blade can be hidden in the shadows of the night\nThe abnormal sword perimeter can capture enemies several feet away\nThe sharp edge of the sword will eat the blood of the enemy and become sharper.\nThese are the blood elves who feed on blood\nThe most powerful holy weapon presented to the King of the South\n"Holy Sword-Lengthened Overnight Use"',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/ZmoB4TC.png',
      },
      {
        type: 'text',
        content:
          'At this time, the Middle Kingdom is preparing to march towards the Southern Kingdom.\nAnd the righteousness of sending troops\nThat church fabricated the bad reputation it gave to the people of the South.\nThat is the crime of OOO\nＯＯＯ = ?\n(first response after 10:48 pm)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      { type: 'text', content: 'huge boobs' },
      { type: 'text', content: 'huge boobs' },
      { type: 'text', content: 'huge boobs' },
      { type: 'text', content: 'huge boobs' },
      { type: 'text', content: 'huge boobs' },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          '"your Majesty, the Knights are ready."\n"...Is there really no other way besides war, Archbishop?\nThat person is...the brave man who saved the kingdom."\n"Your Majesty must know it very well.\nThat’s why you sent that lord to the south.”\n"Ugh... The brave man clearly had a noble and graceful figure when he was young.\nIt must be those dirty demons..."\n"Thats right, if that huge evil is allowed to flow into the kingdom,\nCountless pure seedlings will definitely be poisoned by it."\n"...Let me bear this sin.\nLet the brave man... no, let the "Demon" disappear from the world."\n(Forgive me...child, but your sin is too great...)\n"For the Southern Kingdom! Lets go!"',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/3agK84n.png',
      },
      {
        type: 'text',
        content: '(second response after 11:48 pm - finale)',
      },
    ],
  },
  {
    role: 'user',
    messages: [
      {
        type: 'text',
        content: 'the above is an advertisement for sanitary napkins',
      },
      {
        type: 'text',
        content: 'the above is an advertisement for sanitary napkins',
      },
      {
        type: 'text',
        content: 'the above is an advertisement for sanitary napkins',
      },
      {
        type: 'text',
        content: 'the above is an advertisement for sanitary napkins',
      },
      {
        type: 'text',
        content: 'the above is an advertisement for sanitary napkins',
      },
    ],
  },
  {
    role: 'assistant',
    messages: [
      {
        type: 'text',
        content:
          'King: "Why don\'t you understand?\n"The pain of being a citizen of the sun"\nBrave man: "Even if it\'s only once, have you ever experienced\nThe sadness of the people of the night? "\nKing: "Restricted and unable to move"\nBrave man: "Tossing and turning all night long"\nKing: "I never want to..."\nBrave man: "I never want to..."\nBoth: "ever see myself covered in blood...!"',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/o6G8y4B.png',
      },
      {
        type: 'text',
        content:
          '? ? : "I can\'t stretch during the day if I use the overnight type. I have trouble sleeping at night if I use the daily type.\nYou no longer have to make a choice\n"White Rabbit Dynamic Ultra-Sleep Leakproof Side Slim Extra Long Night Type"\nYour two personalities, taken care of by one napkin\nUse White Rabbit for a peace of mind\n',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/IU24AAF.png',
      },
      {
        type: 'text',
        content: '......\n............................',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/yZYGVFt.png',
      },
      {
        type: 'image',
        content: 'https://i.imgur.com/JsQOlcF.png',
      },
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
