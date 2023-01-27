import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingIndicator(props) {
  let position = props.position || "relative";
  if (position === "relative") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        <CircularProgress size={props.size || 30} />
      </div>
    );
  } else {
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress />
      </div>
    );
  }
}
