import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

let app=express();
app.use(cors({origin: process.env.FRONT_END_URL,
    credentials: process.env.BACKEND_PORT,
}))

app.use(express.json());

const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE);


app.get("/products/view-all/:category",async(req,res)=>{

    const {category}= req.params;


    const {data,error}=await supabase.from("products").select("*").eq("product_category",category);


    if(data){
        return res.json({data:data,success:true, message: "Data is retrieved successfully"});
    }

    if(error){
        return res.json({data,success:true, message: error.message});
    }

   

})

app.get("/products/view-all",async(req,res)=>{
    const {data,error}=await supabase.from("products").select("*")

    if(data){
        return res.json({data:data,success:true, message: "Data is retrieved successfully"});
    }
    if(error){
        return res.statusCode(500).json({data: null, success:false,message: error.message});
    }
})


app.post("/products/create",async(req,res)=>{
    const products=req.body;

    const {data,error}=await supabase.from("products").insert(products).select("id");

    if(data){
        return res.json({data,success:true, message: "Data is retrieved successfully"});
    }
    if(error){
        return res.statusCode(500).json({success:false, data: [],message: error.message});
    }

})


app.get("/products/view-one/:id",async(req,res)=>{
    const {id}=req.params;

    const {data,error}=await supabase.from("products").select(`*,product_owners(*)`).eq("id",id).maybeSingle();

    if(data){
        return res.json({data,success:true, message: "Data is retrieved successfully"});
    }
    if(error){
        return res.status(500).json({success:false, data: [],message: error.message});
    }

})





app.post("/owners/create",async(req,res)=>{

    console.log("OWNERS ");
    const owners=req.body;

    console.log("OWNERS ",owners);
    const {data,error}=await supabase.from("product_owners").insert(owners).select("id");

    if(data){
        return res.json({data: [],success:true, message: "Owner created successfully"});
    }
    if(error){

        return res.status(500).json({data: [],success:false, message:error.message});
    }
})


app.get("/owners/get",async(req,res)=>{


    const {data,error}=await supabase.from("product_owners").select("id");

    if(data){
        return res.json({data});
    }


})

app.listen(4242,()=>console.log("server is running on port "+process.env.BACKEND_PORT))
