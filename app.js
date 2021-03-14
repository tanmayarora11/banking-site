const express=require("express");
const mongoose=require("mongoose");

const app = express();
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://tanmay-admin:tanmay123@cluster0.8jdvg.mongodb.net/customerdb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);

var customerSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	Amount:{
		type:Number,
		required:true
	}

});

var Customer = mongoose.model("Customer",customerSchema);

const transactionSchema = mongoose.Schema({
    sendername:{
        type:String,
        required:true
    },
    receivername:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
});

const Transaction = mongoose.model("Transaction",transactionSchema);

const c1 = new Customer({
    name : "Rajat",
    email : "rajat52co@gmail.com",
    Amount : 50000
});

const c2 = new Customer({
    name : "Tanmay",
    email : "tanmayAr@gmail.com",
    Amount : 100000
});

const c3 = new Customer({
    name : "Shivani",
    email : "shivanisingh@yahoo.com",
    Amount : 12000
});

const c4 = new Customer({
    name : "Mohit",
    email : "mohitco19@hotmail.com",
    Amount : 40000
});

const c5 = new Customer({
    name : "Amrita",
    email : "amk2003@gmail.com",
    Amount : 7000
});

const c6 = new Customer({
    name : "Nitya",
    email : "nitya_9034@yahoo.com",
    Amount : 90000
});

const c7 = new Customer({
    name : "Rohit",
    email : "rohittgup9co@gmail.com",
    Amount : 50000
});

const c8 = new Customer({
    name : "Aman Dev",
    email : "aman_dev55co@gmail.com",
    Amount : 15000
});

const c9 = new Customer({
    name : "Kritika",
    email : "krit52co@gmail.com",
    Amount : 500000
});

const c10 = new Customer({
    name : "Nitin",
    email : "bankar75@gmail.com",
    Amount : 10000
});

const defaultItems = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10];

app.get("/",function(req,res){
    res.render("home");
});

app.get("/transferhistory",function(req,res){
Transaction.find({},function(err,transfers){

          res.render("transferhistory",{
              transferList:transfers
          });
    });
	
});

app.get("/customers",function(req,res){
	Customer.find({},function(err,customers){
        if(customers.length === 0){
            Customer.insertMany(defaultItems,function(err){
            if(err)
            {
                console.log(err);
            }
            else console.log("Customers added Successfully ");
        });
            res.redirect("/customers");
        }
        else{
            res.render("customers",{
                customersList:customers
            });
        }  
		
		
	});
       	
});

app.get("/customers/:customerId",function(req,res){
	const id=req.params.customerId;
	Customer.findOne({_id:id},(err,doc)=>{
		res.render("customer",{customer:doc});
	});
});

app.get("/transfer",function(req,res){
	Customer.find({},(err,docs)=>{
	
           res.render("transfer");

	});
	
});
app.post("/transfer",async (req , res) =>{
    try{
      myAccount = req.body.senderId;
      clientAccount = req.body.recieverId;
      transferBal = req.body.amount;
      const transferBalAmt = parseInt(transferBal);
      const firstUser = await Customer.findOne({name: myAccount});
      console.log(firstUser);
      const secondUser = await Customer.findOne({name: clientAccount});
      const thirdOne =  parseInt(secondUser.Amount) + parseInt(transferBal); //Updating Successfully
      const fourthOne = parseInt(firstUser.Amount) - parseInt(transferBal);
      console.log(thirdOne);
      console.log(fourthOne);
      await Customer.findOneAndUpdate( {name : clientAccount} , {Amount : thirdOne});
      await Customer.findOneAndUpdate( {name : myAccount} , {Amount : fourthOne});

      await Transaction.create({sendername:firstUser.name,amount:transferBalAmt,receivername:secondUser.name});
     res.redirect("/customers");
    }
    catch (error) {
        res.status(404).send(error);
     }
     
});

app.listen(process.env.PORT || 3001,(err)=>{
	console.log("server is running");
});