import React, { useContext, useState, useEffect } from "react";
import { Nav, Row, Col, Spinner } from "react-bootstrap";
import UserLinks from "./user-links";
import AdminPanel from "./admin-panel";
import './navigation.css'; // Import your custom CSS file

function NavigationComponent({ user }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [activePage, setActivePage] = useState("user");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user && user.functions) {
                try {
                    const resp = await user.functions.get_userlinks(user.id);
                    setIsAdmin(resp.data.isAdmin);
                } catch (error) {
                    console.error("Error fetching admin status:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        checkAdminStatus();
    }, [user]);

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <div className="navigation-container">
            <Row>
                {/* Side Navigation */}
                <Col md={3} className="side-nav">
                    <Nav defaultActiveKey="user" className="flex-column">
                        <Nav.Link 
                            eventKey="user" 
                            onClick={() => handlePageChange("user")} 
                            className={activePage === "user" ? "active-link" : ""}
                        >
                            My Links
                        </Nav.Link>
                        {isAdmin && (
                            <Nav.Link 
                                eventKey="admin" 
                                onClick={() => handlePageChange("admin")} 
                                className={activePage === "admin" ? "active-link" : ""}
                            >
                                Admin Panel
                            </Nav.Link>
                        )}
                    </Nav>
                </Col>

                {/* Page Content */}
                <Col md={9} className="page-content thin-scroll">
                    {activePage === "user" ? (
                        <UserLinks user={user} />
                    ) : isAdmin && activePage === "admin" ? (
                        <AdminPanel user={user}/>
                    ) : (
                        <p>You do not have access to this page.</p>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default NavigationComponent;
