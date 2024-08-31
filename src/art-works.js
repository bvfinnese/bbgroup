import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { S3 } from "aws-sdk"; // Import S3
import { MongoContext } from "./context/mongo-context";
import LoginForm from "./components/login-form";
import NavigationComponent from "./components/navigation";

function ArtWorks(props) {
    const {
        user,
        setEmail,
        setPassword,
        onSubmit,
        email,
        password,
    } = useContext(MongoContext);

    // State to hold the user's MongoDB document
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        if (user) {
            // Define the function to get the user's document
            const getUserData = async () => {
                try {
                    // Replace this with your actual function to retrieve user data
                    const resp = await user.functions.get_userlinks(user.id);
                    setUserData(resp.data);


                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false); // Ensure loading state is set to false
                }
            };

            getUserData();
        } else {
            setLoading(false); // If there's no user, stop loading
        }
    }, [user]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return user ? (
        <Row className="p-4">
            <NavigationComponent user={user} />
        </Row>
    ) : (
        <LoginForm
            onEmailChange={(e) => setEmail(e.target.value)}
            email={email}
            onPassWordChange={(e) => setPassword(e.target.value)}
            password={password}
            onSubmit={onSubmit}
        />
    );
}

export default ArtWorks;
