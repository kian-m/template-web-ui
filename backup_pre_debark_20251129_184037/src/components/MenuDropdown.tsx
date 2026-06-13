'use client';

import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCheck,
  faDownload,
  faRightToBracket,
  faUpload,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { decryptLocalStorage, encryptLocalStorage } from '../utils/session';
import { FadingTextContext } from '../contexts/FadingTextContext';

const Menu = () => {
  const { setText } = useContext(FadingTextContext);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [failedImport, setFailedImport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (decryptLocalStorage(inputValue)) {
      setInputValue('');
      setSubmitted(true);
      setShowImport(false);
      setTimeout(() => setSubmitted(false), 2000); // hide checkmark after 2 seconds
    } else {
      setFailedImport(true);
      setTimeout(() => setFailedImport(false), 2000); // hide cross after 2 seconds
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowImport(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <form className="input-container" onSubmit={handleSubmit}>
        {!submitted && showImport && (
          <>
            <div className="close-button" onClick={() => setShowImport(false)}>
              <FontAwesomeIcon icon={faX} />
            </div>
            <input
              className="rounded-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button className="submit-button" type="submit">
              <FontAwesomeIcon icon={faRightToBracket} />
            </button>
          </>
        )}
        {submitted && !failedImport && (
          <FontAwesomeIcon icon={faCheck} className="checkmark" />
        )}
        {!submitted && failedImport && (
          <FontAwesomeIcon icon={faX} className="cross" />
        )}
      </form>
      <div
        className="menu"
        onClick={() => {
          setIsOpen(!isOpen);
          setText('');
        }}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
        {isOpen && (
          <div className="dropdown">
            <button
              className="dropdown-item1"
              onClick={() => {
                setShowImport(true);
                setSubmitted(false);
              }}
            >
              <FontAwesomeIcon icon={faUpload} />
            </button>
            <button
              className="dropdown-item2"
              onClick={() => encryptLocalStorage()}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Menu;
