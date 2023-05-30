import { EventEmitter } from 'events';
import React, { useState, useEffect, useRef, FC, useMemo } from 'react';
import { TranscriptionItem } from './../../utils';
import styles from './TrWord.module.css'

type Props = {
  item: TranscriptionItem;
  eventEmitter: EventEmitter;
};

function useIsInViewport(ref: React.MutableRefObject<HTMLSpanElement|null>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        {
          setIsIntersecting(entry.isIntersecting)
        },{
          // root: document.querySelector("#scrollArea"),
          // rootMargin: "30px",
          threshold: 1.0,
        }
      ),
    [],
  );

  useEffect(() => {
    if(ref.current){
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      }
    }
  }, [ref, observer]);

  return isIntersecting;
}

/*
const isInViewport = function (elem: HTMLSpanElement, height: number) {
	const distance = elem.getBoundingClientRect();
  console.log(distance)
  return distance.y >= height || distance.y < 0
};
*/

const Word: FC<Props> = (props) => {
  const { item, eventEmitter } = props;
  const wordRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const inView = useIsInViewport(wordRef)

  const onEnter = useMemo(() => () => {   
    if(!inView){
      wordRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    }
    setActive(true);
  }, [inView]);

  const onExit = () => {
    setActive(false);
  };

  useEffect(() => {
    item.vttCue.addEventListener('enter', onEnter);
    item.vttCue.addEventListener('exit', onExit);
    return () => {
      item.vttCue.removeEventListener('enter', onEnter);
      item.vttCue.removeEventListener('exit', onExit);
    };
  }, [item, eventEmitter, onEnter]);

  const _text = item.word.punctuated_word || '';
  const texts = _text.trim().split(' ');

  return (
    <>
      {texts.map((text, npp) => {
        const lastSymbol = text.slice(-1);
        const isAlphaNumeric = lastSymbol.match(/^[0-9a-z]+$/);

        const activBackgroundColor = '#0500FF1E';
        const BackgroundColor = '#FFFFFF';
        const color = '#2F374D';

        const style = {
          backgroundColor: active ? activBackgroundColor : BackgroundColor,
          color: color,
        };

        return (
          <span
            ref={wordRef}
            className={isAlphaNumeric ? styles.wordPad : styles.punctuationPad}
            onClick={() => {
              eventEmitter.emit('playStart', item.vttCue.startTime);
            }}
            style={style}
            key={`${item.vttCue.id}-${npp}`}>
            <>{text}</>
          </span>
        );
      })}
    </>
  );
};

export const TrWord = React.memo(
  Word,
  (prevProps, nextProps) => prevProps.eventEmitter === nextProps.eventEmitter,
);
