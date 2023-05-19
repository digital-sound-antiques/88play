import { Theme, useMediaQuery } from "@mui/material";
import { amber, brown, green, lightBlue } from "@mui/material/colors";
import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import { MucomDecoderSnapshot } from "../mucom/mucom-decoder-worker";

export function Monitor(props: { style?: CSSProperties | null }) {
  const context = useContext(PlayerContext);
  const [contents, setContents] = useState<ReactNode>(<></>);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const update = () => {
      const snapshot = context.player.findSnapshotAt(
        context.player.progress.renderer.currentTime
      );
      setContents(buildContents(snapshot));
      if (mountedRef.current == true) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isXs = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const fontSize = isXs ? 10 : 11;

  return (
    <>
      <style>
        {`
        .mucom88-monitor pre {
          font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, "Source Code Pro", source-code-pro, monospace;
          font-size: ${fontSize}px;
          font-weight: bold;
          margin: 0;
          white-space: pre-wrap;
        }
        `}
      </style>
      <div
        className="mucom88-monitor"
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
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: "0px 12px",
          }}
        >
          {contents}
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

const colors = [
  brown[50],
  brown[50],
  brown[50],
  lightBlue[300],
  lightBlue[300],
  lightBlue[300],
  green[400],
  brown[50],
  brown[50],
  brown[50],
  amber[400],
];

function buildContents(
  snapshot?: MucomDecoderSnapshot | null
): React.ReactNode {
  const lines: ReactNode[] = [];
  const color = "white";
  lines.push(
    <pre
      key={-1}
      style={{ color, textShadow: `0 0 1px ${color}, 0 0 4px ${color}` }}
    >
      {"   Inst Vol Det   Adr  Note   LFO Rev p qtz"}
    </pre>
  );
  for (let i = 0; i < 11; i++) {
    const pch = snapshot?.data[i];
    let cols: string[] = [];
    if (pch != null) {
      const noteStr =
        i == 6 ? toRflag(pch.note) : toNote(pch.code >> 4, pch.note);
      let vnum;
      if (i == 6 || i == 10) {
        vnum = "@" + toDec(pch.vnum, 3);
      } else if (3 <= i && i <=5 ) {
        vnum = "----";
      } else {
        vnum = "@" + toDec(pch.vnum_org,3);
      }
      cols = [
        String.fromCharCode(0x41 + i) + " ",
        vnum,
        toDec(pch.vol_org, 3),
        toDec(pch.detune, 5),
        toHex(pch.wadr, 4),
        noteStr,
        pch.lfo_diff != 0 ? "ON " : "OFF",
        pch.reverb !== 0 ? "ON " : "OFF",
        toPan(pch.pan),
        toDec(pch.quantize, 3),
      ];
    } else {
      const noteStr = i == 6 ? toRflag(0) : toNote(0, 0xff);
      cols = [
        String.fromCharCode(0x41 + i) + " ",
        "----",
        toDec(0, 3),
        toDec(0, 5),
        toHex(0, 4),
        noteStr,
        "OFF",
        "OFF",
        toPan(0),
        toDec(0, 3),
      ];
    }
    const color = colors[i];
    lines.push(
      <pre
        key={i}
        style={{ color, textShadow: `0 0 1px ${color}, 0 0 4px ${color}` }}
      >
        {cols.join(" ")}
      </pre>
    );
  }
  return lines;
}

function toPan(value: number) {
  switch (value) {
    case 1:
      return "R";
    case 2:
      return "L";
    case 3:
      return "C";
    default:
      return "-";
  }
}
const keyNames = [
  "C ",
  "C+",
  "D ",
  "D+",
  "E ",
  "F ",
  "F+",
  "G ",
  "G+",
  "A ",
  "A+",
  "B ",
];

function toRflag(key: number) {
  const res = [];
  if (key == 0xff) return "------";
  res.push(key & 32 ? "R" : "-");
  res.push(key & 16 ? "M" : "-");
  res.push(key & 8 ? "H" : "-");
  res.push(key & 4 ? "C" : "-");
  res.push(key & 2 ? "S" : "-");
  res.push(key & 1 ? "B" : "-");
  return res.join("");
}

function toNote(oct: number, key: number) {
  let name;
  if (key == 0xff) {
    name = "  ";
  } else {
    name = keyNames[key % 12];
  }
  return "o" + (oct + 1) + " " + name + " ";
}

function toDec(value: number, cols: number) {
  const text = "00000000" + value.toString();
  return text.slice(text.length - cols, text.length);
}

function toHex(value: number, cols: number) {
  const text = "00000000" + value.toString(16).toUpperCase();
  return text.slice(text.length - cols, text.length);
}
