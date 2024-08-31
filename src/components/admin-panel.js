import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { MongoContext } from "../context/mongo-context";
import UserLinksEditor from "./user-links-editor"; // Import the new component

function AdminPanel() {
    const { user } = useContext(MongoContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatusAndFetchData = async () => {
            if (user && user.functions) {
                try {
                    // Fetch current user's admin status
                    const resp = await user.functions.get_userlinks(user.id);
                    if (resp.success && resp.data.isAdmin) {
                        setIsAdmin(true);
                        await fetchAllUsers(); // Fetch all users if admin
                    } else {
                        setIsAdmin(false);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error checking admin status:", error);
                    setLoading(false);
                }
            }
        };

        const fetchAllUsers = async () => {
            try {
                // Fetch all users data for the admin
                const allUsersResp = await user.functions.get_all_users();
                if (allUsersResp.success) {
                    setUsersData(allUsersResp.data);
                } else {
                    console.error("Error fetching all users:", allUsersResp.error);
                }
            } catch (error) {
                console.error("Error fetching all users:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatusAndFetchData();
    }, [user]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return isAdmin ? (

            <>
                {usersData.map((userData) => (
                    <UserLinksEditor
                        key={userData.userId}
                        userId={userData.userId}
                        userName={userData.userName}
                        links={userData.links}
                    />
                ))}
            </>

    ) : (
        <p>You do not have permission to access this page.</p>
    );
}

export default AdminPanel;
