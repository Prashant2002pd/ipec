const mongoose = require('mongoose');
require('dotenv').config()
// Connect to MongoDB
mongoose.connect(process.env.DB_PASS);

// Define schemas
const AchievementsSchema=new mongoose.Schema({
    // Schema definition here
    team_id:String,
    team_name:String,
    img_id:String,
    event_name: String,
    discription: String,
    date:Date
})

const TeamSchema=new mongoose.Schema({
    // Schema definition here
    team_name:String,
    img_id:String,
    achievements: [{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'AchievementsSchema'
    }]
})

const Achievements=mongoose.model("Achievements",AchievementsSchema);
const Team=mongoose.model("Team",TeamSchema);

module.exports={
    Achievements,
    Team
}

