import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#10B981', '#06B6D4', '#3B82F6', '#F59E0B', '#EC4899'],
    });
  } catch {
    // Fallback if canvas is not ready
  }
};

export const triggerSuperCelebration = () => {
  try {
    const end = Date.now() + 1000;
    const colors = ['#10B981', '#38BDF8', '#F59E0B', '#A855F7'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Fallback
  }
};
