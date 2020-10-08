const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random'),
mealsEl = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
single_mealEl = document.getElementById('single-meal');

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item =>{
    if(item.classList){
      return item.classList.contains('meal-info');
    }else{
      return false
    }
  })

  if(mealInfo){
    const mealID = mealInfo.getAttribute('data-mealid')
    getMealById(mealID)
  }
})

// get meal by ID
function getMealById(mealID){
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res=>res.json())
  .then(data=>{
    const meal = data.meals[0]

    addMealToDOM(meal)
  })
}

// fetch randomnyi dish

function getRandomMeal() {
// minus eda kotoraya uje est' i heading
mealsEl.innerHTML = '';
resultHeading.innerHTML = '';

fetch(`https://www.themealdb.com/api/json/v1/1/random.php`) 
.then(res => res.json())
.then(data=>{
 const meal = data.meals[0];
 addMealToDOM(meal)
})

}


// добавить еду в дом
function addMealToDOM(meal){
  const ingredients = [];
  for(let i=1;i<=20;i++){
    if(meal[`strIngredient${i}`]){
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    }else{
      break
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
    ${meal.strCathegory ? `<p>${meal.strCathegory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    </div>
  </div>`
}

// search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();
  single_mealEl.innerHTML = '';
  const term = search.value
   // check for empty

      if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
          if(data.meals === null){
            resultHeading = `<p>There are no search results.</p>` 
          } else {
            mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            </div>

            `)
            .join('');
          }
        })
        // Clear search text
        search.value = '';

      } else {
        alert('Please enter a search term')
      }
}
