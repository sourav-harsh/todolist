
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// date module
 // const date = require(__dirname + '/date.js');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin_Sourav:29012001Sourav@cluster0.zgo5g.mongodb.net/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name:String
}

const Item =mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name:"Welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit the + button to add the new item."
});


const item3 = new Item({
  name:"<-- Hit this to delete the item."
});

const defaultItems = [item1,item2,item3];

const listSchema ={
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", (req, res) => {

//use "getDate" to get full day and date formate in the place of "getDay" in the line 20.

// let day = date.getDate();



Item.find({},function(err, foundItems){

  if (foundItems.length === 0) {

    Item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully Added the items in DB");
      }
    });
    res.redirect("/")
  }else{
    res.render("list", {listTitle: "Today", newListItems:foundItems});
  }
});
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;


  List.findOne({name:customListName},function(err, foundList){
    if(!err){
      if(!foundList){
    const list = new List({
      name: customListName,
      items:defaultItems
    });
    list.save();
    res.render("/" + customListName);
      }else{
    res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
      }
    }
  });
});

app.post("/",function(req,res){
const itemName = req.body.newItem;
  const listName = req.body.list;

const item = new Item({
  name:itemName
});


if(listName === "Today"){
item.save();
res.redirect("/");
}else{
  List.findOne({name:listName },function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  });
}
// if(req.body.list === "Work"){
//   workItems.push(item);
//   res.redirect("/work")
// }else{
//   items.push(item);
// res.redirect("/");
// }

});

app.post("/delete",function(req,res){
const checkedItemsId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemsId,function(err){
    if(!err){
      console.log("Successfully removed the checked items");
      res.redirect("/");
    }
  })
});


app.get("/work", function(req,res){
  res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.post("/work", function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port== null|| port == "") {
  port=3000;
}
app.listen(port);

app.listen(port, function(){
  console.log("Server started on port 3000.");
});
