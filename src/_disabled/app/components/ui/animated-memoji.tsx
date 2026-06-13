'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedMemojiProps {
  isThinking?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'working' | 'confused' | 'celebrating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export default function AnimatedMemoji({
  isThinking = false,
  mood = 'happy',
  size = 'md',
  message,
}: AnimatedMemojiProps) {
  const [currentExpression, setCurrentExpression] = useState('😊');
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [blinkState, setBlinkState] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-5xl',
  };

  const expressions = {
    happy: ['😊', '😄', '🙂', '😌'],
    thinking: ['🤔', '💭', '🧠', '💡'],
    excited: ['🤩', '✨', '🎉', '🚀'],
    working: ['💻', '⚡', '🛠️', '🔧'],
    confused: ['😅', '🤨', '🫤', '😐'],
    celebrating: ['🎉', '🥳', '🎊', '🏆'],
  };

  const funnyMessages = {
    happy: ['Just vibing here! 🌟', 'Ready to create magic! ✨', 'Good vibes only! 🌈'],
    thinking: [
      'Hmm, let me think about this...',
      'Processing... beep boop! 🤖',
      'Brain neurons firing! 🧠⚡',
    ],
    excited: [
      'This is going to be AMAZING! 🚀',
      'I LOVE making widgets! 💖',
      'Time to create something cool! 🎨',
    ],
    working: [
      'Coding like a wizard! 🧙‍♂️',
      'Making data beautiful! 📊✨',
      'Widget assembly in progress! 🏗️',
    ],
    confused: [
      'Wait, what was that again? 🤷',
      'Error 404: Clarity not found 😅',
      'Let me recompute that... 🔄',
    ],
    celebrating: ['NAILED IT! 🎯', 'Another masterpiece! 🎨', 'We did it! High five! 🙌'],
  };

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      },
      3000 + Math.random() * 2000,
    );

    return () => clearInterval(blinkInterval);
  }, []);

  // Expression cycling based on mood
  useEffect(() => {
    const expressionInterval = setInterval(
      () => {
        const moodExpressions = expressions[mood];
        const randomExpression =
          moodExpressions[Math.floor(Math.random() * moodExpressions.length)];
        setCurrentExpression(randomExpression);
      },
      isThinking ? 800 : 2000,
    );

    return () => clearInterval(expressionInterval);
  }, [mood, isThinking]);

  // Eye tracking mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setEyePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getCurrentMessage = () => {
    if (message) return message;
    const moodMessages = funnyMessages[mood];
    return moodMessages[Math.floor(Math.random() * moodMessages.length)];
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.div
        className={`${sizeClasses[size]} relative flex items-center justify-center rounded-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg dark:border-blue-700 dark:from-blue-900/20 dark:to-purple-900/20`}
        animate={{
          scale: isThinking ? [1, 1.05, 1] : 1,
          rotate: isThinking ? [0, -2, 2, 0] : 0,
          y: isThinking ? [0, -2, 0] : 0,
        }}
        transition={{
          duration: isThinking ? 1.5 : 0.3,
          repeat: isThinking ? Infinity : 0,
          repeatType: 'reverse',
        }}
      >
        {/* Main face/expression */}
        <motion.div
          className="relative z-10"
          animate={{
            scale: blinkState ? [1, 0.8, 1] : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          {currentExpression}
        </motion.div>

        {/* Animated eyes overlay for more detailed expressions */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-black"
            style={{
              left: `${45 + eyePosition.x}%`,
              top: `${40 + eyePosition.y}%`,
            }}
            animate={{
              scaleY: blinkState ? 0.1 : 1,
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-black"
            style={{
              right: `${45 - eyePosition.x}%`,
              top: `${40 + eyePosition.y}%`,
            }}
            animate={{
              scaleY: blinkState ? 0.1 : 1,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Thinking bubbles */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              className="absolute -top-8 -right-2 flex space-x-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-blue-400"
                  animate={{
                    y: [0, -4, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Energy particles for excitement */}
        <AnimatePresence>
          {mood === 'excited' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-yellow-400"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Speech bubble with funny messages */}
      <AnimatePresence>
        <motion.div
          className="relative max-w-xs"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="relative rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {getCurrentMessage()}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-t border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Typing dots when working */}
      <AnimatePresence>
        {mood === 'working' && (
          <motion.div
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-blue-500"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
