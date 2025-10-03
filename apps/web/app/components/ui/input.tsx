import {
  type ComponentProps,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ChangeEvent,
  forwardRef,
} from "react";
import { cn } from "@/lib/tailwindcss/merge";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { mergeRefs } from "@/utils/mergeRefs";

interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  size?: "md" | "sm";
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  function TextInput(
    { className, type = "text", size = "md", hasError = false, ...props },
    ref
  ) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          // Size variants
          {
            "h-9 px-3 py-1 file:h-7 file:text-sm md:text-sm rounded-md":
              size === "md",
            "h-6 px-2 py-1 file:h-5 file:text-xs text-sm rounded-sm":
              size === "sm",
          },
          // Focus styles - red shadow when has error, normal ring otherwise
          hasError
            ? "focus-visible:border-destructive focus-visible:ring-destructive/50 focus-visible:ring-[3px] focus-visible:shadow-[0_0_0_3px_hsl(var(--destructive)/0.3)]"
            : "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    );
  }
);

export function NumberInput(
  props: Omit<NumericFormatProps, "size"> & InputProps
) {
  return (
    <NumericFormat
      placeholder="Enter a number value"
      min={0}
      max={100}
      maxLength={3}
      decimalScale={0}
      thousandSeparator={false}
      type="text"
      {...props}
      customInput={TextInput}
    />
  );
}

const autosizeInputExtraWidht: Record<
  NonNullable<InputProps["size"]>,
  number
> = {
  sm: 18,
  md: 26,
};

interface AutosizeInputProps extends InputProps {
  minWidth?: number;
}

export const AutosizeInput = forwardRef<HTMLInputElement, AutosizeInputProps>(
  function AutosizeInput(
    { size = "md", value = "", onChange, minWidth = 0, placeholder, ...props },
    ref
  ) {
    const [draftValue, setDraftValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setDraftValue(e.target.value);
      onChange?.(e);
    };

    const updateWidth = useCallback(() => {
      const input = inputRef.current;
      const measure = measureRef.current;

      if (!input || !measure) return;

      // Get computed styles from the actual input element
      const computedStyle = window.getComputedStyle(input);

      // Copy all relevant font and text styles to the measurement element
      measure.style.font = computedStyle.font;
      measure.style.fontSize = computedStyle.fontSize;
      measure.style.fontFamily = computedStyle.fontFamily;
      measure.style.fontWeight = computedStyle.fontWeight;
      measure.style.fontStyle = computedStyle.fontStyle;
      measure.style.fontVariant = computedStyle.fontVariant;
      measure.style.letterSpacing = computedStyle.letterSpacing;
      measure.style.textTransform = computedStyle.textTransform;
      measure.style.textIndent = computedStyle.textIndent;
      measure.style.wordSpacing = computedStyle.wordSpacing;

      const textToMeasure = draftValue?.toString() || placeholder || " ";
      measure.textContent = textToMeasure;
      const contentWidth = measure.getBoundingClientRect().width;

      let finalWidth = Math.ceil(contentWidth) + autosizeInputExtraWidht[size];

      if (finalWidth < minWidth) {
        finalWidth = minWidth;
      }

      input.style.width = `${finalWidth}px`;
    }, [draftValue, placeholder, size, minWidth]);

    /**
     * @useEffect
     * Update when the draft value changes
     */
    useEffect(() => {
      updateWidth();
    }, [updateWidth]);

    /**
     * @useEffect
     * Update on mount and when fonts are loaded
     */
    useEffect(() => {
      updateWidth();

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateWidth);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @useEffect
     * Update the draft value when the prop changes
     */
    useEffect(() => {
      setDraftValue(value);
    }, [value]);

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <TextInput
          {...props}
          ref={mergeRefs(ref, inputRef)}
          size={size}
          value={draftValue}
          onChange={handleChange}
          placeholder={placeholder}
        />
        <span
          ref={measureRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            visibility: "hidden",
            whiteSpace: "pre",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
);
