const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add', (req, res) =>{
  res.render('notes/newNote')
});

router.post('/notes/newNote', async (req, res) =>{
  const {title, description} = req.body;
  const errors = [];
  if(!title){
    errors.push({text: 'Please Write a Title'});
  }
  if(!description){
    errors.push({text: 'Please Write a Description'})
  };
  if(errors.length > 0){
    res.render('notes/newNote',{
      errors,
      title,
      description
    })
  }else{
    const newNote = new Note({title, description});
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully')
    res.redirect('/notes')
  }
});

router.get('/notes', (req, res) =>{
  Note.find().sort({date: 'desc'})
    .then(items =>{
      const context = {
        notes: items.map( item => {
          return{
            title: item.title,
            description: item.description,
            _id: item._id
          }
        })
      }
      res.render('notes/allNotes', {notes: context.notes});
    })
});

router.get('/notes/edit/:id',(req, res) => {
 Note.findById(req.params.id)
  .then(item => {
      const contexto = {
          title: item.title,
          description: item.description,
          _id: item._id
      }
      console.log(contexto._id)
      res.render('notes/editNote.hbs', {note: contexto})
  })
})

router.put('/notes/editNote/:id', async(req, res) => {
  const {title, description} = req.body;
  await Note.findByIdAndUpdate(req.params.id,{title, description})
  req.flash('success_msg', 'Note Updated Successfully')
  res.redirect('/notes')
 })

 router.delete('/notes/delete/:id', async(req, res) =>{
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Delete Successfully')
  res.redirect('/notes')
 })
module.exports = router;