import { Dispatch, useState } from 'react';
import SocialMediaIconLinks from './SocialMediaIconLinks';
enum ActionTypes {
  SHOW_CONTACT = 'SHOW_CONTACT',
  SHOW_SHOWS = 'SHOW_SHOWS',
  SHOW_GALLERY = 'SHOW_GALLERY',
  SHOW_ABOUT_ME = 'SHOW_ABOUT_ME',
}

export interface State {
  showContact: boolean;
  showShows: boolean;
  showGallery: boolean;
  showAboutMe: boolean;
}

const initialState: State = {
  showContact: false,
  showShows: false,
  showGallery: false,
  showAboutMe: false,
};

export type Action = {
  type: ActionTypes;
};
const menuItems = [
  { label: 'Contact', type: ActionTypes.SHOW_CONTACT },
  { label: 'Shows', type: ActionTypes.SHOW_SHOWS },
  { label: 'Gallery', type: ActionTypes.SHOW_GALLERY },
  { label: 'About Me', type: ActionTypes.SHOW_ABOUT_ME },
];

export default function PageTopNavBar({
  dispatch,
}: {
  dispatch: Dispatch<Action>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="grid grid-cols-3 items-center p-3 times-italic">
      <div className="relative justify-self-start">
        <button onClick={() => setOpen(!open)} className="px-3 py-2 opacity-75">
          Menu ▾
        </button>
        {open && (
          <div className="absolute left-0 z-10 flex flex-col bg-black border border-neutral-700">
            {menuItems.map(({ label, type }) => (
              <button
                key={label}
                onClick={() => {
                  dispatch({ type });
                  setOpen(false);
                }}
                className="px-4 py-2 text-left whitespace-nowrap opacity-75 hover:bg-neutral-800"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <h1 className="justify-self-center text-center text-xl lg:text-3xl whitespace-nowrap">
        Kacie Jewel Hill
      </h1>

      <div className="justify-self-end">
        <SocialMediaIconLinks />
      </div>
    </header>
  );
}
