import React from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import axios from "axios";
import ContextMain from "./ContextMain";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import { baseUrl } from "./globals";

// define the columns for the material data table
const TABLE_COLUMNS = [
  {
    title: "Live Paper Name",
    field: "title",
  },
  {
    title: "Collab",
    field: "collab_id",
  },
  {
    title: "Modified",
    field: "modified_date",
    type: "date",
    defaultSort: "desc",
  },
];

export default class LoadKGProjects extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      error: null,
      loading: false,
      selectedRow: null,
    };

    // const [authContext,] = this.context.auth;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelectProject = this.handleSelectProject.bind(this);
    this.checkRequirements = this.checkRequirements.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
  }

  handleCancel() {
    this.props.onClose(false);
  }

  checkRequirements(data) {
    let error = null;
    // a collab must be specified
    if (!data.collab_id) {
      error = "A Collab must be specified!";
    }

    if (error) {
      console.log(error);
      this.setState({
        error: error,
      });
      return false;
    } else {
      return true;
    }
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
  }

  handleSelectProject() {
    this.setState({ loading: true }, () => {
      let url =
        baseUrl +
        "/livepapers/" +
        this.props.kg_project_list[this.state.selectedRow].id;
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
            error: null,
            loading: false,
          });
          this.props.onClose(res.data);
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

  render() {
    // console.log(this.state);
    if (this.state.error) {
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={this.state.error[0].msg || this.state.error}
        />
      );
    } else {
      return (
        <Dialog
          onClose={this.handleCancel}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle style={{ backgroundColor: "#ffd180" }}>
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Load Live Paper Project From EBRAINS Knowledge Graph
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <Box my={2}>
              You have permissions to edit the following Live Paper projects on
              the Knowledge Graph:
            </Box>
            <Box my={2}>
              <MaterialTable
                title="Live Paper Projects"
                data={this.props.kg_project_list}
                columns={TABLE_COLUMNS}
                onRowClick={(evt, selectedRow) =>
                  this.setState({ selectedRow: selectedRow.tableData.id })
                }
                options={{
                  search: true,
                  paging: false,
                  filtering: false,
                  exportButton: false,
                  maxBodyHeight: "60vh",
                  headerStyle: {
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#FFFFFF",
                    fontWeight: "bolder",
                    fontSize: 15,
                  },
                  rowStyle: (rowData) => ({
                    backgroundColor:
                      this.state.selectedRow === rowData.tableData.id
                        ? "#FFD180"
                        : "#EEEEEE",
                  }),
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
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "20%",
                  backgroundColor: "#FF9800",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "20%",
                  backgroundColor:
                    (this.state.selectedRow || this.state.selectedRow === 0) &&
                    this.state.selectedRow >= 0
                      ? "#8BC34A"
                      : "#FFFFFF",
                  color: "#000000",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "#000000",
                  borderWidth: "1px",
                }}
                onClick={this.handleSelectProject}
                disabled={
                  !(
                    (this.state.selectedRow || this.state.selectedRow === 0) &&
                    this.state.selectedRow >= 0
                  )
                }
              >
                Load Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }
}

LoadKGProjects.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
