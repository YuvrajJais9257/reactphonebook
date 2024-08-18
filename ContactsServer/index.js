const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const password = process.env.MONGODBPASSWORD;
const PORT = process.env.PORT || 3001;

if (!password) {
  console.log("MONGODBPASSWORD environment variable is required");
  process.exit(1);
}

if (!PORT) {
  console.log("PORT environment variable is required");
  process.exit(1);
}

console.log("Password:", password);
console.log("Port:", PORT);

const url = `mongodb+srv://EvilEyed2k23:${password}@cluster0.cpcfgzg.mongodb.net/contactsApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).send("Something went wrong");
});

// let contacts=[
//     {
//         id:"1",
//         name:"John Doe",
//         number:"1234567890",
//         faviourate:false,
//         block:false
//     },
//     {
//         id:"2",
//         name:"Jane Doe",
//         number:"0987654321",
//         faviourate:false,
//         block:false
//     },
//     {
//         id:"3",
//         name:"Alice",
//         number:"1234567890",
//         faviourate:false,
//         block:false
//     }
// ];

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  faviourate: Boolean,
  block: Boolean,
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/contacts", (req, res) => {
  res.send("<h1>Welcome to Contacts App</h1>");
});

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/contacts/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  //   const contact = contacts.find((contact) => contact.id === id);
  //   if (contact) {
  //     res.json(contact);
  //   } else {
  //     res.status(404).end();
  //   }
  try {
    const contact = await Contact.findById(id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/api/contacts", async (req, res) => {
  //   const contact = req.body;
  //   const ids = contacts.map((note) => note.id);
  //   const maxId = Math.max(...ids);
  //   const newContact = {
  //     id: (maxId + 1).toString(),
  //     name: contact.name,
  //     number: contact.number,
  //     // important:Boolean(note.important)||false,
  //     faviourate: Boolean(contact.faviourate) || false,
  //     // complete:Boolean(note.complete)||false
  //     block: Boolean(contact.block) || false,
  //   };
  //   contacts = [...contacts, newContact];
  //   console.log(contact);

  //   res.status(201).json(newContact);
  const { name, number, faviourate = false, block = false } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and Number are required" });
  }
  try {
    const existingContact = await Contact.findOne({ number });
    if (existingContact) {
      return res.status(400).json({
        error:
          "Contact with the same number already exists. Please provide a new contact.",
      });
    }

    const newContact = new Contact({
      name,
      number,
      faviourate,
      block,
    });
    const savedContact = await newContact.save();
    console.log("Contact saved:", savedContact);
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.delete("/api/contacts/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  //   contacts = contacts.filter((contact) => contact.id !== id);
  //   res.status(204).end();
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.patch("/api/contacts/:id", async (req, res) => {
  const id = req.params.id;
  const updatedContact = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid note ID format" });
  }
  //   let contactFound = false;
  //   contacts = contacts.map((contact) => {
  //     if (contact.id === id) {
  //       contactFound = true;
  //       return { ...contact, ...updatedContact };
  //     }
  //     return contact;
  //   });
  //   if (contactFound) {
  //     res.json(contacts.find((contact) => contact.id === id));
  //   } else {
  //     res.status(404).send({ error: "Contact not found" });
  //   }
  try {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
      runValidators: true,
    });
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).send({ error: "Contact not found" });
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
