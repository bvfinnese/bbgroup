import React, { useEffect, useState } from "react";
import { Spinner, Card, Container, Row, Col } from "react-bootstrap";
import './user-links.css'; // You can still use this for additional custom styles if needed
import gs from '../gs.png'; // Adjust the path as needed

function UserLinks({ user }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupedLinks, setGroupedLinks] = useState({});

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

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <>
            {Object.keys(groupedLinks).length > 0 ? (
                Object.keys(groupedLinks).map((dept, index) => (
                    <div key={index} className="department-container mb-4 text-white">
                        <h4>{dept}</h4>
                        <Row>
                            {groupedLinks[dept].map((link, idx) => (
                                <Col key={idx} sm={12} md={6} lg={4} className="mb-3">
                                    <Card className="h-100 shadow bg-card">
                                    <Card.Img  src={gs} style={{width:'4.5rem'}}/>

                                        <Card.Body>
                                            <Card.Text className="text-black" >
                                                {link.description}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Card.Link href={link.url} target="_blank">
                                                Open Link
                                            </Card.Link>
                                        </Card.Footer>
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
