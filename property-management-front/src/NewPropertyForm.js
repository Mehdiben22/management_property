import axios from "axios";
import React, { useState } from "react";

const NewPropertyForm = ({ onCreateProperty }) => {
  const [formData, setFormData] = useState({
    address: "",
    rentalCostApril2024: "",
    propertyName: "",
    tag: "",
    contractStartDate: "",
    contractEndDate: "",
    directCostApril2024: "",
    group: "",
    city: "",
    fixedCost: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rentalCost = parseFloat(formData.rentalCostApril2024);
      const directCost = parseFloat(formData.directCostApril2024);
      const response = await axios.post("http://localhost:3000/properties", {
        rentalCost: { "April 2024": rentalCost },
        directCost: { "April 2024": directCost },
        ...formData,
      });
      onCreateProperty(response.data);
      setFormData({
        address: "",
        rentalCostApril2024: "",
        propertyName: "",
        tag: "",
        contractStartDate: "",
        contractEndDate: "",
        directCostApril2024: "",
        group: "",
        city: "",
        fixedCost: 0,
      });
    } catch (error) {
      console.error("Error adding new property:", error);
      // Handle errors
    }
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <h2>Add New Property</h2>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Rental Cost (April 2024):</label>
        <input
          type="number"
          name="rentalCostApril2024"
          value={formData.rentalCostApril2024}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Property Name:</label>
        <input
          type="text"
          name="propertyName"
          value={formData.propertyName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Tag:</label>
        <input
          type="text"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Contract Start Date:</label>
        <input
          type="date"
          name="contractStartDate"
          value={formData.contractStartDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Contract End Date:</label>
        <input
          type="date"
          name="contractEndDate"
          value={formData.contractEndDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Direct Cost (April 2024):</label>
        <input
          type="number"
          name="directCostApril2024"
          value={formData.directCostApril2024}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Group:</label>
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          required
        >
          <option value="">Select a group</option>
          <option value="Exited">Exited</option>
          <option value="Full Property List">Full Property List</option>
          <option value="Other">Other</option>{" "}
          {/* Option for typing something else */}
        </select>
      </div>
      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Fixed Cost:</label>
        <input
          type="number"
          name="fixedCost"
          value={formData.fixedCost}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Property</button>
    </form>
  );
};

export default NewPropertyForm;
