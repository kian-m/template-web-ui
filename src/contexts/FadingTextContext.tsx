import React, { ReactNode, useCallback, useRef, useState } from 'react';

interface FadingTextContextProps {
  text: string;
  setText: (text: string) => void;
}

export const FadingTextContext = React.createContext<FadingTextContextProps>({
  text: '',
  setText: () => {},
});

interface FadingTextProviderProps {
  children: ReactNode;
}

export const FadingTextProvider: React.FC<FadingTextProviderProps> = ({
  children,
}) => {
  const [text, setText] = useState('');
  // Bumped on every change so the fade-in animation replays for new text.
  const animKey = useRef(0);

  // Stable identity so effects depending on setText don't re-run every render.
  const updateText = useCallback((newText: string) => {
    animKey.current += 1;
    setText(newText);
  }, []);

  return (
    <FadingTextContext.Provider value={{ text, setText: updateText }}>
      {text && (
        <div
          key={animKey.current}
          style={{
            position: 'absolute',
            top: '2%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '5%',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            fontSize: '0.8rem',
            opacity: 0.5,
            fontFamily: 'Optima, sans-serif',
            // Fade in quickly, then stay at the faded opacity (no fade-out).
            animation: 'fadeInHalf 0.6s ease-out',
          }}
        >
          {text}
        </div>
      )}
      {children}
    </FadingTextContext.Provider>
  );
};
