import { useState, useRef, useEffect, PropsWithChildren, Fragment, CSSProperties } from "react";

type MarqueeProps = PropsWithChildren & {
  play: boolean;
};

export function Marquee({ play, children }: MarqueeProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const calculateWidth = () => {
    // Find width of container and width of marquee
    if (marqueeRef.current && containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
      setMarqueeWidth(marqueeRef.current.getBoundingClientRect().width);
    }
  };

  useEffect(() => {
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  }, []);

  // Recalculate width when children change
  useEffect(() => {
    calculateWidth();
  }, [children]);

  const speed = 25;
  const active = play && marqueeWidth > containerWidth;
  const duration = marqueeWidth / speed;

  return (
    <Fragment>
      <style>{keyframes}</style>
      <div ref={containerRef} style={containerStyle}>
        <div
          ref={marqueeRef}
          style={{
            ...marqueeStyle,
            animationDuration: `${duration}s`,
            animationName: active ? "scroll" : "none",
          }}
        >
          {children}
        </div>
      </div>
    </Fragment>
  );
}

const containerStyle: CSSProperties = {
  overflowX: "hidden",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  width: "100%",
};

const marqueeStyle: CSSProperties = {
  flex: "0 0 auto",
  minWidth: "100%",
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
  animationPlayState: "running",
};

const keyframes = `
@keyframes scroll {
  0% {
      transform: translateX(100%);
  }
  100% {
      transform: translateX(-100%);
  }
}
`;
