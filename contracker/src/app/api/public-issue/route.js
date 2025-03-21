import { dbConnect } from "@/lib/dbConnect";
import Issue from "@/Models/Issue";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: "dt1cqoxe8",
  api_key: "736378735539485",
  api_secret: "iJfGZ2TqF348thygERO5RzVgjpM",
});

export async function POST(req) {
    try {
      await dbConnect();
      console.log("Incoming POST request");
  
      const formData = await req.formData();
      const body = {};
  
      // Convert FormData to an object
      formData.forEach((value, key) => {
        if (key === "image" && value instanceof Blob) {
          body.image = value;
        } else {
          body[key] = value;
        }
      });
  console.log("receivrd body:",body)
      // Debugging: Log raw location
      console.log("Raw location:", body.location);
      
  

      // Ensure location is properly parsed
      if (body.location) {
        try {
          body.location = JSON.parse(body.location);

     
          
  
          // Ensure lat and lng exist
          if (!body.location.lat || !body.location.lng) {
            throw new Error("Missing lat or lng in location data");
          }
  
          // Convert lat/lng to numbers
        //   body.location.lat = parseFloat(body.location.lat);
        //   body.location.lng = parseFloat(body.location.lng);
  
          console.log("Parsed location:", body.location);
     
        } catch (error) {
          console.error("Error parsing location:", error);
          return NextResponse.json({ error: "Invalid location format" }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: "Location is required" }, { status: 400 });
      }
  
      // Upload image if provided
      let imageUrl = null;
      if (body.image) {
        const buffer = await body.image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const dataUri = `data:${body.image.type};base64,${base64Image}`;
  
        const uploadedResponse = await cloudinary.v2.uploader.upload(dataUri, {
          folder: "contracker",
        });
        imageUrl = uploadedResponse.secure_url;
      }
  
      const newIssue = new Issue({
        userId: new mongoose.Types.ObjectId(body.userId), 
        issue_type: body.issue_type,
        description: body.description,
        date_of_complaint: body.date_of_complaint,
        placename: body.placename,
        location: body.location,
        approval: parseInt(body.approval, 10),
        denial: parseInt(body.denial, 10),
        status: body.status,
        image: imageUrl,
      });
  
      await newIssue.save();
  
      return NextResponse.json(
        { message: "Issue created successfully", issue: newIssue },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating issue:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }


export async function GET(){
    try{
    const issues=await Issue.find({status:"Pending"})
    return NextResponse.json({issues:issues},{status:200})
    }
    catch{
        return NextResponse.json({error:"error getting issues"},{status:500})
    }
}
  