const {initializeDatabase} = require("./db/db.connect")
const express = require("express")

const app = express()
const Book = require("./models/books.models");

app.use(express.json())


initializeDatabase();

//To create a new book data in the books Database. 

async function createBook(newBook){
    try{
    const books = new Book(newBook)
    const savedBook = await books.save()
    return savedBook
} catch(error){
    throw error
}
}

app.post("/books", async (req, res) =>{ 
    try{
        const savedBook = await createBook(req.body)
        res.status(201).json({message: "Book added successfully.", book: savedBook})

    }catch(error){
        console.error("Error while adding book:", error);
        res.status(500).json({error: "Failed to add book."})
    }
})


//API to get all the books in the database. 

async function readAllBooks(){
    try{
        const allBooks = await Book.find()
        return allBooks
    } catch(error){
        throw error
    }
}

//readAllBooks()


app.get("/books", async (req, res) => {
    try{
    const books = await readAllBooks()
    if(books.length != 0){
        res.json(books)
    } else {
        res.status(404).json({error: "Book not found."})
    }
    } catch(error){
        res.status(500).json({error: "Unable to fetch books."})
    }
})




//To get a book's detail by its title.

async function readBookByTitle(bookTitle){
    try{
    const book = await Book.find({ title: bookTitle })
    return book
} catch(error){
    throw error
}
}

// readBookByTitle("Shoe Dog")

app.get("/books/:title", async (req, res) => {
    try{
        const book = await readBookByTitle(req.params.title)
        if (book) {
            res.json(book);
          } else {
            res.status(404).json({ error: "Book not found." });
          }
    } catch(error){
        res.status(500).json({ error: "Failed to fetch book." });
    }
})


//To get details of all the books by an author.

async function readBookByAuthor(bookAuthor){
    try{
    const book = await Book.find({ author: bookAuthor })
    return book
    } catch(error){
        throw error
    }
}

//readBookByAuthor("Phil Knight")


app.get("/books/bookAuthor/:author", async (req, res) =>{
    try{
        const book = await readBookByAuthor(req.params.author)
        if(book){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({ error: "Failed to fetch book." });
    }
})


//To get all the books which are of "Business" genre

async function readBookByGenre(bookGenre){
    try{
        const book = await Book.find({genre: bookGenre})
        return book
    } catch(error){
        throw error
    }
}

//readBookByGenre("Business")

app.get("/books/bookGenre/:genre", async (req, res) => {
    try{
        const book = await readBookByGenre(req.params.genre)
        if(book){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

// To get all the books which was released in the year 2012.

async function readBookByReleasedYear(bookReleasedYear){
    try{
        const book = await Book.find({publishedYear: bookReleasedYear})
        return book
    }catch(error){
        throw error
    }
}

//readBookByReleasedYear(2012)

app.get("/books/bookReleasedYear/:releasedYear", async (req, res) => {
    try{
        const book = await readBookByReleasedYear(req.params.releasedYear)
        if(book){
        res.json(book)
     }else{
        res.status(404).json({error: "No book found."})
     }
    } catch(error){
        res.status(500).json({error: "Unable to fetch book."})
    }
})


//API to update a book's rating with the help of its id.

async function updateBookRatingById(bookId, dataToUpdate){
    try{
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
    return updatedBook
    } catch(error){
        throw error
    }
} 

// updateBookRatingById("679a977a65cc013123bcf816",{rating: 4.5})

app.post("/books/:bookId", async (req, res) => {
    try{
    const updatedBook = await updateBookRatingById(req.params.bookId, req.body)
    if(updatedBook){
        res.status(203).json({message: "Book updated successfully.", updatedBook: updatedBook})
    } else {
        res.status(404).json({error: "No book found"})
    }
    }catch(error){
        res.status(500).json({error: "Failed to update book."})
    }
})


//API to update a book's rating with the help of its title.

async function UpdateBookByTitle(bookTitle, dataToUpdate){
    try{
        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return updatedBook
    } catch(error){
        throw error
    }
}

//UpdateBookByTitle("Shoe Dog",{ rating: 4.2})


app.put("/books/:bookTitle", async (req, res) => {
    try{
        const updatedBook = await UpdateBookByTitle(req.params.bookTitle, req.body)
        console.log(updatedBook)
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.", updatedBook})
        } else {
            res.status(404).json({error: "No book found"})
        }
    } catch(error){
        res.status(500).json({error: "Failed to update book."})
    }
})


async function deleteBook(bookId){
    try{
    const deletedBook = await Book.findByIdAndDelete(bookId)
    return deleteBook
    } catch(error){
        throw error
    }
}

//deleteBook("679a97ac65cc013123bcf818")

app.delete("/books/:bookId", async (req, res) => {
    try{
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(203).json({message: "Book deleted successfully."})
        } else{
            res.status(404).json({error: "Book not found."})
        }

    } catch(error){
        res.status(500).json({error: "Unable to fetch data."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Connected to port: ${PORT}`)
})
