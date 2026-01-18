import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
}

export function CustomScrollbar({ children, className = '' }: CustomScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Reset scroll position to top when children change
    content.scrollTop = 0;

    const updateScrollbar = () => {
      const containerHeight = container.clientHeight;
      const contentHeight = content.scrollHeight;
      const scrollRatio = containerHeight / contentHeight;

      if (scrollRatio >= 1) {
        setShowScrollbar(false);
        return;
      }

      setShowScrollbar(true);
      const trackPaddingTop = 12; // top-3 = 12px
      const trackPaddingBottom = 12; // bottom-3 = 12px
      const trackPadding = trackPaddingTop + trackPaddingBottom; // 24px total
      const availableHeight = containerHeight - trackPadding;
      // Ensure thumb doesn't exceed available height
      const calculatedThumbHeight = Math.min(
        Math.max(scrollRatio * availableHeight, 30),
        availableHeight
      );
      setThumbHeight(calculatedThumbHeight);

      const scrollPercentage = content.scrollTop / (contentHeight - containerHeight);
      const maxThumbTop = Math.max(0, availableHeight - calculatedThumbHeight);
      setThumbTop(scrollPercentage * maxThumbTop);
    };

    // Initial update
    updateScrollbar();

    // Delayed update to catch content that renders after mount
    const timeoutId = setTimeout(updateScrollbar, 100);

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(content);
    content.addEventListener('scroll', updateScrollbar);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      content.removeEventListener('scroll', updateScrollbar);
    };
  }, [children]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const containerRect = container.getBoundingClientRect();
      const mouseY = e.clientY - containerRect.top;
      const containerHeight = container.clientHeight;
      const contentHeight = content.scrollHeight;
      const trackPaddingTop = 12; // top-3 = 12px
      const trackPaddingBottom = 12; // bottom-3 = 12px
      const trackPadding = trackPaddingTop + trackPaddingBottom; // 24px total
      const availableHeight = containerHeight - trackPadding;
      const maxThumbTop = availableHeight - thumbHeight;

      const newThumbTop = Math.max(
        0,
        Math.min(mouseY - thumbHeight / 2 - trackPaddingTop, maxThumbTop)
      );
      const scrollPercentage = newThumbTop / maxThumbTop;
      content.scrollTop = scrollPercentage * (contentHeight - containerHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerRect = container.getBoundingClientRect();
    const clickY = e.clientY - containerRect.top;
    const containerHeight = container.clientHeight;
    const contentHeight = content.scrollHeight;
    const trackPaddingTop = 12; // top-3 = 12px
    const trackPaddingBottom = 12; // bottom-3 = 12px
    const trackPadding = trackPaddingTop + trackPaddingBottom; // 24px total
    const availableHeight = containerHeight - trackPadding;
    const adjustedClickY = Math.max(0, Math.min(clickY - trackPaddingTop, availableHeight));
    const scrollPercentage = adjustedClickY / availableHeight;

    content.scrollTop = scrollPercentage * (contentHeight - containerHeight);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Content with hidden scrollbar */}
      <div
        ref={contentRef}
        className={`h-full overflow-y-scroll scrollbar-hide ${showScrollbar ? 'pr-7' : ''}`}
      >
        {children}
      </div>

      {/* Custom scrollbar */}
      {showScrollbar && (
        <div
          className="absolute right-0 top-0 bottom-0 w-7 cursor-pointer"
          onClick={handleTrackClick}
        >
          {/* Track */}
          <div className="absolute w-3 left-4 top-3 bottom-3 bg-display-bg-primary rounded-full" />

          {/* Thumb */}
          <div
            ref={thumbRef}
            className="absolute w-1.5 bg-display-bg-tertiary rounded-full cursor-grab active:cursor-grabbing transition-colors hover:bg-display-text-secondary"
            style={{
              height: `${thumbHeight}px`,
              top: `${thumbTop + 12}px`,
              left: '19px',
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
      )}
    </div>
  );
}
