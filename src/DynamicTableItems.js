import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ForwardIcon from "@material-ui/icons/Forward";
import Tooltip from "@material-ui/core/Tooltip";
import arrayMove from "array-move";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import StorageIcon from "@material-ui/icons/Storage";
import EditIcon from "@material-ui/icons/Edit";

export default class DynamicTableItems extends React.Component {
  handleAdd() {
    var items = this.props.items;
    items.push({ label: "", url: "", mc_url: "" });
    this.props.onChangeValue(items);
  }

  handleItemChanged(i, event) {
    var items = this.props.items;
    items[i][event.target.name] = event.target.value;
    this.props.onChangeValue(items);
  }

  handleItemMoveDown(ind) {
    console.log("Move down item with index: " + ind);
    const maxInd = this.props.items.length;

    if (ind < maxInd) {
      var items = this.props.items;
      items = arrayMove(items, ind, ind + 1);
      this.props.onChangeValue(items);
    }
  }

  handleItemMoveUp(ind) {
    console.log("Move up item with index: " + ind);

    if (ind > 0) {
      var items = this.props.items;
      items = arrayMove(items, ind, ind - 1);
      this.props.onChangeValue(items);
    }
  }

  handleItemDeleted(ind) {
    var items = this.props.items;
    items.splice(ind, 1);
    this.props.onChangeValue(items);
  }

  renderRows(numCols) {
    var context = this;
    var items = this.props.items;

    return this.props.items.map(function (item, ind) {
      return (
        <tr key={"item-" + ind}>
          <td style={{ padding: "5px 10px 5px 0px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip title={item["label"]}>
                <input
                  name="label"
                  type="text"
                  value={item["label"]}
                  onChange={context.handleItemChanged.bind(context, ind)}
                />
              </Tooltip>
            </div>
          </td>
          <td
            style={{
              width: numCols > 2 ? "32.5%" : "65%",
              padding: "5px 10px 5px 0px",
            }}
          >
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip title={item["url"]}>
                <input
                  name="url"
                  type="text"
                  value={item["url"]}
                  onChange={context.handleItemChanged.bind(context, ind)}
                />
              </Tooltip>
            </div>
          </td>
          {numCols > 2 && (
            <td style={{ width: "32.5%", padding: "5px 10px 5px 0px" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
                <Tooltip title={item["mc_url"]}>
                  <input
                    name="mc_url"
                    type="text"
                    value={item["mc_url"]}
                    onChange={context.handleItemChanged.bind(context, ind)}
                  />
                </Tooltip>
              </div>
            </td>
          )}
          <td style={{ width: "100px", padding: "5px 0px 5px 10 px" }}>
            <div style={{ textAlign: "center" }}>
              <Tooltip title="Move down">
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="move down"
                  component="span"
                  style={{ paddingRight: "5px" }}
                  onClick={context.handleItemMoveDown.bind(context, ind)}
                >
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      transform: `rotate(90deg)`,
                      color: ind === items.length - 1 ? "#A1887F" : "#000000",
                    }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move up">
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="move up"
                  component="span"
                  style={{ paddingRight: "5px" }}
                  onClick={context.handleItemMoveUp.bind(context, ind)}
                >
                  <ForwardIcon
                    stroke={"#000000"}
                    strokeWidth={1}
                    style={{
                      transform: `rotate(270deg)`,
                      color: ind === 0 ? "#A1887F" : "#000000",
                    }}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="secondary"
                  size="small"
                  aria-label="delete"
                  component="span"
                  onClick={context.handleItemDeleted.bind(context, ind)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    // console.log(this.props.items);
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th style={{ padding: "5px 10px" }}>Label</th>
              <th style={{ padding: "5px 10px" }}>Download URL</th>
              {this.props.numCols > 2 && (
                <th style={{ padding: "5px 10px" }}>Model Catalog URL</th>
              )}
              <th style={{ padding: "5px 0px 5px 10 px" }}>
                {/* delete button */}
              </th>
            </tr>
          </thead>
          <tbody>{this.renderRows(this.props.numCols)}</tbody>
        </table>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.handleEdit}
            style={{
              width: "160px",
              marginRight: "25px",
              backgroundColor: "#B71C1C",
            }}
            startIcon={<EditIcon />}
          >
            Edit Source
          </Button>
          <Button
            variant="contained"
            color="primary"
            // onClick={}
            style={{
              width: "160px",
              marginRight: "25px",
              backgroundColor: "#388E3C",
            }}
            startIcon={<StorageIcon />}
          >
            Add From KG
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleAdd.bind(this)}
            style={{ width: "160px" }}
            startIcon={<AddCircleOutlineIcon />}
          >
            Add Row
          </Button>
        </div>
      </div>
    );
  }
}
