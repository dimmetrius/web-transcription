import { useRef } from 'react';
import { TrWord } from './../TrWord';
import { EventEmitter } from 'events';
import { TranscriptionItem } from './../../utils';

type Props = {
  items: Array<TranscriptionItem>;
  eventEmitter: EventEmitter;
};
export const TrText = (props: Props) => {
  const { items, eventEmitter } = props;
  eventEmitter;
  const textRef = useRef<HTMLDivElement>(null);

  const pargraphs: Array<Array<TranscriptionItem>> = [];
  let lastSpeaker = -1

  for (const item of items){
    if(lastSpeaker !== item.word.speaker){
      lastSpeaker = item.word.speaker
      const newCue = new VTTCue(
        item.word.start,
        item.word.end,
        item.word.punctuated_word,
      );
      newCue.id = `S${item.word.speaker}` + item.vttCue.id
      const newWord = {...item.word, punctuated_word: `SPEAKER ${item.word.speaker + 1}: `}
      pargraphs.push([{vttCue: newCue, word: newWord}]);
    }
    pargraphs[pargraphs.length - 1].push(item)
  }

  if (pargraphs.length > 1){
    return <div style={{display: 'flex', flexDirection: 'column'}}>
      {pargraphs.map((p, i) => {
          return (
            <div key={`${i}`}>
              <div
                ref={textRef}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {p.map((item) => (
                  <TrWord
                    key={`${item.vttCue.id}`}
                    item={item}
                    eventEmitter={eventEmitter}
                  />
                ))}
              </div>
            </div>
          )
    })}
    </div>
  }

  return (
    <div>
      <div
        ref={textRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {items.map((item) => (
          <TrWord
            key={`${item.vttCue.id}`}
            item={item}
            eventEmitter={eventEmitter}
          />
        ))}
      </div>
    </div>
  );
};
