const express=require("express");
const cors=require("cors");
const morgan=require("morgan");
const app=express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

let contacts=[
    {
        id:"1",
        name:"John Doe",
        number:"1234567890",
        faviourate:false,
        block:false
    },
    {
        id:"2",
        name:"Jane Doe",
        number:"0987654321",
        faviourate:false,
        block:false
    },
    {
        id:"3",
        name:"Alice",
        number:"1234567890",
        faviourate:false,
        block:false
    }
];

app.get("/contacts",(req,res)=>{
    res.send("<h1>Welcome to Contacts Server</h1>");
});

app.get("/api/contacts",(req,res)=>{
    res.json(contacts);
});

app.get('/api/contacts/:id',(req,res)=>{
    const id=req.params.id
    const contact=contacts.find(contact=>contact.id===id)
    if(contact){
        res.json(contact)
    }
    else{
        res.status(404).end()
    }
})
app.post('/api/contacts',(req,res)=>{
    const contact=req.body
    const ids=contacts.map(note=>note.id)
    const maxId=Math.max(...ids)
    const newContact={
        id:(maxId+1).toString(),
        name:contact.name,
        number:contact.number,
        // important:Boolean(note.important)||false,
        faviourate:Boolean(contact.faviourate)||false,
        // complete:Boolean(note.complete)||false
        block:Boolean(contact.block)||false
    }
    contacts=[...contacts,newContact]
    console.log(contact);
    
    res.status(201).json(newContact)
})
app.delete('/api/contacts/:id',(req,res)=>{
    const id=req.params.id
    contacts=contacts.filter(contact=>contact.id!==id)
    res.status(204).end()
})
app.patch('/api/contacts/:id',(req,res)=>{
    const id=req.params.id
    const updatedContact=req.body;
    let contactFound=false;
    contacts=contacts.map(contact=>{
        if(contact.id===id){
            contactFound=true;
            return {...contact,...updatedContact}
        }
        return contact
    })
    if(contactFound){
        res.json(contacts.find(contact=>contact.id===id))
    }
    else{
        res.status(404).send({ error: "Contact not found" });
    }
})

const PORT = 3007
app.listen(PORT)
console.log(`Server running on port ${PORT}`)