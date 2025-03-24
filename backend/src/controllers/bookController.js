import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";

// create a book
export const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Books with pagination => infinite loading
export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();
    
    const books = await Book.find()
      .sort({ createdAt: -1 }) // descending order
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    res.send({
        books,
        currentPage: page,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error getting books", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        // check if book is not found
        if(!book) return res.status(404).json({message: "Book not found"});

        // check if user is the owner of the book   
        if(book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Unauthorized"});
        }

        // delete image from cloudinary as well
        if(book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }

        await book.deleteOne();

        res.status(200).json({message: "Book deleted successfully"});
    } catch (error) {
        
    }
};

// Get recommendation books
export const getUserBooks = async (req, res) => {
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});

        res.status(200).json(books);
    } catch (error) {
        console.log("Error getting books", error);
        res.status(500).json({message: "Internal server error"});
    }
};


