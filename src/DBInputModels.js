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
import SingleSelect from "./SingleSelect";
import MultipleSelect from "./MultipleSelect";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import SwitchTwoWay from "./SwitchTwoWay";
import {
  baseUrl,
  mc_baseUrl,
  querySizeLimit,
  filterKGModelsKeys,
  filterModelDBKeys,
  labelsModelDBKeys,
  filterAttributeMappingModelDB,
  modelDB_baseUrl,
  corsProxy,
} from "./globals";
import {
  formatAuthors,
  formatTimeStampToLongString,
  buildQuery,
} from "./utils";

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
    field: "name",
    title: "Name",
  },
  {
    field: "alias",
    title: "Alias",
    hidden: true,
  },
  {
    field: "author",
    title: "Author",
    render: (item) => formatAuthors(item.author),
  },
  {
    field: "private",
    title: "Visibility",
    render: (item) => (item.private ? "Private" : "Public"),
    hidden: true,
  },
  {
    field: "project_id",
    title: "Collab",
    hidden: true,
  },
  {
    field: "species",
    title: "Species",
    hidden: true,
  },
  {
    field: "brain_region",
    title: "Brain Region",
    hidden: true,
  },
  {
    field: "cell_type",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "model_scope",
    title: "Model Scope",
    hidden: true,
  },
  {
    field: "abstraction_level",
    title: "Abstraction Level",
    hidden: true,
  },
  {
    field: "owner",
    title: "Owner",
    render: (item) => formatAuthors(item.owner),
    hidden: true,
  },
  {
    field: "organization",
    title: "Organization",
    hidden: true,
  },
  {
    field: "date_created",
    title: "Created Date",
    hidden: true,
  },
  {
    field: "instances",
    title: "Instances",
    hidden: true,
    hiddenByColumnsButton: true,
  },
];
const MODELDB_TABLE_COLUMNS = [
  {
    field: "id",
    title: "ID",
  },
  {
    field: "name",
    title: "Name",
  },
  //   {
  //     field: "author",
  //     title: "Author",
  //     hidden: true,
  //   },
  {
    field: "region",
    title: "Brain Region",
    hidden: true,
  },
  {
    field: "neurons",
    title: "Cell Type",
    hidden: true,
  },
  {
    field: "model_type",
    title: "Model Type",
    hidden: true,
  },
  {
    field: "model_concept",
    title: "Model Concept",
    hidden: true,
  },
  {
    field: "modeling_application",
    title: "Simulator",
    hidden: true,
  },
  //   {
  //     field: "date_created",
  //     title: "Created Date",
  //     hidden: true,
  //   },
  // {
  //   field: "instances",
  //   title: "Instances",
  //   hidden: true,
  //   hiddenByColumnsButton: true,
  // },
];

function IncludeButton(props) {
  //   console.log(props);
  if (props.includeFlag) {
    return (
      <Tooltip title="Remove model instance from collection" placement="top">
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
            props.removeInstanceCollection(props.model_id, props.instance_id)
          }
        >
          Remove
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Add model instance to collection" placement="top">
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
              props.model_id,
              props.model_name,
              props.instance_id,
              props.instance_name,
              props.source_url
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
            my={2}
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

class ModelVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "source",
    };
  }

  render() {
    return (
      <Box
        my={2}
        pb={0}
        style={{ backgroundColor: "#FFF1CC", marginBottom: "20px" }}
        key={this.props.instance.id}
      >
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFD180",
          }}
        >
          <Grid item xs={6}>
            <Box px={2} display="flex" flexDirection="row">
              <p variant="subtitle2">
                Version:{" "}
                <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                  {this.props.instance.version}
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
              <Typography variant="body2" color="textSecondary">
                ID: <span>{this.props.instance.id}</span>
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#000000", paddingLeft: "25px" }}
              >
                {formatTimeStampToLongString(this.props.instance.timestamp)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={9}>
            <div style={{ padding: "10px 0px 0px 10px" }}>
              <div>
                {[
                  "description",
                  "source",
                  "morphology",
                  "parameters",
                  "code_format",
                  "license",
                  "hash",
                ].map((param, ind) => (
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
                    style={{ color: "#000000", marginRight: "10px" }}
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
                this.props.instance.model_id,
                this.props.instance.id
              )}
              model_id={this.props.model_id}
              model_name={this.props.model_name}
              instance_id={this.props.instance.id}
              instance_name={this.props.instance.version}
              source_url={this.props.instance.source}
              addInstanceCollection={this.props.addInstanceCollection}
              removeInstanceCollection={this.props.removeInstanceCollection}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

class ModelVersionsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedParam: "source",
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
              <b>Versions</b>
            </Typography>
            <Link
              href={mc_baseUrl + "/#model_id." + this.props.data.id}
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              <Button
                variant="contained"
                style={{ color: "#455A64" }}
                startIcon={<OpenInNewIcon />}
              >
                Open Model
              </Button>
            </Link>
          </Grid>
        </Grid>
        {this.props.data.instances.length === 0 ? (
          <div style={{ fontSize: 14 }}>
            <br />
            No model instances have yet been registered for this model.
          </div>
        ) : (
          this.props.data.instances.map((instance, ind) => (
            <div style={{ marginBottom: "25px" }} key={ind}>
              <ModelVersion
                model_id={this.props.data.id}
                model_name={this.props.data.name}
                instance={instance}
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
        <MaterialTable
          title="Models"
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
                ? "#FFD180"
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
              <ModelVersionsPanel
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
                  backgroundColor: "#FFD180",
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
            {"Number of model instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

export class ModelDBContent extends React.Component {
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
        <MaterialTable
          title="Models"
          data={this.props.data}
          columns={MODELDB_TABLE_COLUMNS}
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
                ? "#FFD180"
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
              <ModelVersionsPanel
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
                  backgroundColor: "#FFD180",
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
            {"Number of model instances selected: " +
              this.props.countTotalInstances()}
          </h6>
        </div>
      </div>
    );
  }
}

export default class DBInputModels extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      list_models: [],
      error: null,
      model_collection: {},
      showFilters: true,
      configFilters: {},
      sourceDB: "Knowledge Graph",
    };

    this.getListModelsKG = this.getListModelsKG.bind(this);
    this.getListModelsModelDB = this.getListModelsModelDB.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
    this.addInstanceCollection = this.addInstanceCollection.bind(this);
    this.removeInstanceCollection = this.removeInstanceCollection.bind(this);
    this.checkInstanceInCollection = this.checkInstanceInCollection.bind(this);
    this.countTotalInstances = this.countTotalInstances.bind(this);
    this.showFiltersPanel = this.showFiltersPanel.bind(this);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
    this.handleKGProceed = this.handleKGProceed.bind(this);
    this.handleModelDBProceed = this.handleModelDBProceed.bind(this);
    this.handleDBChange = this.handleDBChange.bind(this);
  }

  getListModelsKG() {
    console.log("Query KG");
    let config = {
      cancelToken: this.signal.token,
      headers: {
        Authorization: "Bearer " + this.context.auth[0].token,
      },
    };
    let query = buildQuery(this.state.configFilters);
    let url =
      baseUrl + "/models/?" + encodeURI(query) + "&size=" + querySizeLimit;
    this.setState({ loading: true });
    axios
      .get(url, config)
      .then((res) => {
        const models = res.data;
        console.log(models);
        this.setState({
          list_models: models,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          this.setState({
            loading: false,
            error: err,
          });
        }
      });
  }

  getListModelsModelDB() {
    console.log("Query ModelDB");
    this.setState({ loading: true });
    let query = buildQuery(this.state.configFilters);

    let modelDBreqs = [];
    for (let item of [
      "id",
      "name",
      ...Object.values(filterAttributeMappingModelDB),
    ]) {
      let url =
        corsProxy +
        modelDB_baseUrl +
        "/models/" +
        item +
        "?" +
        encodeURI(query);
      modelDBreqs.push(axios.get(url));
    }

    const context = this;
    Promise.all(modelDBreqs)
      .then(function (res) {
        console.log(res);
        let model_list = [];
        for (let ind in res[0].data) {
          let data_dict = {};
          [
            "id",
            "name",
            ...Object.values(filterAttributeMappingModelDB),
          ].forEach(function (item, i) {
            data_dict[item] = res[i].data[ind];
          });
          model_list.push(data_dict);
        }

        console.log(model_list);
        // create model entries from collected attributes
        context.setState({
          list_models: model_list,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("errorUpdate: ", err.message);
        } else {
          // Something went wrong. Save the error in state and re-render.
          context.setState({
            loading: false,
            error: err,
          });
        }
      });
  }

  handleErrorDialogClose() {
    this.setState({ error: null });
  }

  addInstanceCollection(
    model_id,
    model_name,
    instance_id,
    instance_name,
    source_url
  ) {
    console.log("Add");

    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (!Object.keys(model_collection[model_id]).includes(instance_id)) {
        model_collection[model_id][instance_id] = {
          label: model_name + " (" + instance_name + ")",
          source_url: source_url,
        };
      }
    } else {
      model_collection[model_id] = {
        [instance_id]: {
          label: model_name + " (" + instance_name + ")",
          source_url: source_url,
        },
      };
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  removeInstanceCollection(model_id, instance_id) {
    console.log("Remove");

    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (Object.keys(model_collection[model_id]).includes(instance_id)) {
        delete model_collection[model_id][instance_id];
      }
      if (Object.keys(model_collection[model_id]).length === 0) {
        delete model_collection[model_id];
      }
    }

    this.setState({
      model_collection: model_collection,
    });
  }

  checkInstanceInCollection(model_id, instance_id) {
    let flag = false;
    let model_collection = this.state.model_collection;
    if (Object.keys(model_collection).includes(model_id)) {
      if (Object.keys(model_collection[model_id]).includes(instance_id)) {
        flag = true;
      }
    }
    console.log(flag);
    return flag;
  }

  countTotalInstances() {
    let total = 0;
    let model_collection = this.state.model_collection;
    for (let model_id in model_collection) {
      total += Object.keys(model_collection[model_id]).length;
    }
    return total;
  }

  showFiltersPanel() {
    let showFilters =
      this.state.sourceDB === "Knowledge Graph"
        ? filterKGModelsKeys
        : filterModelDBKeys;
    return (
      <Box my={2}>
        <h6 style={{ marginBottom: "20px" }}>Please specify the database:</h6>
        <SwitchTwoWay
          values={["Knowledge Graph", "ModelDB"]}
          selected={this.state.sourceDB}
          onChange={this.handleDBChange}
        />
        <br />
        {this.state.sourceDB === "Knowledge Graph" && (
          <div>
            <h6>Please specify filters to search KG:</h6>
            <em>Note: you can select multiple values for each filter</em>
            <form>
              {showFilters.map((filter) => (
                <MultipleSelect
                  itemNames={
                    !this.props.validKGFilterValues
                      ? []
                      : this.props.validKGFilterValues[filter]
                  }
                  label={filter}
                  value={this.state.configFilters[filter] || []}
                  handleChange={this.handleFiltersChange}
                  key={filter}
                />
              ))}
            </form>
          </div>
        )}
        {this.state.sourceDB === "ModelDB" && (
          <div>
            <h6>Please specify filters to search ModelDB:</h6>
            <em>Note: you can select only one value for each filter</em>
            <form>
              {showFilters.map((filter) => (
                <SingleSelect
                  itemNames={
                    !this.props.validModelDBFilterValues
                      ? ["a"]
                      : this.props.validModelDBFilterValues[filter]
                  }
                  label={labelsModelDBKeys[filter]}
                  name={filterAttributeMappingModelDB[filter]}
                  value={
                    this.state.configFilters[
                      filterAttributeMappingModelDB[filter]
                    ] || ""
                  }
                  handleChange={this.handleFiltersChange}
                  key={filter}
                />
              ))}
            </form>
          </div>
        )}
      </Box>
    );
  }

  handleFiltersChange(event) {
    const newConfig = { ...this.state.configFilters };
    newConfig[event.target.name] =
      typeof event.target.value === "string"
        ? [event.target.value]
        : event.target.value;
    this.setState({ configFilters: newConfig });
  }

  handleKGProceed() {
    this.setState(
      {
        showFilters: false,
      },
      () => {
        this.getListModelsKG();
      }
    );
  }

  handleModelDBProceed() {
    this.setState(
      {
        showFilters: false,
      },
      () => {
        this.getListModelsModelDB();
      }
    );
  }

  handleDBChange(value) {
    console.log(value);
    this.setState({
      sourceDB: value,
      configFilters: {},
      list_models: [],
    });
  }

  render() {
    // console.log(this.props);
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
            style={{ backgroundColor: "#ffd180" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Input From Database
            </span>
          </DialogTitle>
          <DialogContent dividers>
            {(!this.props.validKGFilterValues && this.state.showFilters) ||
            this.state.loading ? (
              <LoadingIndicator />
            ) : this.state.showFilters ? (
              this.showFiltersPanel()
            ) : this.state.sourceDB === "Knowledge Graph" ? (
              <KGContent
                data={this.state.list_models}
                addInstanceCollection={this.addInstanceCollection}
                removeInstanceCollection={this.removeInstanceCollection}
                checkInstanceInCollection={this.checkInstanceInCollection}
                countTotalInstances={this.countTotalInstances}
              />
            ) : (
              <ModelDBContent
                data={this.state.list_models}
                addInstanceCollection={this.addInstanceCollection}
                removeInstanceCollection={this.removeInstanceCollection}
                checkInstanceInCollection={this.checkInstanceInCollection}
                countTotalInstances={this.countTotalInstances}
              />
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
                  backgroundColor: "#FF9800",
                  color: "#000000",
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
                      backgroundColor: "#01579B",
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#000000",
                      borderWidth: "1px",
                    }}
                    onClick={() => {
                      this.setState({ showFilters: true });
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
                  backgroundColor: "#8BC34A",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={() =>
                  this.state.showFilters
                    ? this.state.sourceDB === "Knowledge Graph"
                      ? this.handleKGProceed()
                      : this.handleModelDBProceed()
                    : this.props.handleClose(true, this.state.model_collection)
                }
              >
                {this.state.showFilters ? "Proceed" : "Add KG Items"}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
