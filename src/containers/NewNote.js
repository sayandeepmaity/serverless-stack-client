import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import { useHistory } from "react-router-dom";
import YouTube from "react-youtube";

export default function NewNote() {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const youtubePlayerRef = useRef(null);
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

  async function handleYoutubeSearch(event) {
    event.preventDefault();
    const videoIdMatch = youtubeSearchQuery.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoIdMatch) {
      setYoutubeVideoId(videoIdMatch[1]);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  function onYouTubePlayerReady(event) {
    const player = event.target;
    player.getIframe().style.filter = "none";

    player.addEventListener("onStateChange", () => {
      player.getIframe().style.filter = "none";
    });

    // Handle clicks on timestamps in notes content
    const timestampRegex = /(\d{1,2}):(\d{2})/g;
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = content.replace(
      timestampRegex,
      '<a href="#" class="timestamp">$&</a>'
    );

    const timestampLinks = contentDiv.getElementsByClassName("timestamp");
    for (let i = 0; i < timestampLinks.length; i++) {
      const timestampLink = timestampLinks[i];
      timestampLink.onclick = function (e) {
        e.preventDefault();
        const timestampParts = timestampLink.innerText.split(":");
        const timestampSeconds =
          parseInt(timestampParts[0], 10) * 60 + parseInt(timestampParts[1], 10);
        gotoTimestamp(timestampSeconds);
      };
    }
  }

  // Function to set current time of the video player
  function gotoTimestamp(timestamp) {
    youtubePlayerRef.current.internalPlayer.seekTo(timestamp, true);
  }

  function handleRemoveVideo() {
    setYoutubeVideoId("");
  }

  return (
    <div className="NewNote">
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
          Search
        </LoaderButton>
      </Form>

      {youtubeVideoId && (
        <div style={{ position: "relative" }}>
          <button
            onClick={handleRemoveVideo}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: "1000",
            }}
          >
            ✕
          </button>
          <YouTube
            videoId={youtubeVideoId}
            opts={{ width: "100%", height: "400px" }}
            onReady={onYouTubePlayerReady}
            ref={youtubePlayerRef}
          />
          <hr />
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content" style={{ position: "relative" }}>
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here"
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
