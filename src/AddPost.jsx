import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const AddPost = ({ setShowAddPost }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  const queryClient = useQueryClient();

  const addPost = async (data) => {
    const response = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    console.log(json);
    return json;
  };

  const addPostMutation = useMutation(addPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("Posts");
      setShowAddPost(false);
    },
  });

  const submitPost = (e) => {
    e.preventDefault();
    if (!title || !author || !body) {
      alert("Please fill out all fields");
      return;
    }
    addPostMutation.mutate({ title, author, body });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.8)",
      }}
      onClick={() => setShowAddPost(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Add Post</h1>
        <form action="" onSubmit={submitPost}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="author">Author</label>
              <input
                type="text"
                name="author"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
                id="author"
              />
            </div>

            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="body">Body</label>
              <textarea
                name="body"
                id="body"
                cols="30"
                rows="10"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              ></textarea>
            </div>

            <button
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "wheat",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
              }}
              type="submit"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
