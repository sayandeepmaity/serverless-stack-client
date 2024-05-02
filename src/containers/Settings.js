import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Settings.css";

export default function Settings() {
  return (
    <div className="settings-container">
      <div className="Settings">
        <LinkContainer to="/Settings/email">
          <LoaderButton block bsSize="large" className="settings-link">
            Change Email
          </LoaderButton>
        </LinkContainer>
        <LinkContainer to="/Settings/password">
          <LoaderButton block bsSize="large" className="settings-link">
            Change Password
          </LoaderButton>
        </LinkContainer>
      </div>
    </div>
  );
}
