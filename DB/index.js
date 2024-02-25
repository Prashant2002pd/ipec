const mongoose = require('mongoose');
// Connect to MongoDB
mongoose.connect('mongodb+srv://prashant2002singh:prashantdb123@cluster0.eecayhs.mongodb.net/');

// Define schemas
const AchievementsSchema=new mongoose.Schema({
    // Schema definition here
    team_id:String,
    team_name:String,
    img_id:String,
    event_name: String,
    discription: String,
    Date:Date
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

