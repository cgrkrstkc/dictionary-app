const magnifierBtn = document.querySelector(".magnifier");
const input = document.querySelector(".value");
const eraseBtn = document.querySelector(".close");

const errorContent = document.querySelector(".error__content");

const statementContent = document.querySelector(".statement__content");

const word = document.querySelector(".word");
const prononciation = document.querySelector(".prononciation");
const speaker = document.querySelector(".speaker");

const word__meaning = document.querySelector(".word__meaning");
const word__explanation = document.querySelector(".word__explanation");

const example__meaning = document.querySelector(".example__meaning");
const example__explanation = document.querySelector(".example__explanation");

const synonyms__meaning = document.querySelector(".synonyms__meaning");
const synonyms__explanation = document.querySelector(".synonyms__explanation");





//SHOWING THE MEANING OF THE WORD BEING LOOKED FOR
function searchingTheWord(value){
    const val = value;
    let pTag = `<p class="error">Searching the meaning of the '${val}'.</p>`
    errorContent.innerHTML = pTag
    errorContent.classList.add("show")
}

async function getFetch(value){
    
    const API = `https://api.dictionaryapi.dev/api/v2/entries/en/${value}`;

    await fetch(API)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        word.textContent = data[0].word;
        prononciation.textContent = data[0].phonetic ? data[0].phonetics[0].text : data[0].phonetics[1].text ;
        
        word__meaning.textContent = "Meaning"
        word__explanation.textContent = data[0].meanings[0].definitions[0].definition

        example__meaning.textContent = "Example"
        example__explanation.textContent = data[0].meanings[0].definitions[0].example

        synonyms__meaning.textContent = "Synonyms"

        const meanings = data[0].meanings

        let attachSynonyms = [];
        for (let i = 0; i < meanings.length; i++) {
            const meaning = meanings[i];
            let synonyms = meaning.synonyms
            for (let j = 0; j < synonyms.length; j++) {
                let synonym = synonyms[j];
                attachSynonyms.push(synonym);
            }
        }
        let sumSynonym ="";
        attachSynonyms.forEach( (synonym,index) => {
            if(index < 5){
                sumSynonym += synonym+", "
            }else if(index === 6){
                sumSynonym += " etc."        
            }else return;
            
        })
        synonyms__explanation.textContent = sumSynonym

        console.log(attachSynonyms)

        

        statementContent.classList.add("show");
    })
    .catch(error =>{
        let pTag = `<p class="error">"PROMISE ERROR: "${error.error}</p>`
        errorContent.innerHTML = pTag
        errorContent.classList.add("show")
        setTimeout(()=> {
            errorContent.classList.remove("show")
        }, 5000)
    })
    .finally();
}

//SEARCHING AND FINDING WORDS AND MEANING OF THEM - EVENT
function searchForWord(){
    const value = input.value;
    if(!value){
        let pTag = `<p class="error">Please Type a value!.</p>`
        errorContent.innerHTML = pTag
        errorContent.classList.add("show")
    }else {
        console.log(value)
        searchingTheWord(value)
        getFetch(value)
        statementContent.classList.add("show");
        input.value = "";
    }
}
magnifierBtn.addEventListener("click", searchForWord)


//SEARCHING AND FINDING THE WORDS AND MEANING OF THEM BY PRESSING ENTER- EVENT
function searchForWordInput(e){
    if(e.target.value !== ""){
        searchingTheWord(e.target.value)
        eraseBtn.classList.add("show")
    }else{
        eraseBtn.classList.remove("show")
        errorContent.classList.remove("show")
    }
    if(e.key === "Enter" && e.target.value){
        getFetch(e.target.value)
        console.log(e.target.value)
        statementContent.classList.add("show");
        input.value = "";
        errorContent.classList.remove("show")
    }
}
input.addEventListener("keydown", (e)=>searchForWordInput(e))


//ERASING THE INPUT VALUE
function eraseValue(){
    input.value = "";
    errorContent.classList.remove("show")
}
eraseBtn.addEventListener("click", eraseValue)


//SPEAKER - EVENT
function speakingSpeaker(){
    let utterance = new SpeechSynthesisUtterance(word.textContent);
    utterance.lang = "en";
    speechSynthesis.speak(utterance);
}
speaker.addEventListener("click", speakingSpeaker)