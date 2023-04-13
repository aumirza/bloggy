import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export const Post = ({ id, setId }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  const [editMode, setEditMode] = useState(false);

  const queryClient = useQueryClient();

  const fetchPost = async () => {
    const response = await fetch(`http://localhost:5000/posts/${id}`);
    const data = await response.json();
    return data;
  };

  const stopBubblingAndPropagation = (e) => {
    e.stopPropagation();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const postQuery = useQuery(["Posts", id], fetchPost, {
    enabled: !!id,
    onSuccess: (data) => {
      setTitle(data.title);
      setAuthor(data.author);
      setBody(data.body);
    },
  });

  const updatePost = async (data) => {
    const response = await fetch(`http://localhost:5000/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    console.log(json);
    return json;
  };

  const postMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries("Posts");
      queryClient.invalidateQueries(["Posts", id]);
    },
  });

  const submitPost = () => {
    if (!title || !author || !body) {
      alert("Please fill out all fields");
      return;
    }

    if (
      title === postQuery.data.title &&
      author === postQuery.data.author &&
      body === postQuery.data.body
    ) {
      alert("No changes made");
      return;
    }

    postMutation.mutate({ title, author, body });
  };

  useEffect(() => {
    if (editMode) submitPost();
  }, [title, author, body]);

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
      onClick={() => setId(null)}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "0.5rem",
          width: "500px",
        }}
        onClick={stopBubblingAndPropagation}
      >
        {postQuery.isLoading && <div>Loading...</div>}
        {postQuery.isError && <div>Error</div>}
        {postQuery.isFetching && <div>Fetching...</div>}
        {postQuery.isSuccess ? (
          <>
            <></>
            <h1
              contentEditable={true}
              onKeyDown={handleEnter}
              onFocus={(e) => setEditMode(true)}
              onBlur={(e) => {
                setTitle(e.target.innerText);
              }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <h3
              contentEditable={true}
              onKeyDown={handleEnter}
              onFocus={(e) => setEditMode(true)}
              onBlur={(e) => {
                setAuthor(e.target.innerText);
              }}
              dangerouslySetInnerHTML={{ __html: author }}
            />
            <p
              onFocus={(e) => setEditMode(true)}
              contentEditable="true"
              onBlur={(e) => setBody(e.target.innerText)}
              style={{ maxWidth: "500px" }}
              dangerouslySetInnerHTML={{
                __html: body.replace(/\n/g, "<br />"),
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
