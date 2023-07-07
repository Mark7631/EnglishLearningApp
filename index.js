let express = require(`express`);
let app = express();
let axios = require(`axios`);
let port = 3000;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/english');

let wordsSchema = new mongoose.Schema({
    word: String,
    translate: String,
    isRepeate: Boolean,
});

let Words = mongoose.model('words', wordsSchema);

app.use(express.static(`public`));

app.use(express.json());

app.get(`/words/all`, async function(req, res){
    let words = await Words.find();
    
    res.send(words);
})

app.post(`/words/create`, function (req, res) {
    let word = req.body.word;
    let translate = req.body.translate;

    if(!word || !translate){
        res.send('error')

    }else{
        let newword = new Words({
            word: word,
            translate: translate,
            isRepeate: false
        })
        
        newword.save();

        res.send(newword);
    };
    
});

app.post(`/words/remove`, async function (req, res) {
    let id = req.body.id;

    await Words.deleteOne({_id: id});

    res.sendStatus(200);
});

app.post(`/words/repeate`, async function (req, res) {
    let id = req.body.id;
    let checkButton = req.body.checkButton;
    
    let word = await Words.findOne({_id: id});

    if(checkButton == 'on'){
        word.isRepeate = true;
    }else if(checkButton == 'of'){
        word.isRepeate = false;
    };
    
    word.save();

    res.sendStatus(200);
});
