import React from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import ContextMain from "./ContextMain";
import CreateLivePaperLoadPDFData from "./CreateLivepaper/CreateNewLivePaper/CreateLivePaperLoadPDFData";
import LoadKGProjects from "./CreateLivepaper/CreateNewLivePaper/LoadKGProjects";
import LoadingIndicatorModal from "./Form/LoadingIndicatorModal";
import ErrorDialog from "./HandleErrorsWarnings/ErrorDialog";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { livePaperPlatformUrl, livePaperDocsUrl } from "./globals";
import WarningBox from "./HandleErrorsWarnings/WarningBox";
import { WideButton } from "./Buttons";


import "./App.css";

import {
  baseUrl,
  separator,
  modelDB_baseUrl,
  neuromorpho_baseUrl,
  biomodels_baseUrl,
  corsProxy,
  filterModelDBKeys,
  filterNeuroMorphoKeys,
  filterBioModelsKeys,
  updateHash,
} from "./globals";
import {
  compareArrayoOfObjectsByOrder,
  replaceNullWithEmptyStrings,
} from "./utils";
import RainbowRow from "./RainbowRow";

class App extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      createLivePaperOpen: false,
      projectData: {},
      loadData: false,
      kg_project_list: null,
      loadProjectKGOpen: false,
      auth: props.auth || null,
      error: null,
      loading: false,
    };

    this.inputFileRef = React.createRef();

    this.handleCreateLivePaperOpen = this.handleCreateLivePaperOpen.bind(this);
    this.handleCreateLivePaperClose =
      this.handleCreateLivePaperClose.bind(this);
    this.handleLoadProjectFile = this.handleLoadProjectFile.bind(this);
    this.handleLoadProjectKG = this.handleLoadProjectKG.bind(this);
    this.handleLoadProjectKGClose = this.handleLoadProjectKGClose.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.getCollabList = this.getCollabList.bind(this);
    this.retrieveKGFilterValidValues =
      this.retrieveKGFilterValidValues.bind(this);
    this.retrieveModelDBFilterValidValues =
      this.retrieveModelDBFilterValidValues.bind(this);
    this.retrieveNeuroMorphoFilterValidValues =
      this.retrieveNeuroMorphoFilterValidValues.bind(this);
    this.retrieveBioModelsFilterValidValues =
      this.retrieveBioModelsFilterValidValues.bind(this);
    this.handleSpecifiedLP = this.handleSpecifiedLP.bind(this);
  }

  componentDidMount() {
    const [, setAuthContext] = this.context.auth;
    setAuthContext(this.props.auth);

    const [, setKgStatus] = this.context.kgStatus;
    axios.get(baseUrl).then((response) => {
      setKgStatus(response.data.status);
    });

    this.getCollabList(this.props.auth);
    this.retrieveKGFilterValidValues();
    this.retrieveModelDBFilterValidValues();
    this.retrieveNeuroMorphoFilterValidValues();
    this.retrieveBioModelsFilterValidValues();

    if (window.location.hash) {
      const lp_id = window.location.hash.slice(1);
      console.log(lp_id);
      this.handleSpecifiedLP(lp_id);
    }
  }

  handleSpecifiedLP(lp_id) {
    this.setState({ loading: true }, () => {
      let url = baseUrl + "/livepapers/" + lp_id;
      let config = {
        cancelToken: this.signal.token,
        headers: {
          Authorization: "Bearer " + this.context.auth[0].token,
        },
      };
      axios
        .get(url, config)
        .then((res) => {
          console.log(res.data);
          this.setState({
            loading: false,
          });
          this.handleLoadProjectKGClose(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("error: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            let error_message = "";
            try {
              error_message = err.response.data.detail;
            } catch {
              error_message = err;
            }
            this.setState({
              error: error_message,
            });
          }
          this.setState({
            loading: false,
          });
        });
    });
  }

  handleCreateLivePaperOpen() {
    this.setState({
      projectData: {},
      createLivePaperOpen: true,
      loadData: false,
    });
  }

  handleCreateLivePaperClose() {
    this.inputFileRef.current.value = "";
    this.setState({
      createLivePaperOpen: false,
      projectData: {},
      loadData: false,
    });
    updateHash("");
  }

  handleLoadProjectFile() {
    this.inputFileRef.current.click();
  }

  handleLoadProjectKG(attempt = 0) {
    if (!this.state.kg_project_list) {
      this.setState({ loading: true }, () => {
        let url = baseUrl + "/livepapers/?editable=true";
        let config = {
          cancelToken: this.signal.token,
          headers: {
            Authorization: "Bearer " + this.context.auth[0].token,
          },
        };
        axios
          .get(url, config)
          .then((res) => {
            //   console.log(res);
            if (res.data.length === 0 && attempt < 3) {
              // API Workaround: due to erratic API behavior
              this.handleLoadProjectKG(attempt + 1);
            } else {
              this.setState({
                kg_project_list: res.data,
                error: null,
                loading: false,
                loadProjectKGOpen: true,
              });
            }
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
              console.log("error: ", err.message);
            } else {
              // Something went wrong. Save the error in state and re-render.
              let error_message = "";
              try {
                error_message = err.response.data.detail;
              } catch {
                error_message = err;
              }
              this.setState({
                error: error_message,
              });
            }
            this.setState({
              loading: false,
            });
          });
      });
    } else {
      this.setState({
        error: null,
        loading: false,
        loadProjectKGOpen: true,
      });
    }
  }

  handleLoadProjectKGClose(data) {
    // console.log(data);
    if (data) {
      // along the lines of LivePaperPlatform.LivePaperViewer.componentDidMount()

      // replace null values with empty strings
      // avoids errors, e.g. `value` prop on `textarea` should not be null
      data = replaceNullWithEmptyStrings(data);
      if (data.corresponding_author === "") {
        data.corresponding_author = [];
      }

      // sort resource sections by order #
      data.resources.sort(compareArrayoOfObjectsByOrder);

      // handle useTabs for resources
      // KG doesn't have a separate field for saving tabs_name;
      // this is handled by appending it to the label with a separator (#-#)
      // we do the reverse when loading LP project from KG
      data.resources.forEach(function (res, index) {
        if (res.type !== "section_custom") {
          let tabs = [];
          res.data.forEach(function (res_item, index) {
            let parts = res_item.label.split(separator);
            if (parts.length > 1) {
              tabs.push(parts[1] || "");
              res_item.label = parts[0];
              res_item.tab_name = parts[1];
            }
          });
          // get only unique elements
          tabs = tabs.filter((x, i, a) => a.indexOf(x) === i);
          // add tab names to resource data
          res["useTabs"] = tabs.length > 1 || tabs[0] !== "" ? true : false;
        }
      });

      this.setState({
        loadProjectKGOpen: false,
        projectData: data,
        loadData: true,
        createLivePaperOpen: true,
      });
      updateHash(data["id"]);
    } else {
      this.setState({
        loadProjectKGOpen: false,
      });
    }
  }

  onFileSelect(event) {
    if (event.target.files.length === 1) {
      var data = "";
      const scope = this;
      const reader = new FileReader();
      reader.onload = function (that) {
        data = JSON.parse(reader.result);
        // let remove_keys = ["lp_tool_version", "modified_date"];
        // remove_keys.forEach((k) => delete data[k]);

        // sort resource sections by order #
        data.resources.sort(compareArrayoOfObjectsByOrder);

        // handle useTabs for resources
        data.resources.forEach(function (res, index) {
          console.log(res);
          if (res.type !== "section_custom") {
            let tabs = [];
            res.data.forEach(function (res_item, index) {
              tabs.push(res_item.tab_name || "");
            });
            // get only unique elements
            tabs = tabs.filter((x, i, a) => a.indexOf(x) === i);
            // add tab names to resource data
            res["useTabs"] = tabs.length > 1 || tabs[0] !== "" ? true : false;
          }
        });

        // console.log(data);
        scope.setState({
          projectData: data,
          loadData: true,
          createLivePaperOpen: true,
        });
      };
      reader.readAsText(event.target.files[0]);
    } else {
      this.setState({ projectData: {}, loadData: false });
    }
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
  }

  getCollabList(auth, attempt = 0) {
    const url = baseUrl + "/projects?only_editable=true";
    console.log(auth);
    if (!auth.token) {
      console.log("ERROR: auth token not available!");
    }
    const config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + auth.token },
    };
    axios
      .get(url, config)
      .then((res) => {
        if (res.data.length === 0 && attempt < 3) {
          // API Workaround: due to erratic API behavior
          this.getCollabList(auth, attempt + 1);
        } else {
          let editableProjects = [];
          res.data.forEach((proj) => {
            editableProjects.push(proj.project_id);
          });
          const [, setCollabList] = this.context.collabList;
          setCollabList(editableProjects);
          // console.log(editableProjects);
          console.log(editableProjects.length);
        }
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  retrieveKGFilterValidValues() {
    let url = baseUrl + "/vocab/";
    let config = {
      cancelToken: this.signal.token,
      headers: { Authorization: "Bearer " + this.context.auth[0].token },
    };
    axios
      .get(url, config)
      .then((res) => {
        const [, setValidKGFilterValues] = this.context.validKGFilterValues;
        setValidKGFilterValues(res.data);
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  retrieveModelDBFilterValidValues() {
    let modelDBReqs = [];
    for (let item of filterModelDBKeys) {
      let url = corsProxy + modelDB_baseUrl + "/" + item + "/name";
      modelDBReqs.push(axios.get(url));
    }
    const context = this.context;

    Promise.all(modelDBReqs).then(function (res) {
      console.log(res);
      let data_dict = {};

      filterModelDBKeys.forEach(function (item, i) {
        data_dict[item] = res[i].data;
      });
      const [, setValidModelDBFilterValues] = context.validModelDBFilterValues;
      setValidModelDBFilterValues(data_dict);
    });
  }

  retrieveNeuroMorphoFilterValidValues() {
    let neuroMorphoReqs = [];
    for (let item of filterNeuroMorphoKeys) {
      let url = neuromorpho_baseUrl + "/neuron/fields/" + item;
      neuroMorphoReqs.push(axios.get(url));
    }
    const context = this.context;

    Promise.all(neuroMorphoReqs).then(function (res) {
      console.log(res);
      let data_dict = {};

      filterNeuroMorphoKeys.forEach(function (item, i) {
        data_dict[item] = res[i].data.fields;
      });
      console.log(data_dict);
      const [, setValidNeuroMorphoFilterValues] =
        context.validNeuroMorphoFilterValues;
      setValidNeuroMorphoFilterValues(data_dict);
    });
  }

  retrieveBioModelsFilterValidValues() {
    let url = corsProxy + biomodels_baseUrl + "/search?query=*%3A*&format=json";
    axios
      .get(url)
      .then((res) => {
        // create list of shortlisted filters
        let filters = {};
        console.log(res);
        for (let item of res.data.facets) {
          if (filterBioModelsKeys.includes(item.id)) {
            filters[item.id] = [];
            for (let option of item.facetValues) {
              filters[item.id].push(option.value);
            }
          }
        }
        console.log(filters);
        const [, setValidBioModelsFilterValues] =
          this.context.validBioModelsFilterValues;
        setValidBioModelsFilterValues(filters);
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  }

  render() {
    // console.log(this.props);
    var createLivePaperContent = "";
    if (this.state.createLivePaperOpen) {
      createLivePaperContent = (
        <CreateLivePaperLoadPDFData
          open={this.state.createLivePaperOpen}
          onClose={this.handleCreateLivePaperClose}
          data={this.state.projectData}
          loadData={this.state.loadData}
        />
      );
    }

    let errorModal = "";
    if (this.state.error) {
      errorModal = (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error}
        />
      );
    }

    let loadProjectListModal = "";
    if (this.state.loadProjectKGOpen) {
      loadProjectListModal = (
        <LoadKGProjects
          kg_project_list={this.state.kg_project_list}
          open={this.state.loadProjectKGOpen}
          onClose={this.handleLoadProjectKGClose}
        />
      );
    }

    let [kgStatus] = this.context.kgStatus;

    return (
      <div className="mycontainer" style={{ textAlign: "left" }}>
        <LoadingIndicatorModal open={this.state.loading} />
        <div
          className="box rounded centered"
          style={{
            marginTop: "25px",
            paddingTop: "0.25em",
            paddingBottom: "0.25em",
            marginBottom: "1em",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: 1,
                textAlign: "left",
                paddingLeft: "25px",
                alignSelf: "center",
              }}
            >
              <Tooltip title={"Open EBRAINS Homepage"}>
                <a
                  href="https://ebrains.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: "center" }}
                >
                  <img
                    src="./imgs/General_logo_Landscape_White.svg"
                    alt="EBRAINS logo"
                    style={{ height: "70px", cursor: "pointer" }}
                  />
                </a>
              </Tooltip>
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "right",
                paddingRight: "25px",
                alignSelf: "center",
              }}
            >
              <Tooltip title={"See Live Papers"}>
                <a
                  href={livePaperPlatformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ paddingRight: "10px" }}
                >
                  <IconButton aria-label="See Live Papers">
                    <LibraryBooksIcon fontSize="large" />
                  </IconButton>
                </a>
              </Tooltip>
              <Tooltip title={"Open Documentation"}>
                <a
                  href={livePaperDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton aria-label="Open Documentation">
                    <HelpOutlineIcon fontSize="large" />
                  </IconButton>
                </a>
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 1.75,
            paddingBottom: "20px",
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>
            EBRAINS Live Paper Builder
          </div>
          <div
            className="title-solid-style"
            style={{ fontSize: 32, color: "#00A595" }}
          >
            Quickly create and distribute interactive live papers
          </div>
        </div>
        <div style={{ marginBottom: "40px" }}>
          <RainbowRow />
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
            Welcome to the EBRAINS live paper builder!
          </strong>
          <br />
          <WarningBox message={kgStatus} />
          <br />
          Here you can start building a new live paper linked to your manuscript
          or published article. The live paper builder allows you to build the
          live paper without any web development skills. Various functionalities
          for building a simple to moderately complex live paper is made
          available via this tool. For more advanced features and
          customizations, the users can edit the live Papers generated by this
          tool.
          <br />
          <br />
          Live papers are often not produced in one go, and might require
          revisions over time. Keeping this in mind, we allow users to download
          "live paper projects" at any point of development. These project files
          can be loaded later, to continue from where you had left off. Please
          note, that these project files should not be manually edited as it
          could render them unreadable by the tool. Alternatively, users also
          have the option of loading an existing project that was previously
          saved on the EBRAINS Knowledge Graph.
          <br />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <WideButton
              backgroundColor="#00A595"
              onClick={this.handleCreateLivePaperOpen}
              label="Create New"
              />
            <br />
            <br />
            <WideButton
              backgroundColor="#4DC26D"
              onClick={this.handleLoadProjectFile}
              label="Load From File"
            />
            <br />
            <br />
            <WideButton
              backgroundColor="#9CE142"
              onClick={this.handleLoadProjectKG}
              label="Load From KG"
            />
          </div>
        </div>
        <br />
        <br />
        <RainbowRow />
        <br />
        <br />
        <div>{createLivePaperContent}</div>
        <div>
          <input
            id="fileInput"
            type="file"
            ref={this.inputFileRef}
            style={{ display: "none" }}
            accept=".lpp"
            onChange={this.onFileSelect}
          />
        </div>
        {loadProjectListModal}
        {errorModal}
      </div>
    );
  }
}
export default App;
