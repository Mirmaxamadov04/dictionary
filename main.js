const elAudioButton = document.querySelector(".audio-button");
const elForm = document.querySelector(".form");
const elInput = document.querySelector(".form__input");
const elSearchedWord = document.querySelector(".word__name");
const elWordRead = document.querySelector(".word__read");
const elWordAudioSource = document.querySelector(".wordAudio__src");
const elNounHeading = document.querySelectorAll(".noun__heading");
const elNounMeaning = document.querySelectorAll(".noun__meaning");
const elDefenitionsDiv = document.querySelectorAll(".definitions");
const elSynonymDiv = document.querySelectorAll(".synonyms");
const elSynonym = document.querySelectorAll(".synonyms__paragraph");
const elSynonymValue = document.querySelectorAll(".synonyms__noun");
const elNouns = document.querySelectorAll(".noun");
const elSourceParagraph = document.querySelector(".source__paragraph");
const elSourceLink = document.querySelector(".source__link");
const elNavButton = document.querySelector(".nav__button");
const elOnOff = document.querySelector(".on-off");
const elOnOffImage = document.querySelector(".on-off__image");
const elMoonButton = document.querySelector(".moon");
const elMoonImage = document.querySelector(".moon__image");

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let word = elInput.value;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      elSearchedWord.textContent = data[0]["word"];
      elWordRead.textContent = data[0].phonetic || data[0].phonetics[1]["text"];
      elWordAudioSource.setAttribute(
        "src",
        `${data[0].phonetics[data[0].phonetics.length - 1]["audio"]}`
      );

      elAudioButton.style.display = "block";

      data.forEach((obj) => {
        obj.meanings.forEach((meaning, k) => {
          const heading = elNounHeading[k] || elNounHeading[0];

          heading.textContent = meaning.partOfSpeech;
          elNouns[k].style.display = "block";

          const defDiv = document.createElement("div");
          elDefenitionsDiv[k].appendChild(defDiv);

          meaning.definitions.forEach((definition, j) => {
            let parag = document.createElement("p");
            parag.setAttribute("class", "noun__definition");
            parag.textContent = definition["definition"];

            defDiv.appendChild(parag);

            if (meaning["synonyms"].length > 0) {
              elSynonym[k].textContent = "synonyms";
              elSynonymValue[k].textContent = meaning["synonyms"];
            }
          });
        });
      });

      elSourceParagraph.textContent = "Source";
      elSourceLink.setAttribute("href", data[0]["sourceUrls"]);
      elSourceLink.textContent = data[0]["sourceUrls"];
    })
    .catch((error) => {
      console.log(error);
    });
});

elAudioButton.addEventListener("click", (evt) => {
  evt.preventDefault();

  document.querySelector("#wordAudio").play();
});

// elNavButton.addEventListener("click", (evt) => {
//   evt.preventDefault();

//   console.log("bosildi");
// });

elOnOff.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (elOnOffImage.src.includes("on")) {
    elOnOffImage.src = "./images/off.svg";
  } else {
    elOnOffImage.src = "./images/on.svg";
  }
});

elMoonButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (elOnOffImage.src.includes("on")) {
    elOnOffImage.src = "./images/off.svg";
  } else {
    elOnOffImage.src = "./images/on.svg";
  }
});
