import React, { useState, useEffect, useContext } from 'react';
import '../RecipeProgress.css';
import { useHistory } from 'react-router-dom';
import { SearchFood } from '../services/SearchFood';
import { handleChecked, checkedDefault, checkedLocal } from '../global/checked';
import RevenuesContex from '../context/RevenuesContex';
import Btns from './buttons/Btns';
import { favorite, inProgressFood,
  recipesDone, recipesMade } from '../global/localStorage';

function RecipeProgressFoods() {
  const [saveMade, setSaveMade] = useState([]);
  const [ability, setAbility] = useState(0);
  const [made, setMade] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [foodId, setFoodId] = useState('');

  const { recipes, setRecipes,
    setStorageFavorites, setIconHeart } = useContext(RevenuesContex);

  const history = useHistory();
  const path = history.location.pathname.split('/');
  const id = path[2];

  useEffect(() => {
    const fetchApi = async () => {
      const response = await SearchFood(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      setRecipes(response.meals);
      setFoodId(response.meals[0].idMeal);
    };

    fetchApi();
    favorite(setStorageFavorites, foodId, setIconHeart);
    inProgressFood(id, setSaveMade, setMade, setCocktails);
    recipesDone();
  }, [foodId, id, setIconHeart, setRecipes, setStorageFavorites]);

  if (recipes[0] === undefined) return <p>Carregando...</p>;

  const ingrendients = Object.entries(recipes[0]).filter((recipe) => recipe[0]
    .includes('strIngredient') && recipe[1] !== null && recipe[1] !== '');

  const handleClick = ({ target }) => {
    let array = made;
    if (target.checked) setAbility(ability + 1);
    else setAbility(ability - 1);

    const { value } = target;

    if (made.includes(value)) {
      const filter = array.filter((fil) => fil !== value);
      array = filter;
      setMade(filter);
    } else {
      array = [...made, value];
      setMade([...made, value]);
    }

    localStorage.setItem('inProgressRecipes', JSON.stringify({
      cocktails: {
        ...cocktails,
      },
      meals: {
        ...saveMade,
        [id]: array,
      },
    }));
  };

  const handleClickFinished = () => {
    let tags = [];
    if (recipes[0].strTags === null) {
      tags = [];
    } else {
      tags = recipes[0].strTags.includes(',') ? recipes[0].strTags.split(',')
        : [recipes[0].strTags];
    }

    const data = new Date();
    const finishedMeal = {
      id: recipes[0].idMeal,
      type: recipes[0].strGlass,
      area: recipes[0].strArea,
      category: recipes[0].strCategory,
      alcoholicOrNot: '',
      name: recipes[0].strMeal,
      image: recipes[0].strMealThumb,
      doneDate: `${data.getDate()}/${data.getMonth()}/${data.getFullYear()}`,
      tags,
    };
    recipesMade(finishedMeal);

    return history.push('/receitas-feitas');
  };

  return (
    <main>
      <img
        style={ { height: '20em' } }
        data-testid="recipe-photo"
        src={ recipes[0].strMealThumb }
        alt={ recipes[0].strMeal }
      />
      <h1 data-testid="recipe-title">{recipes[0].strMeal}</h1>
      <Btns pathname={ id } name="comidas" />
      <span data-testid="recipe-category">{recipes[0].strCategory}</span>
      <form>
        {
          ingrendients.map((ingredient, i) => (
            <label
              data-testid={ `${i}-ingredient-step` }
              className={ checkedLocal(ingredient, saveMade, id) }
              key={ i }
              htmlFor={ ingredient[1] }
            >
              {ingredient[1]}
              <input
                type="checkbox"
                name="ingredient"
                id={ ingredient[1] }
                value={ ingredient[1] }
                onChange={ (e) => handleChecked(e, setAbility, ability) }
                onClick={ handleClick }
                defaultChecked={ checkedDefault(ingredient, saveMade, id) }
              />
            </label>
          ))
        }
        <div>
          <span data-testid="instructions">{recipes[0].strInstructions}</span>
        </div>
        <button
          data-testid="finish-recipe-btn"
          type="button"
          disabled={ ability !== ingrendients.length }
          onClick={ handleClickFinished }
        >
          Finalizar receita
        </button>
      </form>
    </main>
  );
}

export default RecipeProgressFoods;
