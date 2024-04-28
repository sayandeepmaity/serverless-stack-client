import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import { useHistory } from 'react-router-dom';

export default function NewNote() {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();
  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content, attachment });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSearch} className="d-flex">
        <Form.Group controlId="search" className="flex-grow-1 mr-2">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search on Google"
            style={{ height: "50px" }}
          />
        </Form.Group>
        <LoaderButton
          type="submit"
          size="lg"
          variant="primary"
          style={{ height: "50px" }}
        >
          Search
        </LoaderButton>
      </Form>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content" style={{ position: 'relative' }}>
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
              backgroundSize: `20px 20px`,
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              width: '100%',
              height: '200px',
              backgroundColor: 'white',
            }}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
