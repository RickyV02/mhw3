const loginitem = document.querySelector(".login");
const cross_img = document.querySelectorAll(".cross");
const boxadreviews = document.querySelectorAll(".boxad a");
const overviews = document.querySelectorAll(".ac img");
const accountitem = document.querySelectorAll(".crea-account");
const modal_view = document.querySelector("#modal_account");
const newsitem = document.querySelectorAll("#show_more");
const form = document.querySelector("form");
const client_id =
  "16b62a7b4155d88c6166fa60765246398123f4f72436d850d9488a275bea93a4";
const client_secret =
  "bd5ff1d692ce2844ed900d3ad4f8040e135cac2af66d347d1ca8aba960ecbfae";
const api_key = "829cd1922e1d8362f105565dd2becd0d";
const access_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjljZDE5MjJlMWQ4MzYyZjEwNTU2NWRkMmJlY2QwZCIsInN1YiI6IjY2MWMwNGNhZDdjZDA2MDE2M2EyYTdmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EGRKuB_NzA5DMADbcqj6fcdwSeg-QvimDfzSsaL4rG8";

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
  modal_view.classList.remove("nascosto");
  modal_view.scrollIntoView();
  document.body.classList.add("noscroll");
}

function close_modal() {
  document.body.classList.remove("noscroll");
  modal_view.classList.add("nascosto");
}

function showmore(event) {
  event.preventDefault();
  const item = event.currentTarget;
  item.textContent = item.dataset.info;
  item.classList.add("nocursor");
}

function onJson(json) {
  if (!json) return;
  else {
  }
}

function onResponse(response) {
  if (!response.ok) {
    console.log("Error: " + response);
    return null;
  } else return response.json();
}

function search(event) {
  event.preventDefault();
  const movie_input = document.querySelector("#movie_name");
  const movie_name = encodeURIComponent(movie_input.value);

  fetch("https://api.themoviedb.org/3/search/movie?query=" + movie_name, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  })
    .then(onResponse)
    .then(onJson);
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

form.addEventListener("submit", search);
