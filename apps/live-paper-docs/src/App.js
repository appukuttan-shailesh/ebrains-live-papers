import React from "react";
import IconButton from '@mui/material/IconButton';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BuildIcon from "@mui/icons-material/Build";
import Tooltip from '@mui/material/Tooltip';
import TopNavigation from "./TopNavigation";
import Introduction from "./Introduction";
import Find from "./Find";
import Create from "./Create";
import Morphology from "./Morphology";
import Traces from "./Traces";
import Models from "./Models";
import Other from "./Other";
import Develop from "./Develop";
import BuildCommon from "./BuildCommon";
import Footer from "./Footer";
import "./App.css";

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageOpen: window.location.hash.slice(1),
    };

    this.updateHash = this.updateHash.bind(this);
  }

  componentDidMount() {
    if (window.location.hash) {
      this.setState({
        pageOpen: window.location.hash.slice(1)
      })
    }
  }

  updateHash(value) {
    this.setState({ pageOpen: value });
  }

  render() {
    // update hash
    window.location.hash = this.state.pageOpen;

    return (
      <div className="mycontainer" style={{ textAlign: "left" }}>
        <div className="box rounded centered"
          style={{ marginTop: "25px", paddingTop: "0.75em", paddingBottom: "0.75em", marginBottom: "0px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, textAlign: "left", paddingLeft: "25px", alignSelf: "center" }}>
              <Tooltip title={"Open EBRAINS Homepage"}>
                <img
                  src="./imgs/General_logo_Portrait_White.svg"
                  alt="EBRAINS logo"
                  style={{ height: "120px", cursor: "pointer" }}
                />
              </Tooltip>
            </div>
            <div style={{ alignSelf: "center" }}>
              <table>
                <tbody>
                  <tr style={{ border: "None" }}>
                    <td>
                      <img
                        className="ebrains-icon-small"
                        src="./imgs/LP_icon_large.svg"
                        alt="EBRAINS logo"
                        style={{ height: "100px", paddingRight: "10px" }}
                      />
                    </td>
                    <td>
                      <h5 className="title-style">Documentation</h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1, textAlign: "right", paddingRight: "25px", alignSelf: "center" }}>
              <Tooltip title={"See Live Papers"}>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ paddingRight: "10px" }}
                >
                  <IconButton aria-label="See Live Papers">
                    <LibraryBooksIcon fontSize="large" />
                  </IconButton>
                </a>
              </Tooltip>
              <Tooltip title={"Open Live Paper Builder"}>
                <a
                  href="/builder"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton aria-label="Open Live Paper Builder">
                    <BuildIcon fontSize="large" />
                  </IconButton>
                </a>
              </Tooltip>
            </div>
          </div>
        </div>

        <TopNavigation updateHash={this.updateHash} pageOpen={this.state.pageOpen} />

        {this.state.pageOpen === "" && <Introduction updateHash={this.updateHash} />}
        {this.state.pageOpen === "find" && <Find updateHash={this.updateHash} />}
        {this.state.pageOpen === "create" && <Create updateHash={this.updateHash} />}
        {this.state.pageOpen === "morphology" && <Morphology updateHash={this.updateHash} />}
        {this.state.pageOpen === "traces" && <Traces updateHash={this.updateHash} />}
        {this.state.pageOpen === "models" && <Models updateHash={this.updateHash} />}
        {this.state.pageOpen === "other" && <Other updateHash={this.updateHash} />}
        {this.state.pageOpen === "develop" && <Develop updateHash={this.updateHash} />}
        {this.state.pageOpen === "buildCommon" && <BuildCommon updateHash={this.updateHash} />}
                
        <Footer />
        <div className="rainbow-row">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <br />
        <footer>
          Copyright © 2022 EBRAINS. All rights reserved.
        </footer>
        <br />
        <br />
      </div >
    );
  }
}
