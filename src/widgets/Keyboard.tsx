import { Box, Stack, SxProps, Theme, useMediaQuery } from "@mui/material";
import {
  pink
} from "@mui/material/colors";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

export type KeyboardPainterArgs = {
  whiteKeyWidth: number;
  blackKeyWidth: number;
  whiteKeyRadii: number | Iterable<number>;
  blackKeyRadii: number | Iterable<number>;
  keyMargin: number;
  whiteKeyHeight: number;
  blackKeyHeight: number;
  numberOfWhiteKeys: number;
};

const defaultKeyboardLayout: KeyboardPainterArgs = {
  whiteKeyWidth: 12,
  whiteKeyHeight: 48,
  whiteKeyRadii: [0, 0, 0.5, 0.5],
  blackKeyWidth: 9,
  blackKeyHeight: 32,
  blackKeyRadii: [0, 0, 0.5, 0.5],
  keyMargin: 1,
  numberOfWhiteKeys: 56,
};

export class KeyboardPainter {
  constructor(args: KeyboardPainterArgs = defaultKeyboardLayout) {
    this.args = args;
    this._width =
      (this.args.whiteKeyWidth + this.args.keyMargin) *
        this.args.numberOfWhiteKeys -
      this.args.keyMargin;
  }

  args: KeyboardPainterArgs;

  private _width: number;

  get width() {
    return this._width;
  }
  get height() {
    return this.args.whiteKeyHeight;
  }

  paintWhiteKeys(ctx: CanvasRenderingContext2D, color: string) {
    let x = 0;
    const w = this.args.whiteKeyWidth;
    const h = this.args.whiteKeyHeight;
    const step = w + this.args.keyMargin;

    ctx.fillStyle = color;
    for (let i = 0; i < this.args.numberOfWhiteKeys; i++) {
      ctx.rect(x, 0, w, h);
      x += step;
    }
    ctx.fill();
  }

  paintBlackKeys(ctx: CanvasRenderingContext2D, color: string) {
    let x =
      this.args.whiteKeyWidth -
      Math.floor((this.args.blackKeyWidth - this.args.keyMargin) / 2);
    const w = this.args.blackKeyWidth;
    const h = this.args.blackKeyHeight;
    const step = this.args.whiteKeyWidth + this.args.keyMargin;
    ctx.fillStyle = color;
    for (let i = 0; i < this.args.numberOfWhiteKeys; i++) {
      if (i % 7 != 2 && i % 7 != 6) {
        ctx.rect(x, 0, w, h);
      }
      x += step;
    }
    ctx.fill();
  }

  paintWhiteKeysOverlay(
    canvas: HTMLCanvasElement,
    kcodes: number[],
    colors: string[]
  ) {
    const w = this.args.whiteKeyWidth;
    const h = this.args.whiteKeyHeight;
    const step = this.args.whiteKeyWidth + this.args.keyMargin;

    const kc2key = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6, null];
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < kcodes.length; i++) {
      const kcode = kcodes[i];
      const color = colors[i];
      const key = kc2key[kcode % 12]!;
      if (key != null) {
        const oct = Math.floor(kcode / 12);
        const dx = (key + oct * 7) * step;
        ctx.fillStyle = color;
        ctx.fillRect(dx, 0, w, h);
      }
    }
  }

  paintBlackKeysOverlay(
    canvas: HTMLCanvasElement,
    kcodes: number[],
    colors: string[],
    whiteKeyColor: string
  ) {
    const x =
      this.args.whiteKeyWidth -
      Math.floor((this.args.blackKeyWidth - this.args.keyMargin) / 2);
    const w = this.args.blackKeyWidth;
    const h = this.args.blackKeyHeight;
    const step = this.args.whiteKeyWidth + this.args.keyMargin;
    const kc2key = [null, 0, null, 1, null, null, 3, null, 4, null, 5, null];
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < kcodes.length; i++) {
      const kcode = kcodes[i];
      const key = kc2key[kcode % 12]!;
      if (key != null) {
        const oct = Math.floor(kcode / 12);
        const dx = (key + oct * 7) * step;

        ctx.fillStyle = whiteKeyColor;
        ctx.fillRect(x + dx + 1, 1, w - 2, h - 2);

        ctx.fillStyle = colors[i];
        ctx.fillRect(x + dx + 1, 1, w - 2, h - 2);
      }
    }
  }
}

function WhiteKeys(props: {
  width?: number | null;
  height?: number | null;
  painter: KeyboardPainter;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = props.painter.width;
    canvas.height = props.painter.height;
    canvas.style.width = `${props.width}px`;
    canvas.style.height = `${props.height}px`;
    props.painter.paintWhiteKeys(canvas.getContext("2d")!, props.color);
  }, [props.width, props.height, props.color, props.painter]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0 }}
    ></canvas>
  );
}

function rkey2notes(rkey: number): number[] {
  const res: number[] = [];
  if (rkey > 63) {
    return res;
  }
  if (rkey & 1) {
    res.push(24); // BD
  }
  if (rkey & 2) {
    res.push(26); // SD
  }
  if (rkey & 4) {
    res.push(37); // CYM
  }
  if (rkey & 8) {
    res.push(30); // HH
  }
  if (rkey & 16) {
    res.push(31); // TOM
  }
  if (rkey & 32) {
    res.push(25); // RIM
  }
  return res;
}

function WhiteKeysOverlay(props: {
  width?: number | null;
  height?: number | null;
  painter: KeyboardPainter;
  targets: number[];
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerContext = useContext(PlayerContext);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = props.painter.width;
    canvas.height = props.painter.height;
    canvas.style.width = `${props.width}px`;
    canvas.style.height = `${props.height}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.width, props.height]);

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const renderFrame = () => {
      const canvas = canvasRef.current!;
      if (canvas != null) {
        requestAnimationFrame(renderFrame);
        const kcodes = [];
        const colors = [];
        for (const target of props.targets) {
          const chdata = playerContext.player.getChannelStatus(target);
          if (chdata != null && chdata.note != 0xff) {
            if (chdata.chnum == 6) {
              for (const note of rkey2notes(chdata.note)) {
                kcodes.push(note);
                colors.push(propsRef.current.color);
              }
            } else {
              kcodes.push(chdata.note);
              colors.push(propsRef.current.color);
            }
          }
        }
        props.painter.paintWhiteKeysOverlay(canvas, kcodes, colors);
      }
    };
    renderFrame();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0 }}
    ></canvas>
  );
}

function BlackKeys(props: {
  width?: number | null;
  height?: number | null;
  painter: KeyboardPainter;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = props.painter.width;
    canvas.height = props.painter.height;
    canvas.style.width = `${props.width}px`;
    canvas.style.height = `${props.height}px`;
    props.painter.paintBlackKeys(canvas.getContext("2d")!, props.color);
  }, [props.width, props.height, props.color, props.painter]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0 }}
    ></canvas>
  );
}

function BlackKeysOverlay(props: {
  width?: number | null;
  height?: number | null;
  painter: KeyboardPainter;
  targets: number[];
  color: string;
  whiteKeyColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = props.painter.width;
    canvas.height = props.painter.height;
    canvas.style.width = `${props.width}px`;
    canvas.style.height = `${props.height}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.width, props.height]);

  const playerContext = useContext(PlayerContext);

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const renderFrame = () => {
      const canvas = canvasRef.current!;
      if (canvas != null) {
        requestAnimationFrame(renderFrame);
        const kcodes = [];
        const colors = [];
        for (const target of props.targets) {
          const chdata = playerContext.player.getChannelStatus(target);
          if (chdata != null && chdata.note != 0xff) {
            if (chdata.chnum == 6) {
              for (const note of rkey2notes(chdata.note)) {
                kcodes.push(note);
                colors.push(propsRef.current.color);
              }
            } else {
              kcodes.push(chdata.note);
              colors.push(propsRef.current.color);
            }
          }
        }
        props.painter.paintBlackKeysOverlay(
          canvas,
          kcodes,
          colors,
          propsRef.current.whiteKeyColor
        );
      }
    };
    renderFrame();
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0 }}
    ></canvas>
  );
}

type KeyboardProps = {
  painter?: KeyboardPainter | null;
  targets: number[];
  disabled?: boolean | null;
  highlightColor: string;
  whiteKeyColor: string;
  blackKeyColor: string;
  sx?: SxProps<Theme> | null;
};

const defaultPainter = new KeyboardPainter();

export function Keyboard(props: KeyboardProps) {
  const boxRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const painter = props.painter ?? defaultPainter;

  const onResize = () => {
    const rect = boxRef.current!.getBoundingClientRect();
    setSize({
      width: rect.width,
      height: rect.height,
    });
  };
  const resizeObserver = new ResizeObserver(onResize);

  useEffect(() => {
    resizeObserver.observe(boxRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const targets: number[] =
    props.targets instanceof Array
      ? (props.targets as number[])
      : [props.targets];

  return (
    <Box
      ref={boxRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...props.sx,
      }}
    >
      <WhiteKeys
        color={props.whiteKeyColor}
        painter={painter}
        width={size.width}
        height={size.height}
      />
      {props.disabled != true ? (
        <WhiteKeysOverlay
          painter={painter}
          targets={targets}
          width={size.width}
          height={size.height}
          color={props.highlightColor}
        />
      ) : undefined}
      <BlackKeys
        color={props.blackKeyColor}
        painter={painter}
        width={size.width}
        height={size.height}
      />
      {props.disabled != true ? (
        <BlackKeysOverlay
          painter={painter}
          targets={targets}
          width={size.width}
          height={size.height}
          color={props.highlightColor}
          whiteKeyColor={props.whiteKeyColor}
        />
      ) : undefined}
    </Box>
  );
}

export function Keyboards() {
  const isXs = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onResize = () => {
    setSize({
      width: boxRef.current?.clientWidth ?? 0,
      height: boxRef.current?.clientHeight ?? 0,
    });
  };
  const resizeObserver = new ResizeObserver(onResize);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resizeObserver.observe(boxRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const children = useMemo(() => {
    const maxWidth = Math.max(512, Math.min(960, (512 * size.height) / 320));
    const minHeight = Math.floor((12 * maxWidth) / 512);
    const maxHeight = Math.floor((28 * maxWidth) / 512);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => (
      <Stack
        key={e}
        direction="row"
        sx={{ alignItems: "center", width: "100%", height: `${maxHeight}px` }}
      >
        <Box
          sx={{
            p: 0,
            width: "16px",
            fontFamily:
              "Monaco, Menlo, 'Ubuntu Mono', Consolas, 'Source Code Pro', source-code-pro, monospace",
            fontSize: "11px",
            lineHeight: "100%",
          }}
        >
          {String.fromCharCode(0x41 + e)}
        </Box>
        <Keyboard
          targets={[e]}
          highlightColor={pink[300]}
          blackKeyColor="#181818"
          whiteKeyColor="#c8c8c8"
          sx={{
            maxWidth: `${maxWidth}px`,
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
          }}
        />
      </Stack>
    ));
  }, [size]);

  return (
    <Stack
      ref={boxRef}
      direction="column"
      gap="1px"
      sx={{
        px: isXs ? 0 : 2,
        pb: 1,
        justifyContent: "start",
        alignItems: "start",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {children}
    </Stack>
  );
}
