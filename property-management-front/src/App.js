import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import NewPropertyForm from "./NewPropertyForm";
import "./styles.css";

const App = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://localhost:3000/properties");
      const fetchedProperties = response.data.properties;
      setProperties(fetchedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const updatedProperties = Array.from(properties);
    const [movedProperty] = updatedProperties.splice(result.source.index, 1);
    movedProperty.group = result.destination.droppableId;
    updatedProperties.splice(result.destination.index, 0, movedProperty);

    setProperties(updatedProperties);

    try {
      await axios.put(
        `http://localhost:3000/properties/${movedProperty._id}`,
        movedProperty
      );
    } catch (error) {
      console.error("Error updating property group:", error);
    }
  };

  const handleCreateProperty = async (newPropertyData) => {
    try {
      newPropertyData.group = "Full Property List"; // Ensure this matches the backend default
      const response = await axios.post(
        "http://localhost:3000/properties",
        newPropertyData
      );
      setProperties([...properties, response.data]);
    } catch (error) {
      console.error("Error creating new property:", error);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(filter.toLowerCase()) ||
      property.propertyName.toLowerCase().includes(filter.toLowerCase())
  );

  const cleaningsRequired = filteredProperties.filter(
    (property) => property.group === "Exited"
  );
  const cleaningsPending = filteredProperties.filter(
    (property) =>
      property.group !== "Exited" && property.group !== "Full Property List"
  );
  const cleaningsDone = filteredProperties.filter(
    (property) => property.group === "Full Property List"
  );

  return (
    <div className="App">
      <h1>Property Management</h1>
      <div>
        <input
          type="text"
          placeholder="Filter properties"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <NewPropertyForm onCreateProperty={handleCreateProperty} />
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-container">
          <Droppable droppableId="Exited">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>Cleanings Required</h2>
                {cleaningsRequired.map((property, index) => (
                  <Draggable
                    key={property._id}
                    draggableId={property._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="property-card"
                      >
                        <p>{property.address}</p>
                        <p>{property.propertyName}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="Pending">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>Cleanings Pending</h2>
                {cleaningsPending.map((property, index) => (
                  <Draggable
                    key={property._id}
                    draggableId={property._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="property-card"
                      >
                        <p>{property.address}</p>
                        <p>{property.propertyName}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="Full Property List">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2>Cleanings Done</h2>
                {cleaningsDone.map((property, index) => (
                  <Draggable
                    key={property._id}
                    draggableId={property._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="property-card"
                      >
                        <p>{property.address}</p>
                        <p>{property.propertyName}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
