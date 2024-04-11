const loginitem = document.querySelector(".login");
const cross_img = document.querySelectorAll(".cross");
const boxadreviews = document.querySelectorAll(".boxad a");
const overviews = document.querySelectorAll(".ac img");
const accountitem = document.querySelectorAll(".crea-account");
const modal_view = document.querySelector("#modal_account");
const newsitem = document.querySelectorAll("#show_more");

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
