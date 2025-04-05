import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/clients";

const ClientsButton = ({ clientId: propClientId, onServiceChange = () => {} }) => {
  const { id: paramClientId } = useParams();
  const clientId = propClientId || paramClientId;

  const [activeCategory, setActiveCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [checkboxes, setCheckboxes] = useState({});
  
  const defaultData = { reg: "", id: "", pin: "", password: "", email: "", mobile: "" };
  const [clientData, setClientData] = useState(defaultData);

  const categories = ["audit", " MonthlySaleTaxRetrn", "fbr", "pra", "srb", "iata", "pseb", "kpra", "bra", "pec", "wht"];

  useEffect(() => {
    if (!clientId) return;

    const savedCheckboxes = JSON.parse(localStorage.getItem(`services_${clientId}`)) || {};
    const initialCheckboxes = categories.reduce((acc, category) => {
      acc[category] = savedCheckboxes[category] || "yes"; 
      return acc;
    }, {});

    setCheckboxes(initialCheckboxes);
    onServiceChange(initialCheckboxes); // Pass the initial checkboxes to onServiceChange
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      localStorage.setItem(`services_${clientId}`, JSON.stringify(checkboxes));
      onServiceChange(checkboxes);
    }
  }, [checkboxes]);

  const fetchClientData = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/${clientId}/${category}`);
      if (response.data.success) {
        setClientData(response.data.data);
      } else {
        setClientData(defaultData);
      }
    } catch (error) {
      console.error("❌ Error fetching client data:", error);
      setClientData(defaultData);
    }
  };

  const handleClientDataSave = async () => {
    if (!clientId || !activeCategory) {
      alert("⚠️ Missing clientId or category");
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/${clientId}/${activeCategory}`, clientData);
      if (response.data.success) {
        alert(`${activeCategory.toUpperCase()} data saved successfully!`);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("❌ Error saving client data:", err);
    }
  };

  const handleClientDataDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${clientId}/${activeCategory}`);
      setClientData(defaultData);
      alert(`${activeCategory.toUpperCase()} data deleted!`);
    } catch (error) {
      console.error("❌ Error deleting data:", error);
    }
  };

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (category, value) => {
    setCheckboxes((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleButtonClick = (category) => {
    if (checkboxes[category] === "no") return;
    setActiveCategory(category);
    fetchClientData(category);
  };

  return (
    <div className="container mt-4">
      <table className="table table-bordered">
        <tbody>
          {categories.map((category, index) =>
            index % 4 === 0 && (
              <tr key={index}>
                {categories.slice(index, index + 4).map((cat) => (
                  <td key={cat} className="text-center">
                    <div className="checkbox-container">
                      <label className={`checkbox-label ${checkboxes[cat] === "yes" ? "yes-checked" : ""}`}>
                        <input
                          type="checkbox"
                          checked={checkboxes[cat] === "yes"}
                          onChange={() => handleCheckboxChange(cat, "yes")}
                        />
                        ✔️ Yes
                      </label>

                      <label className={`checkbox-label ${checkboxes[cat] === "no" ? "no-checked" : ""} mx-2`}>
                        <input
                          type="checkbox"
                          checked={checkboxes[cat] === "no"}
                          onChange={() => handleCheckboxChange(cat, "no")}
                        />
                        ❌ No
                      </label>
                    </div>

                    {/* ✅ Updated Button with type="button" */}
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => handleButtonClick(cat)}
                      disabled={checkboxes[cat] === "no"}
                    >
                      {cat.toUpperCase()}
                    </button>
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* ✅ Client Form Fields */}
      {activeCategory && (
        <div className="card mt-4 p-3">
          <h5 className="text-primary">{activeCategory.toUpperCase()} Details</h5>
          <div className="row">
            {Object.keys(defaultData).map((key) => (
              <div className="col-md-4 form-group" key={key}>
                <label>{activeCategory.toUpperCase()} {key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="text"
                  name={key}
                  value={clientData[key] || ""}
                  onChange={handleClientChange}
                  disabled={false} // Always enabled

                  className="form-control"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
          </div>

          {/* ✅ Save & Delete Buttons with type="button" */}
          <div className="d-flex justify-content-center mt-3">
          <button 
  type="button" 
  className="btn btn-secondary mx-2" 
  onClick={() => setActiveCategory("")} 
>
  Exit
</button>
            <button 
              type="button" 
              className="btn btn-success mx-2" 
              onClick={handleClientDataSave} 
              disabled={!activeCategory}
            >
              Save 
            </button>


 
           
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsButton;