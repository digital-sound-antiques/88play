import { Button, Theme, useMediaQuery } from "@mui/material";
import { ForwardedRef, MouseEventHandler, ReactNode, forwardRef } from "react";

export const ToolBarButton = forwardRef(
  (
    props: {
      icon: ReactNode;
      label?: string | null;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      noShrink?: boolean | null;
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const isXs = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

    if (isXs && !(props.noShrink ?? false)) {
      return (
        <Button
          ref={ref}
          size="small"
          variant="outlined"
          onClick={props.onClick}
          sx={{ minWidth: 32 }}
        >
          {props.icon}
        </Button>
      );
    }
    return (
      <Button
        ref={ref}
        size="small"
        variant="outlined"
        onClick={props.onClick}
        sx={{ minWidth: 32 }}
      >
        {props.icon}
        {props.label != null ? "\u00A0" + props.label : null}
      </Button>
    );
  }
);
