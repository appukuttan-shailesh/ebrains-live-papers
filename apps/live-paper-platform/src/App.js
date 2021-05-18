import React from "react";
import TopNavigation from "./TopNavigation";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import BuildIcon from "@material-ui/icons/Build";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <div className="container" style={{ textAlign: "left" }}>
        <LoadingIndicatorModal open={this.state.loading} />
        <TopNavigation />
        <div
          className="box rounded centered"
          style={{
            marginTop: "5px",
            paddingTop: "50px",
            paddingBottom: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            <img
              className="ebrains-icon-small"
              src="./imgs/ebrains_logo.png"
              alt="EBRAINS logo"
              style={{ width: "50px", height: "50px" }}
            />
            <span
              className="title-style"
              style={{ paddingLeft: "15px", marginTop: "4px" }}
            >
              EBRAINS Live Papers
            </span>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
          }}
        >
          <strong>Welcome to the EBRAINS live paper platform!</strong>
          <br />
          <br />
          EBRAINS Live Papers are structured and interactive documents that
          complement published scientific articles. Interactivity is a prominent
          feature of the "Live Papers" with several integrated tools and
          services that will allow users to download, visualise or simulate
          data, models and results presented in the corresponding publications.
          The live papers allow for diverse types of resources to be presented,
          with practically no limitations.
          <br />
          <br />
          For more information on how to create or explore a live paper, you may
          refer to the documentation by clicking on the{" "}
          <HelpOutlineIcon
            fontSize="small"
            style={{ verticalAlign: "text-bottom" }}
          />{" "}
          icon on the top-left of this page. If you wish to develop a new live
          paper, please click on the{" "}
          <BuildIcon
            fontSize="small"
            style={{ verticalAlign: "text-bottom" }}
          />{" "}
          icon on the top-left of this page to open the live paper builder tool.
          The documentation also contains info on how to develop live papers
          using this tool.
        </div>
        <div
          className="note rounded intro"
          style={{
            marginLeft: "5%",
            marginRight: "5%",
            width: "90%",
            textAlign: "justify",
          }}
        >
          <strong>Note:</strong> Some of the integrated tools used in the Live
          Papers require an EBRAINS account. If you do not have an account yet
          and are interested in getting one, you can do so by visiting:&nbsp;
          <a
            href="https://iam.ebrains.eu/register"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://iam.ebrains.eu/register
          </a>
          . It is free and simple to create a new account, and mainly requires
          an institutional email account.
        </div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
          }}
        >
          For any issues regarding usability or accessibility of resources,
          users are requested to contact{" "}
          <a
            href="mailto:support@ebrains.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            support@ebrains.eu
          </a>{" "}
          for further assistance.
        </div>
        <br />
        <br />

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
        <br />
      </div>
    );
  }
}
export default App;
