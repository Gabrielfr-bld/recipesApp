import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { SearchDrink } from '../../services/SearchDrink';

const TOTAL_CARDS = 6;

function DrinksRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [recomendationFoods, setRecomendationFoods] = useState([]);
  const [finished, setFinished] = useState(true);

  const history = useHistory();
  // const { location } = useHistory();
  // const { pathname } = location;

  const apiRecomendationFoods = async () => {
    const responseRecomendationFoods = await SearchDrink('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const arrayFoods = responseRecomendationFoods.meals;
    setRecomendationFoods(arrayFoods);
  };

  useEffect(() => {
    const fetchApi = async () => {
      const response = await SearchDrink('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=178319');
      setRecipes(response.drinks);
    };
    fetchApi();
    apiRecomendationFoods();
  }, []);

  if (recipes[0] === undefined) return <p>Carregando...</p>;

  const ingrendients = Object.entries(recipes[0]).filter((recipe) => recipe[0]
    .includes('strIngredient') && recipe[1] !== null && recipe[1] !== '');
  const measures = Object.entries(recipes[0]).filter((recipe) => recipe[0]
    .includes('strMeasure') && recipe[1] !== null && recipe[1] !== '');

  return (
    recipes.map((drink) => (
      <main key={ drink.idDrink }>
        <img
          style={ { height: '20em' } }
          src={ drink.strDrinkThumb }
          alt={ drink.strDrink }
          data-testid="recipe-photo"
        />
        <p data-testid="recipe-title">{ drink.strDrink }</p>
        <button data-testid="share-btn" type="button">Compartilhar</button>
        <button data-testid="favorite-btn" type="button">Favoritar</button>
        <p data-testid="recipe-category">{ drink.strAlcoholic }</p>
        <ul>
          { ingrendients.map((ingre, index) => (
            <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
              {`${ingre[1]} - ${measures[index][1]}`}
            </li>))}
        </ul>
        <p data-testid="instructions">{drink.strInstructions}</p>
        <div className="scroll flex">
          {recomendationFoods.slice(0, TOTAL_CARDS).map((recom, index) => (
            <div
              key={ recom.idMeal }
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                style={ { height: '5em' } }
                src={ recom.strMealThumb }
                alt={ recom.strMeal }
              />
              <p data-testid={ `${index}-recomendation-title` }>
                { recom.strMeal }
              </p>
            </div>
          ))}
        </div>
        <button
          style={ { position: 'fixed', bottom: '0px' } }
          data-testid="start-recipe-btn"
          type="button"
          onClick={ () => {
            history.push('/bebidas/178319/in-progress');
            setFinished(!finished);
          } }
        >
          { finished === false ? 'Continuar Receita' : 'Iniciar Receita' }
        </button>
      </main>
    ))
  );
}

export default DrinksRecipes;
