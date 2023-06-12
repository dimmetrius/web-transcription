export interface DeepgramJson {
  metadata: Metadata;
  results: Results;
}

export interface Metadata {
  transaction_key: string;
  request_id: string;
  sha256: string;
  created: Date;
  duration: number;
  channels: number;
  models: string[];
  model_info: ModelInfo;
}

export interface ModelInfo {
  [key: string]: ModelDescriptio;
}

export interface ModelDescriptio {
  name: string;
  version: string;
  arch: string;
}

export interface Results {
  channels: Channel[];
}

export interface Channel {
  alternatives: Alternative[];
}

export interface Alternative {
  transcript: string;
  confidence: number;
  words: Word[];
}

export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker: number;
  speaker_confidence: number;
  punctuated_word: string;
}

export interface TranscriptionItem {
  vttCue: VTTCue;
  word: Word;
}

export const parseDeepgram: (item: DeepgramJson) => TranscriptionItem[] = (
  item: DeepgramJson
) => {
  const words = item.results.channels[0].alternatives[0].words;
  return words.map((word) => {
    const vttCue = new VTTCue(word.start, word.end, word.punctuated_word);
    vttCue.id = [word.start, word.end, word.punctuated_word].join("-");
    return { vttCue, word };
  });
};

export const parseStart = (start: string) => {
  try {
    const splitted = start.split(":");
    if (splitted.length === 3) {
      const h = parseFloat(splitted[0]);
      const m = parseFloat(splitted[1]);
      const s = parseFloat(splitted[2]);
      return h * 60 * 60 + m * 60 + s;
    } else {
      return parseFloat(start);
    }
  } catch (e) {
    return 0;
  }
};
