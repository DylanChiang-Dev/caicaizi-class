// Framer Motion 動畫配置和變體
import { Variants } from 'framer-motion';

// 基礎動畫配置
export const animationConfig = {
  // 頁面過渡動畫
  pageTransition: {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  },

  // 彈性動畫
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },

  // 平滑動畫
  smooth: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  },

  // 快速動畫
  fast: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15
  }
} as const;

// 淡入動畫變體
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: animationConfig.smooth
  },
  exit: {
    opacity: 0,
    transition: animationConfig.fast
  }
};

// 滑入動畫變體
export const slideInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.spring
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: animationConfig.fast
  }
};

// 從右側滑入動畫變體
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: animationConfig.spring
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: animationConfig.fast
  }
};

// 從左側滑入動畫變體
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: animationConfig.spring
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: animationConfig.fast
  }
};

// 縮放動畫變體
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: animationConfig.spring
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: animationConfig.fast
  }
};

// 彈跳動畫變體
export const bounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
      mass: 1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    transition: animationConfig.fast
  }
};

// 容器動畫變體（用於列表子元素的順序動畫）
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// 列表項目動畫變體
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: animationConfig.spring
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: animationConfig.fast
  }
};

// 模態框動畫變體
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: animationConfig.fast
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: animationConfig.fast
  }
};

// 卡片懸停效果
export const cardHover = {
  whileHover: {
    scale: 1.02,
    transition: animationConfig.smooth
  },
  whileTap: {
    scale: 0.98,
    transition: animationConfig.fast
  }
};

// 按鈕點擊效果
export const buttonTap = {
  whileTap: {
    scale: 0.95,
    transition: animationConfig.fast
  }
};

// 滾動動畫觸發配置
export const scrollAnimationConfig = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.3 },
  transition: animationConfig.spring
} as const;

// 常用的動畫組合
export const animations = {
  // 頁面標題動畫
  pageTitle: {
    ...slideInVariants,
    initial: 'hidden',
    animate: 'visible'
  },

  // 統計卡片動畫
  statCard: {
    ...scaleVariants,
    initial: 'hidden',
    animate: 'visible',
    whileHover: cardHover.whileHover
  },

  // 課程卡片動畫
  courseCard: {
    ...fadeInVariants,
    initial: 'hidden',
    animate: 'visible',
    whileHover: {
      ...cardHover.whileHover,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    }
  },

  // 進度條動畫
  progressBar: {
    initial: { width: 0 },
    animate: { width: 'var(--progress)' },
    transition: {
      duration: 1,
      ease: 'easeOut'
    }
  }
} as const;