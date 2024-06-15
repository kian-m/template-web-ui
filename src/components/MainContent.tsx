import React from 'react';

const MainContent = ({
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
export default MainContent;
