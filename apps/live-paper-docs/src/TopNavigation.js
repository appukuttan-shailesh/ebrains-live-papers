import React from "react";
import "./App.css";

export default class TopNavigation extends React.Component {
  render() {
    return (
      <div style={{ width: "100%", padding: "10px", borderBottom: "solid 1px #00A595" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("")}>Introduction</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("find")}>Find</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("create")}>Create</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("morphology")}>Morphology</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("traces")}>Traces</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("models")}>Models</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("other")}>Other</span>
          <span className="nav-item-style" style={{ marginRight: "20px" }} onClick={() => this.props.updateHash("develop")}>Develop</span>
          <span className="nav-item-style" onClick={() => this.props.updateHash("tutorial")}>Tutorial</span>
        </div>
      </div>
    );
  }
}
