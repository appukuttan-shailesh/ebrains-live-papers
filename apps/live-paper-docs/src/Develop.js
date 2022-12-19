import React from "react";
import "./App.css";

export default class Develop extends React.Component {
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
            marginBottom: "40px",
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>
            Resources for developers
          </div>
          <div
            className="title-solid-style"
            style={{ fontSize: 32, color: "#00A595" }}
          >
            Access live papers in your own tools and workflows
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">REST API</div>
          <div className="block-main-header">Live Papers REST API</div>
          <div className="block-text">
            Content of Live Papers can be accessed through a{" "}
            <a
              href="https://validation-v2.brainsimulation.eu/docs#/Live%20Papers"
              target="_blank"
              rel="noopener noreferrer"
            >
              REST API
            </a>{" "}
            (
            <a
              href="https://validation-v2.brainsimulation.eu/redoc#tag/Live-Papers"
              target="_blank"
              rel="noopener noreferrer"
            >
              alternative documentation format
            </a>
            ). The web interface uses this API behind the scenes, and it can
            also be used from any other website or with another programming
            language.
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Fairgraph</div>
          <div className="block-main-header">Direct Knowledge Graph access</div>
          <div className="block-text">
            If you need more fine-grained access than is available through the
            REST API, you may be able to access the underlying metadata in the
            EBRAINS Knowledge Graph directly using the{" "}
            <a
              href="https://github.com/HumanBrainProject/fairgraph/"
              target="_blank"
              rel="noopener noreferrer"
            >
              fairgraph
            </a>{" "}
            library. Please <a href="mailto:support@ebrains.eu">contact us</a>{" "}
            to request access.
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">GitHub</div>
          <div className="block-main-header">Open-source project</div>
          <div className="block-text">
            EBRAINS Live Papers is an open-source project. You can find the
            source code and other development related info on{" "}
            <a
              href="https://github.com/appukuttan-shailesh/ebrains-live-papers"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    );
  }
}
