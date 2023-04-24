/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const myuri = process.env.MONGO_URI ;
mongoose.connect(myuri , { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema ; 

let bookSchema = Schema({
  comments : [String],
  title : { type : String , required : true },
  commentcount : Number
},{
  versionKey: false
})

let Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      const books = await Book.find({});

      if(books.length === 0){
        res.json('no book exists');
      }
      else{
      const filBooks = books.map((book)=>{
        return {
          title : book.title,
          _id : book._id,
          commentcount : book.commentcount
        }
      })

      res.json(filBooks);
      }
      
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if(!title){

        res.send('missing required field title');
      }
      else{

        let object = new Book({
          title,
          commentcount : 0
        });

        object.save();
        
        res.json({
          _id : object._id,
          title : object.title
        })
      }
      
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      
     Book.deleteMany({});
      
      res.json('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
    
      const theBook = await Book.findById(bookid);

      if(!theBook){
        res.json('no book exists');
      }
      else{
        
      res.json({
        title : theBook.title,
        _id : theBook._id,
        comments : theBook.comments 
      });
      }
 
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'    
      const theBook = await Book.findById(bookid);

      if(!theBook){
        res.json('no book exists');
      }
      else{

      theBook.deleteOne();  
      res.json('complete delete successful');
      }
    });
  
};
