import React from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import ContextMain from "./ContextMain";
import CreateLivePaperLoadPDFData from "./CreateLivePaperLoadPDFData";
import LoadKGProjects from "./LoadKGProjects";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";
import TopNavigation from "./TopNavigation";
import { baseUrl, separator } from "./globals";
import {
  compareArrayoOfObjectsByOrder,
  replaceNullWithEmptyStrings,
} from "./utils";

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
  }

  componentDidMount() {
    const [, setAuthContext] = this.context.auth;
    setAuthContext(this.props.auth);
    // console.log("Here: ", this.props.auth.token);
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
  }

  handleLoadProjectFile() {
    this.inputFileRef.current.click();
  }

  handleLoadProjectKG() {
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
          this.setState({
            kg_project_list: res.data,
            error: null,
            loading: false,
            loadProjectKGOpen: true,
          });
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

  handleLoadProjectKGClose(data) {
    // console.log(data);
    if (data) {
      // along the lines of LivePaperPlatform.LivePaperViewer.componentDidMount()

      // replace null values with empty strings
      // avoids errors, e.g. `value` prop on `textarea` should not be null
      data = replaceNullWithEmptyStrings(data);

      // sort resource sections by order #
      data.resources.sort(compareArrayoOfObjectsByOrder);

      // KG requires 'dataFormatted' value for SectionCustom in 'description' field
      // doing reverse mapping here
      data.resources.forEach(function (res, index) {
        // creating extra copy here to handle problem with shallow copy of nested object
        let temp_res = JSON.parse(JSON.stringify(res));
        if (res.type === "section_custom") {
          res.dataFormatted = temp_res.description;
          delete res.description;
        }
      });

      // handle useTabs for resources
      // KG doesn't have a separate field for saving tabs_name;
      // this is handled by appending it to the label with a separator (#-#)
      // we do the reverse when loading LP project from KG
      data.resources.forEach(function (res, index) {
        if (res.type !== "section_custom") {
          let tabs = [];
          res.dataFormatted.forEach(function (res_item, index) {
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
          if (res.type !== "section_custom") {
            let tabs = [];
            res.dataFormatted.forEach(function (res_item, index) {
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

    return (
      <div className="container" style={{ textAlign: "left" }}>
        <LoadingIndicatorModal open={this.state.loading} />
        <TopNavigation />
        <div className="box rounded centered" style={{ marginTop: "5px" }}>
          <a
            href="../../index.html"
            className="waves-effect waves-light"
            style={{ textAlign: "center", color: "black" }}
          >
            <table>
              <tbody>
                <tr>
                  <td>
                    <img
                      className="ebrains-icon-small"
                      src="./imgs/ebrains_logo.png"
                      alt="EBRAINS logo"
                      style={{ width: "25px", height: "25px" }}
                    />
                  </td>
                  <td>
                    <span
                      className="title-style subtitle"
                      style={{ paddingLeft: "5px" }}
                    >
                      EBRAINS Live Papers
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </a>
          <h5 className="title-style">Live Paper Builder</h5>
        </div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
          }}
        >
          <strong>Welcome to the EBRAINS live paper builder!</strong>
          <br />
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
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{
              width: "27.5%",
              backgroundColor: "#FF9800",
              color: "#000000",
              fontWeight: "bold",
              border: "solid",
              borderColor: "#000000",
              borderWidth: "1px",
            }}
            onClick={this.handleCreateLivePaperOpen}
          >
            Create New
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            color="secondary"
            style={{
              width: "27.5%",
              backgroundColor: "#01579b",
              fontWeight: "bold",
              border: "solid",
              borderColor: "#000000",
              borderWidth: "1px",
            }}
            onClick={this.handleLoadProjectFile}
          >
            Load From File
          </Button>
          <br />
          <br />
          <Button
            variant="contained"
            color="secondary"
            style={{
              width: "27.5%",
              backgroundColor: "#1D7021",
              fontWeight: "bold",
              border: "solid",
              borderColor: "#000000",
              borderWidth: "1px",
            }}
            onClick={this.handleLoadProjectKG}
          >
            Load From KG
          </Button>
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
