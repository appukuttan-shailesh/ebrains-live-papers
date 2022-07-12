import React from "react";
import "./App.css";

export default class Traces extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Resource Type: Morphology</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>How to share... How to use...</div>
        </div>

        <div className="block">
          <div className="block-little-header">Share Resource</div>
          <div className="block-main-header">Sharing morphology related resources</div>
          <div className="block-text">
            Authors can share neuronal morphology related resources via their
            live papers. Each individual morphology is listed as a separate
            entry, as shown below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/morphology/example_morphology_section.png" width="85%" />
            </div>
            <br />
            For general instructions on how to add info to resource sections,{" "}
            <a href="share_common.html" target="_blank">click here</a>.
            <br /><br />
            Authors can import / link existing morphology related entries from
            other repositories such as:
            <ul>
              <li><a href="http://neuromorpho.org/" target="_blank">NeuroMoprho.Org</a></li>
              <li><a href="https://celltypes.brain-map.org/data/" target="_blank">Allen Brain Atlas</a></li>
            </ul>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Access Resource</div>
          <div className="block-main-header">Accessing morphology related resources</div>
          <div className="block-text">
            An example of a morphology related resource section in a live paper
            is shown below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/morphology/example_morphology_output.png" width="85%" />
            </div>
            <br />
            Users are able to download each listed morphology file by clicking
            on the 'Download' button for that entry. By clicking on the 'View'
            button, they can also launch the morphology inside an integrated 3D
            morphology viewer. This is illustrated below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/morphology/morphology_viewer.png" width="75%" />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
