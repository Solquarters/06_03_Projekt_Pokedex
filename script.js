let responseAsJson = {};
let allPokemonJson = {};

let renderedToIndex = 0;
let fetchedToIndex = 1;

let evoChainIndexAndImgJson = {};

async function initialize(fetchNumber) {
  await fetchFromAPI(fetchNumber);
  //Checking the content:
  //console.log(responseAsJson);
  renderPokemon();
  // console.log(
  //   `Fetched initially, JSON-Size:${Object.keys(allPokemonJson).length}`
  // );
}

async function fetchFromAPI(fetchNumber) {
  document.getElementById('mainLoadingSpinnerDivId').style.display="flex";
  try {
    for (let i = 1; i < fetchNumber; i++) {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${fetchedToIndex}`
      );
      responseAsJson = await response.json();
      allPokemonJson[fetchedToIndex - 1] = responseAsJson;
      // console.log(Object.keys(allPokemonJson).length);
      fetchedToIndex++;
    }
  } catch (error) {
    console.error(`Fetching took too long or other network error.`, error);
  }
  finally{
    //hide spinner
    document.getElementById('mainLoadingSpinnerDivId').style.display="none";
  }
}

function searchAllPokemon() {
  let searchInput = document.getElementById("searchInputId").value;
  if (searchInput.length > 2) {
    document.getElementById("plusIconId").onclick = null;
    searchInput = searchInput.toLowerCase();
    let content = document.getElementById("content");
    content.innerHTML = "";

    for (let i = 0; i < Object.keys(allPokemonJson).length; i++) {
      let pokemonName = allPokemonJson[i]["name"];
      if (pokemonName.toLowerCase().includes(searchInput)) {
        content.innerHTML += returnSmallPokemonCardHTML(i);
        renderTypes(i);
      }
    }
  }
  if (searchInput == "") {
    document.getElementById("plusIconId").onclick = render20More;
    content.innerHTML = "";
    renderedToIndex = 0;
    renderPokemon();
  }
}

async function renderPokemon() {
  let content = document.getElementById("content");
  for (let i = 0; i < 20; i++) {
    if (renderedToIndex >= fetchedToIndex) {
      console.log("Cannot render more, reached JSON limit");
      return;
    }
    content.innerHTML += returnSmallPokemonCardHTML(i);
    renderTypes(i);
    renderedToIndex++;
  }

  //Fetch rest of API in the background
  // console.log("Waiting for two fetches to finish...");
  if (fetchedToIndex < 42) {
    await fetchFromAPI(985);
    console.log(
      `Fetched rest of API, JSON-Size:${Object.keys(allPokemonJson).length}`
    );
  }
}

function renderTypes(i) {
  let singleCardIconDivId = document.getElementById(`typeIconDivId${i}`);
  for (let j = 0; j < allPokemonJson[i]["types"].length; j++) {
    singleCardIconDivId.innerHTML += /*html*/ `
              <img src="./img/typeIcon_${allPokemonJson[i]["types"][j]["type"]["name"]}.png" alt="" class="typeIconClass lightBoxShadowClass2" >
          `;
  }
}

async function openOverlay(index) {
  document.getElementById("mainOverlayDivId").style.display = "flex";
  stopScrolling();
  renderOverlayContent(index);
  createGradientBackGround();
 
  evolutionsArray = [];
  await fetchFromPokemonNameAndPushToEvoArray(allPokemonJson[index]["name"]);
}

function renderEvoAttributes() {
  let attributesDiv = document.getElementById("attributesDivId");
  attributesDiv.innerHTML = /*html*/ `

<div class="evoAttributesImgDiv2" id="evoAttributesImgDiv2Id"></div>
<div class="evoAttributesImgDiv1" id="evoAttributesImgDiv1Id"></div>
  `;
  findPokemonIndexFromEvoChain();
}

function closeMainOverlay() {
  document.getElementById("overlayChild1DivId").classList.add("fadeOutClass");
  document.getElementById("mainOverlayDivId").classList.add("fadeOutClass");
  setTimeout(function() {
    document.getElementById("overlayChild1DivId").classList.remove("fadeOutClass");
    document.getElementById("mainOverlayDivId").classList.remove("fadeOutClass");
  }, 500); // Adjust the delay as needed
  setTimeout(function() {
    document.getElementById("mainOverlayDivId").style.display = "none";
  }, 300); 
  startScrolling();
}

function stopScrolling() {
  document.body.style.overflow = "hidden";
}

function startScrolling() {
  document.body.style.overflow = "auto";
}

//////////SAME FOR 
function nextOverlayPokemon(index) {
  document.getElementById("overlayChild1DivId").classList.add("fadeOutClass");
  
   setTimeout(function() {
    if (index > renderedToIndex - 1) {
      index = 0;
    }
    renderOverlayContent(index);
    createGradientBackGround();
    evolutionsArray = [];
    fetchFromPokemonNameAndPushToEvoArray(allPokemonJson[index]["name"]);

    document.getElementById("overlayChild1DivId").classList.remove("fadeOutClass");
    document.getElementById("overlayChild1DivId").classList.add("fadeInClass");
  }, 100); 
  document.getElementById("overlayChild1DivId").classList.remove("fadeInClass");
}

function lastOverlayPokemon(index) {
  if (index < 0) {
    index = renderedToIndex - 1;
  }
  renderOverlayContent(index);
  createGradientBackGround();


  evolutionsArray = [];
  fetchFromPokemonNameAndPushToEvoArray(allPokemonJson[index]["name"]);
}

async function render20More() {
  if(renderedToIndex >= fetchedToIndex){console.log('Not enough data fetched yet.'); return};
  let limitRenderAmount = renderedToIndex;
  let content = document.getElementById("content");
  for (let i = renderedToIndex; i < limitRenderAmount + 20; i++) {
    content.innerHTML += /*html*/ `
      
        <div class="singlePokemonCardClass ${allPokemonJson[i]["types"][0]["type"]["name"]} lightBoxShadowClass" id="singlePokeCardId${i}" onclick="openOverlay(${i})">
       <div class="nameAndNumberDivClass">
       <div class="pokeIdDivForSpanClass"><span class="pokeIdSpanClass">#${allPokemonJson[i]["id"]} </span></div>
        <span class="titleSpanClass">${allPokemonJson[i]["name"]}</span>
       </div>
        <img src="${allPokemonJson[i]["sprites"]["other"]["official-artwork"]["front_default"]}" alt="" class="mainPokeImgClass lightBoxShadowClass3">
        <div class="typeIconDivClass" id="typeIconDivId${i}"></div>
        </div>
        `;
    let singleCardIconDivId = document.getElementById(`typeIconDivId${i}`);

    for (let j = 0; j < allPokemonJson[i]["types"].length; j++) {
      singleCardIconDivId.innerHTML += /*html*/ `
                <img src="./img/typeIcon_${allPokemonJson[i]["types"][j]["type"]["name"]}.png" alt="" class="typeIconClass lightBoxShadowClass2" >
            `;
    }
    renderedToIndex++;
  }
}


function scrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


//Gradient color effect START
function getBackgroundColor(elementId) {
  return window.getComputedStyle(elementId).backgroundColor;
}

function setGradientBackground(divId, color1, color2) {
  divId.style.background = `linear-gradient(${color1}, ${color2})`;
}

function createGradientBackGround(){
  let div1 = document.getElementById('overlayPokemonDivClassId');
  let div3 = document.getElementById('navBarId');
  let div2 = document.getElementById('attributesDivId');

  let color1 = getBackgroundColor(div1);
  let color2 = getBackgroundColor(div2);

  setGradientBackground(div3, color1, color2);
}
//Gradient color effect END
 






