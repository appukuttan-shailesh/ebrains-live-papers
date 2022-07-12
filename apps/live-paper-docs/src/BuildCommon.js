import React from "react";
import "./App.css";

export default class BuildCommon extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 1.75,
            marginTop: "40px",
            marginBottom: "40px"
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>Resource Sections</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Handling resource sections in live paper builder tool</div>
        </div>

        <div className="block">
          <div className="block-little-header">LittleHeader</div>
          <div className="block-main-header">MainHeader</div>
          <div className="block-text">
          </div>
        </div>


      </div>
    );
  }
}
