import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Chip from "@material-ui/core/Chip";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Typography from "@material-ui/core/Typography";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import ErrorDialog from "./ErrorDialog";
import LoadingIndicator from "./LoadingIndicator";
import ContextMain from "./ContextMain";
import TextField from "@material-ui/core/TextField";
import MultipleSelect from "./MultipleSelect";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import SwitchMultiWay from "./SwitchMultiWay";
import ToggleSwitch from "./ToggleSwitch";
import FilterListIcon from "@material-ui/icons/FilterList";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import { readRemoteFile } from "react-papaparse";
import {
  neuromorpho_baseUrl,
  neuromorpho_viewUrl,
  allenbrain_baseUrl,
  allenbrain_downloadUrl,
  allenbrain_viewMorphologyUrl,
  filterNeuroMorphoKeys,
  corsProxy,
} from "./globals";
import { buildQuery, showNotification, formatLabel } from "./utils";

const labelsNeuroMorphoKeys = {
  age_classification: "Age Classification",
  age_scale: "Age Scale",
  archive: "Archive",
  brain_region_1: "Primary Brain Region",
  brain_region_2: "Secondary Brain Region",
  brain_region_3: "Tertiary Brain Region",
  cell_type_1: "Primary Cell Type",
  cell_type_2: "Secondary Cell Type",
  cell_type_3: "Tertiary Cell Type",
  deposition_date: "Deposition Date",
  domain: "Domain",
  gender: "Gender",
  neuron_id: "Neuron ID",
  neuron_name: "Neuron Name",
  note: "Note",
  objective_type: "Objective Type",
  original_format: "Original Format",
  protocol: "Protocol",
  reconstruction_software: "Reconstruction Software",
  scientific_name: "Scientific Name",
  species: "Species",
  strain: "Strain",
  upload_date: "Upload Date",
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

// define the columns for the material data table
const NeuroMorpho_TABLE_COLUMNS = [
  {
    field: "neuron_id",
    title: "Neuron ID",
  },
  {
    field: "neuron_name",
    title: "Neuron Name",
  },
  {
    field: "gender",
    title: "Gender",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "brain_region_1",
    title: "Primary Brain Region",
    hidden: true,
  },
  {
    field: "brain_region_2",
    title: "Secondary Brain Region",
    hidden: true,
  },
  {
    field: "brain_region_3",
    title: "Tertiary Brain Region",
    hidden: true,
  },
  {
    field: "cell_type_1",
    title: "Primary Cell Class",
    hidden: true,
  },
  {
    field: "cell_type_2",
    title: "Secondary Cell Class",
    hidden: true,
  },
  {
    field: "cell_type_3",
    title: "Tertiary Cell Class",
    hidden: true,
  },
  {
    field: "strain",
    title: "Strain",
    hidden: true,
  },
  {
    field: "reconstruction_software",
    title: "Software",
  },
  {
    field: "protocol",
    title: "Protocol",
  },
];

const AllenBrain_TABLE_COLUMNS = [
  {
    field: "specimen__id",
    title: "Specimen ID",
  },
  {
    field: "specimen__name",
    title: "Specimen Name",
  },
  {
    field: "specimen__hemisphere",
    title: "Specimen Hemisphere",
    hidden: true,
  },
  {
    field: "structure__name",
    title: "Structure Name",
  },
  {
    field: "structure__layer",
    title: "Structure Layer",
    hidden: true,
  },
  {
    field: "donor__name",
    title: "Donor Name",
    hidden: true,
  },
  {
    field: "donor__species",
    title: "Donor Species",
  },
  {
    field: "donor__sex",
    title: "Donor Sex",
    hidden: true,
  },
  {
    field: "donor__race",
    title: "Donor Race",
    hidden: true,
  },
  {
    field: "donor__disease_state",
    title: "Donor Disease State",
    hidden: true,
  },
  {
    field: "line_name",
    title: "Line Name",
    hidden: true,
  },
  {
    field: "tag__apical",
    title: "Apical",
    hidden: true,
  },
  {
    field: "tag__dendrite_type",
    title: "Dendrite Type",
    hidden: true,
  },
  {
    field: "reconstruction_type",
    title: "Reconstruction Type",
    hidden: true,
  },
];

function IncludeButton(props) {
  //   console.log(props);
  if (props.includeFlag) {
    return (
      <Tooltip
        title="Remove morphology instance from collection"
        placement="top"
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#FF5722",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<RemoveFromQueueIcon />}
          onClick={() =>
            props.removeInstanceCollection(
              props.morphology_id,
              props.instance_id
            )
          }
        >
          Remove
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add morphology instance to collection" placement="top">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#81C784",
            border: "solid",
            borderColor: "#000000",
            borderWidth: "1px",
            width: "150px",
          }}
          startIcon={<AddToQueueIcon />}
          onClick={() =>
            props.addInstanceCollection(
              props.morphology_id,
              props.morphology_name,
              props.instance_id,
              props.instance_name,
              props.source_url,
              props.view_url
            )
          }
        >
          Add
        </Button>
      </Tooltip>
    );
  }
}

function InstanceParameter(props) {
  return (
    <div style={{ width: "1000px" }}>
      <Grid container>
        <Grid item xs={9}>
          <Box
            component="div"
            bgcolor="white"
            overflow="scroll"
            border={1}
            borderColor="grey.500"
            borderRadius={10}
            style={{
              padding: 10,
              cursor: "pointer",
            }}
            whiteSpace="nowrap"
          >
            {props.value || ""}
          </Box>
        </Grid>
        {/* <Grid item xs={3}>
        <Box component="div" my={2}>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
            }}
            //   onClick={() => doSomething(props.value)}
          >
            MyButton
          </Button>
        </Box>
      </Grid> */}
      </Grid>
    </div>
  );
}

class NeuroMorphoContentMorphologyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "name",
    };
  }

  render() {
    console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Morphology Details:</b>
            </Typography>
            <Link
              href={
                neuromorpho_viewUrl +
                "/neuron_info.jsp?neuron_name=" +
                this.props.data.neuron_name
              }
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#01579b", color: "#ffffff" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Page
              </Button>
            </Link>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "25px" }}>
          <Box
            my={2}
            pb={0}
            style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
          >
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#13AC8B",
              }}
            >
              <Grid item xs={6}>
                <Box px={2} display="flex" flexDirection="row">
                  <p variant="subtitle2">
                    Morphology Name:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {this.props.data.neuron_name}
                    </span>
                  </p>
                </Box>
              </Grid>
              <Grid container item justify="flex-end" xs={6}>
                <Box
                  px={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">
                    Morphology ID:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {this.props.data.neuron_id}
                    </span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={9}>
                <div style={{ padding: "10px 0px 0px 10px" }}>
                  <div>
                    {Object.keys(labelsNeuroMorphoKeys).map((item, ind) => (
                      <Chip
                        icon={
                          this.state.selectedParam === item ? (
                            <RadioButtonCheckedIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )
                        }
                        key={ind}
                        label={labelsNeuroMorphoKeys[item]}
                        clickable
                        onClick={() => this.setState({ selectedParam: item })}
                        variant="outlined"
                        style={{
                          color: "#000000",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <InstanceParameter
                    label={"param"}
                    value={this.props.data[this.state.selectedParam]}
                  />
                </div>
              </Grid>
              <Grid item xs={3} style={{ paddingBottom: "35px" }}>
                <IncludeButton
                  includeFlag={this.props.checkInstanceInCollection(
                    "NeuroMorpho_" + this.props.data.neuron_id.toString(),
                    "0"
                  )}
                  morphology_id={
                    "NeuroMorpho_" + this.props.data.neuron_id.toString()
                  }
                  morphology_name={this.props.data.neuron_name}
                  instance_id={"0"}
                  instance_name={""}
                  source_url={
                    neuromorpho_viewUrl +
                    "/dableFiles/" +
                    this.props.data.archive.toLowerCase() +
                    "/CNG%20version/" +
                    this.props.data.neuron_name +
                    ".CNG.swc"
                  }
                  view_url={
                    neuromorpho_viewUrl +
                    "/neuron_info.jsp?neuron_name=" +
                    this.props.data.neuron_name
                  }
                  addInstanceCollection={this.props.addInstanceCollection}
                  removeInstanceCollection={this.props.removeInstanceCollection}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
}

export class NeuroMorphoContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    return (
      <div>
        <div
          style={{
            paddingBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Please click on &nbsp; <ViewColumnIcon /> &nbsp; to hide/show other
          columns, and click on &nbsp; <FilterListIcon /> &nbsp; to filter the
          contents for each column.
        </div>
        <MaterialTable
          title={
            "Morphologies (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={NeuroMorpho_TABLE_COLUMNS}
          options={{
            columnsButton: true,
            search: true,
            paging: false,
            filtering: this.state.filtering,
            sorting: true,
            //   selection: true,
            exportButton: false,
            maxBodyHeight: "60vh",
            headerStyle: {
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
            },
            rowStyle: (rowData) => ({
              backgroundColor: this.state.selectedRows.includes(
                rowData.tableData.id
              )
                ? "#13AC8B"
                : "#EEEEEE",
            }),
          }}
          actions={[
            {
              icon: "filter_list",
              onClick: () =>
                this.setState({ filtering: !this.state.filtering }),
              position: "toolbar",
              tooltip: "Show Filters",
            },
          ]}
          detailPanel={(rowData) => {
            return (
              <NeuroMorphoContentMorphologyPanel
                data={rowData}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            );
          }}
          onRowClick={(event, selectedRow, togglePanel) => {
            togglePanel();
          }}
          components={{
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#13AC8B",
                  fontWeight: "bolder !important",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            width: "100%",
          }}
        >
          <h6>
            {"Number of morphology instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

class AllenBrainContentMorphologyPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "specimen__name",
    };
  }

  render() {
    // console.log(this.props);
    return (
      <Grid item style={{ backgroundColor: "#CFD8DC", padding: "20px" }}>
        <Grid container direction="row">
          <Grid
            item
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              verticalAlign: "middle",
            }}
          >
            <Typography variant="subtitle1">
              <b>Morphology Details:</b>
            </Typography>
            <Link
              href={
                allenbrain_viewMorphologyUrl +
                "/" +
                this.props.data.specimen__id
              }
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#01579b", color: "#ffffff" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Page
              </Button>
            </Link>
          </Grid>
        </Grid>
        <div style={{ marginBottom: "25px" }}>
          <Box
            my={2}
            pb={0}
            style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
          >
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#13AC8B",
              }}
            >
              <Grid item xs={6}>
                <Box px={2} display="flex" flexDirection="row">
                  <p variant="subtitle2">
                    Morphology Name:{" "}
                    <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                      {this.props.data.specimen__name}
                    </span>
                  </p>
                </Box>
              </Grid>
              <Grid container item justify="flex-end" xs={6}>
                <Box
                  px={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">
                    Morphology ID:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {this.props.data.specimen__id}
                    </span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={9}>
                <div style={{ padding: "10px 0px 0px 10px" }}>
                  <div>
                    {[
                      "specimen__id",
                      "specimen__name",
                      "specimen__hemisphere",
                      "structure__name",
                      "structure__layer",
                      "donor__id",
                      "donor__name",
                      "donor__species",
                      "donor__sex",
                      "donor__race",
                      "donor__age",
                      "donor__disease_state",
                      "line_name",
                      "tag__apical",
                      "tag__dendrite_type",
                    ].map((item, ind) => (
                      <Chip
                        icon={
                          this.state.selectedParam === item ? (
                            <RadioButtonCheckedIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )
                        }
                        key={ind}
                        label={formatLabel(item)}
                        clickable
                        onClick={() => this.setState({ selectedParam: item })}
                        variant="outlined"
                        style={{
                          color: "#000000",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <InstanceParameter
                    label={"param"}
                    value={this.props.data[this.state.selectedParam]}
                  />
                </div>
              </Grid>
              <Grid item xs={3} style={{ paddingBottom: "35px" }}>
                <IncludeButton
                  includeFlag={this.props.checkInstanceInCollection(
                    "AllenBrain_" + this.props.data.specimen__id,
                    "0"
                  )}
                  morphology_id={"AllenBrain_" + this.props.data.specimen__id}
                  morphology_name={this.props.data.specimen__name}
                  instance_id={"0"}
                  instance_name={""}
                  source_url={
                    allenbrain_downloadUrl + "/" + this.props.data.download__id
                  }
                  view_url={
                    allenbrain_viewMorphologyUrl +
                    "/" +
                    this.props.data.specimen__id
                  }
                  addInstanceCollection={this.props.addInstanceCollection}
                  removeInstanceCollection={this.props.removeInstanceCollection}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    );
  }
}

export class AllenBrainContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      filtering: false,
    };
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <div
          style={{
            paddingBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Please click on &nbsp; <ViewColumnIcon /> &nbsp; to hide/show other
          columns, and click on &nbsp; <FilterListIcon /> &nbsp; to filter the
          contents for each column.
        </div>
        <MaterialTable
          title={
            "Morphologies (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={AllenBrain_TABLE_COLUMNS}
          options={{
            columnsButton: true,
            search: true,
            paging: false,
            filtering: this.state.filtering,
            sorting: true,
            //   selection: true,
            exportButton: false,
            maxBodyHeight: "60vh",
            headerStyle: {
              position: "sticky",
              top: 0,
              backgroundColor: "#FFF",
              fontWeight: "bolder",
              fontSize: 15,
            },
            rowStyle: (rowData) => ({
              backgroundColor: this.state.selectedRows.includes(
                rowData.tableData.id
              )
                ? "#13AC8B"
                : "#EEEEEE",
            }),
          }}
          actions={[
            {
              icon: "filter_list",
              onClick: () =>
                this.setState({ filtering: !this.state.filtering }),
              position: "toolbar",
              tooltip: "Show Filters",
            },
          ]}
          detailPanel={(rowData) => {
            return (
              <AllenBrainContentMorphologyPanel
                data={rowData}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            );
          }}
          onRowClick={(event, selectedRow, togglePanel) => {
            togglePanel();
          }}
          components={{
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#13AC8B",
                  fontWeight: "bolder !important",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            width: "100%",
          }}
        >
          <h6>
            {"Number of morphology instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

export class FilterPanelNeuroMorpho extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      searchByID: true,
      configFilters: {},
      morphology_ids: "",
    };

    this.getListMorphologyNeuroMorpho =
      this.getListMorphologyNeuroMorpho.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.toggleSearchByID = this.toggleSearchByID.bind(this);
    this.handleIDsChange = this.handleIDsChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListMorphology(this.getListMorphologyNeuroMorpho);
  }

  getListMorphologyNeuroMorpho() {
    console.log("Query NeuroMorpho");

    function isPostiveNumeric(value) {
      return /^\d+$/.test(value);
    }

    if (this.state.searchByID) {
      // one query per input morphology ID
      // each query will correspond to a specific morphology
      let neuroMorphoreqs = [];
      // split csv to list
      let list_morphology_ids = this.state.morphology_ids
        .split(",")
        .map((item) =>
          item.trim().startsWith("NMO_")
            ? isPostiveNumeric(item.split("NMO_")[1].trim())
              ? parseInt(item.split("NMO_")[1].trim())
              : item.trim()
            : item.trim()
        );
      // remove duplicates
      list_morphology_ids = [...new Set(list_morphology_ids)];

      list_morphology_ids.forEach(function (morphology_id, i) {
        let url =
          neuromorpho_baseUrl + "/neuron/id/" + parseInt(morphology_id, 10);
        neuroMorphoreqs.push(axios.get(url));
      });

      const context = this;
      Promise.allSettled(neuroMorphoreqs)
        .then(function (res) {
          console.log(res);
          let morphology_list = [];
          for (let ind in list_morphology_ids) {
            if (res[ind].status === "fulfilled") {
              let item = res[ind].value.data;
              console.log(item);
              morphology_list.push({
                age_classification: item.age_classification,
                age_scale: item.age_scale,
                archive: item.archive,
                brain_region_1: item.brain_region
                  ? item.brain_region.length > 0
                    ? item.brain_region[0]
                    : null
                  : null,
                brain_region_2: item.brain_region
                  ? item.brain_region.length > 1
                    ? item.brain_region[1]
                    : null
                  : null,
                brain_region_3: item.brain_region
                  ? item.brain_region.length > 2
                    ? item.brain_region.splice(2).join(", ")
                    : null
                  : null,
                cell_type_1: item.cell_type
                  ? item.cell_type.length > 0
                    ? item.cell_type[item.cell_type.length - 1]
                    : null
                  : null,
                cell_type_2: item.cell_type
                  ? item.cell_type.length > 1
                    ? item.cell_type[item.cell_type.length - 2]
                    : null
                  : null,
                cell_type_3: item.cell_type
                  ? item.cell_type.length > 2
                    ? item.cell_type
                        .splice(0, item.cell_type.length - 2)
                        .join(", ")
                    : null
                  : null,
                deposition_date: item.deposition_date,
                domain: item.domain,
                gender: item.gender,
                neuron_id: item.neuron_id,
                neuron_name: item.neuron_name,
                note: item.note,
                objective_type: item.objective_type,
                original_format: item.original_format,
                protocol: item.protocol,
                reconstruction_software: item.reconstruction_software,
                scientific_name: item.scientific_name,
                species: item.species,
                strain: item.strain,
                upload_date: item.upload_date,
              });
            } else {
              showNotification(
                context.props.enqueueSnackbar,
                context.props.closeSnackbar,
                "Invalid Morphology ID: " + list_morphology_ids[ind] + "!",
                "error"
              );
            }
          }

          console.log(morphology_list);
          // create morphology entries from collected attributes
          context.props.setListMorphology(morphology_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            context.props.setListMorphology([], false, err);
          }
        });
    } else {
      let config = {
        cancelToken: this.signal.token,
        headers: {
          Authorization: "Bearer " + this.context.auth[0].token,
        },
      };
      let query = buildQuery(this.state.configFilters, "NeuroMorpho");
      let url = neuromorpho_baseUrl + "/neuron/select?" + encodeURI(query);
      this.setState({ loading: true });
      let results = [];
      const context = this;

      axios
        .get(url, config)
        .then((res) => {
          console.log(results.length);
          console.log(res.data["_embedded"]["neuronResources"]);
          results.push(...res.data["_embedded"]["neuronResources"]);
          console.log(results.length);

          const numPages = res.data.page.totalPages;
          console.log(numPages);
          let neuroMorphoreqs = [];
          if (numPages > 1) {
            for (let ind = 1; ind < numPages; ind++) {
              url =
                neuromorpho_baseUrl +
                "/neuron/select?" +
                encodeURI(query) +
                "&page=" +
                ind;
              neuroMorphoreqs.push(axios.get(url));
            }
          }

          Promise.all(neuroMorphoreqs)
            .then(function (res) {
              for (let item of res) {
                results.push(...item.data["_embedded"]["neuronResources"]);
              }
              console.log(results.length);

              let morphology_list = [];
              results.forEach((item) =>
                morphology_list.push({
                  age_classification: item.age_classification,
                  age_scale: item.age_scale,
                  archive: item.archive,
                  brain_region_1: item.brain_region
                    ? item.brain_region.length > 0
                      ? item.brain_region[0]
                      : null
                    : null,
                  brain_region_2: item.brain_region
                    ? item.brain_region.length > 1
                      ? item.brain_region[1]
                      : null
                    : null,
                  brain_region_3: item.brain_region
                    ? item.brain_region.length > 2
                      ? item.brain_region.splice(2).join(", ")
                      : null
                    : null,
                  cell_type_1: item.cell_type
                    ? item.cell_type.length > 0
                      ? item.cell_type[item.cell_type.length - 1]
                      : null
                    : null,
                  cell_type_2: item.cell_type
                    ? item.cell_type.length > 1
                      ? item.cell_type[item.cell_type.length - 2]
                      : null
                    : null,
                  cell_type_3: item.cell_type
                    ? item.cell_type.length > 2
                      ? item.cell_type
                          .splice(0, item.cell_type.length - 2)
                          .join(", ")
                      : null
                    : null,
                  deposition_date: item.deposition_date,
                  domain: item.domain,
                  gender: item.gender,
                  neuron_id: item.neuron_id,
                  neuron_name: item.neuron_name,
                  note: item.note,
                  objective_type: item.objective_type,
                  original_format: item.original_format,
                  protocol: item.protocol,
                  reconstruction_software: item.reconstruction_software,
                  scientific_name: item.scientific_name,
                  species: item.species,
                  strain: item.strain,
                  upload_date: item.upload_date,
                })
              );

              console.log(morphology_list);
              context.props.setListMorphology(morphology_list, false, null);
            })
            .catch((err) => {
              if (axios.isCancel(err)) {
                console.log("errorUpdate: ", err.message);
              } else {
                // Something went wrong. Save the error in state and re-render.
                context.props.setListMorphology([], false, err);
              }
            });
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else if (
            err.response.status === 404 &&
            err.response.statusText === "Not Found"
          ) {
            context.props.setListMorphology([], false, null);
          } else {
            // Something went wrong. Save the error in state and re-render.
            context.props.setListMorphology([], false, err);
          }
        });
    }
  }

  handleFiltersChange(event) {
    console.log(event);
    const newConfig = { ...this.state.configFilters };
    newConfig[event.target.name] =
      typeof event.target.value === "string"
        ? [event.target.value]
        : event.target.value;
    this.setState({ configFilters: newConfig });
  }

  toggleSearchByID() {
    if (this.state.searchByID) {
      this.setState({
        morphology_ids: "",
        searchByID: false,
      });
    } else {
      this.setState({
        searchByID: true,
      });
    }
  }

  handleIDsChange(event) {
    this.setState({
      morphology_ids: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
          <h6>
            <span style={{ paddingRight: "10px" }}>
              Do you wish to search by NeuroMorpho.Org ID?
            </span>
            <ToggleSwitch
              id="searchSwitch"
              checked={this.state.searchByID}
              onChange={this.toggleSearchByID}
            />
          </h6>
        </Grid>
        {this.state.searchByID && (
          <div>
            <h6>Please enter the morphology IDs below:</h6>
            <em>
              Note: you can enter multiple IDs by separating them with a comma
              (e.g. NMO_00001, NMO_124073)
            </em>
            <form>
              <TextField
                variant="outlined"
                fullWidth={true}
                name="NeuroMorpho_morphology_ids"
                value={this.state.morphology_ids}
                onChange={this.handleIDsChange}
                InputProps={{
                  style: {
                    padding: "5px 15px",
                    minWidth: 700,
                    maxWidth: 900,
                    marginTop: "10px",
                  },
                }}
              />
            </form>
          </div>
        )}
        {!this.state.searchByID && (
          <div>
            <h6>Please specify filters to search NeuroMorpho:</h6>
            <em>Note: you can select multiple values for each filter</em>
            <form>
              {this.props.showFilters.map((filter) => (
                <MultipleSelect
                  itemNames={
                    !this.props.validNeuroMorphoFilterValues
                      ? []
                      : this.props.validNeuroMorphoFilterValues[filter]
                  }
                  label={labelsNeuroMorphoKeys[filter]}
                  name={filter}
                  value={this.state.configFilters[filter] || []}
                  handleChange={this.handleFiltersChange}
                  key={filter}
                />
              ))}
            </form>
          </div>
        )}
      </div>
    );
  }
}

export class FilterPanelAllenBrain extends React.Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      searchByID: true,
      morphology_ids: "",
    };

    this.getListMorphologyAllenBrain =
      this.getListMorphologyAllenBrain.bind(this);
    this.toggleSearchByID = this.toggleSearchByID.bind(this);
    this.handleIDsChange = this.handleIDsChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListMorphology(this.getListMorphologyAllenBrain);
  }

  getListMorphologyAllenBrain() {
    console.log("Query Allen Brain Atlas");

    if (this.state.searchByID) {
      // one query per input cell ID
      // each query will correspond to a specific morphology
      let morphologyDBreqs = [];
      // split csv to list
      let list_morphology_ids = this.state.morphology_ids
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      // remove duplicates
      list_morphology_ids = [...new Set(list_morphology_ids)];
      list_morphology_ids.forEach(function (morphology_id, i) {
        let url =
          corsProxy +
          allenbrain_baseUrl +
          "/query.json?wrap=true&criteria=%5Bspecimen__id%24eq" +
          morphology_id +
          "%5D";
        morphologyDBreqs.push(axios.get(url));
      });
      const context = this;
      Promise.allSettled(morphologyDBreqs)
        .then(function (res) {
          console.log(res);
          let morphology_list = [];
          for (let ind in list_morphology_ids) {
            if (
              res[ind].status === "fulfilled" &&
              (res[ind].value.data.msg[0].nr__reconstruction_type === "full" ||
                res[ind].value.data.msg[0].nr__reconstruction_type ===
                  "dendrite-only")
            ) {
              let item = res[ind].value.data.msg[0];
              morphology_list.push({
                specimen__id: item.specimen__id,
                specimen__name: item.specimen__name,
                specimen__hemisphere: item.specimen__hemisphere,
                structure__name: item.structure__name,
                structure__layer: item.structure__layer,
                donor__id: item.donor__id,
                donor__name: item.donor__name,
                donor__species: item.donor__species,
                donor__sex: item.donor__sex,
                donor__race: item.donor__race,
                donor__age: item.donor__age,
                donor__disease_state: item.donor__disease_state,
                line_name: item.line_name,
                tag__apical: item.tag__apical,
                tag__dendrite_type: item.tag__dendrite_type,
                ephys_thumb_path: item.ephys_thumb_path,
                ephys_inst_thresh_thumb_path: item.ephys_inst_thresh_thumb_path,
                download__id: item.nrwkf__id,
                reconstruction_type: item.nr__reconstruction_type,
              });
            } else {
              showNotification(
                context.props.enqueueSnackbar,
                context.props.closeSnackbar,
                "Invalid Cell ID: " + list_morphology_ids[ind] + "!",
                "error"
              );
            }
          }
          console.log(morphology_list);
          // create morphology entries from collected attributes
          context.props.setListMorphology(morphology_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.props.setListMorphology([], false, err);
          }
        });
    } else {
      // as AllenBrain collection is loaded via CSV file, we offer filtering on the front-end
      let url =
        corsProxy +
        "https://celltypes.brain-map.org/cell_types_specimen_details.csv";
      try {
        readRemoteFile(url, {
          header: true,
          complete: (res) => {
            console.log(res);
            let morphology_list = [];
            for (let item of res.data) {
              if (
                item.nr__reconstruction_type === "full" ||
                item.nr__reconstruction_type === "dendrite-only"
              ) {
                morphology_list.push({
                  specimen__id: item.specimen__id,
                  specimen__name: item.specimen__name,
                  specimen__hemisphere: item.specimen__hemisphere,
                  structure__name: item.structure__name,
                  structure__layer: item.structure__layer,
                  donor__id: item.donor__id,
                  donor__name: item.donor__name,
                  donor__species: item.donor__species,
                  donor__sex: item.donor__sex,
                  donor__race: item.donor__race,
                  donor__age: item.donor__age,
                  donor__disease_state: item.donor__disease_state,
                  line_name: item.line_name,
                  tag__apical: item.tag__apical,
                  tag__dendrite_type: item.tag__dendrite_type,
                  ephys_thumb_path: item.ephys_thumb_path,
                  ephys_inst_thresh_thumb_path:
                    item.ephys_inst_thresh_thumb_path,
                  download__id: item.nrwkf__id,
                  reconstruction_type: item.nr__reconstruction_type,
                });
              }
            }
            console.log(morphology_list);
            this.props.setListMorphology(morphology_list, false, null);
          },
        });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.props.setListMorphology([], false, err);
        }
      }
    }
  }

  toggleSearchByID() {
    if (this.state.searchByID) {
      this.setState({
        morphology_ids: "",
        searchByID: false,
      });
    } else {
      this.setState({
        searchByID: true,
      });
    }
  }

  handleIDsChange(event) {
    this.setState({
      morphology_ids: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
          <div style={{ color: "red", paddingBottom: "10px" }}>
            <strong>Note: </strong> Currently unavailable as files have some
            compatibility issues with PyNWB and Neo.
          </div>
          <h6>
            Allen Brain Atlas:{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://alleninstitute.org/legal/citation-policy/"
            >
              Citation Policy
            </a>
          </h6>
          <div>
            Use one of the following general citation formats for any Allen
            Institute resource:
            <ul>
              <li style={{ marginBottom: "10px" }}>
                <em>
                  © [[year of first publication]] Allen Institute for Brain
                  Science. [Name of Allen Institute Resource]. Available from:
                  [Resource URL]
                </em>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <em>
                  © [[year of first publication]] Allen Institute for Cell
                  Science. [Name of Allen Institute Resource]. Available from:
                  [Resource URL]
                </em>
              </li>
            </ul>
          </div>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
          <h6>
            <span style={{ paddingRight: "10px" }}>
              Do you wish to search by cell ID?
            </span>
            <ToggleSwitch
              id="searchSwitch"
              checked={this.state.searchByID}
              onChange={this.toggleSearchByID}
            />
          </h6>
        </Grid>
        {this.state.searchByID && (
          <div>
            <h6>Please enter the cell IDs below:</h6>
            <em>
              Note: you can enter multiple IDs by separating them with a comma
              (e.g. 643575207, 614767057)
            </em>
            <form>
              <TextField
                disabled // TODO: Remove when fixed
                variant="outlined"
                fullWidth={true}
                name="AllenBrain_morphology_ids"
                // value={this.state.morphology_ids}  // TODO: Remove when fixed
                value={"Currently unavailable!"}
                onChange={this.handleIDsChange}
                InputProps={{
                  style: {
                    padding: "5px 15px",
                    minWidth: 700,
                    maxWidth: 900,
                    marginTop: "10px",
                  },
                }}
              />
            </form>
          </div>
        )}
        {!this.state.searchByID && (
          <div>
            <h6>
              Click "Proceed" to fetch all entries from Allen Brain Atlas, and
              you can subsequently filter them by individual attributes.
            </h6>
          </div>
        )}
      </div>
    );
  }
}

export default class DBInputMorphology extends React.Component {
  static contextType = ContextMain;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      list_morphologies: [],
      error: null,
      morphology_collection: {},
      showFilters: true,
      sourceDB: "NeuroMorpho",
    };

    this.acceptsProceedMethod = this.acceptsProceedMethod.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.setListMorphology = this.setListMorphology.bind(this);

    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.addInstanceCollection = this.addInstanceCollection.bind(this);
    this.removeInstanceCollection = this.removeInstanceCollection.bind(this);
    this.checkInstanceInCollection = this.checkInstanceInCollection.bind(this);
    this.countTotalInstances = this.countTotalInstances.bind(this);
    this.showFiltersPanel = this.showFiltersPanel.bind(this);
    this.showContentsPanel = this.showContentsPanel.bind(this);
    this.handleDBChange = this.handleDBChange.bind(this);
  }

  acceptsProceedMethod(childGetListMethod) {
    // Parent stores the method that the child passed
    this.getListMorphology = childGetListMethod;
  }

  handleProceed() {
    this.setState(
      {
        showFilters: false,
        loading: true,
      },
      () => {
        this.getListMorphology();
      }
    );
  }

  setListMorphology(list_morphologies, loading, error) {
    this.setState({
      list_morphologies: list_morphologies,
      loading: loading,
      error: error,
    });
  }

  handleErrorDialogClose() {
    this.setState({ error: null });
  }

  addInstanceCollection(
    morphology_id,
    morphology_name,
    instance_id,
    instance_name,
    source_url,
    view_url
  ) {
    console.log("Add");

    let morphology_collection = this.state.morphology_collection;
    if (Object.keys(morphology_collection).includes(morphology_id)) {
      if (
        !Object.keys(morphology_collection[morphology_id]).includes(instance_id)
      ) {
        morphology_collection[morphology_id][instance_id] = {
          label: instance_name
            ? morphology_name + " (" + instance_name + ")"
            : morphology_name,
          source_url: source_url,
          view_url: view_url,
        };
      }
    } else {
      morphology_collection[morphology_id] = {
        [instance_id]: {
          label: instance_name
            ? morphology_name + " (" + instance_name + ")"
            : morphology_name,
          source_url: source_url,
          view_url: view_url,
        },
      };
    }

    this.setState({
      morphology_collection: morphology_collection,
    });
  }

  removeInstanceCollection(morphology_id, instance_id) {
    console.log("Remove");

    let morphology_collection = this.state.morphology_collection;
    if (Object.keys(morphology_collection).includes(morphology_id)) {
      if (
        Object.keys(morphology_collection[morphology_id]).includes(instance_id)
      ) {
        delete morphology_collection[morphology_id][instance_id];
      }
      if (Object.keys(morphology_collection[morphology_id]).length === 0) {
        delete morphology_collection[morphology_id];
      }
    }

    this.setState({
      morphology_collection: morphology_collection,
    });
  }

  checkInstanceInCollection(morphology_id, instance_id) {
    let flag = false;
    let morphology_collection = this.state.morphology_collection;
    if (Object.keys(morphology_collection).includes(morphology_id)) {
      if (
        Object.keys(morphology_collection[morphology_id]).includes(instance_id)
      ) {
        flag = true;
      }
    }
    console.log(flag);
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let morphology_collection = this.state.morphology_collection;
    for (const morphology_id in morphology_collection) {
      total += Object.keys(morphology_collection[morphology_id]).length;
    }
    return total;
  }

  showFiltersPanel() {
    let showFilters = "";
    switch (this.state.sourceDB) {
      case "NeuroMorpho":
        showFilters = filterNeuroMorphoKeys;
        break;
      case "Allen Brain":
        showFilters = null;
        break;
      default:
        showFilters = null;
    }

    return (
      <Box my={2}>
        <h6 style={{ marginBottom: "20px" }}>Please specify the database:</h6>
        <SwitchMultiWay
          values={["NeuroMorpho", "Allen Brain"]}
          selected={this.state.sourceDB}
          onChange={this.handleDBChange}
        />
        <br />
        {this.state.sourceDB === "NeuroMorpho" && (
          <FilterPanelNeuroMorpho
            showFilters={showFilters}
            validNeuroMorphoFilterValues={
              this.context.validNeuroMorphoFilterValues[0]
            }
            shareGetListMorphology={this.acceptsProceedMethod}
            setListMorphology={this.setListMorphology}
            enqueueSnackbar={this.props.enqueueSnackbar}
            closeSnackbar={this.props.closeSnackbar}
          />
        )}
        {this.state.sourceDB === "Allen Brain" && (
          <FilterPanelAllenBrain
            showFilters={showFilters}
            shareGetListMorphology={this.acceptsProceedMethod}
            setListMorphology={this.setListMorphology}
            enqueueSnackbar={this.props.enqueueSnackbar}
            closeSnackbar={this.props.closeSnackbar}
          />
        )}
      </Box>
    );
  }

  showContentsPanel() {
    if (this.state.sourceDB === "NeuroMorpho") {
      return (
        <NeuroMorphoContent
          data={this.state.list_morphologies}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else if (this.state.sourceDB === "Allen Brain") {
      return (
        <AllenBrainContent
          data={this.state.list_morphologies}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else {
      return null;
    }
  }

  handleDBChange(value) {
    console.log(value);
    this.setState({
      sourceDB: value,
      list_morphologies: [],
    });
  }

  render() {
    console.log(this.props);
    console.log(this.state);

    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error.message || this.state.error}
        />
      );
    }
    return (
      <div>
        <Dialog
          onClose={() => this.props.handleClose(false)}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
          fullWidth={this.state.showFilters ? false : true}
          maxWidth={"xl"}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: "#00A595" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Input From Database
            </span>
          </DialogTitle>
          <DialogContent dividers>
            {(!this.context.validNeuroMorphoFilterValues[0] &&
              this.state.showFilters) ||
            this.state.loading ? (
              <div
                style={{
                  minWidth: 700,
                }}
              >
                <LoadingIndicator />
              </div>
            ) : this.state.showFilters ? (
              this.showFiltersPanel()
            ) : (
              this.showContentsPanel()
            )}
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "10px",
                paddingBottom: "20px",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#525252",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() => this.props.handleClose(false, null)}
              >
                Cancel
              </Button>
              <br />
              <br />
              {!this.state.showFilters && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      width: "150px",
                      backgroundColor: "#29B480",
                      color: "#000000",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={() => {
                      this.setState({
                        list_morphologies: [],
                        morphology_collection: {},
                        showFilters: true,
                      });
                    }}
                  >
                    Filters
                  </Button>
                  <br />
                  <br />
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "150px",
                  backgroundColor: "#4DC26D",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() =>
                  this.state.showFilters
                    ? this.handleProceed()
                    : this.props.handleClose(
                        true,
                        this.state.morphology_collection,
                        this.state.sourceDB
                      )
                }
              >
                {this.state.showFilters ? "Proceed" : "Add Items"}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
