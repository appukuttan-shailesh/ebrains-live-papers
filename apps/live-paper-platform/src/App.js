import React from "react";
import Button from "@material-ui/core/Button";
import TopNavigation from "./TopNavigation";
import LoadingIndicator from "./LoadingIndicator";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import InsertDriveFileTwoToneIcon from "@material-ui/icons/InsertDriveFileTwoTone";
import NoteAddTwoToneIcon from "@material-ui/icons/NoteAddTwoTone";
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
// import { TwitterTimelineEmbed } from "react-twitter-embed";
import { Timeline } from "react-twitter-widgets";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import "./App.css";

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

// define the columns for the material data table
const TABLE_COLUMNS = [
  {
    title: "",
    field: "associated_paper_title",
    width: "30px",
    render: (item) => (
      <Tooltip
        title={
          item.associated_paper_title
            ? "Publication Associated Live Paper"
            : "Standalone Live Paper"
        }
      >
        {item.associated_paper_title ? (
          <InsertDriveFileTwoToneIcon
            style={{ color: "#FF6900", fontSize: 30, marginLeft: 10 }}
          />
        ) : (
          <NoteAddTwoToneIcon
            style={{ color: "#FF6900", fontSize: 30, marginLeft: 10 }}
          />
        )}
      </Tooltip>
    ),
  },
  {
    title: "Paper Title",
    field: "live_paper_title",
    render: (item) => (
      <div style={{ marginLeft: 0 }}>
        <p>
          <b>{item.live_paper_title}</b>
        </p>
        <p>
          <i>{item.citation}</i>
        </p>
      </div>
    ),
    customFilterAndSearch: (value, item) => {
      if (
        item.live_paper_title
          .concat(item.citation)
          .toLowerCase()
          .includes(value.toLowerCase())
      ) {
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
      MuiTableRow: {
        hover: {
          "&:hover": {
            backgroundColor: "#FFECB3 !important",
          },
        },
      },
    },
  },
});

const useStyles = makeStyles({
  root: {
    width: "100%",
    marginLeft: "5%",
    marginRight: "5%",
    // maxWidth: 325,
  },
  media: {
    height: 140,
  },
});

function MediaCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card
        style={{
          width: "90%",
          backgroundColor: "#FFECB3",
          borderStyle: "solid",
          borderWidth: 2,
        }}
      >
        <CardActionArea
          onClick={() => window.open("/#" + props.alias)}
        >
          <CardMedia
            className={classes.media}
            image={props.image_url}
            title={props.title}
            style={{ height: 200, borderBottom: "solid 1px" }}
          />
          <CardContent style={{ marginLeft: 5, marginRight: 5 }}>
            <div style={{ height: 85 }}>
              <ResponsiveEllipsis
                text={props.title}
                maxLine="3"
                ellipsis="..."
                trimRight
                basedOn="letters"
                style={{
                  fontSize: 16,
                  fontWeight: "bolder",
                  lineHeight: "1.5",
                }}
              />
            </div>
            <div style={{ height: 50 }}>
              <ResponsiveEllipsis
                text={props.citation}
                maxLine="3"
                ellipsis="..."
                trimRight
                basedOn="letters"
                style={{
                  fontSize: 14,
                  fontStyle: "oblique",
                  lineHeight: "1.5",
                }}
              />
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ marginLeft: 5, marginRight: 5 }}>
          <Button
            size="small"
            color="primary"
            style={{ fontWeight: "bolder" }}
            onClick={() => window.open("/#" + props.alias)}
          >
            Access Live Paper
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default class App extends React.Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);

    this.state = {
      lp_listing: [],
      loadingListing: false,
      loadingSelectedLP: false,
      error: null,
      dataLPs: {}, // keys are LP UUIDs or aliases; will cache data once loaded; alias key will have value of UUID
      lp_open_id: false, // UUID or alias
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
      const lp_id = window.location.hash.slice(1);
      console.log(lp_id);
      this.handleSelectedLP(lp_id, true);
    }
  }

  handleLoadListingLP() {
    this.setState({ loadingListing: true }, () => {
      axios
        .get("/cache/summary.json")
        .then((res) => {
          console.log("Found listing in server cache!");
          console.log(res);
          this.setState({
            lp_listing: res.data,
            loadingListing: false,
            error: null,
          });
          return
        })
        .catch((err) => {
          console.log("Error finding listing in server cache!");
          console.log(err);

          // if LP listing data not found in server cache, then fetch from KG
          let url = baseUrl + "/livepapers-published/";
          let config = {
            cancelToken: this.signal.token,
          };
          axios
            .get(url, config)
            .then((res2) => {
              // console.log(res2);
              this.setState({
                lp_listing: res2.data,
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
        })
    });
  }

  handleSelectedLP(lp_id, open = false) {
    // Note: lp_id can be UUID or alias
    // Workflow:
    // 1) locally cached: check if LP data in cache; if yes, load LP
    // 2) server cached: check if LP data in server cache; if yes, fetch and load LP
    // 3) published: check if LP published; if yes, fetch LP, add to cache
    // 4) password-protected: check if LP in GET all LPs  (-> password-protected)
    // Note: does not handle

    this.setState({ loadingSelectedLP: true }, () => {

      // 1) check if LP in local cache
      if (
        Object.keys(this.state.dataLPs).includes(lp_id) &&
        this.state.dataLPs[lp_id] !== null
      ) {
        // 1) cached: check if LP data in cache; if yes, load LP
        console.log("Found LP in local cache!");
        this.setState({
          lp_open_id: lp_id,
          loadingSelectedLP: false,
        });
        return;
      }

      // 2) check if LP in server cache
      axios
        .get("/cache/" + lp_id + ".json")
        .then((res) => {
          console.log("Found LP in server cache!");
          console.log(res);
          this.setState((prevState) => ({
            dataLPs: {
              ...prevState.dataLPs,
              [res.data.id]: res.data,
              [res.data.alias]: res.data.id,
            },
            loadingSelectedLP: false,
            lp_open_id: open ? lp_id : false,
          }));
          return
        })
        .catch((err) => {
          console.log("Error finding LP in server cache!");
          console.log(err);

          // 3) published: check if LP published; if yes, fetch LP, add to cache
          let context = this;
          console.log("Get LP data from KG");
          let url = baseUrl + "/livepapers-published/" + lp_id;
          let config = {
            cancelToken: this.signal.token,
          };
          axios
            .get(url, config)
            .then((res) => {
              // console.log(res);
              // 3.1) found
              // cache response with UUID key; alias key points to UUID
              this.setState((prevState) => ({
                dataLPs: {
                  ...prevState.dataLPs,
                  [res.data.id]: res.data,
                  [res.data.alias]: res.data.id,
                },
                loadingSelectedLP: false,
                lp_open_id: open ? lp_id : false,
              }));
              return;
            })
            .catch((err) => {
              // 3.2) not found
              if (axios.isCancel(err)) {
                console.log("error: ", err.message);
              } else {
                // 4) password-protected: check if LP in GET all LPs  (-> password-protected)
                url = baseUrl + "/livepapers/" + lp_id;
                axios
                  .get(url, config)
                  .then((res2) => {
                    console.log("Code not expected to reach here!");
                    return;
                  })
                  .catch((err) => {
                    if (axios.isCancel(err)) {
                      console.log("error: ", err.message);
                    } else {
                      if (err.response.status === 403) {
                        console.log("Password-protected Live Paper");
                        // 4.1) found
                        // only UUID here, as alias assigned only after publication (not for password-protected)
                        let context = this;
                        const password = prompt(
                          "Please enter the live paper password:"
                        );
                        let hash = saltedMd5(password, lp_id).toString();
                        config = {
                          cancelToken: context.signal.token,
                          headers: {
                            Authorization: "Bearer " + hash,
                            "Content-type": "application/json",
                          },
                        };
                        axios
                          .get(url, config)
                          .then((res3) => {
                            // console.log(res3);
                            context.setState((prevState) => ({
                              dataLPs: {
                                ...prevState.dataLPs,
                                [res3.data.id]: res3.data,
                              },
                              loadingSelectedLP: false,
                              lp_open_id: open ? lp_id : false,
                            }));
                            // console.log(lp_id);
                            // console.log(open);
                          })
                          .catch((err) => {
                            console.log(err);
                            let error_message = err.message;
                            if (err.response.status === 401) {
                              error_message = "Live Paper password is incorrect!";
                            }
                            if (err.response.status === 404) {
                              error_message = "You have requested a non-existent Live Paper!";
                            }
                            context.setState({
                              error: error_message,
                              loadingSelectedLP: false,
                            });
                            updateHash("");
                            context.forceUpdate();
                          });
                      } else {
                        // 4.2) not found
                        // Something went wrong. Save the error in state and re-render.
                        context.setState({
                          error: err.message,
                          loadingSelectedLP: false,
                        });
                        updateHash("");
                        context.forceUpdate();
                      }
                    }
                  });
              }
            });
        })
    });
  }

  handleCloseLP() {
    this.setState({ lp_open_id: false });
    updateHash("");
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
  }

  render() {
    let lp_page = null;
    let errorModal = "";
    // console.log(this.state.lp_open_id);
    if (this.state.lp_open_id) {
      lp_page = (
        <LivePaperViewer
          open={this.state.lp_open_id !== false}
          data={
            this.state.dataLPs[
            isUUID(this.state.lp_open_id)
              ? this.state.lp_open_id
              : this.state.dataLPs[this.state.lp_open_id]
            ]
          }
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
    // console.log(window.location.hash);
    // console.log(lp_page);
    // console.log(this.state.loadingSelectedLP);
    if (window.location.hash) {
      return (
        <div className="mycontainer" style={{ textAlign: "left" }}>
          {lp_page}
        </div>
      );
    } else {
      return (
        <div
          className="mycontainer"
          style={{
            textAlign: "left",
          }}
        >
          <TopNavigation />
          <LoadingIndicatorModal open={this.state.loadingSelectedLP} />
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
              fontSize: 16,
              lineHeight: 1.75,
            }}
          >
            <strong style={{ fontSize: 18 }}>
              Welcome to the EBRAINS live paper platform!
            </strong>
            <br />
            <br />
            EBRAINS Live Papers are structured and interactive documents that
            complement published scientific articles. Interactivity is a
            prominent feature of the "Live Papers" with several integrated tools
            and services that will allow users to download, visualise or
            simulate data, models and results presented in the corresponding
            publications. The live papers allow for diverse types of resources
            to be presented, with practically no limitations.
          </div>
          {/* <div
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          > */}
          <div className="box rounded centered" style={{ width: "90%" }}>
            <span
              style={{
                fontWeight: "bolder",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Featured Live Papers
            </span>
          </div>
          <div
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          >
            <Slider
              {...{
                autoplay: true,
                autoplaySpeed: 5000,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      infinite: true,
                      dots: true,
                    },
                  },
                  {
                    breakpoint: 900,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      initialSlide: 2,
                    },
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ],
              }}
            >
              <MediaCard
                id="bee280cc-8184-4380-a2cb-a74b131de611"
                alias="2021-saray-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2021_saray_et_al.jpg"
                }
                image_title={"Saray et al., 2020"}
                title={
                  "HippoUnit: A software tool for the automated testing and systematic comparison of detailed models of hippocampal neurons based on electrophysiological data"
                }
                citation={
                  "Sáray, S., Rössert, C. A., Appukuttan, S., Migliore, R., Vitale, P., Lupascu, C. A., ... & Káli, S. (2021). PLoS computational biology, 17(1), e1008114."
                }
              />
              <MediaCard
                id="93a5c03a-6995-47bc-af9f-4f0d85950d1d"
                alias="2020-lupascu-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2020_lupascu_et_al.jpg"
                }
                image_title={"Lupascu et al., 2020"}
                title={
                  "Computational modeling of inhibitory transsynaptic signaling in hippocampal and cortical neurons expressing intrabodies against gephyrin"
                }
                citation={
                  "Lupascu CA, Morabito A, Ruggeri F, Parisi C, Pimpinella D, Pizzarelli R, Meli G, Marinelli S, Cherubini E, Cattaneo A & Migliore M (2020). Frontiers in Celllular Neuroscience, In press."
                }
              />
              <MediaCard
                id="c1573aeb-d139-42a2-a7fc-fd68319e428e"
                alias="2018-migliore-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2018_migliore_et_al.jpg"
                }
                image_title={"Migliore et al., 2018"}
                title={
                  "The physiological variability of channel density in hippocampal CA1 pyramidal cells and interneurons explored using a unified data-driven modeling workflow"
                }
                citation={
                  "Migliore R, Lupascu CA, Bologna LL, Romani A, Courcol J-D, Antonel S, et al. (2018). PLoS Comput Biol 14(9): e1006423."
                }
              />
              <MediaCard
                id="b6917332-e092-4bf3-bf31-3f0d212ff861"
                alias="2019-bruce-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2019_bruce_et_al.jpg"
                }
                image_title={"Bruce et al., 2019"}
                title={
                  "Regulation of adenylyl cyclase 5 in striatal neurons confers the ability to detect coincident neuromodulatory signals"
                }
                citation={
                  "Bruce NJ, Narzi D, Trpevski D, van Keulen SC, Nair AG, Röthlisberger U, et al. (2019). PLoS Comput Biol 15(10): e1007382."
                }
              />
              <MediaCard
                id="cf895d83-49b8-4c72-b1ac-8b974bbe4eb5"
                alias="2019-kokh-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2019_kokh_et_al.jpg"
                }
                image_title={"Kokh et al., 2019"}
                title={
                  "Machine Learning Analysis of τRAMD Trajectories to Decipher Molecular Determinants of Drug-Target Residence Times"
                }
                citation={
                  "Kokh DB, Kaufmann T, Kister B, Wade RC(2019). Front. Mol. Biosci."
                }
              />
              <MediaCard
                id="67806cc2-84e0-4bb3-ae52-8cc3e5abf738"
                alias="2020-hjorth-et-al"
                image_url={
                  "https://object.cscs.ch/v1/AUTH_c0a333ecf7c045809321ce9d9ecdfdea/EBRAINS_live_papers/featured_thumbs/2020_hjorth_et_al.jpg"
                }
                image_title={"Hjorth et al., 2020"}
                title={"The microcircuits of striatum in silico"}
                citation={
                  "Hjorth J, Kozlov A, Carannante I, Frost Nylén J, Lindroos R, Johansson Y, Tokarska A, Dorst MC, Suryanarayana SM, Silberberg G, Hellgren Kotaleski J, Grillner S (2020). Proc Natl Acad Sci USA."
                }
              />
            </Slider>
          </div>
          <br />
          <br />
          <div
            className="rainbow-row"
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              textAlign: "justify",
            }}
          >
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
          <div
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
              textAlign: "justify",
            }}
          >
            <Grid container>
              <Grid item xs={8}>
                <div
                  style={{
                    paddingLeft: "2.5%",
                    paddingRight: "2.5%",
                    textAlign: "justify",
                    fontSize: 16,
                    lineHeight: 1.75,
                  }}
                >
                  For information on how to create or explore a live paper, you
                  may refer to the documentation by clicking on the{" "}
                  <HelpOutlineIcon
                    fontSize="small"
                    style={{ verticalAlign: "text-bottom" }}
                  />{" "}
                  icon on the top-left of this page. If you wish to develop a
                  new live paper, please click on the{" "}
                  <BuildIcon
                    fontSize="small"
                    style={{ verticalAlign: "text-bottom" }}
                  />{" "}
                  icon on the top-left of this page to open the live paper
                  builder tool. The documentation also contains info on how to
                  develop live papers using this tool.
                </div>
                <div
                  className="note rounded intro"
                  style={{
                    marginLeft: "5%",
                    marginRight: "5%",
                    width: "90%",
                    textAlign: "justify",
                    fontSize: 16,
                    lineHeight: 1.75,
                  }}
                >
                  <strong>Note:</strong> Some of the integrated tools used in
                  the Live Papers require an EBRAINS account. If you do not have
                  an account yet and are interested in getting one, you can do
                  so by visiting:&nbsp;
                  <a
                    href="https://ebrains.eu/register"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ebrains.eu/register
                  </a>
                  . It is free and simple to create a new account, and mainly
                  requires an institutional email account.
                </div>
                <div
                  style={{
                    paddingLeft: "5%",
                    paddingRight: "5%",
                    textAlign: "justify",
                    fontSize: 16,
                    lineHeight: 1.75,
                  }}
                >
                  For any issues regarding usability or accessibility of
                  resources, users are requested to contact{" "}
                  <a
                    href="https://ebrains.eu/support"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ebrains.eu/support
                  </a>{" "}
                  for further assistance.
                </div>
              </Grid>
              <Grid item xs={4}>
                <div
                  style={{
                    paddingLeft: "5%",
                    paddingRight: "5%",
                    textAlign: "justify",
                  }}
                >
                  {/* <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="HumanBrainProj"
                    borderColor="#F44336"
                    noHeader
                    noFooter
                    options={{ height: 400 }}
                  /> */}
                  <Timeline
                    dataSource={{
                      sourceType: "profile",
                      screenName: "HumanBrainProj",
                    }}
                    options={{
                      height: "400",
                      chrome: "noheader, nofooter",
                      borderColor: "#F44336",

                      id: "profile:HumanBrainProj",
                    }}
                  />
                </div>
              </Grid>
            </Grid>
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
                    rowStyle: {
                      fontSize: 16,
                      paddingLeft: "10%",
                      marginLeft: "10%",
                      border: "solid",
                      borderWidth: 2,
                      borderColor: "#999999",
                    },
                    // tableLayout: "fixed",
                  }}
                  onRowClick={(event, selectedRow) => {
                    // console.log(selectedRow.alias);
                    window.open("/#" + selectedRow.alias);
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
