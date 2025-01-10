import React, { ReactNode, useEffect, useState } from 'react';

interface FadingTextContextProps {
  text: string;
  setText: (text: string) => void;
  setShow: (show: boolean) => void;
  setTimeoutValue: (timeout: number) => void;
}

export const FadingTextContext = React.createContext<FadingTextContextProps>({
  text: '',
  setText: () => {},
  setShow: () => {},
  setTimeoutValue: () => {},
});

interface FadingTextProviderProps {
  children: ReactNode;
}

export const FadingTextProvider: React.FC<FadingTextProviderProps> = ({
  children,
}) => {
  const [text, setText] = useState('');
  const [showText, setShow] = useState(true);
  const [timeoutValue, setTimeoutValue] = useState(8);

  const updateText = (newText: string) => {
    setShow(false);
    setTimeout(() => {
      setText(newText);
      setShow(true);
    }, 1000);
  };

  return (
    <FadingTextContext.Provider
      value={{ text, setText: updateText, setShow, setTimeoutValue }}
    >
      {showText && (
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '50%',
            margin: '20 auto',
            transform: 'translateX(-50%)',
            alignSelf: 'center',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            marginTop: '5%',
            fontSize: '0.8rem',
            opacity: '0.5',
            fontFamily: 'Optima, sans-serif',
            animation: `fadeInHalf 3s ease-in-out, fadeOutHalf 2s ${timeoutValue}s forwards`,
            transition: 'opacity 50% 8s',
          }}
        >
          {text}
        </div>
      )}
      {children}
    </FadingTextContext.Provider>
  );
};
