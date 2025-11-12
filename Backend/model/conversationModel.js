import mongoose, { Schema } from "mongoose";

const conversationSchema = new mongoose.Schema({

    members: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    membersUsernames: [{type: String}]

},{timestamps:true})

export default mongoose.model("Conversations", conversationSchema )

