// Animated cart button with flash effect on item addition

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CartDrawer } from './CartDrawer';

export interface AnimatedCartButtonHandle {
  flash: () => void;
  scrollIntoView: () => void;
}

export const AnimatedCartButton = forwardRef<AnimatedCartButtonHandle>((props, ref) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    flash: async () => {
      await controls.start({
        scale: [1, 1.2, 1.05, 1],
        transition: {
          duration: 0.6,
          times: [0, 0.3, 0.7, 1],
          ease: 'easeInOut',
        },
      });
    },
    scrollIntoView: () => {
      buttonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    },
  }));

  return (
    <motion.div
      ref={buttonRef}
      animate={controls}
      className="fixed top-20 right-8 z-50 bg-transparent"
    >
      <CartDrawer />
    </motion.div>
  );
});

AnimatedCartButton.displayName = 'AnimatedCartButton';
