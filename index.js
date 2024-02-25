const express = require('express');
const bodyParser = require('body-parser');
const {Achievements,Team} = require("./DB");
const { default: mongoose } = require("mongoose");
const app = express();

const PORT=3000;
app.use(express.json());

app.get('/get/achievements',(req,res)=>{
    Achievements.find({})
        .then((data) =>{
            let arr=data.sort(function(a, b) {
                return a.team_name.localeCompare(b.team_name)
            });
            res.status(200).json(arr);
        })
})

app.post('/post/achievements',async(req,res) => {
    const team_id=Math.floor(Math.random()*100000)
    const team_name= req.body.team_name;
    const img_id= req.body.image_id;
    const discription= req.body.discription;
    const date= new Date().toISOString().slice(0,10);  //YYYY-MM-DD
   const team=await Achievements.create({
        team_id,
        team_name,
        img_id,
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
                    res.send('Achievement added successfully!')
                }) 
                
            })
        }   
    });   

});

app.put('/put/achievements/:id',async(req,res)=>{
    const id=req.params.id;
    const { team_name, image_id, achievements } = req.body;
    try {
        const updatedAchievement = await Achievements.findOneAndUpdate({team_id:id}, { team_name, img_id:image_id, achievements });
        const updatedTeam = await Team.findOneAndUpdate({achievements:updatedAchievement._id}, { team_name, img_id:image_id});
        res.json({
            msg:"Successfully updated the Achievements",
        });
    } catch (err) {
        res.status(404).json({ message: 'Team not found' });
    }
    
})

app.delete('/delete/achievements/:id',(req,res)=>{
    const id = req.params.id;
    Achievements.findOneAndDelete({team_id:id})
    .then(()=>{
        res.json("Deleted Successfully");
    })
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});