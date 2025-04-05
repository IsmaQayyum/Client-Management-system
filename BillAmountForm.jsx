import React, { useState, useEffect } from "react";
import axios from "axios";

function BillAmountForm({ companyId, checkboxes }) {
  const getInitialBillData = () => {
    try {
      const savedBill = localStorage.getItem(`billData-${companyId}`);
      return savedBill
        ? JSON.parse(savedBill)
        : {
            amounts: {
              Audit: "0",
              MonthlySaleTaxRetrn: "0",
              Fbr: "0",
              Pra: "0",
              Srb: "0",
              Iata: "0",
              Pseb: "0",
              Kpra: "0",
              Bra: "0",
              Pec: "0",
              Wht: "0",
              Dts: "0",
              Secp: "0"
            },
            totalAmount: 0,
            receivedAmount: "0",
            balance: 0,
            receivedDate: "",
          };
    } catch (error) {
      console.error("❌ Error parsing local storage data:", error);
      return {};
    }
  };

  const [billData, setBillData] = useState(getInitialBillData());
  const [billId, setBillId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const saveBill = async () => {
    try {
      if (!billId) {
        console.warn("⚠️ No bill ID found. Creating a new bill...");
  
        const newBillRes = await axios.post(`http://localhost:5000/api/bills`, { companyId });
  
        if (newBillRes.data && newBillRes.data.bill) {
          setBillId(newBillRes.data.bill._id);
        } else {
          alert("Failed to create a bill. Please try again.");
          return;
        }
      }
  
      // 🔹 Ab update request send karain
      const response = await axios.put(`http://localhost:5000/api/bills/${billId}`, {
        amounts: billData.amounts,
        totalAmount: billData.totalAmount,
        receivedAmount: billData.receivedAmount,
        balance: billData.balance,
        receivedDate: billData.receivedDate,
      });
  
      console.log("✅ Bill updated:", response.data);
    } catch (error) {
      console.error("❌ Error saving bill:", error);
    }
  };
  

  
  useEffect(() => {
    if (!companyId) {
      console.warn("⚠️ companyId is undefined! Skipping API request.");
      return;
    }
  
    const fetchBill = async () => {
      try {
        console.log(`📡 Fetching bill for companyId: ${companyId}`);
        const res = await axios.get(`http://localhost:5000/api/bills/${companyId}`);
  
        if (res.data && res.data.bill) {
          setBillId(res.data.bill._id);
          setBillData((prevData) => {
            const updatedData = {
              ...prevData,
              ...res.data.bill,
              receivedAmount: res.data.bill.receivedAmount || "0",
              receivedDate: res.data.bill.receivedDate || new Date().toISOString(),
            };
            localStorage.setItem(`billData-${companyId}`, JSON.stringify(updatedData));
            return updatedData;
          });
        } else {
          console.warn("⚠️ No existing bill found. Creating a new one...");
  
          // 🔹 Agar bill nahi mila to auto-create karein
          const newBillRes = await axios.post(`http://localhost:5000/api/bills`, { companyId });
  
          if (newBillRes.data && newBillRes.data.bill) {
            setBillId(newBillRes.data.bill._id);
            setBillData((prevData) => {
              const updatedData = {
                ...prevData,
                ...newBillRes.data.bill,
                receivedAmount: "0",
                receivedDate: new Date().toISOString(),
              };
              localStorage.setItem(`billData-${companyId}`, JSON.stringify(updatedData));
              return updatedData;
            });
          } else {
            console.error("❌ Failed to create a new bill.");
            alert("Error creating a new bill. Please try again.");
          }
        }
      } catch (err) {
        console.error("❌ Error fetching bill:", err.response?.data || err.message);
        alert("An error occurred while fetching the bill.");
      }
    };
  
    fetchBill();
  }, [companyId]);
  
  
  

  const handleInputChanged = (e) => {
    const { name, value } = e.target;

    // Prevent changes if the field is disabled
    if (checkboxes?.[name.toLowerCase()] === "no") return;

    setBillData((prevData) => {
      const updatedAmounts = { ...prevData.amounts, [name]: value };
      const newTotal = Object.values(updatedAmounts).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      return {
        ...prevData,
        amounts: updatedAmounts,
        totalAmount: newTotal,
        balance: newTotal - parseFloat(prevData.receivedAmount || 0),
      };
    });
  };

  const handleReceivedAmountChange = (e) => {
    const value = e.target.value;
    setBillData((prevData) => ({
      ...prevData,
      receivedAmount: value,
      balance: prevData.totalAmount - (parseFloat(value) || 0),
    }));
  };
 
  
  

  return (
    <div className="container mt-4">
      {!showForm ? (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Open Bill Form
          </button>
        </div>
      ) : (
        <div className="card p-4">
          <h4 className="text-center mb-3">Company Bill Form</h4>
          <div className="row">
            {Object.keys(billData.amounts).map((key) => (
              <div className="col-md-4 mb-3" key={key}>
                <label className="form-label">{key.replace(/([A-Z])/g, " $1")}:</label>
                <input
  type="text"
  name={key}
  value={billData.amounts[key] || "0"}
  onChange={handleInputChanged}
  className="form-control"
  disabled={checkboxes?.[key.toLowerCase()] === "no"}
  // Normalize key case
/>

              </div>
            ))}
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Total Amount:</label>
              <input type="text" name="totalAmount" value={billData.totalAmount.toFixed(2)} readOnly className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Received Amount:</label>
              <input type="text" name="receivedAmount" value={billData.receivedAmount || "0"} onChange={handleReceivedAmountChange} className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Balance:</label>
              <input type="text" name="balance" value={billData.balance.toFixed(2)} readOnly className="form-control" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Received Date:</label>
              <input type="date" name="receivedDate" value={billData.receivedDate || ""} onChange={(e) => setBillData(prev => ({ ...prev, receivedDate: e.target.value }))} className="form-control" />
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-success me-2" onClick={saveBill}>Save Bill</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillAmountForm;
