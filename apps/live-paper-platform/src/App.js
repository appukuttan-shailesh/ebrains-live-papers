import React from "react";
import Button from "@material-ui/core/Button";
import TopNavigation from "./TopNavigation";
import LoadingIndicator from "./LoadingIndicator";
import Icon from "@material-ui/core/Icon";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import BuildIcon from "@material-ui/icons/Build";
import axios from "axios";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ErrorDialog from "./ErrorDialog";
import LivePaperViewer from "./LivePaperViewer";
import { baseUrl, updateHash } from "./globals";
import { isUUID } from "./utils";
import saltedMd5 from "salted-md5";

// define the columns for the material data table
const TABLE_COLUMNS = [
  {
    title: "Paper Title",
    field: "live_paper_title",
    render: (item) => (
      <div style={{ marginLeft: 15 }}>
        <p>
          <b>{item.live_paper_title}</b>
        </p>
        <p>
          <i>{item.citation}</i>
        </p>
      </div>
    ),
    customFilterAndSearch: (value, item) => {
      if (item.live_paper_title.concat(item.citation).includes(value)) {
          console.log("found");
        return true;
      } else {
          console.log("not found");
          return false;
      }
    },
  },
  {
    title: "Year",
    field: "year",
    width: "85px",
    defaultSort: "desc",
    render: (item) => new Date(item.year).getFullYear().toString(),
  },
];

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      h6: {
        fontWeight: "bolder !important",
        color: "#000000",
      },
    },
  },
});

export default class App extends React.Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);

    this.state = {
      lp_listing: [],
      loadingListing: false,
      error: null,
      selectedLPs: [],
      dataLPs: {}, // keys are lp_ids; will cache data once loaded
      lp_open_id: false,
      showPassword: false,
    };

    this.handleLoadListingLP = this.handleLoadListingLP.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.handleSelectedLP = this.handleSelectedLP.bind(this);
    this.handleCloseLP = this.handleCloseLP.bind(this);
  }

  componentDidMount() {
    this.handleLoadListingLP();
    if (window.location.hash) {
      let error_message = "";
      const lp_id = window.location.hash.slice(1);
      console.log(lp_id);
      if (!isUUID(lp_id)) {
        error_message =
          "Specified live paper ID '" + lp_id + "' is not a valid UUID.";
        this.setState({ error: error_message });
        updateHash("");
      } else {
        this.handleSelectedLP(lp_id, true);
      }
    }
  }

  handleLoadListingLP() {
    this.setState({ loadingListing: true }, () => {
      let url = baseUrl + "/livepapers-published/";
      let config = {
        cancelToken: this.signal.token,
      };
      axios
        .get(url, config)
        .then((res) => {
          // console.log(res);
          this.setState({
            lp_listing: res.data,
            loadingListing: false,
            error: null,
          });
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("error: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            let error_message = "";
            try {
              error_message = err.message;
            } catch {
              error_message = err;
            }
            this.setState({
              error: error_message,
            });
          }
          this.setState({
            loadingListing: false,
          });
        });
    });
  }

  handleSelectedLP(lp_id, open = false) {
    // console.log("Get LP data from KG");
    if (lp_id === "a8d69ef1-1fc5-49f8-9aff-c185925f3a42") {
      // TODO: add check to see if password-protected live paper
      // Currently just for demo purposes with a single sample live paper
      let context = this;
      const password = prompt("Please enter the live paper password:");
      let hash = saltedMd5(password, lp_id).toString();
      let url = baseUrl + "/livepapers/" + lp_id;
      let config = {
        cancelToken: context.signal.token,
        headers: {
          Authorization: "Bearer " + hash,
          "Content-type": "application/json",
        },
      };
      axios
        .get(url, config)
        .then((res) => {
          console.log(res);
          context.setState((prevState) => ({
            dataLPs: {
              ...prevState.dataLPs,
              [lp_id]: res.data,
            },
          }));
          if (open) {
            context.setState({
              lp_open_id: lp_id,
            });
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("error: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            context.setState((prevState) => ({
              dataLPs: {
                ...prevState.dataLPs,
                lp_id: null,
              },
            }));
          }
          updateHash("");
          context.forceUpdate();
        });
    } else {
      let url = baseUrl + "/livepapers-published/" + lp_id;
      let config = {
        cancelToken: this.signal.token,
      };
      axios
        .get(url, config)
        .then((res) => {
          //   console.log(res);
          this.setState((prevState) => ({
            dataLPs: {
              ...prevState.dataLPs,
              [lp_id]: res.data,
            },
          }));
          if (open) {
            this.setState({
              lp_open_id: lp_id,
            });
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("error: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.setState((prevState) => ({
              dataLPs: {
                ...prevState.dataLPs,
                lp_id: null,
              },
            }));
          }
          updateHash("");
        });
    }
  }

  handleCloseLP() {
    this.setState({ lp_open_id: false });
    updateHash("");
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
  }

  renderDetailPanel(data) {
    // console.log(this.props.lp_open_id);

    if (data === null) {
      return (
        <div style={{ backgroundColor: "#FCF6E6", padding: 20 }}>
          Error in loading content!
        </div>
      );
    } else {
      return (
        <div
          style={{
            backgroundColor: "#FCF6E6",
            padding: 20,
            border: "1px solid #9E9E9E",
          }}
        >
          <div>
            <p style={{ fontSize: 14, marginTop: 0 }}>
              <b>Citation: </b>
            </p>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid #9E9E9E",
                borderRadius: 10,
                padding: 10,
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              {data["citation"]}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 14 }}>
              <b>DOI: </b>
            </p>
            <div
              style={{
                padding: 10,
                marginBottom: 45,
                clear: "both",
              }}
            >
              <span
                style={{
                  backgroundColor: "white",
                  border: "1px solid #9E9E9E",
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 14,
                  minWidth: "70%",
                  maxWidth: "70",
                  float: "left",
                  cursor: "pointer",
                }}
                onClick={() => window.open(data["doi"], "_blank")}
              >
                {data["doi"]}
              </span>
              <span
                style={{ width: "275px", textAlign: "right", float: "right" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "250px",
                    maxWidth: "250px",
                    backgroundColor: "#FF9800",
                    color: "#000000",
                    fontWeight: "bold",
                    border: "solid",
                    borderColor: "#000000",
                    borderWidth: "1px",
                  }}
                  onClick={() => this.setState({ lp_open_id: data["id"] })}
                >
                  Open Live Paper
                </Button>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    let lp_page = null;
    let errorModal = "";

    if (this.state.lp_open_id) {
      lp_page = (
        <LivePaperViewer
          open={this.state.lp_open_id !== false}
          data={this.state.dataLPs[this.state.lp_open_id]}
          onClose={this.handleCloseLP}
        />
      );
      updateHash(this.state.lp_open_id);
    }

    if (this.state.error) {
      errorModal = (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error}
        />
      );
    }
    // console.log(this.state.dataLPs);
    // console.log(this.state.selectedLPs);
    if (window.location.hash) {
      return (
        <div className="mycontainer" style={{ textAlign: "left" }}>
          {lp_page}
        </div>
      );
    } else {
      return (
        <div className="mycontainer" style={{ textAlign: "left" }}>
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
            complement published scientific articles. Interactivity is a
            prominent feature of the "Live Papers" with several integrated tools
            and services that will allow users to download, visualise or
            simulate data, models and results presented in the corresponding
            publications. The live papers allow for diverse types of resources
            to be presented, with practically no limitations.
            <br />
            <br />
            For more information on how to create or explore a live paper, you
            may refer to the documentation by clicking on the{" "}
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
            icon on the top-left of this page to open the live paper builder
            tool. The documentation also contains info on how to develop live
            papers using this tool.
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
          {this.state.loadingListing && <LoadingIndicator />}
          {!this.state.loadingListing && (
            <div
              style={{
                paddingLeft: "5%",
                paddingRight: "5%",
                textAlign: "justify",
              }}
            >
              <ThemeProvider theme={theme}>
                <MaterialTable
                  title="Published Live Papers"
                  data={this.state.lp_listing}
                  columns={TABLE_COLUMNS}
                  options={{
                    search: true,
                    paging: false,
                    filtering: false,
                    exportButton: false,
                    headerStyle: {
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#EEEEEE",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: 16,
                    },
                    rowStyle: (rowData) => ({
                      fontSize: 16,
                      backgroundColor: this.state.selectedLPs.includes(
                        rowData.tableData.id
                      )
                        ? "#FFECB3"
                        : "#FFFFFF",
                      paddingLeft: "10%",
                      marginLeft: "10%",
                      border: "solid",
                      borderWidth: 2,
                      borderColor: "#999999",
                    }),
                    // tableLayout: "fixed",
                  }}
                  detailPanel={[
                    {
                      icon: () => (
                        <Icon color="primary" style={{ marginLeft: 10 }}>
                          insert_drive_file
                        </Icon>
                      ),
                      openIcon: () => (
                        <Icon color="secondary" style={{ marginLeft: 10 }}>
                          find_in_page
                        </Icon>
                      ),
                      render: (rowData) => {
                        if (
                          !Object.keys(this.state.dataLPs).includes(
                            rowData.id
                          ) ||
                          this.state.dataLPs[rowData.id] === null
                        ) {
                          this.handleSelectedLP(rowData.id);
                          return <LoadingIndicator />;
                        } else {
                          return this.renderDetailPanel(
                            this.state.dataLPs[rowData.id]
                          );
                        }
                      },
                    },
                  ]}
                  onRowClick={(event, selectedRow, togglePanel) => {
                    // console.log(selectedRow.id);
                    togglePanel();
                    let selectedLPs = this.state.selectedLPs;
                    let index = selectedLPs.indexOf(selectedRow.tableData.id);
                    if (index !== -1) {
                      selectedLPs.splice(index, 1);
                    } else {
                      selectedLPs.push(selectedRow.tableData.id);
                    }
                    this.setState({ selectedLPs: selectedLPs });
                  }}
                  components={{
                    Toolbar: (props) => (
                      <div
                        style={{
                          backgroundColor: "#FFD180",
                        }}
                      >
                        <MTableToolbar {...props} />
                      </div>
                    ),
                  }}
                />
              </ThemeProvider>
            </div>
          )}
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
          {errorModal}
        </div>
      );
    }
  }
}
