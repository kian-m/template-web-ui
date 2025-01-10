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
  const [timeoutValue, setTimeoutValue] = useState(4); // State for timeout

  const updateText = (newText: string) => {
    setShow(false);
    setTimeout(() => {
      setText(newText);
      setShow(true);
    }, 500); // Add a slight delay to ensure the previous text is hidden before updating
  };

  return (
    <FadingTextContext.Provider
      value={{ text, setText: updateText, setShow, setTimeoutValue }}
    >
      {showText && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            margin: '10 auto',
            transform: 'translateX(-50%)',
            alignSelf: 'center',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            marginTop: '5%',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            animation: `fadeIn 3s ease-in-out, fadeOut 1s ${timeoutValue}s forwards`,
            transition: 'opacity 1s',
          }}
        >
          {text}
        </div>
      )}
      {children}
    </FadingTextContext.Provider>
  );
};
