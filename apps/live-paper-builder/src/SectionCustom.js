import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import HelpIcon from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";
import DialogConfirm from "./DialogConfirm";
import { Converter } from "showdown";
import prettier from "prettier/standalone";
import html from "prettier/parser-html";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver"
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-tomorrow";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ForwardIcon from "@material-ui/icons/Forward";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import styled from "styled-components";

function HelpContentCustom() {
  const example_markdown = `
    #### Sample Table

    | # | Model     | Status      |
    |---|-----------|-------------|
    | 1 | Model v1  | Published   |
    | 2 | Model v2  | Published   |
    | 3 | Model v2a | Development |
    `;

  const example_html = `
    <h4 id="sampletable">Sample Table</h4>
    <table>
        <thead>
            <tr>
                <td>#</td>
                <td>Model</td>
                <td>Status</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Model v1</td>
                <td>Published</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Model v2</td>
                <td>Published</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Model v2a</td>
                <td>Development</td>
            </tr>
        </tbody>
    </table>`;

  return (
    <div>
      You can enter custom content using either Markdown syntax or HTML.
      <br/>
      <b>Note: </b>Markdown content will be automatically converted to 
      equivalent HTML syntax.
      <br />
      <br />
      <h6>
        <b>Example of Markdown input:</b>
      </h6>
      <pre>
        <code>{example_markdown}</code>
      </pre>
      <h6>
        <b>Example of HTML input:</b>
      </h6>
      <pre>
        <code>{example_html}</code>
      </pre>
      <br/>
      <hr/>
      <br/>
      <h6>
        <b>Live Paper CSS & JS dependencies</b>
      </h6>
      <br/>
      <div>
        Live Papers make use of a series of CSS and JS libraries, such as&nbsp;
        <a href="https://materializecss.com/" 
          target="_blank" 
          rel="noreferrer">Materialize CSS</a>.
        These are imported by default in every sheet.<br/>
        Please bear this in mind when developing your own custom Live Paper section with additional dependencies to avoid conflicts.<br/><br/>
        To view a complete list of the CSS and JS dependencies, check&nbsp;
        <a href="https://github.com/appukuttan-shailesh/ebrains-live-papers/blob/main/apps/live-paper-platform/src/templates/LivePaper_v0.1.njk#L485-L498" 
          target="_blank" 
          rel="noreferrer">here</a>.  
      </div>
      <br/>
    </div>
  );
}

const Icon = styled((props) => (
  <div {...props} style={{ color: "#000000" }}>
    <div className="y">
      <span style={{ verticalAlign: "middle" }}>
        <UnfoldMoreIcon />
      </span>
    </div>
    <div className="n">
      <span style={{ verticalAlign: "middle" }}>
        <UnfoldLessIcon />
      </span>
    </div>
  </div>
))`
  & > .y {
    display: block;
  }
  & > .n {
    display: none;
  }
  .Mui-expanded & > .n {
    display: block;
  }
  .Mui-expanded & > .y {
    display: none;
  }
`;

export default class SectionCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: null,
      type: "section_custom",
      title: "Custom Section",
      icon: "check_box_outline_blank",
      description: "",
      // NOTE: in KG schema, data is stored under "description" field (for schema purposes),
      // and "data" field is set to []
      data: [],
      showHelp: false,
      deleteOpen: false,
      expanded: true,
      expandSection: false,
      ...props.data,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.toggleExpandSection = this.toggleExpandSection.bind(this);
  }

  componentDidMount() {
    this.props.storeSectionInfo(this.state);
  }

  toggleExpanded() {
    console.log(this.state.expanded);
    this.setState(
      (prevState) => ({
        expanded: !prevState.expanded,
      }),
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  toggleExpandSection() {
    this.setState((prevState) => ({
      expandSection: !prevState.expandSection,
    }));
  }

  handleDelete(flag) {
    console.log(flag);
    this.setState({ deleteOpen: false });
    if (flag) {
      this.props.handleDelete(this.state.order);
    }
  }

  handleMoveDown(event) {
    event.stopPropagation();
    this.props.handleMoveDown(this.state.order);
  }

  handleMoveUp(event) {
    event.stopPropagation();
    this.props.handleMoveUp(this.state.order);
  }

  handleFieldChange(event) {
    console.log(event);
    const target = event.target;
    let value = target.value;
    const name = target.name;
    // console.log(name + " => " + value);
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  handleCodeChange(value) {
    console.log(value);
    this.setState(
      {
        description: value,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  setIcon(icon_name) {
    this.setState(
      {
        icon: icon_name,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  clickHelp() {
    this.setState({
      showHelp: true,
    });
  }

  handleHelpClose() {
    this.setState({
      showHelp: false,
    });
  }

  handleDataInputOnBlur(event, editor) {
    const converter = new Converter({ tables: true });
    let code = converter.makeHtml(this.state.description);
    console.log(this.state.description);
    console.log(code);
    try {
      code = prettier.format(code, {
        parser: "html",
        plugins: [html]
      });
      console.log(code);
    } catch (error) {
      console.log("Error using prettier on code. Potentially invalid HTML syntax!");
    }
    
    this.setState(
      {
        description: code,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  render() {
    return (
      <div style={{ width: "100%", paddingTop: "25px", paddingBottom: "25px" }}>
        <Accordion
          expanded={this.state.expanded}
          onChange={this.toggleExpanded}
        >
          <AccordionSummary
            expandIcon={<Icon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderStyle: "solid",
              borderColor: "#525252",
              borderWidth: "2px",
              backgroundColor: "#ABABAB",
              fontWeight: "bold",
              color: "#000000",
              width: "100%",
              paddingRight: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontWeight: "bolder",
                  fontSize: 16,
                  color: "#000000",
                }}
              >
                <span style={{ verticalAlign: "middle" }}>
                  Section: Custom HTML / Markdown
                </span>
              </div>
              <div>
                <Tooltip title="Delete this section">
                  <DeleteForeverIcon
                    style={{
                      height: "25px",
                      width: "25px",
                      marginRight: "30px",
                      color: "#000000",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      this.setState({ deleteOpen: true });
                    }}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
                <Tooltip title="Move section down">
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      marginRight: "30px",
                      transform: `rotate(90deg)`,
                      color:
                        this.state.order === this.props.numResources - 1
                          ? "#A1887F"
                          : "#000000",
                    }}
                    onClick={(event) => this.handleMoveDown(event)}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
                <Tooltip title="Move section up">
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      marginRight: "20px",
                      transform: `rotate(270deg)`,
                      color: this.state.order === 0 ? "#A1887F" : "#000000",
                    }}
                    onClick={(event) => this.handleMoveUp(event)}
                    onFocus={(event) => event.stopPropagation()}
                  />
                </Tooltip>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails
            style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
          >
            <div
              style={{
                backgroundColor: "#EAEAEA",
                width: "100%",
              }}
            >
              <div
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <br />
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ width: "50px" }}>
                    <MaterialIconSelector
                      size="35px"
                      icon={this.state.icon}
                      setIcon={this.setIcon}
                    />
                  </div>
                  <div style={{ paddingLeft: "20px", flexGrow: 1 }}>
                    <TextField
                      label="Section Title"
                      variant="outlined"
                      fullWidth={true}
                      name="title"
                      value={this.state.title}
                      onChange={this.handleFieldChange}
                      InputProps={{
                        style: {
                          padding: "5px 15px",
                          backgroundColor: "#FFFFFF",
                        },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "50px",
                      paddingLeft: "20px",
                      paddingTop: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title="Click for info on input format">
                      <HelpIcon
                        style={{ width: 30, height: 30 }}
                        onClick={this.clickHelp}
                      />
                    </Tooltip>
                  </div>
                </div>
                <br />

                <Grid
                  item
                  xs={12}
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingBottom: "20px",
                  }}
                >
                  <span style={{ paddingRight: "10px" }}>
                    Click on ? icon for help on input, 
                    and for info on the existing CSS/JS dependencies.
                  </span>
                </Grid>

                <Grid item xs={12}>
                  {/* <TextField
                    multiline
                    rows={!this.state.expandSection ? "10" : "50"}
                    label="Input custom content"
                    variant="outlined"
                    fullWidth={true}
                    helperText="Click on ? icon for info on input format."
                    name="description1"
                    value={this.state.description}
                    onChange={this.handleFieldChange}
                    onBlur={this.handleDataInputOnBlur}
                    InputProps={{
                      style: {
                        padding: "15px 15px",
                        backgroundColor: "#FFFFFF",
                        fontFamily:
                          "'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace",
                      },
                    }}
                  /> */}
                  <AceEditor
                    placeholder="Enter markdown or HTML here. Click on ? icon for info on input format."
                    mode="html"
                    theme="tomorrow"
                    name="description"
                    fontSize={18}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.state.description}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: false,
                      showLineNumbers: true,
                      tabSize: 2,
                      useWorker: false
                    }}
                    width="100%"
                    height={!this.state.expandSection ? "200px" : "800px"}
                    onChange={this.handleCodeChange}
                    onBlur={this.handleDataInputOnBlur}
                  />
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.toggleExpandSection}
                      style={{
                        width: "200px",
                        backgroundColor: "#795548",
                      }}
                      startIcon={<AspectRatioIcon />}
                    >
                    Expand Section
                  </Button>
                  </div>
                </Grid>
                <br />
                <br />
                {this.state.showHelp ? (
                  <ModalDialog
                    open={this.state.showHelp}
                    title="Custom Input"
                    headerBgColor="#ABABAB"
                    handleClose={this.handleHelpClose}
                    content={<HelpContentCustom />}
                  />
                ) : null}
              </div>
              <DialogConfirm
                open={this.state.deleteOpen}
                title="Please confirm to delete!"
                headerBgColor="#ABABAB"
                content={
                  "Do you wish to delete the custom resource section with title: <b>" +
                  this.state.title +
                  "</b>"
                }
                handleClose={this.handleDelete}
                size="xs"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
