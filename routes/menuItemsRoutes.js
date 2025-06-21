const express = require('express');
const router = express.Router();

//import menuitem schema model
const menuItem = require('../models/menuItem');
const { model } = require('mongoose');


//POST route to add a menuItem
router.post('/', async(req, res) => {
  try {
    const data = req.body;
    //create a new menuitem document using mongoose model
    const newMenuItem = new menuItem(data);

    //save the new menuitem to the database
    const response = await newMenuItem.save();
    console.log('data saved');
    res.status(200).json(response);
    


  } catch (error) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
    
  }
});

//Get method to get the menuitem
router.get('/', async (req, res) =>{
  try {
    const data = await menuItem.find();
    console.log('data fetched');
    res.status(200).json(data);
    
  } catch(err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
    
  }
});

//parameterized url
router.get('/:taste', async (req, res) =>{
  try {
    const taste = req.params.taste;
    if(taste == 'sweet' || taste == 'spicy' || taste == 'sour'){
      const response = await menuItem.find({taste: taste});
      console.log('taste response fatched');
      res.status(200).json(response);
      
    }else{
      res.status(404).json({error: 'invalid taste'});
    }



  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

// update method for menuitem
router.put('/:id', async (req, res) =>{
  try {
    const menuId = req.params.id;
    const menuUpdatedData = req.body;
    const response = await menuItem.findByIdAndUpdate(menuId, menuUpdatedData, {
      new: true,
      runValidators: true
    });

    if(!response){
      res.status(404).json({error: 'item not found'});
    }

    console.log('data updated');
    res.status(200).json(response);
    
    




  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});


// delete method
router.delete('/:id', async (req, res) =>{
  try {
    const menuId = req.params.id;
    const response = await menuItem.findByIdAndDelete(menuId);

    if(!response){
      res.status(404).json({error: 'person not found'});

    }

    console.log('Data deleted');
    res.status(200).json({message: 'data deleted successfully'});
    




  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'internal server error'});
  }
});

module.exports = router;