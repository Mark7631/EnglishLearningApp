axios.defaults.headers.post['Content-Type'] = 'application/json';

// Объявляем контейнер для слов
let container = document.querySelector(`.word-container`);

// Объявляем контейнер для повторения слов
let testSpace = document.querySelector(`.testSpace`);

// Объявляем пустой массив  с словами
let words = [];

// Объявляем функцию загрузки слов
loadWord();
// Создаём саму функцию
async function loadWord(){
    // Отправляем запрос для получения данных из бд
    let response = await axios(`/words/all`);

    // Получяем нужную часть из данных
    words = response.data;

    // Запускаем рендер слов на экран
    renderWords();
}

// Объявляем функцию рендера слов
async function renderWords(){
    // Очищаем контейнер
    container.innerHTML = ``;
    // Запускаем цикл с добавлением каждого слова
    for (let i = 0; i < words.length; i++) {
        // Получаю слово
        let word = words[i];

        // Объявляю параметр checked для повторения
        let checked = '';

        // Если слово для повторения то чекбокс отмечен
        if(word.isRepeate == true){
            checked = 'checked';
        }else{
            checked = '';
        };
        
        //добовляем в html
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

    // в конце добовляем кнопку начать
    container.innerHTML += `
        <button type="button" class="start">
            начать
        </button>
    `;

    // Объявляем функции 
    removeWord();
    repeateWord();
    startTest();
};

// Создание нового слова
newWord();
function newWord() {
    // Получаем кнопку из формы
    let form = document.querySelector(`#send-data`); 

    // Добовляем обработчик для отправки слова
    form.addEventListener(`submit`, async function(evt) {  
        evt.preventDefault();

        // Получаем новое слово
        let newword = await axios.post('/words/create', form);

        // Очищаем форму
        form.reset();

        // Ошибка если форма заполнена не полностью
        if(newword.data != 'error'){
            words.push(newword.data);
        };
        
        // Получаем даные из бд заново
        loadWord();
    });
};

// Удаление слова
function removeWord(){
    // Находим все кнопки для удаления
    let removeButtons = document.querySelectorAll(`.word-remove`);

    // Объявляем цикл для каждой кнопки
    for (let i = 0; i < words.length; i++) {
        // Получения слова относящегося к кнопке
        let word = words[i];

        // Получаем отдельную кнопку
        let removeButton = removeButtons[i];

        // Добавляем обработчик события для кнопки
        removeButton.addEventListener(`click`, async function() {     
            // Отправляем запрос на сервер
            await axios.post(`/words/remove`, {
                id: word._id
            })

            // получаем новые даные
            loadWord();
        });
        
    };
};


// Функция для повторения слов
function repeateWord(){
    // Находим чекбоксы
    let isRepeateAll = document.querySelectorAll(`.isRepeate`)

    // Запускаем цикл для каждого слова
    for (let i = 0; i < words.length; i++) {
        // Получаем слово
        let word = words[i];

        // Берём отдельное слово
        let isRepeate = isRepeateAll[i]

        // Добавляем обработчик
        isRepeate.addEventListener(`click`, async function() {
            // обЪявляем переменную для состаяния кнопки
            let checkButton = ""
            if(word.isRepeate == false){
                checkButton = "on"
            } else {
                checkButton = 'of'
            }       
            // Отправляем запрос к серверу на изменения статуса
            await axios.post(`/words/repeate`, {
                id: word._id,
                checkButton: checkButton,
            })

            // Получаем новые данные из бд
            loadWord();

            // Очищаем массив слов для повторения если повторяемые слова изменились
            wordsForTest = [];
        });
        
    };
};

// Функции для повторения слов

// Объявляем массив для слов, которые пользователь хочет повторить
let wordsForTest = [];

// Функция для начала тестирования
function startTest(){
    // Цикл проверки нужно слово повторять или нет
    for(let i = 0; i < words.length; i++){
        let word = words[i];
        if(word.isRepeate == true){
            // Добавление в массив для повтора
            wordsForTest.push(word);
        };
    };

    // Находим кнопку для начала тестирования
    let startButton = document.querySelector(`.start`);

    // Вешаем обработчик событий
    startButton.addEventListener(`click`, function(){
        // Скрываем слова с переводом
        container.classList.add(`text-none`)

        // Очищаем контейнер для теста
        testSpace.innerHTML = ``;
        
        // Цикл с добавлением слова
        for (let i = 0; i < wordsForTest.length; i++) {
            // Получаем отдельное слово
            let word = wordsForTest[i];
            
            // Добавляем в html
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
        // Объявляем функцию для проверки слов
        checkWord();
    });
};

// Создаём функцию для проверки слов
function checkWord(){
    // Ищем все кнопки проверки
    let buttonsForWordsForCheck = document.querySelectorAll(`.word-check`);

    // Ищем все ответы пользователя
    let userAnswers = document.querySelectorAll(`.userAnswer`);

    // Ищем все контейнеры слов для теста
    let containersOfWords = document.querySelectorAll(`.testWord`);

    // Добавляем цикл для всех слов
    for(let i = 0; i < wordsForTest.length; i++){
        // Получаем отдельное слово
        let testWord = wordsForTest[i];

        // Получаем отдельный контейнер
        let containerOfWord = containersOfWords[i];

        // Получаем отдельную кнопку
        let buttonForWordForCheck = buttonsForWordsForCheck[i];

        // Получаем отдельный ответ
        let userAnswer = userAnswers[i];

        // Вешаем обработчик событий для конопок
        buttonForWordForCheck.addEventListener(`click`, function(){
            // Если правильно то контейнер становится зелённым
            if(userAnswer.value == testWord.word){
                containerOfWord.classList.add("right");
                containerOfWord.classList.remove("wrong");
            }else{ // Иначе становится красным
                containerOfWord.classList.remove("right");
                containerOfWord.classList.add("wrong");
            }
        });
    };
    // Функция для окончания повторения
    endTest();
};

// функция для окончания повторения
function endTest(){
    // Находим кнопку
    let endButton = document.querySelector(`.end`);
    
    // Добавляем обработчик событий
    endButton.addEventListener(`click`, function(){
        // Очищаем поле
        testSpace.innerHTML = 'пока что пусто :(';

        // Очищаем массив слов для проверки, чтобы не добавлялись одни и теже слова несколько раз
        wordsForTest = [];

        // Объявляем функцию начала тестирования
        startTest();

        // Делаем слова с переводом обратно видимыми
        container.classList.remove(`text-none`);
    });
};