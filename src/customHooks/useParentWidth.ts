import { useEffect, useRef, useState } from "react";

const useParentWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<number>(window.innerWidth);
  const [parentWidth, setParentWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth !== widthRef.current) {
          widthRef.current = newWidth;
          setParentWidth(newWidth);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return { containerRef, parentWidth };
};

export default useParentWidth;
