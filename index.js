let express = require(`express`);
let app = express();
let axios = require(`axios`);
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})



// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/english');

// Схема слов
let wordsSchema = new mongoose.Schema({
    word: String,
    translate: String,
    isRepeate: Boolean,
});

let Words = mongoose.model('words', wordsSchema);

// Раздача статики
app.use(express.static(`public`));

// Получение данных в json
app.use(express.json());

// Получение всех слов
app.get(`/words/all`, async function(req, res){
    // Нахождение в бд
    let words = await Words.find();
    // Отправка во фронтовую часть
    res.send(words);
})

// Создание нового слова
app.post(`/words/create`, function (req, res) {
    // Получаем из формы данные
    let word = req.body.word; // Само слово на английском
    let translate = req.body.translate; // Перевод этого слова

    // Создание нового слова в бд:
    // Проверка на наличие обоих данных
    if(!word || !translate){
        // Ошибка в случее если форма заполнена не полностью
        res.send('error')

    }else{
        // Создание нового экземпляра по схеме Words
        let newword = new Words({
            word: word,
            translate: translate,
            isRepeate: false // По умолчанию слово не нуждается в повторение пользователем
        })
        
        // Сохранение в бд нового слова
        newword.save();
        // Отправка нового слова
        res.send(newword);
    };
    
});

// Удаление слова
app.post(`/words/remove`, async function (req, res) {
    // Получение id в бд
    let id = req.body.id;

    // Удаление в бд по id
    await Words.deleteOne({_id: id});

    // Отправка удачного статуса
    res.sendStatus(200);
});

// Обработка слов и их чекбоксов для повторения
app.post(`/words/repeate`, async function (req, res) {
    // Получение id
    let id = req.body.id;
    // Получение статуса кнопки
    let checkButton = req.body.checkButton;

    // Нахождение слова в бд
    let word = await Words.findOne({_id: id});

    // Проверка
    if(checkButton == 'on'){
        // Если чекбокс отмечен то повторение true
        word.isRepeate = true;
    }else if(checkButton == 'of'){
        // Если не отмечен то повторение false
        word.isRepeate = false;
    };
    
    // Сохранение информации в бд
    word.save();

    res.sendStatus(200);
});