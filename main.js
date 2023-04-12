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

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let word = elInput.value;

  elLoader.style.display = "block";
  if (word.trim() === "") {
    document.querySelector(".form__validation").textContent =
      "Whoops, can’t be empty…";
    elInput.classList.add("border");
    elLoader.style.display = "none";
    return false;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const dataString = JSON.stringify(data);
      localStorage.setItem("myData", dataString);
      data = JSON.parse(localStorage.getItem("myData")) || data;

      elLoader.style.display = "none";
      makenull();
      //render synonyms
      render(data);
      elInput.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
});

//playSoundButton
elAudioButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  console.log("play");
  const audio = document.querySelector("#wordAudio");
  audio.play();
});

//switchmoodbuttons
elOnOff.addEventListener("click", (evt) => {
  evt.preventDefault();
  console.log("hi");

  if (elOnOffImage.src.includes("on")) {
    elOnOffImage.src = "./images/off.svg";
    elbody.classList.remove("dark");
  } else {
    elOnOffImage.src = "./images/on.svg";
    elbody.classList.add("dark");
  }
});

//listen moon button
elMoonButton.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (elOnOffImage.src.includes("on")) {
    elOnOffImage.src = "./images/off.svg";
    elbody.classList.remove("dark");
  } else {
    elOnOffImage.src = "./images/on.svg";
    elbody.classList.add("dark");
  }
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
    document.body.style.fontFamily = "'Inter', sans-serif";
    console.log(document.body.style.fontFamily);
  } else if (event.target.value === "Serif") {
    document.body.style.fontFamily = "'Lora', serif";
  } else {
    document.body.style.fontFamily = "'Inconsolata', monospace";
  }
});

function render(data) {
  if (data["title"] == "No Definitions Found") {
    elErrorDiv.style.display = "block";
    elErrorParagraph.textContent = data["title"];
    elErrorSuggestion.textContent = `${data["message"]}. ${data["resolution"]}`;
  }

  elSearchedWord.textContent = data[0]["word"];
  elWordRead.textContent = data[0].phonetic || data[0].phonetics[1]["text"];
  elAudio.setAttribute(
    "src",
    `${data[0].phonetics[data[0].phonetics.length - 1]["audio"]}`
  );

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
        parag.setAttribute("class", "noun__definition");
        parag.textContent = definition["definition"];
        defDiv.appendChild(parag);
        elDefenitionsDiv[k].appendChild(defDiv);
      });

      //render synonyms
      if (meaning["synonyms"].length > 0) {
        elSynonymDiv[k].style.display = "flex";
        elSynonym[k].textContent = "synonyms";
        elSynonymValue[k].innerHTML = meaning["synonyms"];
        console.log(meaning["synonyms"]);
      }

      //render antonyms
      if (meaning["antonyms"].length > 0) {
        elAntonymsDiv[k].style.display = "flex";
        elAntonym[k].textContent = "Antonyms";
        elAntonymValue[k].innerHTML = meaning["antonyms"];
        console.log(meaning["antonyms"]);
      }
    });
  });

  //render source
  elSourceParagraph.textContent = "Source";
  elSourceLink.setAttribute("href", data[0]["sourceUrls"]);
  elSourceLink.textContent = data[0]["sourceUrls"];
}

//onload
window.onload(render(JSON.parse(localStorage.getItem("myData"))));
