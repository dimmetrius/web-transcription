import { EventEmitter } from 'events';
import {AudioTranscription} from './components';
import { FC } from 'react';

interface Props {
  audio: string;
  transcription: string;
}
const App :FC<Props> = ({audio, transcription}) => {
  const eventEmitter = new EventEmitter();

  return (
    <AudioTranscription audio={audio} transcription={transcription} eventEmitter={eventEmitter} />
  );
}

export default App;
