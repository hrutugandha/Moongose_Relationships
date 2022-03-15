const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect MongoDB

const connect = () => {
  //mongodb url
  return mongoose.connect("mongodb://localhost:27017/test");
};

// create Schema - basically a structure of our document
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Model
const User = mongoose.model("user", userSchema);

const authorSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, // createdAt, updatedAt
  }
);

const Author = mongoose.model("Author", authorSchema);

const sectionSchema = mongoose.Schema({
  genres: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
});

const Section = mongoose.model("Section", sectionSchema);

const bookSchema = mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

bookAuthorSchema = mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
});

const BookAuthor = mongoose.model("BookAuthor", bookAuthorSchema);

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();

    return res.status(200).send({ users: users }); // []
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong .. try again later" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// body => req.body
// url => req.params
// query string => req.query


app.get("/users/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).lean().exec();
      // db.users.findOne({_id: Object('622893471b0065f917d24a38')})
  
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.patch("/users/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
      // db.users.update({_id: Object('622893471b0065f917d24a38')}, {$set: {req.body}})
  
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  
app.delete("/users/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id).lean().exec();
      // db.users.deleteOne({_id: Object('622893471b0065f917d24a38')})
  
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

// books CRUD
app.get("/books", async (req, res) => {
    try {
      const books = await BookAuthor.find().lean().exec();
  
      return res.status(200).send(books);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.get("/books", async (req, res) => {
    try {
      const books = await Section.find().lean().exec();
  
      return res.status(200).send(books);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  app.get("/books/:authorid", async (req, res) => {
    try {
      const post = await Section.findById(req.params.authorid).lean().exec();
  
      return res.status(200).send(post);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  app.patch("/books/:id", async (req, res) => {
    try {
      const post = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
  
      return res.status(200).send(post);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  app.delete("/books/:id", async (req, res) => {
    try {
      const post = await Book.findByIdAndDelete(req.params.id).lean().exec();
  
      return res.status(200).send(post);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

app.listen(4321, async () => {
  try {
    await connect();
    console.log("listening at 4321");
  } catch (e) {
    console.log(e);
  }
});
