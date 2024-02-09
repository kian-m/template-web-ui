import React from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import Func = jest.Func;

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
  setVisible: Function;
}) => {
  const toggleVisibility = () => {
    setVisible();
  };

  return (
    <div>
      <div
        style={{ width: '100%', height: '1px', backgroundColor: 'white' }}
      ></div>
      <div className={'flex justify-between'}>
        {visible && (
          <CloseIcon boxSize={30} padding={8} onClick={toggleVisibility} />
        )}
        {visible && (
          <CloseIcon boxSize={30} padding={8} onClick={toggleVisibility} />
        )}
      </div>

      {visible &&
        components.map(({ component, visible, name }) =>
          visible ? (
            <div
              className="flex justify-center items-center h-30"
              key={name}
              tabIndex={visible ? 0 : undefined} // Add tabindex to make it focusable
            >
              <button style={{ backgroundColor: 'black' }} />
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
