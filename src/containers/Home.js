import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  async function handleDeleteAll() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all notes?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await Promise.all(notes.map((note) => deleteNote(note.noteId)));
      setNotes([]);
    } catch (e) {
      onError(e);
    }
  }

  function deleteNote(noteId) {
    return API.del("notes", `/notes/${noteId}`);
  }

  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

  function renderNotesList(notes) {
    const filteredNotes = notes.filter((note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearch}
          className="form-control search-bar mb-3"
        />
        <LinkContainer to="/notes/new">
          <ListGroup.Item
            action
            className="py-3 text-nowrap text-truncate custom-note-item custom-note-new"
          >
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {filteredNotes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
        {notes.length > 0 && (
          <ListGroup.Item
            action
            className="py-3 text-nowrap text-truncate custom-note-item custom-note-delete-all"
            onClick={handleDeleteAll}
          >
            <BsTrash size={17} />
            <span className="ml-2 font-weight-bold">Delete All Notes</span>
          </ListGroup.Item>
        )}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>NESTOPIA</h1>
        <p className="text-muted">Build the Perfect Nest for Your Thoughts!</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Welcome to the Nest</h2>
        <h3 className="pb-3 mt-4 mb-3 border-bottom">
          Unleash your creativity! Create, delete, and edit your notes with ease
        </h3>
        <ListGroup className="notes-grid">
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
