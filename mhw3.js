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

let token;
let game_name;
let song_name;
let movie_name;
let first_request = true;

function show_movie_info() {}

function show_music_info() {
  console.log("prova musica");
}

function show_game(json) {
  console.log(json);
}

function onTokenJson(json) {
  token = json.access_token;
}

function onResponse(response) {
  if (!response.ok) {
    console.log("Error: " + response);
    return null;
  } else return response.json();
}

function onErrorCors(error) {
  console.clear();
  return null;
}

async function show_game_info() {
  if (first_request) {
    const url_token =
      "https://id.twitch.tv/oauth2/token?client_id=" +
      client_id_twitch +
      "&client_secret=" +
      client_secret_twitch +
      "&grant_type=client_credentials";
    const options_token = { method: "POST" };
    fetch(url_token, options_token).then(onResponse).then(onTokenJson);
  }
  const target_url = "https://api.igdb.com/v4/games";
  const cors_proxy = "https://corsproxy.io/?";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": client_id_twitch,
      Authorization: "Bearer " + token,
    },
    body: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;",
  };
  if (first_request) {
    const check = await fetch(cors_proxy + target_url, options).then(
      onErrorCors
    );
    first_request = false;
    show_game_info();
  } else {
    fetch(cors_proxy + target_url, options)
      .then(onResponse)
      .then(show_game);
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
        game_name = nome;
        movie_list.addEventListener("click", show_game_info);
      } else if (content_type === "musicVideo") {
        song_name = nome;
        movie_list.addEventListener("click", show_music_info);
      } else {
        movie_name = nome;
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
