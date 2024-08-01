import { useEffect, useRef } from "react";

export interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  initialHeight?: React.CSSProperties["height"];
  maxHeight?: number;
}

export function AutoResizeTextarea({
  initialHeight,
  maxHeight,
  ...props
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function adjustTextareaHeight() {
    const textarea = ref.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    const borderHeight = textarea.offsetHeight - textarea.clientHeight;
    const contentHeight = textarea.scrollHeight + borderHeight;
    if (maxHeight === undefined || contentHeight <= maxHeight) {
      textarea.style.height = `${contentHeight}px`;
    } else {
      textarea.style.height = `${maxHeight}px`;
    }
  }

  useEffect(() => {
    adjustTextareaHeight();
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={ref}
      style={{ ...props.style, height: initialHeight }}
      onChange={(e) => {
        props.onChange?.(e);
        if (props.value === undefined) {
          adjustTextareaHeight();
        }
      }}
    />
  );
}
