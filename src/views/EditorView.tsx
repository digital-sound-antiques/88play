import { Box, SxProps, Theme } from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds/ace";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "../ace/mode-mucom.js";
import { ConsoleContext } from "../contexts/ConsoleContext.js";
import { EditorContext } from "../contexts/EditorContext";
import { EditorSettingsContext } from "../contexts/EditorSettingContext.js";
import { FileDropContext } from "../contexts/FileDropContext";

type EditorViewProps = {
  sx?: SxProps<Theme>;
};

export function EditorView(props: EditorViewProps) {
  const context = useContext(EditorContext);
  const console = useContext(ConsoleContext);
  const settings = useContext(EditorSettingsContext);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const aceRef = useRef<AceEditor>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const onResize = () => {
    if (boxRef.current != null) {
      const width = boxRef.current?.clientWidth ?? 0;
      const height = boxRef.current?.clientHeight ?? 0;
      setSize({
        width,
        height,
      });
    }
  };

  const annotations: Ace.Annotation[] = useMemo(() => {
    const res: Ace.Annotation[] = [];
    for (const line of console.incomingLines) {
      const m = line.match(/#error.*in\s*line\s*([0-9]+)/);
      if (m != null) {
        res.push({
          row: parseInt(m[1]) - 1,
          column: 0,
          text: "Syntax Error",
          type: "error",
        });
      }
    }
    return res;
  }, [console.incomingLines]);

  const resizeObserver = new ResizeObserver(onResize);

  useEffect(() => {
    if (boxRef.current != null) {
      resizeObserver.observe(boxRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Box
      ref={boxRef}
      sx={{
        position: "absolute",
        display: "flex",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        ...props.sx,
      }}
    >
      <FileDropContext
        onFileDrop={(fileList) => context.reducer.onFileOpen(fileList)}
      >
        <AceEditor
          ref={aceRef}
          annotations={annotations}
          theme="mucom"
          value={context.text}
          fontSize={settings.fontSize}
          wrapEnabled={settings.wrap}
          mode="mucom"
          onChange={context.reducer.onChangeText}
          name="mml_editor"
          editorProps={{ $blockScrolling: true }}
          style={{
            position: "relative",
            width: size.width + "px",
            height: size.height + "px",
          }}
          setOptions={{
            indentedSoftWrap: false,
          }}
        />
      </FileDropContext>
    </Box>
  );
}
