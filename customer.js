const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/customerdb",{useNewUrlParser:true,useUnifiedTopology: true});
const conn=mongoose.connection;
const customerSchema=new mongoose.Schema({
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


const customer=mongoose.model('customer',customerSchema);
module.exports=customer;