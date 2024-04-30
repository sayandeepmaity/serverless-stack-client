import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Notes.css";
import { s3Upload } from "../libs/awsLib";
import YouTube from "react-youtube";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");

  useEffect(() => {
    async function loadNote() {
      try {
        const note = await API.get("notes", `/notes/${id}`);
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    loadNote();
  }, [id]);

  function validateForm() {
    return content.trim().length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let attachment = note.attachment;

      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || undefined,
      });

      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  async function handleYoutubeSearch(event) {
    event.preventDefault();
    const videoIdMatch = youtubeSearchQuery.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoIdMatch) {
      setYoutubeVideoId(videoIdMatch[1]);
    }
  }

  async function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }

  async function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  function handleRemoveVideo() {
    setYoutubeVideoId("");
  }

  return (
    <div className="Notes">
      <Form onSubmit={handleYoutubeSearch} className="d-flex">
        <Form.Group controlId="youtubeSearch" className="flex-grow-1 mr-2">
          <Form.Control
            type="text"
            value={youtubeSearchQuery}
            onChange={(e) => setYoutubeSearchQuery(e.target.value)}
            placeholder="Search on YouTube, Not all videos may be compatible with dark mode"
            style={{ height: "50px" }}
          />
        </Form.Group>
        <LoaderButton
          type="submit"
          size="lg"
          variant="primary"
          style={{ height: "50px" }}
        >
          YouTube Search
        </LoaderButton>
      </Form>

      {youtubeVideoId && (
        <div style={{ position: "relative" }}>
          <button onClick={handleRemoveVideo} style={{ position: "absolute", top: "10px", right: "10px", zIndex: "1000" }}>✕</button>
          <YouTube
            videoId={youtubeVideoId}
            opts={{ width: "100%", height: "400px" }}
          />
          <hr />
        </div>
      )}

      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content" style={{ position: "relative" }}>
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
                backgroundSize: `20px 20px`,
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                width: "100%",
                height: "300px",
                backgroundColor: "white",
              }}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {note.attachment.replace(/^\w+-/, "")}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
