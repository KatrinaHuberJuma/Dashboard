// =============================================
// IMPORTS
// =============================================
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const flash = require('express-flash');
// =============================================
// APP TO USE EXPRESS METHODS
// =============================================
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/static"));
// =============================================
// APP SETTINGS
// =============================================
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// =============================================
// CONNECT TO DATABASE (remember to rename)
// =============================================
mongoose.connect('mongodb://localhost/dragon', {useNewUrlParser: true});
// =============================================
// SCHEMA
// =============================================
const GooseSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2},
    date: {type: Date, default: Date.now}
})


const Goose = mongoose.model('Goose', GooseSchema);

// =============================================
// ROUTES
// =============================================
app.get('/', (request, response) => {
    Goose.find({})
        .then(geese => {
            response.render("index", {geese:geese})
            
        })
        .catch(err => {
                    console.log("We have an error!", err);
                    for (var key in err.errors) {
                        request.flash('registration', err.errors[key].message);
                    }
                    response.send("oopsie boopsie")
                });

});

app.get('/geese/new', (request, response) => {
    response.render("newGoose")  
});

app.post('/geese', (request, response) => {
    const gooseData = request.body;
    Goose.create(gooseData)
        .then(newGoose => {
            response.redirect("/")
        })
        .catch(err => {
            console.log("We have an error!", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.redirect('/');
        });
});


app.get('/geese/:id', (request, response) => {
    var id = request.params.id
    console.log("_________________________")
    console.log(id)
    console.log("_________________________")
    Goose.findOne({_id:id})
        .then(goose => {
            console.log(goose);
            response.render("oneGoose", {goose:goose})
            
        })
        .catch(err => {
                    console.log("We have an error!", err);
                    for (var key in err.errors) {
                        request.flash('registration', err.errors[key].message);
                    }
                    response.send("oopsie boopsie")
                });

});

app.post('/geese/edit/:id', (request, response) => {
    const gooseData = request.body;
    console.log("_________________________")
    console.log(request.body)
    Goose.updateOne({_id:request.params.id}, {$set: {name: gooseData.name}})
        .then( updatedGoose => {
            console.log(updatedGoose)
            response.redirect("/")
        })
        .catch(err => {
            console.log("We have an error!", err);
            for (var key in err.errors) {
                request.flash('registration', err.errors[key].message);
            }
            response.redirect('/');
        });
});

app.listen(8000, () => console.log("listening on port 8000"));