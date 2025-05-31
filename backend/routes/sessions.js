const router=require('express').Router();
const sessions=require('../models/sessions');

router.post('/',async(req,res)=>{
    try {
        const session=new sessions(req.body);
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({error:err.message});
        
    }
})

router.get('/',async(req,res)=>{
    try {
        const sessionsList=await sessions.find().sort({date:-1});
        res.json(sessionsList);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});
// Get a session by ID
router.get('/:id',async(req,res)=>{
    try {
        const session=await sessions.findById(req.params.id);
        if(!session) return res.status(404).json({error:"Session not found"});
        res.json(session);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});
module.exports=router;