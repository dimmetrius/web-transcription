import { useRef, useEffect, useState } from "react";
import { EventEmitter } from "events";
import { TranscriptionItem } from "./../../utils";

import styles from "./Player.module.css";
import pauseBtn from "./img/pausebtn.svg";
import playBtn from "./img/play.svg";
import { PlayerRange } from "../PlayerRange";
import { VolumeBar } from "../VolumeBar";
import Slider from "../Slider";

type Props = {
  link: string;
  start: number;
  items: Array<TranscriptionItem>;
  eventEmitter: EventEmitter;
};

const padNum = (n: number) => (n || "0").toString().padStart(2, "0");

const formatLabel = (_value: number) => {
  const value = Math.floor(_value);
  let rest = value;
  const secInM = 60;
  const secInH = secInM * 60;
  let h = 0,
    m = 0,
    s = 0;
  if (rest % secInH < rest) {
    h = Math.floor(rest / secInH);
    rest = rest % secInH;
  }
  if (rest % secInM < rest) {
    m = Math.floor(rest / secInM);
    rest = rest % secInM;
  }
  s = rest;

  return [h ? padNum(h) : "", padNum(m), padNum(s)]
    .filter((el) => el)
    .join(":");
};

const useWindowsSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const updateSize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener("resize", updateSize, false);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const Player = (props: Props) => {
  const { link, items = [], start = 0, eventEmitter: emitter } = props;
  const [play, setPlay] = useState(false);
  const [time, setTime] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [volume, setVolume] = useState(1);
  const windowSise = useWindowsSize();
  const playerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.onloadedmetadata = function () {
      const _maxVal =
        Math.round((playerRef?.current?.duration || 0) * 100) / 100;
      const startValue = _maxVal < start ? 0 : start;
      if (playerRef?.current) {
        playerRef.current.currentTime = startValue;
      }
      setMaxValue(_maxVal);
      setTime(startValue);
    };

    playerRef.current.onended = function () {
      setPlay(false);
      setTime(0);
    };

    playerRef.current.onvolumechange = function () {
      setVolume(playerRef.current?.volume || 0);
    };

    const track = playerRef.current.addTextTrack("metadata");

    items.forEach((c) => {
      track.addCue(c.vttCue);
    });

    const onPlayStart = (start: number) => {
      if (!playerRef.current) return;
      if (start >= 0) playerRef.current.currentTime = start;
      setPlay(true);
      playerRef.current.play();
    };
    emitter.addListener("playStart", onPlayStart);

    return () => {
      emitter.removeListener("playStart", onPlayStart);
    };
  }, [link, start, items, emitter]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (play) {
      const interval = setInterval(() => {
        if (!playerRef.current) return;
        setTime(Math.round(playerRef.current.currentTime * 100) / 100);
      }, 300);
      return () => {
        clearInterval(interval);
      };
    }
  }, [play]);

  const startPlay = () => {
    if (!playerRef.current) return;
    emitter.emit("onAudioPlay", link);
    setPlay(true);
    playerRef.current.play();
  };

  const setPlayerTime = (pos: number) => {
    if (!playerRef.current) return;
    pos = Math.round(pos * 100) / 100;
    playerRef.current.currentTime = pos;
    setTime(pos);
  };

  const stopPlay = () => {
    if (!playerRef.current) return;
    setPlay(false);
    playerRef.current.pause();
  };

  const startStop = () => {
    play ? stopPlay() : startPlay();
  };

  const linkSplitted = link.split("/");
  const name = decodeURIComponent(linkSplitted.pop() || "").replace(".mp3", "");

  return (
    <div className={styles.player}>
      <audio ref={playerRef} style={{ width: "100%" }}>
        {link ? <source src={link} /> : null}
      </audio>
      <div className={styles.playerBtn} onClick={startStop}>
        <img className={styles.playPauseImg} src={play ? pauseBtn : playBtn} />
      </div>

      <div className={styles.controlsColumn}>
        <div
          className={styles.audioTitle}
          style={{ display: windowSise.width > 600 ? "block" : "none" }}
        >
          {name}
        </div>
        <div className={styles.rangeContainer}>
          <div className={styles.label}>{formatLabel(time)}</div>
          <div className={styles.range}>
            <PlayerRange
              maxValue={maxValue || 1}
              minValue={0}
              step={0.01}
              value={time}
              onChange={setPlayerTime}
            />
          </div>
          <div className={styles.label}>{formatLabel(maxValue)}</div>
        </div>
      </div>

      <div className={styles.playerBtn}>
        <Slider
          minValue={0}
          maxValue={1}
          position={volume}
          onPositionChange={setVolume}
          viewComponent={VolumeBar}
        />
      </div>
    </div>
  );
};
