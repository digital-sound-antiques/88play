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
import { AppGlobalContext } from "../contexts/AppGlobalContext.js";

type EditorViewProps = {
  sx?: SxProps<Theme>;
};

export function EditorView(props: EditorViewProps) {
  const { setErrorMessage } = useContext(AppGlobalContext);
  const context = useContext(EditorContext);
  const consoleContext = useContext(ConsoleContext);
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
    for (const line of consoleContext.incomingLines) {
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
  }, [consoleContext.incomingLines]);

  const resizeObserver = new ResizeObserver(onResize);

  useEffect(() => {
    if (boxRef.current != null) {
      resizeObserver.observe(boxRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileDrop = async (fileList: FileList | null) => {
    try {
      await context.reducer.onFileOpen(fileList);
    } catch (e) {
      setErrorMessage(e);
    }
  };

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
      <FileDropContext onFileDrop={onFileDrop}>
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
            tabSize: 2,
            useSoftTabs: true,
            navigateWithinSoftTabs: true,
          }}
        />
      </FileDropContext>
    </Box>
  );
}
