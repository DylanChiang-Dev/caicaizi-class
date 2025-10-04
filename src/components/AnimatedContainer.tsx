// 動畫容器組件
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { fadeInVariants, slideInVariants, scaleVariants } from '@/utils/animations';

interface AnimatedContainerProps {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideIn' | 'scale';
  className?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = memo(({
  children,
  variant = 'fadeIn',
  className = '',
  delay = 0,
  duration = 0.3
}) => {
  const variants = {
    fadeIn: fadeInVariants,
    slideIn: slideInVariants,
    scale: scaleVariants
  };

  const selectedVariant = variants[variant];

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        type: 'tween',
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
});

AnimatedContainer.displayName = 'AnimatedContainer';

// 頁面過渡容器
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: 'anticipate'
      }}
    >
      {children}
    </motion.div>
  );
};

// 列表動畫容器
interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// 彈性動畫容器
interface BounceContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const BounceContainer: React.FC<BounceContainerProps> = ({
  children,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 15,
          delay
        }
      }}
    >
      {children}
    </motion.div>
  );
};