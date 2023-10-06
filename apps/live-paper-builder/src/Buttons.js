import React from "react";
import Button from "@mui/material/Button";
import AcUnitIcon from '@mui/icons-material/AcUnit';


const baseButtonStyle = {
    fontWeight: "bold",
    border: "solid",
    borderColor: "#000000",
    borderWidth: "1px",
    color: "#000000",
}


function WideButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        ...baseButtonStyle,
        width: "27.5%",
        backgroundColor: props.backgroundColor
      }}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}

function StandardButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        ...baseButtonStyle,
        width: "150px",
        backgroundColor: props.backgroundColor,
        padding: "10px"
      }}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}

function InvertedButton(props) {
    return (
      <Button
        variant="contained"
        color="primary"
        style={{
          ...baseButtonStyle,
          width: "150px",
          backgroundColor: props.backgroundColor,
          color: "#ffffff",
          padding: "10px",
        }}
        onClick={props.onClick}
      >
        {props.label}
      </Button>
    );
  }

function StandardIconButton(props) {

    return (
      <Button
        variant="contained"
        color="primary"
        style={{
          ...baseButtonStyle,
          width: "17.5%",
          backgroundColor: props.backgroundColor,
          overflowX: "hidden"
        }}
        startIcon={<AcUnitIcon style={{ width: 30, height: 30 }} />}
        onClick={props.onClick}
      >
        {props.label}
      </Button>
    )
}


export { StandardButton, InvertedButton, WideButton };
