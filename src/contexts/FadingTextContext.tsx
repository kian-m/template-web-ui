import React, { ReactNode, useState } from 'react';

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

  return (
    <FadingTextContext.Provider value={{ text, setText }}>
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          alignSelf: 'center',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          marginTop: '10%',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          animation: 'fadeIn 4s ease-in-out, fadeOut 10s 4s forwards',
          transition: 'opacity 1s',
        }}
      >
        {text}
      </div>
      {children}
    </FadingTextContext.Provider>
  );
};
