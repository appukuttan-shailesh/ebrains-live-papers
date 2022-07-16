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
  nar_baseUrl,
  allenbrain_baseUrl,
  allenbrain_downloadUrl,
  allenbrain_viewTraceUrl,
  querySizeLimit,
  filterKGTracesKeys,
  corsProxy,
} from "./globals";
import { buildQuery, showNotification, formatLabel } from "./utils";

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
const KG_TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
    hidden: true,
  },
  {
    field: "label",
    title: "Label",
  },
  {
    field: "modality",
    title: "Modality",
  },
  {
    field: "stimulation",
    title: "Stimulation",
  },
  {
    field: "timestamp",
    title: "Timestamp",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "location",
    title: "Location",
    hidden: true,
  },
  {
    field: "view_url",
    title: "View URL",
    hidden: true,
  },
  {
    field: "parent_name",
    title: "Parent Name",
    hidden: true,
  },
  {
    field: "parent_id",
    title: "Parent ID",
    hidden: true,
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
      <Tooltip title="Remove trace instance from collection" placement="top">
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
            props.removeInstanceCollection(props.trace_id, props.instance_id)
          }
        >
          Remove
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add trace instance to collection" placement="top">
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
              props.trace_id,
              props.trace_name,
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

class KGContentTraceVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "location",
    };
  }

  render() {
    return (
      <Box
        my={2}
        pb={0}
        style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
        key={this.props.ind}
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
                Record #:{" "}
                <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {this.props.ind + 1}
                </span>
              </p>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={9}>
            <div style={{ padding: "10px 0px 0px 10px" }}>
              <div>
                {["description", "location"].map((param, ind) => (
                  <Chip
                    icon={
                      this.state.selectedParam === param ? (
                        <RadioButtonCheckedIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )
                    }
                    key={ind}
                    label={param}
                    clickable
                    onClick={() => this.setState({ selectedParam: param })}
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
                value={this.props.instance[this.state.selectedParam]}
              />
            </div>
          </Grid>
          <Grid item xs={3} style={{ paddingBottom: "35px" }}>
            <IncludeButton
              includeFlag={this.props.checkInstanceInCollection(
                "KG_" + this.props.trace_id,
                this.props.ind.toString()
              )}
              trace_id={"KG_" + this.props.trace_id}
              trace_name={this.props.trace_name}
              instance_id={this.props.ind.toString()}
              instance_name={this.props.ind.toString()}
              source_url={this.props.instance.location}
              view_url={this.props.view_url}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

class KGContentTraceVersionsPanel extends React.Component {
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
              <b>Versions</b>
            </Typography>
            <Link
              href={this.props.data.view_url}
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
        {this.props.data.instances.length === 0 ? (
          <div style={{ fontSize: 14 }}>
            <br />
            No records have yet been registered for this trace.
          </div>
        ) : (
          this.props.data.instances.map((instance, ind) => (
            <div style={{ marginBottom: "25px" }} key={ind}>
              <KGContentTraceVersion
                trace_id={this.props.data.id}
                trace_name={this.props.data.label}
                instance={instance}
                view_url={this.props.data.view_url}
                ind={ind}
                addInstanceCollection={this.props.addInstanceCollection}
                removeInstanceCollection={this.props.removeInstanceCollection}
                checkInstanceInCollection={this.props.checkInstanceInCollection}
              />
            </div>
          ))
        )}
      </Grid>
    );
  }
}

export class KGContent extends React.Component {
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
            "Electrophysiological Recordings (" +
            this.props.data.length +
            (this.props.data.length === 1 ? " entry)" : " entries)")
          }
          data={this.props.data}
          columns={KG_TABLE_COLUMNS}
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
              <KGContentTraceVersionsPanel
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
            {"Number of trace instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

class AllenBrainContentTracePanel extends React.Component {
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
                allenbrain_viewTraceUrl + "/" + this.props.data.specimen__id
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
                    Trace Name:{" "}
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
                    Trace ID: <span style={{ fontWeight: "bold" }}>{this.props.data.specimen__id}</span>
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
                  trace_id={"AllenBrain_" + this.props.data.specimen__id}
                  trace_name={this.props.data.specimen__name}
                  instance_id={"0"}
                  instance_name={""}
                  source_url={
                    allenbrain_downloadUrl + "/" + this.props.data.download__id
                  }
                  view_url={
                    allenbrain_viewTraceUrl + "/" + this.props.data.specimen__id
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
            "Electrophysiological Recordings (" +
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
              <AllenBrainContentTracePanel
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
            {"Number of trace instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

export class FilterPanelKG extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      configFilters: {},
    };

    this.getListTracesKG = this.getListTracesKG.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListTraces(this.getListTracesKG);
  }

  getListTracesKG() {
    console.log("Query KG");
    let config = {
      cancelToken: this.signal.token,
      headers: {
        Authorization: "Bearer " + this.context.auth[0].token,
      },
    };
    let query = buildQuery(this.state.configFilters);
    let url =
      nar_baseUrl +
      "/recordings/?" +
      encodeURI(query) +
      "&summary=false&size=" +
      querySizeLimit +
      "&from_index=0";
    this.setState({ loading: true });
    axios
      .get(url, config)
      .then((res) => {
        console.log(res.data.results);
        let traces = [];
        res.data.results.forEach((item) =>
          traces.push({
            id: item.identifier,
            label: item.label,
            modality: item.modality,
            stimulation: item.stimulation,
            timestamp: item.timestamp,
            species: item.recorded_from ? item.recorded_from.species : null,
            cell_type: item.recorded_from ? item.recorded_from.cell_type : null,
            instances: item.data_location,
            view_url: item.part_of ? item.part_of.uri : null,
            parent_name: item.part_of ? item.part_of.name : null,
            parent_id: item.part_of ? item.part_of.identifier : null,
          })
        );

        console.log(traces);
        this.props.setListTraces(traces, false, null);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.props.setListTraces([], false, err);
        }
      });
  }

  handleFiltersChange(event) {
    const newConfig = { ...this.state.configFilters };
    newConfig[event.target.name] =
      typeof event.target.value === "string"
        ? [event.target.value]
        : event.target.value;
    this.setState({ configFilters: newConfig });
  }

  render() {
    return (
      <div>
        <h6>Please specify filters to search KG:</h6>
        <em>Note: you can select multiple values for each filter</em>
        <form>
          {this.props.showFilters.map((filter) => (
            <MultipleSelect
              itemNames={
                !this.props.validKGFilterValues
                  ? []
                  : this.props.validKGFilterValues[filter]
              }
              label={formatLabel(filter)}
              name={filter}
              value={this.state.configFilters[filter] || []}
              handleChange={this.handleFiltersChange}
              key={filter}
            />
          ))}
        </form>
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
      trace_ids: "",
    };

    this.getListTracesAllenBrain = this.getListTracesAllenBrain.bind(this);
    this.toggleSearchByID = this.toggleSearchByID.bind(this);
    this.handleIDsChange = this.handleIDsChange.bind(this);
  }

  componentDidMount() {
    // Child passes its method to the parent
    this.props.shareGetListTraces(this.getListTracesAllenBrain);
  }

  getListTracesAllenBrain() {
    console.log("Query Allen Brain Atlas");

    if (this.state.searchByID) {
      // one query per input cell ID
      // each query will correspond to a specific trace
      let traceDBreqs = [];
      // split csv to list
      let list_trace_ids = this.state.trace_ids
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      // remove duplicates
      list_trace_ids = [...new Set(list_trace_ids)];
      list_trace_ids.forEach(function (trace_id, i) {
        let url =
          corsProxy +
          allenbrain_baseUrl +
          "/query.json?wrap=true&criteria=%5Bspecimen__id%24eq" +
          trace_id +
          "%5D";
        traceDBreqs.push(axios.get(url));
      });
      const context = this;
      Promise.allSettled(traceDBreqs)
        .then(function (res) {
          console.log(res);
          let trace_list = [];
          for (let ind in list_trace_ids) {
            if (res[ind].status === "fulfilled") {
              let item = res[ind].value.data.msg[0];
              trace_list.push({
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
                download__id: item.erwkf__id,
                reconstruction_type: item.nr__reconstruction_type,
              });
            } else {
              showNotification(
                context.props.enqueueSnackbar,
                context.props.closeSnackbar,
                "Invalid Cell ID: " + list_trace_ids[ind] + "!",
                "error"
              );
            }
          }
          console.log(trace_list);
          // create trace entries from collected attributes
          context.props.setListTraces(trace_list, false, null);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("errorUpdate: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            this.props.setListTraces([], false, err);
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
            let trace_list = [];
            for (let item of res.data) {
              trace_list.push({
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
                download__id: item.erwkf__id,
                reconstruction_type: item.nr__reconstruction_type,
              });
            }
            console.log(trace_list);
            this.props.setListTraces(trace_list, false, null);
          },
        });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.props.setListTraces([], false, err);
        }
      }
    }
  }

  toggleSearchByID() {
    if (this.state.searchByID) {
      this.setState({
        trace_ids: "",
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
      trace_ids: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Grid item xs={12} style={{ paddingBottom: "10px" }}>
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
              (e.g. 643575207, 628700262)
            </em>
            <form>
              <TextField
                variant="outlined"
                fullWidth={true}
                name="AllenBrain_trace_ids"
                value={this.state.trace_ids}
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

export default class DBInputTraces extends React.Component {
  static contextType = ContextMain;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      list_traces: [],
      error: null,
      trace_collection: {},
      showFilters: true,
      sourceDB: "Knowledge Graph",
    };

    this.acceptsProceedMethod = this.acceptsProceedMethod.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.setListTraces = this.setListTraces.bind(this);

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
    this.getListTraces = childGetListMethod;
  }

  handleProceed() {
    this.setState(
      {
        showFilters: false,
        loading: true,
      },
      () => {
        this.getListTraces();
      }
    );
  }

  setListTraces(list_traces, loading, error) {
    this.setState({
      list_traces: list_traces,
      loading: loading,
      error: error,
    });
  }

  handleErrorDialogClose() {
    this.setState({ error: null });
  }

  addInstanceCollection(
    trace_id,
    trace_name,
    instance_id,
    instance_name,
    source_url,
    view_url
  ) {
    console.log("Add");

    let trace_collection = this.state.trace_collection;
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (!Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        trace_collection[trace_id][instance_id] = {
          label: instance_name
            ? trace_name + " (" + instance_name + ")"
            : trace_name,
          source_url: source_url,
          view_url: view_url,
        };
      }
    } else {
      trace_collection[trace_id] = {
        [instance_id]: {
          label: instance_name
            ? trace_name + " (" + instance_name + ")"
            : trace_name,
          source_url: source_url,
          view_url: view_url,
        },
      };
    }

    this.setState({
      trace_collection: trace_collection,
    });
  }

  removeInstanceCollection(trace_id, instance_id) {
    console.log("Remove");

    let trace_collection = this.state.trace_collection;
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        delete trace_collection[trace_id][instance_id];
      }
      if (Object.keys(trace_collection[trace_id]).length === 0) {
        delete trace_collection[trace_id];
      }
    }

    this.setState({
      trace_collection: trace_collection,
    });
  }

  checkInstanceInCollection(trace_id, instance_id) {
    let flag = false;
    let trace_collection = this.state.trace_collection;
    if (Object.keys(trace_collection).includes(trace_id)) {
      if (Object.keys(trace_collection[trace_id]).includes(instance_id)) {
        flag = true;
      }
    }
    console.log(flag);
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let trace_collection = this.state.trace_collection;
    for (const trace_id in trace_collection) {
      total += Object.keys(trace_collection[trace_id]).length;
    }
    return total;
  }

  showFiltersPanel() {
    let showFilters = "";
    switch (this.state.sourceDB) {
      case "Knowledge Graph":
        showFilters = filterKGTracesKeys;
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
          values={["Knowledge Graph", "Allen Brain"]}
          selected={this.state.sourceDB}
          onChange={this.handleDBChange}
        />
        <br />
        {this.state.sourceDB === "Knowledge Graph" && (
          <FilterPanelKG
            showFilters={showFilters}
            validKGFilterValues={this.context.validKGFilterValues[0]}
            shareGetListTraces={this.acceptsProceedMethod}
            setListTraces={this.setListTraces}
          />
        )}
        {this.state.sourceDB === "Allen Brain" && (
          <FilterPanelAllenBrain
            shareGetListTraces={this.acceptsProceedMethod}
            setListTraces={this.setListTraces}
            enqueueSnackbar={this.props.enqueueSnackbar}
            closeSnackbar={this.props.closeSnackbar}
          />
        )}
      </Box>
    );
  }

  showContentsPanel() {
    if (this.state.sourceDB === "Knowledge Graph") {
      return (
        <KGContent
          data={this.state.list_traces}
          addInstanceCollection={this.addInstanceCollection}
          removeInstanceCollection={this.removeInstanceCollection}
          checkInstanceInCollection={this.checkInstanceInCollection}
          countTotalInstances={this.countTotalInstances}
        />
      );
    } else if (this.state.sourceDB === "Allen Brain") {
      return (
        <AllenBrainContent
          data={this.state.list_traces}
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
      list_traces: [],
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
        //   disableBackdropClick={true}
        //   disableEscapeKeyDown={true}
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
            {(!this.context.validKGFilterValues[0] && this.state.showFilters) ||
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
                        list_traces: [],
                        trace_collection: {},
                        showFilters: true
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
                      this.state.trace_collection,
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
