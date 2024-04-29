import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import { useHistory, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const history = useHistory();

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label style={{ fontWeight: 500, color: "black" }}>
            Email
          </Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
            list="emailSuggestions"
          />
          <datalist id="emailSuggestions">
            <option value="example1@example.com" />
            <option value="example2@example.com" />
            <option value="example3@example.com" />
          </datalist>
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label style={{ fontWeight: 500, color: "black" }}>
            Password
          </Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
        <div className="signup-link" style={{ marginTop: "10px" }}>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" style={{ fontWeight: 500, color: "black" }}>
              Sign up here
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
