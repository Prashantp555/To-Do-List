const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://Prashantp:Test01@cluster0.koxdefa.mongodb.net/ToDoDB",{useNewUrlParser:true});


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const ToDoSchema=new mongoose.Schema({
  item:String
});

const Item=mongoose.model("Item",ToDoSchema);

const listsSchema = new mongoose.Schema({
  name:String,
  items:[ToDoSchema]
});
const List=mongoose.model("List",listsSchema);
const day = date.getDate();

app.get("/", function(req, res) {


Item.find({},function(err,foundItem){
  res.render("list", {listTitle: day, newListItems: foundItem});
});
// Item.insertMany(defaultItem,function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Item added successfully");
//   }
// });

  

});

app.post("/", function(req, res){

  const listName=req.body.list;
  const item=new Item({
    item: req.body.newItem
  });
  if(listName===day){
    item.save();
  res.redirect("/");
  }
  else{
    List.findOne({name: listName}, function(err,foundList){
      console.log(foundList);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
  
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  setTimeout(function(){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully deleted item");
      res.redirect("/");
    }
  });
},1000);
});

app.get("/:listTitle",function(req,res){
  const listTitle = req.params.listTitle;
  List.findOne({name:listTitle},function(err,foundList){
    if(!err){
      if(!foundList){
        const list=new List({
          name: listTitle,
          items: req.body.newItem
        });
        list.save();
        res.redirect("/"+listTitle);
      }
      else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList});
      }
    }
    
  });
});

// app.post("/:listTitle",function(req,res){
  
//   redirect("/:listTitle");
// });


app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});   
