import { Box, useTheme } from "@mui/material";
import { PropsWithChildren, useRef, useState } from "react";
import { FileDrop } from "react-file-drop";

export function useFileDrop(
  onFileDrop?:
    | ((files: FileList | null, ev: React.DragEvent<HTMLDivElement>) => void)
    | null
) {
  const [isDraggingOver, setDraggingOver] = useState(false);

  const highlightListItem = (target: HTMLElement): HTMLElement | null => {
    if (target instanceof HTMLElement) {
      const item = target.closest(".MuiListItem-root");
      const list = target.closest(".MuiList-root");
      const items = list?.querySelectorAll(".MuiListItem-root") ?? [];
      for (let i = 0; i < items.length; i++) {
        if (items[i] == item) {
          items[i].classList.add("fileDragOver");
        } else {
          items[i].classList.remove("fileDragOver");
        }
      }
    }
    return null;
  };

  const clearHighlight = () => {
    const list = document.querySelector(".MuiList-root");
    const items = list?.querySelectorAll(".MuiListItem-root") ?? [];
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("fileDragOver");
    }
  };

  const fileDropRef = useRef(null);
  const fileDropProps = {
    onDragOver: (ev: React.DragEvent<HTMLDivElement>) => {
      if (ev.defaultPrevented) {
        setDraggingOver(false);
        return;
      }
      setDraggingOver(true);
      highlightListItem(ev.target as HTMLElement);
      ev.preventDefault();
    },
    onDragLeave: (_: React.DragEvent<HTMLDivElement>) => {
      setDraggingOver(false);
      clearHighlight();
    },
    onDrop: (files: FileList | null, ev: React.DragEvent<HTMLDivElement>) => {
      clearHighlight();
      setDraggingOver(false);
      if (ev.defaultPrevented) {
        return;
      }
      onFileDrop?.(files, ev);
      ev.preventDefault();
    },
  };

  return { fileDropRef, fileDropProps, isDraggingOver };
}

type FileDropContextProps = PropsWithChildren & {
  onFileDrop: (
    files: FileList | null,
    ev: React.DragEvent<HTMLDivElement>
  ) => void;
};

export function FileDropContext(props: FileDropContextProps) {
  const theme = useTheme();
  const { fileDropRef, fileDropProps, isDraggingOver } = useFileDrop(
    props.onFileDrop
  );
  
  return (
    <FileDrop ref={fileDropRef} {...fileDropProps}>
      <style>{`.fileDragOver { border-top: 2px solid ${theme.palette.secondary.main};  }`}</style>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {props.children}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: isDraggingOver ? "flex" : "none",
            zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff40",
            pointerEvents: "none",
          }}
        ></Box>
      </Box>
    </FileDrop>
  );
}
