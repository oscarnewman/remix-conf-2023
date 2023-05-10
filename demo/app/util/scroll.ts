import { useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useBoundedScroll(
  bound: number,
  container?: React.RefObject<any>
) {
  let { scrollY } = useScroll({
    container,
  });
  let scrollYBounded = useMotionValue(0);
  let scrollYBoundedProgress = useTransform(scrollYBounded, [0, bound], [0, 1]);

  useEffect(() => {
    return scrollY.onChange((current) => {
      console.log({ current });
      let previous = scrollY.getPrevious();
      let diff = current - previous;
      let newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, -300, bound));
    });
  }, [bound, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}
