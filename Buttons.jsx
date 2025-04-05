import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api/buttons";

function Buttons({ companyId: propCompanyId, onServiceStatusChange }) {
  const { id: urlCompanyId } = useParams();
  const companyId = propCompanyId || urlCompanyId;
  const [activeGroup, setActiveGroup] = useState(null);

  const [companyData, setCompanyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [checkboxes, setCheckboxes] = useState({});

  if (!companyId) {
    console.error("❌ Error: companyId is missing in Buttons component.");
    return <p>Error: Company ID is missing in the URL.</p>;
  }

  const groups = ["audit", "MonthlySaleTaxRetrn", "fbr", "pra", "srb", "iata", "pseb", "kpra", "bra", "pec", "wht"];
  useEffect(() => {
    if (companyId && activeGroup) {
      axios
        .post(`${API_BASE_URL}/createOrFetch`, { // ✅ Fix endpoint here
          companyId, 
          group: activeGroup
        })
        .then((response) => {
          if (response.data.message === "Button fetched successfully" || response.data.message === "Button created successfully") {
            setCompanyData((prevData) => ({
              ...prevData,
              [activeGroup]: response.data.button.data || {},
            }));
          } else {
            console.error("❌ Error: Data fetch unsuccessful.");
          }
        })
        .catch((error) => {
          console.error("❌ API Error:", error);
        });
  
      const savedCheckboxes = localStorage.getItem(`checkboxes_${companyId}`);
      setCheckboxes(savedCheckboxes ? JSON.parse(savedCheckboxes) : {});
    }
  }, [companyId, activeGroup]); 
  

  const handleSave = async () => {
    if (!activeGroup) {
        alert("Please select a group first.");
        return;
    }

    const currentData = companyData[activeGroup] || {}; // Ensure it's an object

    try {
        const response = await axios.put(`${API_BASE_URL}/update`, {
            companyId,
            group: activeGroup,
            data: currentData, // ✅ Now it saves all button data, including empty audit
        });

        if (response.status === 200 && response.data.message === "Button updated successfully") {
            alert("✅ Data saved successfully!");
            setIsEditing(false);
        } else {
            alert("❌ Failed to save data. Please try again.");
        }
    } catch (error) {
        console.error("❌ Error saving data:", error.response ? error.response.data : error.message);
        alert(`Error: ${error.response ? error.response.data.message : "Something went wrong!"}`);
    }
};


  

  
  
  const handleCheckboxChange = (group, value) => {
    setCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev, [group]: value };
      localStorage.setItem(`checkboxes_${companyId}`, JSON.stringify(updatedCheckboxes));
      return updatedCheckboxes;
    });

    if (typeof onServiceStatusChange === "function") {
      setTimeout(() => {
        onServiceStatusChange((prevStatuses) => ({ ...prevStatuses, [group]: value }));
      }, 0);
    }
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [activeGroup]: {
        ...prevData[activeGroup],
        [key]: value,
      },
    }));
  };


  

  return (
    <div className="container">
    <table className="table">
  <tbody>
    {groups.reduce((rows, _, index) => {
      if (index % 4 === 0) {
        rows.push(
          <tr key={index}>
            {groups.slice(index, index + 4).map((grp) => (
              <td key={grp} className="text-center">
                <div className="button-container">
                  {/* Group Button */}
                  <button
                    className={`btn btn-primary group-button ${checkboxes[grp] === "no" ? "disabled-button" : ""}`}
                    onClick={() => setActiveGroup(grp)}
                    disabled={checkboxes[grp] === "no"}
                  >
                    {grp.toUpperCase()}
                  </button>

                  {/* Checkbox Options */}
                  <div className="checkbox-group">
                    <label className="checkbox-label mx-2">
                      <input
                        type="checkbox"
                        checked={checkboxes[grp] === "yes"}
                        onChange={() => handleCheckboxChange(grp, "yes")}
                      /> ✔️ Yes
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={checkboxes[grp] === "no"}
                        onChange={() => handleCheckboxChange(grp, "no")}
                      /> ❌ No
                    </label>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        );
      }
      return rows;
    }, [])}
  </tbody>
</table>

{activeGroup !== null &&  (
  <div className="form-container">
    <h2>{activeGroup.toUpperCase()} Form</h2>
    <form>
      <div className="row">
        {"reg id pin password email mobile".split(" ").map((key) => (
          <div className="col-md-4 form-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="text"
              name={key}
              value={companyData[activeGroup]?.[key] || ""}
              onChange={(e) => {
                if (isEditing) {
                  setCompanyData((prevData) => ({
                    ...prevData,
                    [activeGroup]: { 
                      ...prevData[activeGroup], 
                      [e.target.name]: e.target.value 
                    },
                  }));
                }
              }}
              className="form-control"
              placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              disabled={!isEditing} // ✅ Prevents editing if `isEditing` is false
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="row mt-2">
        <div className="col-4">
          <button 
            type="button" 
            onClick={handleSave} 
            className="btn btn-success w-100"
            disabled={!isEditing} // ✅ Prevents saving when not in edit mode
          >
            Save
          </button>
        </div>
        <div className="col-4">
          <button 
            type="button" 
            onClick={() => setIsEditing(!isEditing)} 
            className={`btn w-100 ${isEditing ? "btn-secondary" : "btn-warning"}`}
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>
        </div>
        <div className="col-4">
          <button 
            type="button" 
            onClick={() => setActiveGroup(null)} 
            className="btn btn-danger w-100"
          >
            Close
          </button>
        </div>
      </div>
    </form>
  </div>
)}

    </div>
  );
}

export default Buttons;