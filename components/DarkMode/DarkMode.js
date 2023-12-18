/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const DarkMode = () => {
  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark');
    localStorage.setItem('selectedTheme', 'dark');
  };

  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light');
    localStorage.setItem('selectedTheme', 'light');
  };

  const selectedTheme = localStorage.getItem('selectedTheme');

  if (selectedTheme === 'light') {
    setLightMode();
  }

  const toggleTheme = (e) => {
    if (e.target.checked) setLightMode();
    else setDarkMode();
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        defaultChecked={selectedTheme === 'light'}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <FontAwesomeIcon className="moon mode" icon={faMoon} />
        <FontAwesomeIcon className="sun mode" icon={faSun} />

      </label>
    </div>
  );
};

export default DarkMode;
