import { EventEmitter } from "events";
import { Player } from "./../Player";
import { TrText } from "./../TrText";
import { TranscriptionItem, parseDeepgram } from "./../../utils";
import { FC, useEffect, useState } from "react";
import styles from "./AudioTranscription.module.css";

export const AudioTranscription: FC<{
  audio: string;
  transcription: string;
  start: number;
  eventEmitter: EventEmitter;
}> = ({ audio, transcription, start, eventEmitter }) => {
  const [items, setItems] = useState<TranscriptionItem[] | null>(null);
  useEffect(() => {
    const fn = async () => {
      const jsonDataResponse = await fetch(transcription);
      const json = await jsonDataResponse.json();
      const items = parseDeepgram(json);
      setItems(items);
    };
    fn();
    return () => {
      eventEmitter.emit("playStop");
    };
  }, [audio, transcription, eventEmitter]);
  if (!items) {
    return <div>LOADING</div>;
  }
  return (
    <div className={styles.audioTranscription} style={{ height: 350 }}>
      <Player
        link={audio}
        start={start}
        items={items}
        eventEmitter={eventEmitter}
      />
      <div style={{ height: 250, overflowY: "scroll" }}>
        <TrText items={items} eventEmitter={eventEmitter} />
      </div>
    </div>
  );
};
