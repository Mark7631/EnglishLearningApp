axios.defaults.headers.post['Content-Type'] = 'application/json';

let container = document.querySelector(`.word-container`);

let testSpace = document.querySelector(`.testSpace`);

let words = [];

loadWord();
async function loadWord(){
    let response = await axios(`/words/all`);

    words = response.data;

    renderWords();
}

async function renderWords(){
    container.innerHTML = ``;
    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        let checked = '';

        if(word.isRepeate == true){
            checked = 'checked';
        }else{
            checked = '';
        };
        
        container.innerHTML += `
        <div class="word">
            <span>${word.word} - ${word.translate}</span>
            <input class="isRepeate" type="checkbox" ${checked}>
            <button type="button" class="word-remove">
                Удалить слово
            </button>
        </div>
        `;
        

    }

    container.innerHTML += `
        <button type="button" class="start">
            начать
        </button>
    `;

    removeWord();
    repeateWord();
    startTest();
};

newWord();
function newWord() {
    let form = document.querySelector(`#send-data`); 

    form.addEventListener(`submit`, async function(evt) {  
        evt.preventDefault();

        let newword = await axios.post('/words/create', form);

        form.reset();

        if(newword.data != 'error'){
            words.push(newword.data);
        };
        
        loadWord();
    });
};

function removeWord(){
    let removeButtons = document.querySelectorAll(`.word-remove`);

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        let removeButton = removeButtons[i];

        removeButton.addEventListener(`click`, async function() {
            await axios.post(`/words/remove`, {
                id: word._id
            })
            loadWord();
        });
        
    };
};

function repeateWord(){
    let isRepeateAll = document.querySelectorAll(`.isRepeate`)

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        let isRepeate = isRepeateAll[i]

        isRepeate.addEventListener(`click`, async function() {
            let checkButton = ""
            if(word.isRepeate == false){
                checkButton = "on"
            } else {
                checkButton = 'of'
            }
            await axios.post(`/words/repeate`, {
                id: word._id,
                checkButton: checkButton,
            })

            loadWord();

            wordsForTest = [];
        });
        
    };
};

let wordsForTest = [];

function startTest(){
    for(let i = 0; i < words.length; i++){
        let word = words[i];
        if(word.isRepeate == true){
            wordsForTest.push(word);
        };
    };

    let startButton = document.querySelector(`.start`);

    startButton.addEventListener(`click`, function(){
        container.classList.add(`text-none`)

        testSpace.innerHTML = ``;
        
        for (let i = 0; i < wordsForTest.length; i++) {
            let word = wordsForTest[i];
            
            testSpace.innerHTML += `
            <div class="word testWord">
                <span>${word.translate}</span>
                <input class="repeate userAnswer" type="string">
                <button type="button" class="word-check">
                    проверить
                </button>
            </div>
            `;
        };
        checkWord();
    });
};

function checkWord(){
    let buttonsForWordsForCheck = document.querySelectorAll(`.word-check`);

    let userAnswers = document.querySelectorAll(`.userAnswer`);

    let containersOfWords = document.querySelectorAll(`.testWord`);

    for(let i = 0; i < wordsForTest.length; i++){
        let testWord = wordsForTest[i];

        let containerOfWord = containersOfWords[i];

        let buttonForWordForCheck = buttonsForWordsForCheck[i];

        let userAnswer = userAnswers[i];

        buttonForWordForCheck.addEventListener(`click`, function(){
            if(userAnswer.value == testWord.word){
                containerOfWord.classList.add("right");
                containerOfWord.classList.remove("wrong");
            }else{
                containerOfWord.classList.remove("right");
                containerOfWord.classList.add("wrong");
            }
        });
    };
    endTest();
};

function endTest(){
    let endButton = document.querySelector(`.end`);
    
    endButton.addEventListener(`click`, function(){
        testSpace.innerHTML = 'пока что пусто :(';

        wordsForTest = [];
        
        startTest();

        container.classList.remove(`text-none`);
    });
};
