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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Resource Type: Electrophysiological Data</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>How to share... How to use...</div>
        </div>

        <div className="block">
          <div className="block-little-header">Share Resource</div>
          <div className="block-main-header">Sharing electrophysiology related resources</div>
          <div className="block-text">
            Authors can share electrophysiology recording data via their live
            papers. Each individual data file is listed as a separate entry, as
            shown below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/traces/example_traces_section.png" width="85%" />
            </div>
            <br />
            For general instructions on how to add info to resource sections,{" "}
            <a onClick={() => this.props.updateHash("buildCommon")} target="_blank">click here</a>.
            <br /><br />
            Authors can import / link existing electrophysiological data related entries from
            other repositories such as:
            <ul>
              <li><a href="https://search.kg.ebrains.eu/?facet_type[0]=Dataset" target="_blank">EBRAINS Knowledge Graph</a></li>
              <li><a href="https://celltypes.brain-map.org/data/" target="_blank">Allen Brain Atlas</a></li>
            </ul>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Access Resource</div>
          <div className="block-main-header">Accessing electrophysiology related resources</div>
          <div className="block-text">
            An example of a electrophysiology related resource section in a live paper
            is shown below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/traces/example_traces_output.png" width="85%" />
            </div>
            <br />
            By clicking on an entry, it expands to show further info and
            actions. This is illustrated in the figure below. Users are able to
            download each listed trace file by clicking on the 'Download' button
            (button with down arrow symbol) for that entry. Additional info can
            be viewed by clicking on the 'info' button (button with circled
            'i'). The integrated NEO viewer allows for exploring the data from
            within the live paper document itself. Users can specify the signals
            of interest from those available within the data file.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img src="/figures/traces/example_traces_output_detail.png" width="85%" />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
