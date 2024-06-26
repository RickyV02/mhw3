const loginitem = document.querySelector(".login");
const cross_img = document.querySelectorAll(".cross");
const boxadreviews = document.querySelectorAll(".boxad a");
const overviews = document.querySelectorAll(".ac img");
const accountitem = document.querySelectorAll(".crea-account");
const modal_view = document.querySelector("#modal_account");
const modal_search = document.querySelector("#modal_search");
const newsitem = document.querySelectorAll("#show_more");
const form = document.querySelector("form");
const placeholder_img =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png";
const api_key = "17d4cbc601mshdf748d30e539c36p12f7abjsn768814760e84";
const client_id_twitch = "12h3bsf6as2gx17rhtrnjjx0bfkr03";
const client_secret_twitch = "cdpi68gukavd5evpooq9pn3bk31ugg";
const cross_src = "public/cross.png";

function login(event) {
  event.preventDefault();
  const window = document.getElementById("loginwindow");
  window.classList.remove("nascosto");
}

function close(event) {
  const element = event.currentTarget.parentNode;
  element.classList.add("nascosto");
}

function hidereviews(event) {
  const element = event.currentTarget;
  element.addEventListener("mouseenter", showreviews);
  const elementdiv = event.currentTarget.parentNode;
  const revs = elementdiv.querySelector("p");
  revs.remove();
}

function showreviews(event) {
  const element = event.currentTarget;
  const elementdiv = event.currentTarget.parentNode;
  const new_text = document.createElement("p");
  new_text.classList.add("inforev");
  new_text.textContent = element.dataset.info;
  elementdiv.appendChild(new_text);
  element.removeEventListener("mouseenter", showreviews);
  element.addEventListener("mouseleave", hidereviews);
}

function resetoverviews(event) {
  const image = event.currentTarget;
  const index = parseInt(image.dataset.index);
  if (index === 1) {
    image.src = "public/films1.png";
  } else if (index === 2) {
    image.src = "public/films2.png";
  } else {
    image.src = "public/films3.png";
  }
  image.toggle("mouseenter", resetoverviews);
  image.toggle("mouseleave", changeoverviews);
}

function changeoverviews(event) {
  const image = event.currentTarget;
  const index = parseInt(image.dataset.index);
  if (index === 1) {
    image.src = "public/ov1.png";
  } else if (index === 2) {
    image.src = "public/ov2.png";
  } else {
    image.src = "public/ov3.png";
  }
  image.toggle("mouseenter", resetoverviews);
  image.toggle("mouseleave", changeoverviews);
}

function crea_account(event) {
  event.preventDefault();
  document.body.classList.add("noscroll");
  modal_view.classList.remove("nascosto");
  const div = document.querySelector(".modal_div");
  div.classList.remove("nascosto");
  modal_view.scrollIntoView();
}

function close_modal() {
  document.body.classList.remove("noscroll");
  modal_view.classList.add("nascosto");
}

function close_search(event) {
  document.body.classList.remove("noscroll");
  modal_search.classList.remove("modal_display");
  modal_search.classList.add("nascosto");
}

function stopProp(event) {
  event.stopPropagation();
}

function showmore(event) {
  event.preventDefault();
  const item = event.currentTarget;
  item.textContent = item.dataset.info;
  item.classList.add("nocursor");
}

let game_name;
let game_token;
let retry = false;
let first_request = true;
let result = true;

function onTokenJson(json) {
  game_token = json.access_token;
}

function show_name(json) {
  modal_search.innerHTML = "";
  const cross = document.createElement("img");
  cross.src = cross_src;
  cross.classList.add("cross");
  modal_search.appendChild(cross);
  const movie_div = document.createElement("div");
  movie_div.classList.add("modal_game");
  const poster = document.createElement("img");
  poster.classList.add("cover");
  if (json.primaryImage !== null) {
    poster.src = json.primaryImage.url;
  } else {
    poster.src = placeholder_img;
  }
  movie_div.appendChild(poster);
  const movie_info = document.createElement("div");
  const actor_name = document.createElement("p");
  actor_name.textContent = json.nameText.text;
  movie_info.appendChild(actor_name);
  if (json.birthDate) {
    const birthDay = document.createElement("p");
    birthDay.textContent =
      "Birth Date: " +
      json.birthDate.dateComponents.day +
      "/" +
      json.birthDate.dateComponents.month +
      "/" +
      json.birthDate.dateComponents.year;
    movie_info.appendChild(birthDay);
  }
  if (json.birthLocation) {
    const birthLoc = document.createElement("p");
    birthLoc.textContent = "Birth Location: " + json.birthLocation.text;
    movie_info.appendChild(birthLoc);
  }
  if (json.deathDate) {
    const deathDay = document.createElement("p");
    deathDay.textContent =
      "Death Date: " +
      json.deathDate.dateComponents.day +
      "/" +
      json.deathDate.dateComponents.month +
      "/" +
      json.deathDate.dateComponents.year;
    movie_info.appendChild(deathDay);
  }
  if (json.deathLocation) {
    const deathLoc = document.createElement("p");
    deathLoc.textContent = "Death Location: " + json.deathLocation.text;
    movie_info.appendChild(deathLoc);
  }
  if (json.deathCause) {
    const death_Cause = document.createElement("p");
    death_Cause.textContent =
      "Death Cause: " + json.deathCause.displayableProperty.value.plainText;
    movie_info.appendChild(death_Cause);
  }
  if (json.wins.total !== 0) {
    const info = document.createElement("p");
    info.textContent = "Wins: " + json.wins.total;
    movie_info.appendChild(info);
  }
  if (json.nominations.total !== 0) {
    const info = document.createElement("p");
    info.textContent = "Nominations: " + json.nominations.total;
    movie_info.appendChild(info);
  }
  if (json.knownForFeature.edges.length !== 0) {
    const movie_credits = document.createElement("section");
    movie_credits.classList.add("credits");
    const cast = json.knownForFeature.edges;
    for (item of cast) {
      const movie_li = document.createElement("li");
      const obj = item.node.title;
      const actor_name = document.createElement("p");
      actor_name.textContent = obj.titleText.text;
      movie_li.appendChild(actor_name);
      const img = document.createElement("img");
      if (!obj.primaryImage) {
        img.src = placeholder_img;
      } else {
        img.src = obj.primaryImage.url;
      }
      movie_li.appendChild(img);
      movie_credits.appendChild(movie_li);
    }
    const movie_cast = document.createElement("p");
    movie_cast.textContent = "Known For: ";
    movie_cast.appendChild(movie_credits);
    movie_info.appendChild(movie_cast);
  }
  movie_div.appendChild(movie_info);
  movie_div.addEventListener("click", stopProp);
  modal_search.appendChild(movie_div);
}

function show_movie(json) {
  modal_search.innerHTML = "";
  const cross = document.createElement("img");
  cross.src = cross_src;
  cross.classList.add("cross");
  modal_search.appendChild(cross);
  const film = json;
  const movie_div = document.createElement("div");
  movie_div.classList.add("modal_game");
  const poster = document.createElement("img");
  poster.classList.add("cover");
  if (film.primaryImage !== null) {
    poster.src = json.primaryImage.url;
  } else {
    poster.src = placeholder_img;
  }
  movie_div.appendChild(poster);
  const movie_info = document.createElement("div");
  const movie_title = document.createElement("p");
  movie_title.textContent = film.titleText.text;
  movie_info.appendChild(movie_title);
  if (film.releaseDate !== null) {
    const releaseDate = document.createElement("p");
    releaseDate.textContent =
      "Release Date: " +
      film.releaseDate.day +
      "/" +
      film.releaseDate.month +
      "/" +
      film.releaseDate.year;
    movie_info.appendChild(releaseDate);
  }
  if (film.ratingsSummary.aggregateRating !== null) {
    const rating = document.createElement("p");
    rating.textContent =
      "Rating Summary: " + film.ratingsSummary.aggregateRating;
    movie_info.appendChild(rating);
  }
  if (film.canHaveEpisodes) {
    const ep = document.createElement("p");
    ep.textContent = "Episodes: " + film.episodes.episodes.total;
    movie_info.appendChild(ep);
  }
  if (film.genres !== null) {
    const genres = document.createElement("p");
    genres.textContent = "Genres: ";
    for (item of film.genres.genres) {
      genres.textContent += item.text + " ";
    }
    movie_info.appendChild(genres);
  }
  if (film.countriesOfOrigin !== null) {
    const country = document.createElement("p");
    country.textContent = "Countries of Origin: ";
    for (item of film.countriesOfOrigin.countries) {
      country.textContent += item.id + "";
    }
    movie_info.appendChild(country);
  }
  if (film.directors.length !== 0 && film.directors.credits) {
    const director = document.createElement("p");
    director.textContent = "Director: ";
    for (item of film.directors) {
      if (item.credits.length !== 0) {
        director.textContent += item.credits[0].name.nameText.text;
      }
    }
    movie_info.appendChild(director);
  }
  if (film.plot !== null) {
    const mainplot = document.createElement("p");
    mainplot.textContent = "Plot: " + film.plot.plotText.plainText;
    movie_info.appendChild(mainplot);
  }
  if (film.cast.edges.length !== 0) {
    const movie_credits = document.createElement("section");
    movie_credits.classList.add("credits");
    const cast = film.cast.edges;
    for (item of cast) {
      const movie_li = document.createElement("li");
      const obj = item.node;
      const actor_name = document.createElement("p");
      actor_name.textContent = obj.name.nameText.text;
      movie_li.appendChild(actor_name);
      const img = document.createElement("img");
      if (!obj.name.primaryImage) {
        img.src = placeholder_img;
      } else {
        img.src = obj.name.primaryImage.url;
      }
      const ch = obj.characters;
      if (ch !== null) {
        for (item of ch) {
          const character = document.createElement("p");
          character.textContent = item.name;
          movie_li.appendChild(character);
        }
      }
      movie_li.appendChild(img);
      movie_credits.appendChild(movie_li);
    }
    const movie_cast = document.createElement("p");
    movie_cast.textContent = "Cast: ";
    movie_cast.appendChild(movie_credits);
    movie_info.appendChild(movie_cast);
  }
  movie_div.appendChild(movie_info);
  movie_div.addEventListener("click", stopProp);
  modal_search.appendChild(movie_div);
}

function show_nm_info(event) {
  const id = event.currentTarget.querySelector("p");
  const research_id = id.textContent;
  const url =
    "https://imdb146.p.rapidapi.com/v1/name/?id=" +
    encodeURIComponent(research_id);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "imdb146.p.rapidapi.com",
    },
  };
  fetch(url, options).then(onResponse).then(show_name);
}

function show_movie_info(event) {
  const id = event.currentTarget.querySelector("p");
  const research_id = id.textContent;
  const url =
    "https://imdb146.p.rapidapi.com/v1/title/?id=" +
    encodeURIComponent(research_id);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": api_key,
      "X-RapidAPI-Host": "imdb146.p.rapidapi.com",
    },
  };
  fetch(url, options).then(onResponse).then(show_movie);
}

function show_game(json) {
  modal_search.innerHTML = "";
  const cross = document.createElement("img");
  cross.src = cross_src;
  cross.classList.add("cross");
  modal_search.appendChild(cross);
  for (item of json) {
    const game = item;
    const game_div = document.createElement("div");
    game_div.classList.add("modal_game");
    const game_cover = document.createElement("img");
    const img_id = game.cover.image_id;
    const cover_url =
      "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
      img_id +
      ".jpg";
    game_cover.src = cover_url;
    game_cover.classList.add("cover");
    const game_info = document.createElement("div");
    const game_title = document.createElement("p");
    game_title.textContent = game.name;
    const game_genre = document.createElement("p");
    game_genre.textContent = "Genres: ";
    for (item of game.genres) {
      game_genre.textContent += item.name + " ";
    }
    const game_platform = document.createElement("p");
    game_platform.textContent = "Platforms: ";
    for (item of game.platforms) {
      game_platform.textContent += item.name + " ";
    }
    const first_release = document.createElement("p");
    first_release.textContent =
      "First Release Date: " + game.release_dates[0].human;
    const themes = document.createElement("p");
    themes.textContent = "Themes: ";
    for (item of game.themes) {
      themes.textContent += item.name + " ";
    }
    const summary = document.createElement("p");
    summary.textContent = "Summary: " + game.summary;
    const storyline = document.createElement("p");
    storyline.textContent = "Storyline: " + game.storyline;
    game_info.appendChild(game_title);
    game_info.appendChild(game_genre);
    game_info.appendChild(game_platform);
    game_info.appendChild(themes);
    game_info.appendChild(first_release);
    if (summary.textContent !== "Summary: undefined") {
      game_info.appendChild(summary);
    }
    if (storyline.textContent !== "Storyline: undefined") {
      game_info.appendChild(storyline);
    }
    game_div.appendChild(game_cover);
    game_div.appendChild(game_info);
    game_div.addEventListener("click", stopProp);
    modal_search.appendChild(game_div);
  }
}

function onResponse(response) {
  if (!response.ok) {
    console.log("Error: " + response);
    return null;
  } else return response.json();
}

function onResponseCors(response) {
  if (!response.ok) {
    console.clear();
    retry = true;
  } else return response.json().then(show_game);
}

async function show_game_info(event) {
  if (first_request) {
    const url_token =
      "https://id.twitch.tv/oauth2/token?client_id=" +
      client_id_twitch +
      "&client_secret=" +
      client_secret_twitch +
      "&grant_type=client_credentials";
    const options_token = { method: "POST" };
    fetch(url_token, options_token).then(onResponse).then(onTokenJson);
    first_request = false;
  }
  if (!result) {
    result = true;
  } else {
    const name_li = event.currentTarget.querySelector("h2");
    game_name = name_li.textContent;
  }
  const target_url = "https://api.igdb.com/v4/games/";
  const cors_proxy = "https://corsproxy.io/?";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": client_id_twitch,
      Authorization: "Bearer " + game_token,
    },
    body:
      "fields id,name,alternative_names.name,genres.name,release_dates.*,cover.image_id,genres.*,summary,storyline,rating,platforms.name,themes.name;" +
      'where name = "' +
      game_name +
      '" | alternative_names.name = "' +
      game_name +
      '";',
  };
  const fetch_result = await fetch(cors_proxy + target_url, options).then(
    onResponseCors
  );
  if (retry) {
    retry = false;
    result = false;
    show_game_info();
  }
}

function onJson_Imdb(json) {
  if (!json) return null;
  else {
    document.body.classList.add("noscroll");
    modal_search.classList.remove("nascosto");
    modal_search.innerHTML = "";
    modal_search.classList.add("modal_display");
    const lista_film = json.d;
    if (lista_film.length === 0) {
      const msg = document.createElement("h2");
      msg.textContent = "NO RESULTS !";
      modal_search.appendChild(msg);
    }
    for (item of lista_film) {
      const nome = item.l;
      let poster;
      if (!item.i) {
        poster = placeholder_img;
      } else {
        poster = item.i.imageUrl;
      }
      const movie_list = document.createElement("li");
      const poster_url = document.createElement("img");
      poster_url.src = poster;
      const title = document.createElement("h2");
      title.textContent = nome;
      const movie_id = item.id;
      const hiddenID = document.createElement("p");
      hiddenID.textContent = movie_id;
      hiddenID.classList.add("nascosto");
      movie_list.appendChild(hiddenID);
      movie_list.appendChild(title);
      movie_list.appendChild(poster_url);
      movie_list.addEventListener("click", stopProp);
      if (movie_id.includes("tt")) {
        if (item.qid == "videoGame") {
          movie_list.addEventListener("click", show_game_info);
        } else {
          movie_list.addEventListener("click", show_movie_info);
        }
      } else if (movie_id.includes("nm")) {
        movie_list.addEventListener("click", show_nm_info);
      }
      modal_search.appendChild(movie_list);
    }
    modal_search.scrollIntoView();
  }
}

function search(event) {
  event.preventDefault();
  const movie_input = document.querySelector("#movie_name");
  const movie_name = encodeURIComponent(movie_input.value);
  if (movie_name !== "") {
    const url = "https://imdb8.p.rapidapi.com/auto-complete?q=" + movie_name;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
      },
    };
    fetch(url, options).then(onResponse).then(onJson_Imdb);
  }
}

loginitem.addEventListener("click", login);

for (const rev of boxadreviews) {
  rev.addEventListener("mouseenter", showreviews);
}

for (const ov of overviews) {
  ov.addEventListener("mouseenter", changeoverviews);
  ov.addEventListener("mouseleave", resetoverviews);
}

for (const acc of accountitem) {
  acc.addEventListener("click", crea_account);
}

for (const crosses of cross_img) {
  crosses.addEventListener("click", close);
  crosses.addEventListener("click", close_modal);
}

for (const news of newsitem) {
  news.addEventListener("click", showmore);
}

modal_search.addEventListener("click", close_search);
form.addEventListener("submit", search);
