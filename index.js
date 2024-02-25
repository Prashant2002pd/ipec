const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const {Achievements,Team} = require("./DB");
const { default: mongoose } = require("mongoose");
const app = express();

//const PORT=3000;
app.use(express.json());

//this Middeleware is for checking that date is valid or not
function DateMiddleware(req,res,next){
    let date=req.body.date.split("-");
    const currentdate=new Date();

    if(Number(date[0])>currentdate.getFullYear() && Number(date[1]) > (currentdate.getMonth()+1) && Number(date[2]) > (currentdate.getDate())){
        res.status(400).send({
            error:"date is not valid",
        })
        
    }else{
        next();
    }

}

//get  all achievements
app.get('/get/achievements',(req,res)=>{
    Achievements.find({})
        .then((data) =>{
            let arr=data.sort(function(a, b) {
                return a.team_name.localeCompare(b.team_name)
            });
            res.status(200).json(arr);
        })
})

//add achievement to Achievements and Team table
app.post('/post/achievements',DateMiddleware,async(req,res) => {
    const team_id=Math.floor(Math.random()*100000)
    const team_name= req.body.team_name;
    const img_id= req.body.image_id;
    const event_name=req.body.event_name;
    const discription= req.body.discription;
    const date= req.body.date;  //YYYY-MM-DD
   const team=await Achievements.create({
        team_id,
        team_name,
        img_id,
        event_name,
        discription,
        date
    })

    await Team.findOne({team_name,img_id}).then( (data)=>{
        if(data){
            Team.updateOne({team_name},{
                "$push":{
                    achievements:new mongoose.Types.ObjectId(team._id)
                }
            })
            .then(()=>{
                res.send('Achievement added successfully!')
            })   
        }else{
            Team.create({
                team_name,
                img_id,
                
            }).then(()=>{
                Team.updateOne({team_name},{
                    "$push":{
                        achievements:new mongoose.Types.ObjectId(team._id)
                    }
                }).then(()=>{
                    res.status(200).send('Achievement added successfully!')
                }) 
                
            })
        }   
    });   

});

//Update achievements(only team_name and image_id)
app.put('/put/achievements/:id',async(req,res)=>{
    const id=req.params.id;
    const { team_name, image_id} = req.body;
    try {
        const updatedAchievement = await Achievements.findOneAndUpdate({team_id:id}, { team_name, img_id:image_id});
        const updatedTeam = await Team.findOneAndUpdate({achievements:updatedAchievement._id}, { team_name, img_id:image_id});
        res.status(200).json({
            msg:"Successfully updated the Achievements",
        });
    } catch (err) {
        res.status(404).json({ message: 'Team not found' });
    }
    
})

//Delete achievements
app.delete('/delete/achievements/:id',(req,res)=>{
    const id = req.params.id;
    Achievements.findOneAndDelete({team_id:id})
    .then(()=>{
            res.status(200).json("Deleted Successfully");
        
    })
})




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});