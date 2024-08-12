import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Contacts from "./components/Contacts";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

function App() {
	const [contacts, setContacts] = useState([]);
	const [contactName, setContactName] = useState("");
	const [mobileNum, setMobileNum] = useState("");
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		axios
			.get("http://localhost:3007/api/contacts")
			.then((response) => {
				console.log("obtianed response", response);
				setContacts(response.data);
			})
			.catch((error) => {
				alert("There was an error fetching the contacts!", error);
			});
	}, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    const mobileNumPattern = /^\d{10}$/; // Regular expression to check for exactly 10 digits
    if (!mobileNumPattern.test(mobileNum)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    // Proceed with adding the contact
    console.log("Contact added:", { contactName, mobileNum });
    const newContact = {
      name: contactName,
      phone: mobileNum,
      faviourate: false,
      block: false,
    };
    try {
      const existingContactResponse = await axios.get(
        "http://localhost:3007/api/contacts"
      );
      console.log("existingContactResponse", existingContactResponse);
      const existingContactsEntries = existingContactResponse.data;
      const contactExists = existingContactsEntries.some(
        (contact) => contact.phone === mobileNum // Ensure 'contact.phone' matches the structure of your response
      );
      if (contactExists) {
        alert("Contact already exists!");
      } else {
        const response = await axios.post(
          "http://localhost:3007/api/contacts",
          newContact
        );
        console.log("response posted", response);
        setContacts(contacts.concat(response.data));
        setShowForm(false);
        setContactName("");
        setMobileNum("");
      }
    } catch (error) {
      alert("There was an error adding the contact!");
      console.error("Error details:", error);
    }
  };
  

	// const markAsFaviourate = (id) => {
	// 	// const updatedContacts = contacts.map((contact, index) =>
	// 	// 	index === id ? { ...contact, faviourate: true } : contact
	// 	// );
	// 	// setContacts(updatedContacts);
	// 	axios
	// 		.patch(`http://localhost:3007/api/contacts/${id}`, { faviourate: true })
	// 		.then((response) => {
	// 			const updatedContacts = contacts.map((contact) =>
	// 				contact.id === id ? { ...contact, faviourate: true } : contact
	// 			);
	// 			setContacts(updatedContacts);
	// 		})
	// 		.catch((error) => {
	// 			alert("There was an error marking the contact as faviourate!");
	// 			console.error("Error details:", error);
	// 		});
	// };

  const markAsFaviourate = (id) => {
    axios
      .patch(`http://localhost:3007/api/contacts/${id}`, { faviourate: true })
      .then((response) => {
        const updatedContacts = contacts.map((contact) =>
          contact.id === id ? { ...contact, faviourate: true } : contact
        );
        setContacts(updatedContacts);
      })
      .catch((error) => {
        alert("There was an error marking the contact as faviourate!");
        console.error("Error details:", error);
      });
  };
  
	const blockNumber = (id) => {
		// const updatedContacts = contacts.map((contact, index) =>
		// 	index === id ? { ...contact, block: true } : contact
		// );
		// setContacts(updatedContacts);
		axios
			.patch(`http://localhost:3007/api/contacts/${id}`, { block: true })
			.then((response) => {
				const updatedContacts = contacts.map((contact) =>
					contact.id === id ? { ...contact, block: true } : contact
				);
				setContacts(updatedContacts);
			})
			.catch((error) => {
				alert("There was an error blocking the contact!");
				console.error("Error details:", error);
			});
	};

	const deleteNumber = (id) => {
		// const deleteAlert = window.confirm("Are you sure you want to delete it?");
		// if (deleteAlert) {
		// 	const updatedContacts = contacts.filter((_, index) => index !== id);
		// 	setContacts(updatedContacts);
		// }
		const confirmation = window.confirm(
			"Are you sure you want to delete this contact?"
		);
		if (confirmation) {
			axios
				.delete(`http://localhost:3007/api/contacts/${id}`)
				.then((response) => {
					const updatedContacts = contacts.filter(
						(contact) => contact.id !== id
					);
					setContacts(updatedContacts);
				})
				.catch((error) => {
					alert("There was an error deleting the contact!");
					console.error("Error details:", error);
				});
		}
	};

	const unblockNumber = (id) => {
		// const updatedContacts = contacts.map((contact, index) =>
		// 	index === id ? { ...contact, block: false } : contact
		// );
		// setContacts(updatedContacts);
		axios
			.patch(`http://localhost:3007/api/contacts/${id}`, { block: false })
			.then((response) => {
				const updatedContacts = contacts.map((contact) =>
					contact.id === id ? { ...contact, block: false } : contact
				);
				setContacts(updatedContacts);
			})
			.catch((error) => {
				alert("There was an error unblocking the contact!");
				console.error("Error details:", error);
			});
	};

	const unmarkAsFaviourate = (id) => {
		// const updatedContacts = contacts.map((contact, index) =>
		// 	index === id ? { ...contact, faviourate: false } : contact
		// );
		// setContacts(updatedContacts);
		axios
			.patch(`http://localhost:3007/api/contacts/${id}`, { faviourate: false })
			.then((response) => {
				const updatedContacts = contacts.map((contact) =>
					contact.id === id ? { ...contact, faviourate: false } : contact
				);
				setContacts(updatedContacts);
			})
			.catch((error) => {
				alert("There was an error removing the contact from faviourates!");
				console.error("Error details:", error);
			});
	};

	// console.log("contacts", contacts);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
			className="contacts-super-container"
		>
			{contacts.length > 0 ? (
				<div className="contacts-container">
					<Contacts
						contacts={contacts}
						markAsFaviourate={markAsFaviourate}
						blockNumber={blockNumber}
						deleteNumber={deleteNumber}
						unblockNumber={unblockNumber}
						unmarkAsFaviourate={unmarkAsFaviourate}
					/>
					<Button
						style={{ marginTop: "12px" }}
						variant="primary"
						onClick={() => setShowForm(true)}
					>
						Create Contact
					</Button>
				</div>
			) : (
				<div className="contacts-container">
					<Button variant="primary" onClick={() => setShowForm(true)}>
						Create Contact
					</Button>
				</div>
			)}
			{showForm && (
				<div
					className="form-container"
					style={{
						backgroundColor: "#f5f5f5",
						padding: "25px",
						borderRadius: "5px",
					}}
				>
					<Form onSubmit={handleAddContact}>
						<label style={{ fontWeight: "bold" }}>Name</label>
						<input
							style={{
								backgroundColor: "#ddd",
								color: "#000",
								fontWeight: "bold",
							}}
							type="text"
							required
							value={contactName}
							onChange={(e) => setContactName(e.target.value)}
							placeholder="Enter Name"
						/>
						<label style={{ fontWeight: "bold" }}>Mobile</label>
						<input
							style={{
								backgroundColor: "#ddd",
								color: "#000",
								fontWeight: "bold",
							}}
							type="text"
							required
							value={mobileNum}
							onChange={(e) => setMobileNum(e.target.value)}
							placeholder="Enter Number"
						/>
						<Button style={{ marginTop: "25px" }} type="submit">
							Add Contact
						</Button>
					</Form>
				</div>
			)}
		</div>
	);
}

export default App;
