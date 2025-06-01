const express = require("express");
const Project = require("../models/projects");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/",async(req,res)=>{
    try {
        const projectsList = await Project.find().sort({ beginDate: -1 });
        res.json(projectsList);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
})
module.exports = router;
