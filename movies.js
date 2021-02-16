// https://api.themoviedb.org/3/movie/now_playing?api_key=426eb0f90521d4c76fbc67a9acd43da6&language=en-US

window.addEventListener('DOMContentLoaded', async function (event) {

  let db = firebase.firestore()
  let querySnapshot = await db.collection('watched').get()
  let movieList = querySnapshot.docs

  let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=426eb0f90521d4c76fbc67a9acd43da6&language=en-US`)
  let json = await response.json()
  let movies = json.results

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    console.log(movie);
    let movieID = movie.id
    let movieTitle = movie.original_title
    let moviePosterFileName = movie.poster_path
    let moviePoster = `https://image.tmdb.org/t/p/w500/${moviePosterFileName}`
    let docRef = await db.collection('watched').doc(`${movieID}`).get()
    let item = docRef.data()
    console.log(item);

    printMovie(movieID, moviePoster, item)
    movieListener(movieID, movieTitle)

  }

  async function printMovie(movieID, moviePoster, item) {

    if (item) {
      document.querySelector(".movies").insertAdjacentHTML("beforeend",
        `
          <div class="w-1/5 p-4 movie-${movieID} opacity-20">
            <img src="${moviePoster}" class="w-full">
            <a href="#" class="watched-button-${movieID} block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
          </div>
        `
      )
    } else {
      document.querySelector(".movies").insertAdjacentHTML("beforeend",
        `
          <div class="w-1/5 p-4 movie-${movieID}">
            <img src="${moviePoster}" class="w-full">
            <a href="#" class="watched-button-${movieID} block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
          </div>
        `
      )
    }
  }

  function movieListener(movieID, movieName) {
    document.querySelector(`.watched-button-${movieID}`).addEventListener("click", async function (event) {
      event.preventDefault()
      document.querySelector(`.movie-${movieID}`).classList.add('opacity-20')
      await db.collection('watched').doc(`${movieID}`).set({
        movie: `${movieName}`
      })
    })
  }
})