import React from "react";
import "./App.css";

export default class Find extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Find Live Papers</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Find and explore live papers</div>
        </div>

        <div className="block">
          <div className="block-little-header">Live Paper Platform</div>
          <div className="block-main-header">Collection of all public live papers</div>
          <div className="block-text">
            Published live papers are freely accessible on the live paper
            platform. The live papers are listed in reverse chronological order:
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/find/live_paper_homepage.png" width="95%" />
            </div>
            <br />
            You can click on any entry to view that specific live paper:
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/find/live_paper_migliore_2018.png" width="95%" />
            </div>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Searching / Filtering</div>
          <div className="block-main-header">Searching / Filtering the list of live papers</div>
          <div className="block-text">
            The live paper platform allows users to search for specific live
            papers and/or shortlist live papers based on specific criteria, such
            as:
            <ul>
              <li>title of associated published article</li>
              <li>the year of publication</li>
              <li>the publishing journal</li>
              <li>names of associated author(s)</li>
              <li>keyword search of abstract</li>
            </ul>
            <p><i>Work in progress!</i></p>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Resources</div>
          <div className="block-main-header">Accessing shared resources</div>
          <div className="block-text">
            For computational modeling studies, we have found that the most
            common resources being distributed comprise of the following:
            <ul>
              <li><a href onClick={() => this.props.updateHash("morphology")}>Morphologies</a></li>
              <li><a href onClick={() => this.props.updateHash("traces")}>Electrophysiological Recordings</a></li>
              <li><a href onClick={() => this.props.updateHash("models")}>Models</a></li>
              <li><a href onClick={() => this.props.updateHash("other")}>Other Content</a></li>
            </ul>
            <br />
            Click on the above links for more details on how to access and
            explore each type of resource.
          </div>
        </div>

      </div>
    );
  }
}
