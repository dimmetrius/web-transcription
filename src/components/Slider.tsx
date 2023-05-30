import React, { FC, useEffect, useRef, useState } from "react";

interface IProps {
  position: number;
  minValue: number;
  maxValue: number;
  viewComponent: FC<{ position: number }>;
  onPositionChange?: (position: number) => void;
}

const Slider: React.FC<IProps> = (props: IProps) => {
  const {
    position,
    minValue,
    maxValue,
    viewComponent,
    onPositionChange = () => {
      return;
    },
  } = props;

  const ViewComponent = viewComponent;

  const containerRef = useRef<HTMLDivElement>(null);

  // 0 to 1
  // const [sliderPosition, setSliderPosition] = useState<number>(position);
  const w = containerRef.current?.getBoundingClientRect().width || 0;
  const [containerWidth, setContainerWidth] = useState<number>(w);
  // const [isSliding, setIsSliding] = useState<boolean>(false);

  // make the component responsive
  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    const w = containerElement.getBoundingClientRect().width;
    setContainerWidth(w);
    const resizeObserver = new ResizeObserver(([entry]) => {
      const currentContainerWidth = entry.target.getBoundingClientRect().width;
      setContainerWidth(currentContainerWidth);
    });
    resizeObserver.observe(containerElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const handleSliding = (event: TouchEvent | MouseEvent) => {
      const e = event || window.event;

      // Calc cursor position from the:
      // - left edge of the viewport (for horizontal)
      // - top edge of the viewport (for vertical)

      const cursorXfromViewport = "touches" in e ? e.touches[0].pageX : e.pageX;

      // Calc Cursor Position from the:
      // - left edge of the window (for horizontal)
      // - top edge of the window (for vertical)
      // to consider any page scrolling
      const cursorXfromWindow = cursorXfromViewport - window.pageXOffset;

      const containerPosition = containerElement.getBoundingClientRect();

      let pos = cursorXfromWindow - containerPosition.left;

      if (pos < 0) pos = 0;
      if (pos > containerWidth) pos = containerWidth;

      // setSliderPosition(pos / containerWidth)

      // If there's a callback function, invoke it everytime the slider changes
      const newPos = containerWidth
        ? (maxValue - minValue) * (pos / containerWidth)
        : 0;
      if (onPositionChange) {
        onPositionChange(newPos);
      }
    };

    const startSliding = (e: TouchEvent | MouseEvent) => {
      // setIsSliding(true);

      // Prevent default behavior other than mobile scrolling
      if (!("touches" in e)) {
        e.preventDefault();
      }

      // Slide the image even if you just click or tap (not drag)
      handleSliding(e);

      window.addEventListener("mousemove", handleSliding); // 07
      window.addEventListener("touchmove", handleSliding); // 08
    };

    const finishSliding = () => {
      // setIsSliding(false);
      window.removeEventListener("mousemove", handleSliding);
      window.removeEventListener("touchmove", handleSliding);
    };
    // it's necessary to reset event handlers each time the canvasWidth changes

    // for mobile
    containerElement.addEventListener("touchstart", startSliding); // 01
    window.addEventListener("touchend", finishSliding); // 02

    containerElement.addEventListener("mousedown", startSliding); // 05
    window.addEventListener("mouseup", finishSliding); // 06

    return () => {
      // cleanup all event resteners
      containerElement.removeEventListener("touchstart", startSliding); // 01
      window.removeEventListener("touchend", finishSliding); // 02
      containerElement.removeEventListener("mousemove", handleSliding); // 03
      containerElement.removeEventListener("mouseleave", finishSliding); // 04
      containerElement.removeEventListener("mousedown", startSliding); // 05
      window.removeEventListener("mouseup", finishSliding); // 06
      window.removeEventListener("mousemove", handleSliding); // 07
      window.removeEventListener("touchmove", handleSliding); // 08
    };
  }, [containerWidth, maxValue, minValue, onPositionChange]);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      boxSizing: "border-box",
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <>
      <div
        style={{
          ...styles.container,
        }}
        ref={containerRef}
      >
        <ViewComponent position={position} />
      </div>
    </>
  );
};

export default Slider;
