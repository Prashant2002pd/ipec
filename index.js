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

app.post('/post/achievements', (req,res) => {
    const team_id= req.body.team_id;
    const team_name= req.body.team_name;
    const img_id= req.body.image_id;
    const discription= req.body.discription;
    const date= new Date().toISOString().slice(0,10);  //YYYY-MM-DD
    Achievements.create({
        team_id,
        team_name,
        img_id,
        discription,
        date
    })
    
        res.status(200).json({
            msg:"Achievement created"
        });

})

app.put('/put/achievements/:id"',(req,res)=>{
    const id=req.params.id;
    
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});