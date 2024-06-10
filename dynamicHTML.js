function returnSmallPokemonCardHTML(i) {
    return /*html*/ `
    <div class="singlePokemonCardClass ${allPokemonJson[i]["types"][0]["type"]["name"]} lightBoxShadowClass" id="singlePokeCardId${i}" onclick="openOverlay(${i})">
   <div class="nameAndNumberDivClass">
   <div class="pokeIdDivForSpanClass"><span class="pokeIdSpanClass">#${allPokemonJson[i]["id"]} </span></div>
    <span class="titleSpanClass">${allPokemonJson[i]["name"]}</span>
   </div>
    <img src="${allPokemonJson[i]["sprites"]["other"]["official-artwork"]["front_default"]}" alt="" class="mainPokeImgClass lightBoxShadowClass3">
    <div class="typeIconDivClass" id="typeIconDivId${i}"></div>
    </div>
    `;
  }

  function renderEvoAttributes() {
    let attributesDiv = document.getElementById("attributesDivId");
    attributesDiv.innerHTML = /*html*/ `
    <div id="mainLoadingSpinnerDivId2">
        <div class="loadingSpinnerChildDiv2"></div>
        <div id="loadingSpinner2">
            <img src="./img/icons8-pokéball-100.png" alt="" id="rotatingSpinner2">
        </div>
    </div>
  <div class="evoAttributesImgDiv2" id="evoAttributesImgDiv2Id"></div>
  <div class="evoAttributesImgDiv1" id="evoAttributesImgDiv1Id"></div>
    `;
    findPokemonIndexFromEvoChain();
  }

  function findPokemonIndexFromEvoChain() {
    if (evolutionsArray.length == 0) {
      console.log("Attention, evolutionsArray has a length of 0");
      return;
    }
    ///HIER WARTEN AUF EVOARRAY DATA FETCH, so lange display load spinner
    document.getElementById('mainLoadingSpinnerDivId2').style.display="none";
    let foundEvoNumber = 0;
    
    
    for (let i = 0; i < evolutionsArray.length; i++) {
      for (let j = 0; j < Object.keys(allPokemonJson).length; j++) {
        if (allPokemonJson[j]["name"].toLowerCase() == evolutionsArray[i]) {
          foundEvoNumber++;

          ///for loop durch evolutionarray -
          if (foundEvoNumber == 1) {
            document.getElementById("evoAttributesImgDiv2Id").innerHTML = returnEvoSvgHTMLContent(j);
          }
          if (foundEvoNumber == 2) {
            document.getElementById("evoAttributesImgDiv2Id").innerHTML += /*html*/ `
               <div id="evoArrowsDivId">
                <img src="./img/icons8-pfeil-30.png" alt="" class="evoArrowImgClass1 evoArrowImgClass3">
                </div>`
                document.getElementById("evoAttributesImgDiv2Id").innerHTML += returnEvoSvgHTMLContent(j);
              
          }
          if (foundEvoNumber == 3) {
            document.getElementById("evoArrowsDivId").innerHTML += /*html*/`
            <img src="./img/icons8-pfeil-30.png" alt="" class="evoArrowImgClass1 evoArrowImgClass2">`;

            document.getElementById("evoAttributesImgDiv1Id").innerHTML = returnEvoSvgHTMLContent(j);
          }
          if (foundEvoNumber > 3) {
            document.getElementById("evoAttributesImgDiv1Id").innerHTML += /*html*/ `=>${allPokemonJson[j]["name"]}<br>`;
          }
        }
      }
    }

  }


  function returnEvoSvgHTMLContent(j){
    return /*html*/ `<div class="container">
    <div class="circle " >
    <img src="${allPokemonJson[j]["sprites"]["other"]["official-artwork"]["front_default"]}" alt="Circular Image" >
    </div>
    <svg width="0" height="0" >
    <defs>
      <path id="outerCirclePath" d="M 100, 100 m -70, 0 a 70,70 0 1,0 142,0 a 70,72 0 1,0 -144,0" />
    </defs>
  </svg>
  <div class="text">
      <svg viewBox="12 5 180 160" >
          <text font-size="24px"  id="pokemonEvolutionId1">  <textPath xlink:href="#outerCirclePath" startOffset="25%" text-anchor="middle">
              ${allPokemonJson[j]["name"]}
            </textPath>
          </text>
        </svg>
  </div>
</div>`;

}



  function renderOverlayContent(index) {
    let overlayContent = document.getElementById("overlayChild1DivId");
    overlayContent.innerHTML = /*html*/ `
      <div class="overlayPokemonDivClass ${allPokemonJson[index]["types"][0]["type"]["name"]} " id="overlayPokemonDivClassId">
         <div class="nameAndNumberDivClass">
              <div class="pokeIdDivForSpanClass"><span class="pokeIdSpanClass">#${
                allPokemonJson[index]["id"]
              } </span>
          </div>
              <span class="titleSpanClass">${allPokemonJson[index]["name"]}</span>
         </div>
              <img src="${
                allPokemonJson[index]["sprites"]["other"]["official-artwork"][
                  "front_default"
                ]
              }" alt="" class="mainPokeOverlayImgClass lightBoxShadowClass3">
          <div class="typeIconDivClass" id="typeIconOverlayDivId${index}"></div>
      </div>
          <div class="attributesMainDivClass" id="attributesMainDivClassId">
              <div class="overlayMenuDivClass" id="overlayNavBarDivId">
              </div>
              <div id="attributesDivId" ></div>
          </div>
          <div class="arrowDiv">
              <img src="./img/icons8-zurück-100.png" alt="" class="arrowClass" onclick="lastOverlayPokemon(${index - 1})" >
              <img src="./img/icons8pfeilausklappen100.png" alt="" class="arrowClass2 margin-top" onclick="closeMainOverlay()">
              <img src="./img/icons8-vorwärts-100.png" alt="" class="arrowClass" onclick="nextOverlayPokemon(${index + 1})">
          </div>
          `;
  
    let singleCardIconDivId = document.getElementById(`typeIconOverlayDivId${index}`);
  
    for (let j = 0; j < allPokemonJson[index]["types"].length; j++) {
      singleCardIconDivId.innerHTML += /*html*/ `
          <img src="./img/typeIcon_${allPokemonJson[index]["types"][j]["type"]["name"]}.png" alt="" class="typeIconClass lightBoxShadowClass2">
      `;
    }
  
    renderNavBar(index);
    renderMainAttributes(index);
  }

  //Animated Nav Bar 
function renderNavBar(index) {
  document.getElementById("overlayNavBarDivId").innerHTML = /*html*/ `
      <nav id="navBarId">
          <ul>
            <li class="active"><a href="#about" onclick="renderMainAttributes(${index})" id="aTagId1" class="aTagClass">About</a></li>
            <li><a href="#base-stats" onclick="renderStatsAttributes(${index})" class="aTagClass" id="aTagId2">Base Stats</a></li>
            <li><a href="#evolution" onclick="renderEvoAttributes(${index})" class="aTagClass" id="aTagId3">Evolution</a></li>
          </ul>
      </nav>
    `;
  const nav = document.querySelector("nav ul");
  const underline = document.createElement("div");
  underline.classList.add("underline");
  nav.appendChild(underline);

  const updateUnderline = () => {
    const activeItem = document.querySelector("nav li.active a");
    if (activeItem) {
      const { left, width } = activeItem.getBoundingClientRect();
      const { left: navLeft } = nav.getBoundingClientRect();
      underline.style.left = `${left - navLeft}px`;
      underline.style.width = `${width}px`;
    }
  };
  document.querySelectorAll("nav li a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector("nav li.active").classList.remove("active");
      this.parentNode.classList.add("active");
      updateUnderline();
    });
  });
  window.addEventListener("resize", updateUnderline);
  updateUnderline();
}

function renderMainAttributes(index) {
  
    // Render attributes
    let attributesDiv = document.getElementById("attributesDivId");
    attributesDiv.innerHTML = /*html*/ `
         <table class="mainStatsTableClass">
         <tbody>
             <tr>
                 <td>Height</td>
                 <td>${allPokemonJson[index]["height"]}</td>
             </tr>
             <tr>
                 <td>Weight</td>
                 <td>${allPokemonJson[index]["weight"]}</td>
             </tr>
             <tr>
                 <td>Base EXP</td>
                 <td>${allPokemonJson[index]["base_experience"]}</td>
             </tr>
             <tr>
                 <td class="verticalAlignTableElementClass">Abilities</td>
                 <td id="abilityTdId">
                 </td>
             </tr>
         </tbody>
     </table>
         `;
  
    let abilityTdId = document.getElementById("abilityTdId");
    for (let j = 0; j < allPokemonJson[index]["abilities"].length; j++) {
      abilityTdId.innerHTML += `${allPokemonJson[index]["abilities"][j]["ability"]["name"]} |<br> `;
    }
  }

 
  ///Including dynamic progress bar
  ///Need further study ! Combination of map,arrow function and .join() !
  function renderStatsAttributes(index) {
    let attributesDiv = document.getElementById("attributesDivId");
    let stats = allPokemonJson[index]["stats"];
    let statsHtml = stats.map((stat, i) => {
      let statName;
      switch(i) {
        case 0: statName = "Hp"; break;
        case 1: statName = "Attack"; break;
        case 2: statName = "Defense"; break;
        case 3: statName = "Sp. attack"; break;
        case 4: statName = "Sp. defense"; break;
        case 5: statName = "Speed"; break;
      }
      let statValue = stat['base_stat'];
      let percentageValue = (statValue / 160) * 100;
      return `
        <tr>
          <td>${statName}</td>
          <td>
            <div class="progress">
              <div class="progress-bar" data-value="${percentageValue}" style="width: 0%;">${statValue}</div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  
    attributesDiv.innerHTML = /*html*/ `
      <table class="mainStatsTableClass">
        <tbody>
          ${statsHtml}
        </tbody>
      </table>
    `;
  
    // Animate the progress bars
    document.querySelectorAll('.progress-bar').forEach(bar => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute('data-value') + '%';
      }, 10); // Delay to ensure animation triggers
    });
  }
