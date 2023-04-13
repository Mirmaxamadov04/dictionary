const elAudioButton = document.querySelector(".audio-button");
const elForm = document.querySelector(".form");
const elInput = document.querySelector(".form__input");
const elSearchedWord = document.querySelector(".word__name");
const elWordRead = document.querySelector(".word__read");
const elAudio = document.querySelector("#wordAudio");
const elWordAudioSource = document.querySelector(".wordAudio__src");
const elNounHeading = document.querySelectorAll(".noun__heading");
const elNounMeaning = document.querySelectorAll(".noun__meaning");
const elDefenitionsDiv = document.querySelectorAll(".definitions");
const elSynonymDiv = document.querySelectorAll(".synonyms");
const elSynonym = document.querySelectorAll(".synonyms__paragraph");
const elSynonymValue = document.querySelectorAll(".synonyms__noun");
const elAntonymsDiv = document.querySelectorAll(".antonyms");
const elAntonym = document.querySelectorAll(".antonyms__paragraph");
const elAntonymValue = document.querySelectorAll(".antonyms__noun");
const elErrorDiv = document.querySelector(".error");
const elErrorParagraph = document.querySelector(".error__paragraph");
const elErrorSuggestion = document.querySelector(".error__suggestion");
const elNouns = document.querySelectorAll(".noun");
const elSourceParagraph = document.querySelector(".source__paragraph");
const elSourceLink = document.querySelector(".source__link");
const elNavButton = document.querySelector(".nav__button");
const elOnOff = document.querySelector(".on-off");
const elOnOffImage = document.querySelector(".on-off__image");
const elMoonButton = document.querySelector(".moon");
const elMoonImage = document.querySelector(".moon__image");
const elbody = document.querySelector("body");
const elLoader = document.querySelector(".center-body");
const elContent = document.querySelector(".content");

//Listening form
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let word = elInput.value;

  elContent.style.display = "none";
  elLoader.style.display = "block";

  if (word.trim() === "") {
    document.querySelector(".form__validation").textContent =
      "Whoops, can’t be empty…";
    elInput.classList.add("border");
    elLoader.style.display = "none";
    elContent.style.display = "block";
    return false;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      const dataString = JSON.stringify(data);
      localStorage.setItem("myData", dataString);
      data = JSON.parse(localStorage.getItem("myData")) || data;

      elLoader.style.display = "none";
      elContent.style.display = "block";
      makenull();
      render(data);
      querySave(word);
    })
    .catch((error) => {});
});

//playSoundButton
elAudioButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  const audio = document.querySelector("#wordAudio");
  audio.play();
});

//switchmoodbuttons
elOnOff.addEventListener("click", (evt) => {
  evt.preventDefault();
  switchMood();
});

//listen moon button
elMoonButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  switchMood();
});

//function makenull all
function makenull() {
  document.querySelector(".form__validation").textContent = "";
  elInput.classList.remove("border");
  elSourceParagraph.textContent = " ";
  elSourceLink.textContent = " ";
  elNouns.forEach((noun) => (noun.style.display = "none"));
  elErrorDiv.style.display = "none";
  elSearchedWord.textContent = "";
  elWordRead.textContent = "";
  elDefenitionsDiv.forEach((div) => (div.textContent = ""));
  elSynonym.forEach((num) => (num.textContent = ""));
  elSynonymValue.forEach((num) => (num.textContent = ""));
  elNounHeading.forEach((heading) => (heading.textContent = " "));
  elAudioButton.style.display = "none";
}

//fontfamily
const fontSelector = document.getElementsByClassName("nav__select")[0];
fontSelector.addEventListener("change", (event) => {
  event.preventDefault();
  if (event.target.value === "Sans Serif") {
    localStorage.setItem("selectedFont", "Sans Serif");
    document.body.style.fontFamily = "'Inter', sans-serif";
    localStorage.setItem("fontfamily", "'Inter', sans-serif");
  } else if (event.target.value === "Serif") {
    document.body.style.fontFamily = "'Lora', serif";
    localStorage.setItem("fontfamily", "'Lora', serif");
    localStorage.setItem("selectedFont", "Serif");
  } else {
    document.body.style.fontFamily = "'Inconsolata', monospace";
    localStorage.setItem("fontfamily", "'Inconsolata', monospace");
    localStorage.setItem("selectedFont", "Mono");
  }
});

//switchmood
function switchMood() {
  if (elOnOffImage.src.includes("on")) {
    elOnOffImage.src = "./images/off.svg";
    elbody.classList.remove("dark");
    elMoonButton.classList.remove("moon-clicked");
    localStorage.setItem("mode", "light");
  } else {
    elOnOffImage.src = "./images/on.svg";
    elbody.classList.add("dark");
    elMoonButton.classList.add("moon-clicked");
    localStorage.setItem("mode", "dark");
  }
}

//render searched word to the page
function render(data) {
  fontSelector.value = localStorage.getItem("selectedFont");
  if (data["title"] == "No Definitions Found") {
    elErrorDiv.style.display = "block";
    elErrorParagraph.textContent = data["title"];
    elErrorSuggestion.textContent = `${data["message"]}. ${data["resolution"]}`;
  }

  elSearchedWord.textContent = data[0]["word"];
  elWordRead.textContent = data[0].phonetic || data[0].phonetics[1]["text"];
  elAudio.src = findAudioValidSrc(data);
  elAudioButton.style.display = "block";

  data.forEach((obj) => {
    obj.meanings.forEach((meaning, k) => {
      //render heading
      const heading = elNounHeading[k] || elNounHeading[0];
      heading.textContent = meaning.partOfSpeech;
      elNouns[k].style.display = "block";
      const defDiv = document.createElement("div");

      //render definition
      meaning.definitions.forEach((definition, j) => {
        let parag = document.createElement("p");
        let example = document.createElement("p");
        parag.setAttribute("class", "noun__definition");
        parag.classList.add("spaan");
        example.setAttribute("class", "definition__example");
        parag.textContent = definition["definition"];
        example.textContent = definition["example"];
        defDiv.appendChild(parag);
        defDiv.appendChild(example);
        elDefenitionsDiv[k].appendChild(defDiv);
      });

      //render synonyms
      if (meaning["synonyms"].length > 0) {
        elSynonymDiv[k].style.display = "flex";
        elSynonym[k].textContent = "synonyms";
        elSynonymValue[k].innerHTML = meaning["synonyms"];
      }
      //render antonyms
      if (meaning["antonyms"].length > 0) {
        elAntonymsDiv[k].style.display = "flex";
        elAntonym[k].textContent = "Antonyms";
        elAntonymValue[k].innerHTML = meaning["antonyms"];
      }
    });
  });

  //render source
  elSourceParagraph.textContent = "Source";
  elSourceLink.setAttribute("href", data[0]["sourceUrls"]);
  elSourceLink.textContent = data[0]["sourceUrls"];
}

//findAudioValidSrc
function findAudioValidSrc(data) {
  for (let i = 0; i < data[0].phonetics.length; i++) {
    if (data[0].phonetics[i].audio !== "") {
      return data[0].phonetics[i].audio;
    }
  }
}

//Reload page function to prevent clearing page
window.addEventListener("load", (evt) => {
  evt.preventDefault();
  const dataAPi = JSON.parse(localStorage.getItem("myData"));
  render(dataAPi);

  const Mode = localStorage.getItem("mode");

  if (Mode === "light") {
    elOnOffImage.src = "./images/off.svg";
    elbody.classList.remove("dark");
    elMoonButton.classList.remove("moon-clicked");
  } else {
    elOnOffImage.src = "./images/on.svg";
    elbody.classList.add("dark");
    elMoonButton.classList.add("moon-clicked");
  }

  const fontttFamily = localStorage.getItem("fontfamily");
  if (fontttFamily === "'Inter', sans-serif") {
    document.body.style.fontFamily = "'Inter', sans-serif";
  } else if (fontttFamily === "'Lora', serif") {
    document.body.style.fontFamily = "'Lora', serif";
  } else {
    document.body.style.fontFamily = "'Inconsolata', monospace";
  }
});

//query save
function querySave(word) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("search", word);
  window.location.href = `${window.location.origin}${window.location.pathname}?${urlParams}`;
}
