// Definimos una función asíncrona que se encargará de buscar una receta. 
// Es asíncrona porque usará `await` para esperar respuestas de la API.
const searchMeal = async (e) => {
  // Prevenimos la acción por defecto del evento de envío de formulario, 
  // que generalmente recarga la página. Esto permite manejar el envío del formulario con JavaScript.
  e.preventDefault();

  // Selección de elementos del DOM (Document Object Model) que se usarán para mostrar la información de la receta:
  const input = document.querySelector(".input"); // El campo de entrada de texto donde el usuario escribe la receta a buscar.
  const title = document.querySelector(".title"); // Elemento HTML donde se mostrará el nombre de la receta encontrada.
  const info = document.querySelector(".info"); // Elemento donde se mostrarán las instrucciones de la receta.
  const img = document.querySelector(".img"); // Elemento que se usará para mostrar la imagen de la receta como fondo.
  const ingredientsOutput = document.querySelector(".ingredients"); // Contenedor para la lista de ingredientes de la receta.

  // Función que recibe un objeto `meal` y muestra la información de la receta en la página.
  const showMealInfo = (meal) => {
    // Usamos desestructuración para extraer directamente las propiedades necesarias del objeto `meal`:
    // `strMeal` es el nombre de la receta.
    // `strMealThumb` es la URL de la imagen de la receta.
    // `strInstructions` contiene las instrucciones para preparar la receta.
    const { strMeal, strMealThumb, strInstructions } = meal;

    // Establecemos el texto del título con el nombre de la receta.
    title.textContent = strMeal;
    // Usamos la propiedad `backgroundImage` para mostrar la imagen de la receta como fondo del elemento `img`.
    img.style.backgroundImage = `url(${strMealThumb})`;
    // Asignamos las instrucciones de preparación al elemento `info`.
    info.textContent = strInstructions;

    // Creamos un array para almacenar los ingredientes y sus cantidades.
    const ingredients = [];

    // Bucle para recorrer hasta 20 posibles ingredientes. La API puede tener hasta 20 ingredientes por receta.
    // `meal` es un objeto que tiene propiedades `strIngredient1` a `strIngredient20` y sus respectivas medidas.
    for (let i = 1; i <= 20; i++) {
      // Verificamos si el ingrediente actual (`strIngredient{i}`) existe y no está vacío.
      // Si existe, lo añadimos al array `ingredients` junto con su medida.
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        // Si no hay más ingredientes (campo vacío), rompemos el bucle.
        break;
      }
    }

    // Creamos una cadena de texto HTML para mostrar la lista de ingredientes como elementos de lista `<li>`.
    const html = `
    <span>${ingredients
      .map((ing) => `<li class="ing">${ing}</li>`)
      .join("")}</span>
    `;

    // Insertamos el HTML generado dentro del contenedor `ingredientsOutput`.
    ingredientsOutput.innerHTML = html;
  };

  // Función que muestra una alerta si la receta no se encuentra.
  const showAlert = () => {
    alert("Receta no encontrada :(");
  };

  // Función asíncrona para obtener los datos de la receta desde la API de TheMealDB.
  // Recibe el valor de búsqueda ingresado por el usuario.
  const fetchMealData = async (val) => {
    // Realiza una solicitud HTTP GET a la API usando la URL con el valor de búsqueda.
    // `val` es la palabra clave que el usuario ingresó para buscar la receta.
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`
    );

    // Esperamos la respuesta de la API y la convertimos a formato JSON para poder trabajar con ella.
    const { meals } = await res.json();
    // La respuesta tiene una propiedad `meals` que contiene un array de recetas.
    // Retornamos ese array para que se use más adelante.
    return meals;
  };

  // Obtenemos el valor de búsqueda ingresado por el usuario en el campo de entrada de texto.
  // `trim()` elimina espacios en blanco al principio y al final para evitar errores.
  const val = input.value.trim();

  // Verificamos si el usuario ingresó un valor en el campo de búsqueda.
  if (val) {
    // Si hay un valor, llamamos a la función `fetchMealData` para buscar las recetas correspondientes en la API.
    const meals = await fetchMealData(val);

    // Si la API no encuentra recetas (es decir, `meals` es `null` o `undefined`), mostramos una alerta.
    if (!meals) {
      showAlert();
      return; // Salimos de la función ya que no hay más que hacer.
    }

    // Si se encontraron recetas, usamos `forEach` para iterar sobre cada receta encontrada.
    // Para cada una, llamamos a `showMealInfo` para mostrar la información de la receta en la página.
    meals.forEach(showMealInfo);
  } else {
    // Si el usuario no ingresó un valor de búsqueda (el campo estaba vacío), mostramos un mensaje pidiendo que ingrese una búsqueda.
    alert("Por favor, intenta buscar por receta :)"); 
  }
};

// Seleccionamos el formulario de la página y añadimos un evento para ejecutar la función `searchMeal` 
// cuando el formulario sea enviado (por ejemplo, cuando se hace clic en un botón "Buscar").
const form = document.querySelector("form");
form.addEventListener("submit", searchMeal);

// Seleccionamos un ícono de lupa que también se usará para iniciar la búsqueda al hacer clic.
// Añadimos un evento que ejecuta la función `searchMeal` cuando el usuario hace clic en este ícono.
const magnifier = document.querySelector(".magnifier");
magnifier.addEventListener("click", searchMeal);
