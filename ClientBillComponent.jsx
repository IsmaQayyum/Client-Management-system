import React, { useState, useEffect } from "react";
import axios from "axios";

function ClientBillComponent({ clientId, serviceCheckboxes }) {
  const defaultAmounts = {
    audit: "0",
    MonthlySaleTaxRetrn: "0",
    fbr: "0",
    pra: "0",
    srb: "0",
    iata: "0",
    pseb: "0",
    kpra: "0",
    bra: "0",
    pec: "0",
    wht: "0",
    dts: "0",
    secp: "0"
  };

  const getInitialBillData = () => {
    try {
      const savedBill = localStorage.getItem(`billData-${clientId}`);
      return savedBill
        ? JSON.parse(savedBill)
        : {
            amounts: { ...defaultAmounts },
            totalAmount: 0,
            receivedAmount: "0",
            balance: 0,
            receivedDate: ""
          };
    } catch (error) {
      console.error("❌ Error parsing local storage data:", error);
      return {
        amounts: { ...defaultAmounts },
        totalAmount: 0,
        receivedAmount: "0",
        balance: 0,
        receivedDate: ""
      };
    }
  };

  const [billData, setBillData] = useState(getInitialBillData());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [billId, setBillId] = useState(null);

  // Simple client ID validation (without mongoose)
  const isValidClientId = (id) => {
    return id && id.length === 24 && /^[0-9a-fA-F]+$/.test(id);
  };

  useEffect(() => {
    if (!clientId) {
      console.warn("⚠️ clientId is undefined! Skipping API request.");
      return;
    }

    console.log("🔍 Fetching or creating bill for clientId:", clientId);

    axios
      .get(`http://localhost:5000/api/client-bills/${clientId}`) // ✅ FIXED API ROUTE
      .then((res) => {
        if (res.data && res.data._id) {
          setBillId(res.data._id);
          setBillData((prevData) => {
            const updatedData = {
              ...prevData,
              ...res.data, // ✅ Update all fields directly
              receivedAmount: res.data.receivedAmount || "0",
              receivedDate: res.data.receivedDate || "",
            };
            localStorage.setItem(`billData-${clientId}`, JSON.stringify(updatedData));
            return updatedData;
          });
        } else {
          console.error("❌ No _id returned from API.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching or creating bill:", err.response?.data || err.message);
      });
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData((prevData) => {
      const updatedAmounts = { ...prevData.amounts, [name]: value };
      const newTotal = Object.values(updatedAmounts).reduce(
        (acc, val) => acc + (parseFloat(val) || 0),
        0
      );
      return {
        ...prevData,
        amounts: updatedAmounts,
        totalAmount: newTotal,
        balance: newTotal - parseFloat(prevData.receivedAmount || 0)
      };
    });
  };

  const handleReceivedAmountChange = (e) => {
    const value = e.target.value;
    setBillData((prevData) => ({
      ...prevData,
      receivedAmount: value,
      balance: prevData.totalAmount - (parseFloat(value) || 0)
    }));
  };

  const handleDateChange = (e) => {
    setBillData((prevData) => ({
      ...prevData,
      receivedDate: e.target.value
    }));
  };

  const saveBill = async () => {
    try {
      if (!clientId) {
        alert("⚠️ Client ID is missing!");
        return;
      }

      const payload = {
        clientId,
        amounts: billData.amounts,
        totalAmount: billData.totalAmount,
        receivedAmount: billData.receivedAmount || "0",
        balance: billData.balance || 0,
        receivedDate: billData.receivedDate || "",
      };

      let res;
      if (billId) {
        console.log("📝 Updating existing bill:", billId);
        res = await axios.put(`http://localhost:5000/api/client-bills/${billId}`, payload);
      } else {
        console.log("📌 Creating a new bill...");
        res = await axios.post(`http://localhost:5000/api/client-bills`, payload);
      }

      if (res.status === 200 || res.status === 201) {
        alert("✅ Bill saved successfully!");
        if (res.data.bill) {
          setBillId(res.data.bill._id); // ✅ ENSURE BILL ID UPDATES
          setBillData(res.data.bill);
          localStorage.setItem(`billData-${clientId}`, JSON.stringify(res.data.bill));
        }
      }
    } catch (error) {
      console.error("❌ Error saving bill:", error.response?.data || error.message);
    }
  };
  return (
    <div className="container mt-4">
   

      {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Open Bill Form"}
          </button>
        </div>
      ) : (
        <div className="card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Client Bill Form</h4>
          
          </div>

          <div className="row">
            {Object.keys(billData.amounts).map((key) => (
              <div className="col-md-4 mb-3" key={key}>
                <label className="form-label">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="number"
                  name={key}
                  value={billData.amounts[key] || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  disabled={serviceCheckboxes && serviceCheckboxes[key.toLowerCase()] === "no"}
                />
              </div>
            ))}
          </div>

          <div className="row mt-3">
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Total Amount</label>
              <input
                type="text"
                className="form-control"
                value={billData.totalAmount.toLocaleString()}
                readOnly
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Received Amount</label>
              <input
                type="number"
                className="form-control"
                value={billData.receivedAmount}
                onChange={handleReceivedAmountChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Balance</label>
              <input
                type="text"
                className="form-control"
                value={billData.balance.toLocaleString()}
                readOnly
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">Received Date</label>
              <input
                type="date"
                className="form-control"
                value={billData.receivedDate || ""}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="text-center mt-3 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={saveBill}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Bill"}
            </button>
       
          <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default ClientBillComponent;