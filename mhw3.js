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
const api_key = "a651580f21mshb17176ebf41df00p1d3654jsn21f531773e64";
const client_id_twitch = "12h3bsf6as2gx17rhtrnjjx0bfkr03";
const client_secret_twitch = "cdpi68gukavd5evpooq9pn3bk31ugg";

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

///////////////////////////////////////////////////////////////////////////////////////

let game_name;
let game_token;
let retry = false;
let first_request = true;
let result = true;

function onTokenJson(json) {
  game_token = json.access_token;
}

function show_movie_info() {}

function show_music_info() {
  console.log("prova musica");
}

function show_game(json) {
  modal_search.innerHTML = "";
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

////////////////

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
      movie_list.appendChild(title);
      movie_list.appendChild(poster_url);
      movie_list.addEventListener("click", stopProp);
      const content_type = item.qid;
      if (content_type === "videoGame") {
        movie_list.addEventListener("click", show_game_info);
      } else if (content_type === "musicVideo") {
        movie_list.addEventListener("click", show_music_info);
      } else {
        movie_list.addEventListener("click", show_movie_info);
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
