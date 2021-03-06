import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import Radios from './Radios/Radios';

function Header({ title }) {
  const [search, setSearch] = useState(true);
  const [change, setChange] = useState('');

  if (title === 'Comidas' || title === 'Bebidas' || title === 'Explorar Origem') {
    if (search === true) {
      return (
        <header>
          <Link to="/perfil">
            <img src={ profileIcon } alt="provile" data-testid="profile-top-btn" />
          </Link>
          <p data-testid="page-title">{title}</p>
          <button
            style={ { backgroundColor: 'Transparent', border: 'none' } }
            type="button"
            onClick={ () => setSearch(!search) }
          >
            <img data-testid="search-top-btn" src={ searchIcon } alt="searchIcon" />
          </button>
        </header>
      );
    }
    return (
      <header>
        <Link to="/perfil">
          <img src={ profileIcon } alt="provile" data-testid="profile-top-btn" />
        </Link>
        <p data-testid="page-title">{title}</p>
        <button
          style={ { backgroundColor: 'Transparent', border: 'none' } }
          type="button"
          onClick={ () => setSearch(!search) }
        >
          <img data-testid="search-top-btn" src={ searchIcon } alt="searchIcon" />
        </button>
        <input
          data-testid="search-input"
          type="text"
          name="search"
          id="search"
          value={ change }
          onChange={ (e) => setChange(e.target.value) }
        />
        <Radios value={ change } />
      </header>
    );
  }
  return (
    <header>
      <Link to="/perfil">
        <img src={ profileIcon } alt="provile" data-testid="profile-top-btn" />
      </Link>
      <p data-testid="page-title">{title}</p>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
