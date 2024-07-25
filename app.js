import dotenv from 'dotenv';

dotenv.config();

import express from "express" ;
import bodyParser from "body-parser";
import mongoose  from "mongoose" ;
import _ from "lodash";


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

  await mongoose.connect(process.env.URL);
  

const todoSchema = {
  name:String
}

const todo = mongoose.model("Todo",todoSchema);

const todo1 = new todo({
  name:"Welcome to TODO LIST"

});

const todo2 = new todo({
  name:"Hit + button for adding"

});

const defaulttodo= [todo1,todo2]

const listSchema = {
  name:String,
  items:[todoSchema]
}

const List =mongoose.model("List",listSchema);

app.get('/work',function(req,res){
  res.render('index', {
    Da: "Work",
    New: work
 });
});

app.get('/', async  (req, res)  => {

  try {
    const todos =  await todo.find();
    if(todos.length === 0){
      await todo.insertMany(defaulttodo);
      res.redirect("/");
    }
    else{
      res.render('index', { Da: "Today", New: todos });
    }
    
} catch (err) {
    console.error("Error finding TODO:", err);
    res.status(500).send("Internal Server Error");
}
  
});

app.post('/', async (req, res)=> {
  var  ItemName = req.body.input; // Update global variable
  var  list=req.body.button;
  const item = new todo({
    name: ItemName
  })

  if (list==="Today"){
   item.save();
   res.redirect('/')
  }
  else{
    var check = await List.findOne({name:list});
    check.items.push(item)
    check.save();
    res.redirect('/'+list)
  }
    
});

app.post("/delete",async(req,res)=>{
  const checkID = req.body.checkbox;
  const listID =req.body.listname;

  if (listID==="Today"){
    await todo.findByIdAndDelete(checkID)
    res.redirect('/');
  }

  else{
     await List.findOneAndUpdate({name:listID} ,{$pull:{items:{_id: checkID}}}
);

     res.redirect('/'+listID)

    }
  }
 
);

app.get("/:customerName",async(req,res)=>{
  const customer= _.capitalize(req.params.customerName);

 const checkDB= await List.findOne({ name: customer })

 if (!checkDB){
  var list = new List({
    name:customer,
    items:defaulttodo
  })
  list.save();
  res.redirect('/'+customer)
 }
  
  else{
  res.render("index",{ Da:checkDB.name, New: checkDB.items })
  }

});

app.post('/work',function(req,res){

});

app.listen(process.env.PORT, function() {
   console.log("Server started on port 2000");
});





// tzTMyFvi6AA794Ak