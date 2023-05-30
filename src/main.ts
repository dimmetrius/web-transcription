/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import App from "./App";

const AT = reactToWebComponent(App, React, ReactDOM, {
  props: {
    audio: "string",
    transcription: "string",
  },
});

customElements.define("audio-transcription", AT);
