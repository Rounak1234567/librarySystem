const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());


const connect = ()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/librarySystem2")
}


// Step-1 - Create schema for section


const sectionSchema = new mongoose.Schema({
    section_name : {type : String, required : true}
});



// Step-2 - Connect the schema to section collection


const Section = mongoose.model("section", sectionSchema);



// Step-3 - Create schema for books

const bookSchema = new mongoose.Schema({
    name:{type:String, required:true},
    body:{type:String, required:true},
    section_name:{type : mongoose.Schema.Types.ObjectId, ref : "section", required : true}
})


// Step-4 - Connect the schema to books collection

const Book = mongoose.model("book", bookSchema);


// Step-5 - Create schema for author

const authorSchema = new mongoose.Schema({
    author_name:{type:String, required:true}
})

// Step-6 - Connect the schema to authors collection

const Author = mongoose.model("author", authorSchema)


// Step-7 - Create schema for book author

const bookAuthorSchema = new mongoose.Schema({
    book_id:{type : mongoose.Schema.Types.ObjectId, ref:"book", required:true},
    author_id:[{type : mongoose.Schema.Types.ObjectId, ref:"author", required:true}]
})

// Step-8 - Connect the Schema to bookAuthors collection

const BookAuthor = mongoose.model("bookAuthor", bookAuthorSchema)


// Step-9 - Create schema for user

const usersSchema = new mongoose.Schema({
    name:{type:String, required:true}
})


// Step-10 - Connect the Schema to user collection

const Users = mongoose.model("user", usersSchema)



// Step-11 - Create schema for checked_out

const checkedoutSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    book_id:{type : mongoose.Schema.Types.ObjectId, ref:"book", required:true},
    checkedOutTime:{type:String, required:false, default:null},
    checkedInTime:{type:String, required:false, default:null},
})


// Step-12 - Connect the Schema to checked_out collection

const Checkedout = mongoose.model("checkedout", checkedoutSchema)




//----------------CRUD API for Section-----------------------

app.post("/section", async (req, res)=>{
    const sec = await Section.create(req.body)

    return res.status(201).send({sec})
});

app.get("/section", async (req,res)=>{
    const sec = await Section.find().lean().exec();
    res.status(200).send({sec})
});



//----------------CRUD API for Books-----------------------


app.post("/book", async (req, res)=>{
    const book = await Book.create(req.body)

    return res.status(201).send({book})
});

app.get("/book", async (req,res)=>{
    const book = await Book.find().populate("section_name").lean().exec()
    res.status(200).send({book})
});


app.get("/book/:id", async(req, res)=>{
    const book = await Book.findById(req.params.id).lean().exec();
    res.status(200).send({book})
});



//----------------CRUD API for Authors-----------------------


app.post("/author", async (req, res)=>{
    const author = await Author.create(req.body)

    return res.status(201).send({author})
});

app.get("/author", async (req,res)=>{
    const author = await Author.find().lean().exec();
    res.status(200).send({author})
});


//----------------CRUD API for bookAuthor-----------------------

app.post("/bookauthor", async(req,res)=>{
    const bookauthor = await BookAuthor.create(req.body);
    return res.status(201).send({bookauthor})
})
app.get("/bookauthor", async (req,res)=>{
    const bookauthor = await BookAuthor.find().populate("author_id").populate("book_id").lean().exec();
    res.status(200).send({bookauthor})
});


//----------------CRUD API for users-----------------------

app.post("/users", async(req,res)=>{
    const users = await Users.create(req.body);
    return res.status(201).send({users})
})
app.get("/users", async (req,res)=>{
    const users = await Users.find().lean().exec();
    res.status(200).send({users})
});

//----------------CRUD API for checked_out-----------------------

app.post("/co", async(req,res)=>{
    const co = await Checkedout.create(req.body);
    return res.status(201).send({co})
})
app.get("/co", async (req,res)=>{
    const co = await Checkedout.find().lean().exec();
    //console.log(co[0].checkedOutTime)
    res.status(200).send({co})
});





//-----------------All books written by an Author------------------

app.get("/booksbyauthor/:id", async(req, res)=>{
    /*const bookauthor = await BookAuthor.find().lean().populate("author_id").populate("book_id").exec();
    let match = [];
    //console.log(bookauthor[0].author_id[0].author_name)
    //console.log(req.params.id)
    for(let i = 0; i < bookauthor.length; i++){
        //console.log(bookauthor[i])
        for(let j = 0; j < bookauthor[i].author_id.length; j++){
            //console.log(bookauthor[i].author_id[j]._id)
            if(bookauthor[i].author_id[j]._id == req.params.id){
                //console.log(req.params.id)
                match.push(bookauthor[i].book_id);
            }
        }
    }
    return res.send(match)*/
    const match = await BookAuthor.find({author_id:req.params.id}).lean().populate("book_id").exec();
    res.send(match)
})


app.listen(2345, async (req,res)=>{
    await connect();
    console.log("Listening to port 2345");
});