const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const app = express();
app.use(express.static("public"));
var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    
    let day = date.getDate();


    // var currentday = today.getDay();
    // var day = "";
    // switch (currentday) {
    //     case 0:
    //         day = "Sunday"; break;
    //     case 1:
    //         day = "Monday"; break;
    //     case 2:
    //         day = "tuesday"; break;
    //     case 3:
    //         day = "Wednesday"; break;
    //     case 4:
    //         day = "Thursday"; break;
    //     case 5:
    //         day = "Friday"; break;
    //     case 6:
    //         day = "Saturday"; break;
    //     default:
    //         console.log("Invalid--------" + currentday);
    // }


    res.render("list", { listTitle: day, newlistitems: items });

});



app.post("/", function (request, response) {
    var item = request.body.newItem;
    if( request.body.button === 'Work List' ){
        workItems.push(item);
        response.redirect("/work");
    }
    else{
        items.push(item);
        response.redirect("/");
    }
    
})

app.get("/work", function(request, response){
    response.render("list", {listTitle: 'Work List', newlistitems: workItems});
})


app.listen(3000 || process.env.PORT, function () {
    console.log("listening on port 3000");
});