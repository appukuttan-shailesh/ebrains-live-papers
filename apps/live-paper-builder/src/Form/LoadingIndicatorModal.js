import Dialog from "@mui/material/Dialog";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingIndicatorModal(props) {
  return (
    <Dialog
      open={props.open}
      fullWidth={true}
      maxWidth={"md"}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "250",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
          marginBottom: "100px",
        }}
      >
        <CircularProgress thickness={5.0} />
      </div>
    </Dialog>
  );
}
