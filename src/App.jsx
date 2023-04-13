import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "./Post";
import { useState } from "react";
import { AddPost } from "./AddPost";

function App() {
  const [id, setId] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);

  const queryClient = useQueryClient();

  const fetchPosts = async () => {
    const response = await fetch("http://localhost:5000/posts");
    const data = await response.json();
    return data;
  };

  const postQuery = useQuery(["Posts"], fetchPosts);

  return (
    <div
      className="App"
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "wheat" }}>ALL Posts</h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            queryClient.invalidateQueries("Posts");
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "wheat",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            marginRight: "1rem",
          }}
          disabled={postQuery.isFetching}
        >
          {postQuery.isFetching ? <div>Fetching...</div> : <div>Refresh</div>}
        </button>

        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "wheat",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
          onClick={() => setShowAddPost(true)}
        >
          Add Post
        </button>
      </div>

      {postQuery.isError && <div>Error</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "1rem",
        }}
      >
        {postQuery.isSuccess && postQuery.data.length > 0 ? (
          postQuery.data.map((post) => (
            <div
              key={post._id}
              onClick={() => setId(post._id)}
              style={{
                cursor: "pointer",
                backgroundColor: "wheat",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <h2
                dangerouslySetInnerHTML={{ __html: post.title }}
                style={{ marginBottom: "0.1rem" }}
              ></h2>
              <h5 style={{ margin: "0" }}>{post.author}</h5>
              <p
                style={{
                  whiteSpace: "pre-line",
                  maxHeight:
                    "calc(1em + 2 * .6rem)" /* 2 lines with 1.2rem line height */,
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    post.body.substring(0, 100).replace(/\n/g, "<br />") +
                    (post.body.length > 100 ||
                    post.body.split("\n").length - 1 >= 2
                      ? "......."
                      : ""),
                }}
              />
            </div>
          ))
        ) : postQuery.isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>No Posts</div>
        )}
      </div>

      {id && <Post id={id} setId={setId} />}
      {showAddPost && <AddPost setShowAddPost={setShowAddPost} />}
    </div>
  );
}

export default App;
