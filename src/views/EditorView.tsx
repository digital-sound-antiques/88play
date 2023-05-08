import { Box, SxProps, Theme } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "../ace/mode-mucom.js";
import { EditorContext } from "../contexts/EditorContext";
import { EditorSettingsContext } from "../contexts/EditorSettingContext.js";
import { FileDropContext } from "../contexts/FileDropContext";

type EditorViewProps = {
  sx?: SxProps<Theme>;
};

export function EditorView(props: EditorViewProps) {
  const context = useContext(EditorContext);
  const settings = useContext(EditorSettingsContext);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const aceRef = useRef<AceEditor>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const onResize = () => {
    if (boxRef.current != null) {
      const width = boxRef.current!.clientWidth;
      const height = boxRef.current!.clientHeight;
      setSize({
        width,
        height,
      });
    }
  };

  const resizeObserver = new ResizeObserver(onResize);

  useEffect(() => {
    resizeObserver.observe(boxRef.current!);
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
          theme="mucom"
          value={context.text}
          fontSize={settings.fontSize}
          wrapEnabled={settings.wrap}
          mode="mucom"
          onChange={context.reducer.onChangeText}
          name="mml"
          editorProps={{ $blockScrolling: true }}
          style={{
            position: "relative",
            width: size.width + "px",
            height: size.height + "px",
          }}
        />
      </FileDropContext>
    </Box>
  );
}
