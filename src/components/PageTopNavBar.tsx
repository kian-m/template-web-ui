import Link from 'next/link';
import { Dispatch, useReducer } from 'react';
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
export default function PageTopNavBar({
  dispatch,
}: {
  dispatch: Dispatch<Action>;
}) {
  return (
    <main className="-ml-4 flex flex-col items-center justify-between p-3">
      <div className="grid grid-cols-4 gap-4 lg:space-x-12">
        <button
          onClick={() => dispatch({ type: ActionTypes.SHOW_CONTACT })}
          className="lg:scale-150 group border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <p className={`m-0 text-sm opacity-75 font-extralight times-italic`}>
            Contact
          </p>
        </button>

        <button
          onClick={() => dispatch({ type: ActionTypes.SHOW_SHOWS })}
          className="lg:scale-150 group border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <p className={`m-0 text-sm opacity-75 font-extralight times-italic`}>
            Shows
          </p>
        </button>

        <button
          onClick={() => dispatch({ type: ActionTypes.SHOW_GALLERY })}
          className="lg:scale-150 group border border-transparent px-4 py-3 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <p className={`m-0 text-sm opacity-75 font-extralight times-italic`}>
            Gallery
          </p>
        </button>

        <button
          onClick={() => dispatch({ type: ActionTypes.SHOW_ABOUT_ME })}
          className="lg:scale-150 group border border-transparent px-4 py-3 transition-colors hover:border-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <p
            className={`m-0 text-sm opacity-75 font-extralight whitespace-nowrap times-italic`}
          >
            About Me
          </p>
        </button>
      </div>
    </main>
  );
}
