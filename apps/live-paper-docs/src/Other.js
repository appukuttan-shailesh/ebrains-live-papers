import React from "react";
import "./App.css";

export default class Other extends React.Component {
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
            Resource Type: Other Data
          </div>
          <div
            className="title-solid-style"
            style={{ fontSize: 32, color: "#00A595" }}
          >
            How to share... How to use...
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Share Resource</div>
          <div className="block-main-header">
            Sharing other types of resources
          </div>
          <div className="block-text">
            The live papers provide two other types of resource sections to
            enable authors to share data that might not fit well within the
            other specific resource sections. These are:
            <ul>
              <li>Generic resource section</li>
              <li>Custom resource section</li>
            </ul>
            <strong>Generic resource section</strong> basically allows authors
            to create a listing of resource items, that isn't tied to any
            specific type of resource. Each individual resource is listed as a
            separate entry, as shown below:
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/other/example_generic_section.png"
                }
                width="85%"
              />
            </div>
            <br />
            <strong>Custom resource sections</strong> provides advanced users
            the ability to present custom data or add custom functionality by
            being able to specify the content via HTML / Markdown. This ensures
            that the live paper builder tool does not limit the complexity of
            live papers that can be developed using it. An example of more
            advanced usage of this is the leveraging of web-socket based service
            to remotely run NEURON models on BlueNaaS (Blue Neuron as a
            Service).
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/other/example_custom_section.png"
                }
                width="85%"
              />
            </div>
            <br />
            For general instructions on how to add info to resource sections,{" "}
            <a
              href
              onClick={() => this.props.updateHash("buildCommon")}
              target="_blank"
              rel="noreferrer"
            >
              click here
            </a>
            .
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Access Resource</div>
          <div className="block-main-header">Accessing other types of data</div>
          <div className="block-text">
            An example of a generic listing resource section in a live paper is
            shown below. Users are able to download each listed item by clicking
            on the 'Download' button for that entry.
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/other/example_generic_output.png"
                }
                width="85%"
              />
            </div>
            <br />
            An example of a custom listing resource section in a live paper is
            shown below:
            <br />
            <br />
            <div style={{ textAlign: "center" }}>
              <img
                alt=""
                src={
                  process.env.PUBLIC_URL +
                  "/figures/other/example_custom_output.png"
                }
                width="85%"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
