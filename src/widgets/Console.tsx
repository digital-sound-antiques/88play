import { CSSProperties, useContext, useEffect, useRef, useState } from "react";

import { Divider } from "@mui/material";
import { brown } from "@mui/material/colors";
import { Box } from "@mui/system";
import { ConsoleContext } from "../contexts/ConsoleContext";

function ConsoleLine(props: { text: string }) {
  const text = props.text == "" ? "\u00A0" : props.text;

  const m = text.match(/^(#[a-z0-9]+)(.*)$/i);
  const emColor = "#9f9";
  const color = brown[100];
  const errorColor = "#f99";

  const emStyle: CSSProperties = {
    color: emColor,
    textShadow: `0 0 2px ${emColor}, 0 0 8px ${emColor}`,
  };
  const errorStyle: CSSProperties = {
    color: errorColor,
    textShadow: `0 0 2px ${errorColor}, 0 0 8px ${errorColor}`,
  };
  const style: CSSProperties = {
    color: color,
    textShadow: `0 0 2px ${color}, 0 0 8px ${color}`,
  };

  let child;
  if (m != null) {
    if (/error/i.test(m[0])) {
      child = <pre style={errorStyle}>{text}</pre>;
    } else {
      child = <pre style={emStyle}>{text}</pre>;
    }
  } else {
    if (/error/i.test(text)) {
      child = <pre style={errorStyle}>{text}</pre>;
    } else {
      child = <pre style={style}>{text}</pre>;
    }
  }

  return (
    <div
      style={{
        padding: 0,
        margin: 0,
      }}
    >
      {child}
    </div>
  );
}

function Caret() {
  const color = brown[200];
  return (
    <>
      <style>
        {`
        @keyframes blink {
          0% {
            opacity: 1.0;
          }
          25% {
            opacity: 1.0;
          }          
          50% {
            opacity: 0.0;
          }
          75% {
            opacity: 1.0;
          }
          100% {
            opacity: 1.0;
          }
        }
        `}
      </style>
      <div
        style={{
          padding: 0,
          margin: 0,
          animation: "1s infinite normal blink",
          color: color,
          textShadow: `0 0 3px ${color}, 0 0 8px ${color}`,
        }}
      >
        <pre>{"\u2589"}</pre>
      </div>
    </>
  );
}

type ConsoleState = {
  lines: string[];
  linesAdded: number;
  rev: number;
};

const defaultConsoleState: ConsoleState = {
  lines: [],
  linesAdded: 0,
  rev: 0,
};

export function Console(props: { style?: CSSProperties | null }) {
  const context = useContext(ConsoleContext);
  const [state, setState] = useState<ConsoleState>({
    ...defaultConsoleState,
    lines: context.lines,
    linesAdded: context.lines.length,
    rev: context.rev,
  });

  useEffect(() => {
    const div = containerRef.current!;
    div.scrollTop = div.scrollHeight;
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setState((oldState) => {
        if (oldState.lines.length > oldState.linesAdded) {
          return {
            ...oldState,
            linesAdded: oldState.linesAdded + 1,
          };
        }
        return oldState;
      });
    }, 16);
    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (state.rev != context.rev) {
      const incomingLines = context.incomingLines;
      setState({
        ...state,
        lines: [...state.lines, ...incomingLines],
      });
    }
  }, [context.rev]);

  const maxLines = 300;
  const visibleLines = state.lines
    .slice(Math.max(0, state.lines.length - maxLines), state.linesAdded + 1)
    .reverse();

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box sx={{ height: "4px", backgroundColor: "background.paper" }}></Box>
      <Divider />
      <style>
        {`
        .mucom88-console pre {
          font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, "Source Code Pro", source-code-pro, monospace;
          font-size: 11px;
          margin: 0;
          white-space: pre-wrap;
        }
        `}
      </style>
      <div
        className="mucom88-console"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          ...props.style,
          textAlign: "left",
        }}
      >
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column-reverse",
              justifyContent: "start",
              alignItems: "stretch",
              padding: "16px",
            }}
          >
            {[
              <Caret key="caret" />,
              ...visibleLines.map((e, i) => <ConsoleLine text={e} key={i} />),
            ]}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            ...overlayStyle,
          }}
        ></div>
      </div>
    </>
  );
}

const overlayStyle: CSSProperties = {
  pointerEvents: "none",
  background:
    "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
  zIndex: 2,
  backgroundSize: "100% 2px, 2px 100%",
};
