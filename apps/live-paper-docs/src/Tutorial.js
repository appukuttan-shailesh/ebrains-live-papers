import React from "react";
import "./App.css";

export default class Tutorial extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Tutorial</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>A step-by-step walkthrough</div>
        </div>

        <div className="block">
          <div className="block-little-header">Video Tutorial</div>
          <div className="block-main-header">Demonstration of Live Papers</div>
          <div className="block-text">
            <div class="video-container">
              <iframe width="560" height="315" title="EBRAINS Live Papers Demo" src="https://www.youtube.com/embed/azBQRXMsLPY?start=21" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
