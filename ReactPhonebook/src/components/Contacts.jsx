import React, { useState } from "react";
import "./Contacts.css";
import { Button } from "react-bootstrap";

const Contacts = ({
  contacts,
  markAsFaviourate,
  blockNumber,
  deleteNumber,
  unblockNumber,
  unmarkAsFaviourate,
}) => {
  const [searchContact, setSearchContact] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const handleSearchContact = (e) => {
    setSearchContact(e.target.value);
  };

  const getContactStyle = (contact) => {
    if (contact.block) {
      return { backgroundColor: "#f8d7da", color: "#721c24" };
    } else if (contact.faviourate) {
      return { backgroundColor: "#d4edda", color: "#155724" };
    }
    return {};
  };

  const filteredContacts = searchContact
    ? contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchContact.toLowerCase())
      )
    : contacts;

  const handleSortContact = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "default" ? "faviourate" : "default"
    );
  };

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortOrder === "faviourate") {
      if (a.faviourate && !b.faviourate) return -1;
      if (!a.faviourate && b.faviourate) return 1;
    }
    if (a.block && !b.block) return 1;
    if (!a.block && b.block) return -1;
    return 0;
  });

  return (
    <div className="contacts-sub-container">
      <h1 className="contacts-headings-top">Contacts</h1>
      <div className="contact-search-input-and-sort-btn-container">
        <input
          style={{ borderRadius: "5px", backgroundColor: "#ddd" }}
          className="contact-input"
          type="text"
          placeholder="Search by name..."
          value={searchContact}
          onChange={handleSearchContact}
        />
        <Button onClick={handleSortContact} style={{ marginLeft: "10px" }}>
          {sortOrder === "default" ? "Sort by Importance" : "Sort by Default"}
        </Button>
      </div>

      {sortedContacts.map((contact, index) => (
        <div className="contact-container" key={index}>
          <h3>Name</h3>
          <h5
            style={{
              margin: "5px 0",
              padding: "5px",
              borderRadius: "5px",
              ...getContactStyle(contact),
            }}
          >
            {contact.name}
          </h5>
          <h3>Phone</h3>
          <p>{contact.phone}</p>
          <div className="button-group">
            <Button
              style={{ marginRight: "10px" }}
              className="block-btn"
              variant="dark"
              // onClick={() => blockNumber(index)}
              onClick={() =>
                contact.block
                  ? unblockNumber(contact._id)
                  : blockNumber(contact._id)
              }
            >
              <img
                // src="https://cdn-icons-png.flaticon.com/128/2550/2550431.png"
                src={
                  contact.block
                    ? "https://cdn-icons-png.flaticon.com/128/3076/3076198.png"
                    : "https://cdn-icons-png.flaticon.com/128/2550/2550431.png"
                }
                width="30px"
                height="24px"
                alt="block-icon"
              />
              {contact.block ? "Unblock" : "Block"}
            </Button>
            <Button
              style={{ marginRight: "10px" }}
              className="faviourate-btn"
              variant="dark"
              // onClick={() => markAsFaviourate(index)}
              onClick={() =>
                contact.faviourate
                  ? unmarkAsFaviourate(contact._id)
                  : markAsFaviourate(contact._id)
              }
            >
              <img
                // src="https://cdn-icons-png.flaticon.com/128/1040/1040230.png"
                src={
                  contact.faviourate
                    ? "https://cdn-icons-png.flaticon.com/128/13906/13906281.png"
                    : "https://cdn-icons-png.flaticon.com/128/1040/1040230.png"
                }
                width="30px"
                height="24px"
                alt="faviourate"
              />
              {contact.faviourate ? "UnMark" : "Mark"} as Faviourate
            </Button>
            <Button
              style={{ marginRight: "10px" }}
              className="delete-btn"
              variant="dark"
              onClick={() => deleteNumber(contact._id)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/6711/6711573.png"
                alt="delete-icon"
                width="30px"
                height="24px"
              />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contacts;
