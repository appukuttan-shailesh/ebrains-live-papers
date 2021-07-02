import React from "react";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import HelpIcon from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";
import DialogConfirm from "./DialogConfirm";
import { Converter } from "showdown";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ForwardIcon from "@material-ui/icons/Forward";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
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
      // description: "", // no description field for SectionCustom
      // NOTE: in KG schema, data is stored under "description" field (for schema purposes),
      // Handled by SaveModal.adjustForKGSchema()
      data: "",
      showHelp: false,
      deleteOpen: false,
      expanded: true,
      ...props.data,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
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

  handleDataInputOnBlur(event) {
    const converter = new Converter({ tables: true });
    let value = converter.makeHtml(this.state.data);
    console.log(value);
    this.setState(
      {
        data: value,
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

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows="8"
                    label="Input custom content"
                    variant="outlined"
                    fullWidth={true}
                    helperText="Click on ? icon for info on input format."
                    name="data"
                    value={this.state.data}
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
                  />
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
