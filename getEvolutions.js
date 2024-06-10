let fetchedPokemonAsJson = {};
let evolutionChainAsJson ={};
let evolutionsArray = [];

async function fetchFromPokemonNameAndPushToEvoArray(pokemon) {
  pokemon = pokemon.toLowerCase();
      try {
          let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
          if (!response.ok) {
              throw new Error('Pokemon-Species: Network response was not ok');
          }
          fetchedPokemonAsJson = await response.json();
          ////////Fetch im Fetch beginnt hier
          await fetchFromEvolutionUrl(fetchedPokemonAsJson['evolution_chain']['url']);
          /////////Fetch im Fetch endet hier 
      } catch (error) {
          console.error(`Error fetching data for ${pokemon}:`, error);
          fetchedPokemonAsJson = { error: "no data" };
      }
      //Rekursive, fancy aber elegantere Lösung:
      await pushToEvoChainArray(evolutionChainAsJson.chain, content);
}

async function fetchFromEvolutionUrl(EvoURL){
  //Fetch im fetch
  try {
    let responseEvolutionFetch = await fetch(`${EvoURL}`);
    if (!responseEvolutionFetch.ok) {
        throw new Error('Evolution Url: Network response was not ok');
    }
    evolutionChainAsJson = await responseEvolutionFetch.json();
    // console.log(evolutionChainAsJson);
 } catch (error) {
    console.error(`Error fetching data for ${EvoURL}:`, error);
    evolutionChainAsJson = { error: "no data" };
  }
}

//recursive solution:
function pushToEvoChainArray(chain, contentId) {
  if (!chain) {
      console.log('No Evo chain data available or another error occured.');
      return;
  }
  // Display the current species name
  if (chain.species?.name) {
      evolutionsArray.push(chain.species.name);

      ///////////HIER IMPLEMENTIEREN: EIN PROMISE, DAS ERFÜLLT IST, WENN evolutionsArray voll ist
      //bzw die rekursive funktion keine weiteren branches mehr hat !
      // dann die flag oder promise resolve benutzen, um findPokemonIndexFromEvoChain() aufzurufen
  }
  // Recursively process each evolution in the evolves_to array
  if (chain.evolves_to?.length > 0) {
    //'evolution' represents a node in the tree, any name can be used here:
      chain.evolves_to.forEach(evolution => {
          pushToEvoChainArray(evolution, contentId);
      });
  }
}


//Simpler, more readable but longer solution (NOT USED RIGHT NOW!):
function renderEvoChain() {
  let contentId = document.getElementById('content');
  contentId.innerHTML = ``;
    ///Hier Zugriff auf fetch vom fetch
      const Evochain = evolutionChainAsJson;
      if (Evochain.error) {
          contentId.innerHTML += `<b>Species</b><br>No data available<br><br>`;
          return;
      }
      // Check if the first species name is accessible
      if (Evochain.chain.species?.name) {
          contentId.innerHTML += `${Evochain.chain.species.name}<br>`;
      }
      // Check if the second species name is accessible
      if (Evochain.chain.evolves_to?.[0]?.species?.name)
        {contentId.innerHTML += `${Evochain.chain.evolves_to[0].species.name}<br>`;}
      else{return;}
      // Check if the third species name is accessible
      if (Evochain.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.name) {
          contentId.innerHTML += `${Evochain.chain.evolves_to[0].evolves_to[0].species.name}<br>`;
      }
      if (Evochain.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.name) {
        contentId.innerHTML += `${Evochain.chain.evolves_to[0].evolves_to[0].species.name}<br>`;
    }
}

//Andere Schreibweise für die Tree Zugriffe zur Orientierung:
// console.log(evolutionChainAsJson["chain"]["species"]["name"]);
// console.log(evolutionChainAsJson["chain"]["evolves_to"][0]["species"]["name"]);
// console.log(evolutionChainAsJson["chain"]["evolves_to"][0]["evolves_to"][0]["species"]["name"]);


