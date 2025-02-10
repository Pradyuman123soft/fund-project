"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDB"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// export const initiate = async (amount, to_username, paymentform) => {
//     await connectDB();
//     var instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_KEY_ID, key_secret: process.env.KEY_SECRET })

//     let options = {
//         amount: Number.parseInt(amount),
//         currency: "INR",
//     }
//     let x = await instance.orders.create(options)

//     // create a payment object which shows a pending payment in the database
//     await Payment.create({oid: x.id, amount: amount, to_user: to_username, name: paymentform.name, message: paymentform.message})
//     return x;
// }

export const initiate = async (amount, to_username, paymentform) => {
    try {
        await connectDB();
        let user = await User.findOne({username: to_username})
        let secret = user.razorpaySecret
        var instance = new Razorpay({ key_id: user.razorpayId, key_secret: secret });

        let options = {
            amount: Number.parseInt(amount) * 100,  // Convert rupees to paise
            currency: "INR",
        };
        let x = await instance.orders.create(options);

        // create a payment object which shows a pending payment in the database
        await Payment.create({oid: x.id, amount: amount, to_user: to_username, name: paymentform.name, message: paymentform.message});
        return x;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};


// export const fetchuser = async (username)=>{
//     await connectDB();
//     let u = await User.findOne({username: username})
//     let user = u.toObject({flattenObjectIds: true});
//     return user
// }

// export const fetchuser = async (username) => {
//     await connectDB();
//     let u = await User.findOne({ username: username });

//     if (!u) {
//         return null; // Handle the case where the user is not found
//     }

//     // Convert the Mongoose document to a plain JavaScript object
//     let user = u.toObject();

//     // If you need to convert ObjectId fields to strings, you can do this manually
//     user._id = user._id.toString();

//     return user;
// };

// lets perform full crud operation in dashboard
export const createOrUpdateUser = async (data) => {
    const session = await getServerSession(authOptions);
    await connectDB();
    if(!session) return {error : "user unauthorized"};

    const { name, username, profilepic, coverpic, razorpayId, razorpaySecret } = data;
    const email = session.user.email;

    let user = await User.findOne({ email });
    if (user) {
        user.name = name;
        user.username = username;
        user.profilepic = profilepic;
        user.coverpic = coverpic;
        user.razorpayId = razorpayId;
        user.razorpaySecret = razorpaySecret;
        await user.save();
    }else{
        user = await User.create({ name, email, username, profilepic, coverpic, razorpayId, razorpaySecret })
    }
    return {success : "user Data saved" , user};
}

// lets fetch the data of user
export const getUser = async () =>{
    const session = await getServerSession(authOptions);
    await connectDB();
    if(!session) return null;

    const user = await User.findOne({ email: session.user.email }).lean(); // Convert Mongoose object to plain JSON
  return JSON.parse(JSON.stringify(user)); // Ensure it's a plain object
}

export const deleteUser = async () => {
    const session = await getServerSession(authOptions);
    await connectDB();

    if(!session) return { error : "unauthorized user"}
    await User.findOneAndDelete({ email: session.user.email });
    return { success : "User deleted successfull "}
}


export const fetchpayments = async (username)=>{
    await connectDB();
    // find all payments sorted by decreasing order of amount
    let p = await Payment.find({to_user: username, done: true}).sort({amount: -1}).limit(5).lean()
    return p
}

// export const updateProfile = async(data, fullName)=>{
//     await connectDB();
//     let ndata = JSON.parse(JSON.stringify(data));
//     // lets check the username is available
//     if (fullName !== ndata.name) {
//         let u = await User.findOne({name: ndata.name})
//         if (u) {
//             return {error : "username is not avaliable"}
//         }
//     }
//     await User.updateOne({email: ndata.email, username:ndata.username}, ndata);
//     return {success: true}
// }