import {Server} from 'socket.io';
import http from 'http';
import express from "express";
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

import cors from 'cors';


const app=express()
const server=http.createServer(app);
// const io=new Server(server,{
//     cors:{
//         // origin:"http://13.201.133.79:3000",
//         origin:"http://localhost:3000",
//         // origin:"https://new-thread-proj-1.onrender.com/api",
//         methods:["GET","POST"],
//     },
// })   

const io = new Server(server, {
    cors: {
        origin: true, // Allow any origin
        methods: ["GET", "POST", "PUT","DELETE"], // Specify the allowed HTTP methods
    },
});

app.use(cors({
    origin: true, // Allow any origin
    methods: ['GET', 'POST', 'PUT','DELETE'], // Specify the allowed HTTP methods
  }));


export const getRecipientSocketId=(recipientId)=>{
    return userSocketMap[recipientId];   
}


const userSocketMap={}; //userId:socketId 

io.on("connection",(socket)=>{
    console.log("user connected",socket.id);
    const userId=socket.handshake.query.userId; 
   
    if(userId !="undefined") userSocketMap[userId]=socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); //[1,2,3,4]

    socket.on("markMessagesAsSeen",async({conversationId,userId})=>{
        try{
    await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}});
    await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}});
    io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})
        }catch(error){
            console.log(error)
        }
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,server,app};