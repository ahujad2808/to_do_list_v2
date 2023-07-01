const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("list", listSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    Item.find({}).then(function(findItem){
        if( findItem.length === 0 ){
            Item.insertMany(defaultItems).then(function(){
                console.log("Successfully inserted");
            });
            res.redirect("/");
        }
        else{
            res.render("list", { listTitle: "Today", newlistitems: findItem });
        }  
    });

});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).then(function(foundList){
        if(foundList === null){
            const list = new List({
                name: customListName,
                items: defaultItems
            });
        
            list.save();
            res.redirect(customListName);
        }
        else{
            console.log(foundList);
            console.log("Exists!");
            res.render("list", {listTitle: foundList.name, newlistitems: foundList.items})
        }
        
    })

    
})

app.post("/", function (request, response) {
    var itemName = request.body.newItem;
    const listName = request.body.button;
    console.log(itemName + listName);
    const item = new Item({
        name: itemName
    });
    if( listName === "Today"){
        item.save();
        response.redirect("/")

    }else{
        List.findOne({name: listName}).then(function(foundList){
            console.log(foundList.items);
            foundList.items.push(item);
            foundList.save();
            response.redirect("/" + listName);
        });
    }
      
})

app.post("/delete", function(req, res){
    const CheckedItemID = (req.body.checkbox);
    const listName = req.body.listName;

    if( listName === "Today" ){
        Item.findByIdAndRemove(CheckedItemID).then(function(itrm){
            console.log("item deleted successfully");
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: CheckedItemID}}}).then(function(){
            res.redirect("/" + listName);
        });
    }
    
})


app.listen(3000 || process.env.PORT, function () {
    console.log("listening on port 3000");
});