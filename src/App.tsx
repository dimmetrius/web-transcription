import { EventEmitter } from "events";
import { AudioTranscription } from "./components";
import { FC } from "react";
import { parseStart } from "./utils";

interface Props {
  audio: string;
  transcription: string;
  start: string;
}
const App: FC<Props> = ({ audio, transcription, start }) => {
  const eventEmitter = new EventEmitter();
  const numStart = parseStart(start);
  return (
    <AudioTranscription
      audio={audio}
      transcription={transcription}
      start={numStart}
      eventEmitter={eventEmitter}
    />
  );
};

export default App;
