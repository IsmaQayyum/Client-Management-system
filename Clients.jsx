import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Clients() {
    const { id } = useParams(); // Company ID from URL
    const [clients, setClients] = useState([]);
    const [message, setMessage] = useState(null);
    const [clientData, setClientData] = useState({ name: '' });

    useEffect(() => {
        if (!id) {
            console.error("Error: Company ID is missing in URL");
            return;
        }

        fetch(`http://localhost:5000/api/clients/company/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Clients Data:", data);
                if (Array.isArray(data)) {
                    setClients(data);
                    localStorage.setItem(`clients_${id}`, JSON.stringify(data)); // ✅ Store in localStorage
                } else {
                    setClients([]);
                }
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                const cachedClients = localStorage.getItem(`clients_${id}`);
                if (cachedClients) {
                    setClients(JSON.parse(cachedClients)); // ✅ Load from localStorage if fetch fails
                }
            });
    }, [id]);

    const handleChange = (e) => {
        setClientData({ ...clientData, [e.target.name]: e.target.value });
    };

    const addClient = async () => {
        if (!id) {
            console.error("Error: Company ID is missing!");
            return;
        }
        if (clientData.name.trim() === "") {
            console.error("Error: Client name cannot be empty!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/clients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyId: id,
                    name: clientData.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Error Response:", errorData);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("New Client Added:", responseData);

            // ✅ Ensure correct data structure
            const newClient = responseData.client || responseData;
            setClients([...clients, newClient]);
            setClientData({ name: '' });

            // ✅ Show success message
            showMessage("Client added successfully!", "success");

            // ✅ Redirect to Client Details page
            window.location.href = `/client-details/${newClient._id}?name=${encodeURIComponent(newClient.name)}`;

        } catch (error) {
            console.error("Error adding client:", error);
            showMessage("Error adding client. Please check the console for details.", "danger");
        }
    };

    const deleteClient = async (clientId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/clients/${clientId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setClients(clients.filter(client => client._id !== clientId));
                showMessage("Client deleted successfully!", "success");
            } else {
                console.error("Failed to delete client, status:", response.status);
                showMessage("Error deleting client!", "danger");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            showMessage("Error deleting client!", "danger");
        }
    };

    const showMessage = (msg, type) => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };


    return (
        <div className="container mt-4">
    {message && <div className={`alert alert-${message.type} text-center`}>{message.text}</div>}

    <h2 className="mb-3 text-primary text-center">Clients List</h2>

    {/* Input Field and Button (Full Width on Small Screens) */}
    <div className="row mt-3">
        <div className="col-md-8 col-12 mb-2">
            <input
                type="text"
                className="form-control"
                placeholder="Client Name"
                name="name"
                value={clientData.name}
                onChange={handleChange}
            />
        </div>
        <div className="col-md-4 col-12">
            <button className="btn btn-success w-100" onClick={addClient}>Add Client</button>
        </div>
    </div>

    {/* Clients List */}
    <ul className="list-group mt-3">
        {Array.isArray(clients) && clients.length > 0 ? (
            clients.map((client) => (
                <li key={client._id} className="list-group-item d-flex flex-wrap justify-content-between align-items-center">
                    <div className="flex-grow-1">
                        <h5 className="mb-0">{client.name}</h5>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to={`/client-details/${client._id}`} className="btn btn-info btn-sm">
                            Details
                        </Link>
                        <button className="btn btn-danger btn-sm w-100" onClick={() => deleteClient(client._id)}>
                            Delete
                        </button>
                    </div>
                </li>
            ))
        ) : (
            <li className="list-group-item text-center">No clients found.</li>
        )}
    </ul>
</div>

    );
}

export default Clients;
