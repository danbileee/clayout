import { styled } from "styled-components";
import {
  type ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

interface Props extends ComponentProps<"div"> {
  onObserve: (isIntersecting: boolean) => void;
  options?: IntersectionObserverInit;
}

export const Observer = forwardRef<HTMLDivElement, Props>(
  function ElementObserver(
    { onObserve, options, hidden = false, ...props },
    ref
  ) {
    const observerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => observerRef.current as HTMLDivElement, []);

    const handleIntersection: IntersectionObserverCallback = useCallback(
      ([entry]) => {
        onObserve(entry.isIntersecting);
      },
      [onObserve]
    );

    useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: "0px",
        threshold: 1,
        ...options,
      });

      if (observerRef.current) {
        observer.observe(observerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [handleIntersection, options]);

    return hidden ? (
      <ObserverBase {...props} />
    ) : (
      <ObserverBase ref={observerRef} {...props} />
    );
  }
);

const ObserverBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1px;
  height: 1px;
  margin-top: auto;
`;
