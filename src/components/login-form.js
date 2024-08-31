import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LoginForm(props) {
  return (
    <Col xs={12} md={4} className="card shadow p-3 bg-white">
      <h3 className="text-dark mb-4">Login</h3>
      <Form className="py-2" autoComplete="off">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={props.onEmailChange}
            value={props.email}
            autoComplete="off"
          />
        </Form.Group>
        <input type="text" style={{ display: 'none' }} autoComplete="username" />

        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={props.onPassWordChange}
            value={props.password}
            autoComplete="new-password"
            aria-autocomplete="none"  // Using "new-password" prevents auto-fill
          />
          <Form.Text className="text-danger">
            {props.loginFailed ? "Login Failed! Please check your password" : ''}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={props.onSubmit}>
          Submit
        </Button>
      </Form>
    </Col>
  );
}

export default LoginForm;
