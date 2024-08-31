import React, { useState, useContext } from "react";
import { Button, Form, Collapse, Card } from "react-bootstrap";
import { MongoContext } from "../context/mongo-context";
import { FaPlus, FaSave } from 'react-icons/fa'; // Import icons from react-icons

function UserLinksEditor({ userId, userName, links }) {
    const { user } = useContext(MongoContext);
    const [linkData, setLinkData] = useState(links);
    const [expandedIndex, setExpandedIndex] = useState(null);

    const addNewLink = () => {
        setLinkData([...linkData, { url: '', description: '', dept: '' }]);
    };

    const updateLinkField = (index, field, value) => {
        setLinkData(linkData.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
    };

    const deleteLink = (index) => {
        setLinkData(linkData.filter((_, i) => i !== index));
    };

    const saveChanges = async () => {
        try {
            if (user && user.functions) {
                const response = await user.functions.update_userlinks(userId, linkData);
                if (response.success) {
                    alert("Changes saved successfully!");
                } else {
                    alert(`Error saving changes: ${response.error}`);
                }
            } else {
                alert("User context is not available.");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("An error occurred while saving changes.");
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="user-links-editor mb-4 p-2">
            <h3 className="mb-4 text-white">{userName}</h3>
            <div className="link-cards-container px-2">
                {linkData.map((link, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Header 
                            className="bg-dark text-white d-flex justify-content-between align-items-center cursor-pointer" 
                            onClick={() => toggleExpand(index)}
                        >
                            <span>Link {index + 1} - {link.description}</span>
                            <Button 
                                variant="danger" 
                                onClick={(e) => { e.stopPropagation(); deleteLink(index); }}
                            >
                                Delete
                            </Button>
                        </Card.Header>
                        <Collapse in={expandedIndex === index}>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={link.url}
                                        placeholder="Enter URL"
                                        onChange={(e) => updateLinkField(index, "url", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={link.description}
                                        placeholder="Enter Description"
                                        onChange={(e) => updateLinkField(index, "description", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={link.dept}
                                        placeholder="Enter Department"
                                        onChange={(e) => updateLinkField(index, "dept", e.target.value)}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Collapse>
                    </Card>
                ))}
            </div>
            <div className="d-flex justify-content-end mt-3">
                <Button onClick={addNewLink} variant="success" className="me-2">
                    <FaPlus /> Add
                </Button>
                <Button onClick={saveChanges} variant="primary">
                    <FaSave /> Save
                </Button>
            </div>
        </div>
    );
}

export default UserLinksEditor;
