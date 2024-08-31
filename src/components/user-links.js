import React, { useEffect, useState } from "react";
import { Spinner, Card, Container, Row, Col, Form } from "react-bootstrap";
import './user-links.css'; // You can still use this for additional custom styles if needed
import gs from '../gs.png'; // Adjust the path as needed
import linkp from '../link.png'; // Adjust the path as needed
import { FaExternalLinkAlt } from "react-icons/fa";

function UserLinks({ user }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupedLinks, setGroupedLinks] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query

    const isGoogleSheetsLink = (link) => {
        return link.includes("docs.google.com/spreadsheets/");
    };

    useEffect(() => {
        const fetchUserLinks = async () => {
            if (user && user.functions) {
                try {
                    const resp = await user.functions.get_userlinks(user.id);
                    setUserData(resp.data);

                    // Group links by department
                    const linksByDept = resp.data.links.reduce((acc, link) => {
                        if (!acc[link.dept]) {
                            acc[link.dept] = [];
                        }
                        acc[link.dept].push(link);
                        return acc;
                    }, {});
                    setGroupedLinks(linksByDept);
                } catch (error) {
                    console.error("Error fetching user links:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserLinks();
    }, [user]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredLinks = (links) => {
        return links.filter(
            (link) =>
                link.description.toLowerCase().includes(searchQuery) ||
                link.url.toLowerCase().includes(searchQuery)
        );
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <>
            <Form className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Type to search links..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Form>

            {Object.keys(groupedLinks).length > 0 ? (
                Object.keys(groupedLinks).map((dept, index) => (
                    <div key={index} className="department-container mb-4 text-white">
                        <h4>{dept}</h4>
                        <Row>
                            {filteredLinks(groupedLinks[dept]).map((link, idx) => (
                                <Col key={idx} sm={6} md={4} lg={3} className="mb-3">
                                    <Card className="h-100 shadow bg-card">
                                        <Card.Body className="d-flex align-items-center" href={link.url} as="a" target="_blank">
                                            <Card.Img
                                                src={isGoogleSheetsLink(link.url) ? gs : linkp}
                                                style={{ width: '2.5rem' }}
                                            />
                                            <Card.Text className="text-black px-1">
                                                {link.description} <FaExternalLinkAlt className="text-info" />
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            ) : (
                <p className="no-links-message">No links available.</p>
            )}
        </>
    );
}

export default UserLinks;
