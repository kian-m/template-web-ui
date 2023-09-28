import React from 'react';
import { CloseIcon } from '@chakra-ui/icons';

const PageBottom = ({
  components,
  visible,
  setVisible,
}: {
  components: {
    component: React.ReactNode;
    visible: boolean;
    name: string;
  }[];
  visible: boolean;
  setVisible: (b: boolean) => void;
}) => {
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      {visible && (
        <CloseIcon boxSize={12} padding={2} onClick={toggleVisibility} />
      )}
      <div
        style={{ width: '100%', height: '1px', backgroundColor: 'white' }}
      ></div>
      {visible &&
        components.map(({ component, visible, name }) =>
          visible ? (
            <div
              className="flex justify-center items-center h-30"
              key={name}
              tabIndex={visible ? 0 : undefined} // Add tabindex to make it focusable
            >
              <button autoFocus style={{ backgroundColor: 'black' }} />
              {component}
            </div>
          ) : (
            <div key={name} />
          ),
        )}
    </div>
  );
};
export default PageBottom;
