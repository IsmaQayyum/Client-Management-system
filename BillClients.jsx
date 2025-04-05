import React, { useState, useEffect } from "react";
import axios from "axios";

function BillClients({ clientId }) {
  const [billData, setBillData] = useState({
    amounts: {
      taxReturn: "0",
      audit: "0",
      secp: "0",
      salesTax: "0",
      pra: "0",
      bra: "0",
      kpra: "0",
      srb: "0",
      dts: "0",
      iata: "0",
      pseb: "0",
      pec: "0",
    },
    totalAmount: 0,
    paymentData: {
      receivedAmount: "0",
      balance: 0,
      receivedDate: "",
    },
  });

  const [billId, setBillId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    console.log("🔍 Fetching or creating bill for clientId:", clientId);
    axios.get(`http://localhost:5000/api/clientBills/${clientId}`)
      .then((res) => {
        if (res.data && res.data._id) {
          setBillId(res.data._id);
          setBillData(prevData => ({
            ...prevData,
            amounts: res.data.amounts || prevData.amounts,
            totalAmount: res.data.totalAmount || 0,
            paymentData: {
              receivedAmount: res.data.paymentData?.receivedAmount || "0",
              balance: res.data.paymentData?.balance || 0,
              receivedDate: res.data.paymentData?.receivedDate || "",
            }
          }));
        }
      })
      .catch((err) => console.error("❌ Error fetching or creating bill:", err));
  }, [clientId]);
  

  const handleInputChanged = (e) => {
    const { name, value } = e.target;
    setBillData((prevData) => {
      const updatedAmounts = { ...prevData.amounts, [name]: value };

      const newTotal = Object.values(updatedAmounts)
        .reduce((acc, val) => acc + (parseFloat(val) || 0), 0);

      return {
        ...prevData,
        amounts: updatedAmounts,
        totalAmount: newTotal,
        paymentData: {
          ...prevData.paymentData,
          balance: newTotal - (parseFloat(prevData.paymentData?.receivedAmount) || 0),
        },
      };
    });
  };

  const handleReceivedAmountChange = (e) => {
    const value = e.target.value;
    const received = parseFloat(value.replace(/,/g, "")) || 0;

    setBillData((prevData) => ({
      ...prevData,
      paymentData: {
        ...prevData.paymentData,
        receivedAmount: value,
        balance: prevData.totalAmount - received,
      },
    }));
  };

  const saveBill = async () => {
    try {
      if (!clientId) {
        console.error("❌ Error: clientId is undefined. Cannot save bill.");
        alert("Client ID is missing! Please select a client.");
        return;
      }

      if (!billId) {
        console.warn("⚠️ Bill ID is undefined. Fetching or creating a new bill...");
        const response = await axios.get(`http://localhost:5000/api/clientBills/${clientId}`);

        if (response.data?._id) {
          setBillId(response.data._id);
          console.log("✅ Retrieved Bill ID:", response.data._id);
        } else {
          console.error("❌ Error: Could not retrieve a bill ID.");
          alert("Failed to fetch bill ID. Try again.");
          return;
        }
      }

      const payload = {
        amounts: billData.amounts,
        totalAmount: billData.totalAmount,
        receivedAmount: billData.paymentData?.receivedAmount || "0",
        balance: billData.paymentData?.balance || 0,
        receivedDate: billData.paymentData?.receivedDate || "",
      };

      const res = await axios.put(`http://localhost:5000/api/clientBills/${billId}`, payload);

      if (res.status === 200) {
        alert("✅ Bill updated successfully!");
        setBillData(res.data.bill);
        localStorage.setItem(`billData-${clientId}`, JSON.stringify(res.data.bill));
      }
    } catch (error) {
      console.error("❌ Error saving bill:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      {!showForm ? (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-lg">
            Open Bill Form
          </button>
        </div>
      ) : (
        <div className="card p-4 shadow">
          <h4 className="text-center mb-3">Client Bill Form</h4>
          <div className="row">
            {Object.keys(billData.amounts).map((key) => (
              <div className="col-md-4 col-sm-6 mb-3" key={key}>
                <label className="form-label">{key.replace(/([A-Z])/g, " $1")}:</label>
                <input
                  type="text"
                  name={key}
                  value={billData.amounts[key] || ""}
                  onChange={handleInputChanged}
                  className="form-control"
                />
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-6">
              <label><strong>Total Amount:</strong></label>
              <input type="text" className="form-control" value={billData.totalAmount.toLocaleString()} readOnly />
            </div>
            <div className="col-md-6">
              <label><strong>Received Amount:</strong></label>
              <input
                type="text"
                className="form-control"
                value={billData.paymentData?.receivedAmount || ""}
                onChange={handleReceivedAmountChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label><strong>Remaining Balance:</strong></label>
              <input type="text" className="form-control" value={(billData.paymentData?.balance || 0).toLocaleString()} readOnly />
            </div>
            <div className="col-md-6">
              <label><strong>Received Date:</strong></label>
              <input
                type="date"
                className="form-control"
                value={billData.paymentData?.receivedDate || ""}
                onChange={(e) => setBillData(prev => ({
                  ...prev,
                  paymentData: { ...prev.paymentData, receivedDate: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-success me-2" onClick={saveBill}>Save Bill</button>
            <button className="btn btn-danger" onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillClients;
