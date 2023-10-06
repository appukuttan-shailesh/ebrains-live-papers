import React from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect(props) {
  const fieldId = "select-" + props.label.replace(" ", "-");
  const fieldLabelId = fieldId + "-label";
  const fieldName = props.name.replace(" ", "_");

  return (
    <div>
      <FormControl
        disabled={props.disabled || false}
        sx={{ margin: 1, minWidth: 700, maxWidth: 900 }}
      >
        <InputLabel id={fieldLabelId}>{props.label}</InputLabel>
        <Select
          labelId={fieldLabelId}
          id={fieldId}
          multiple
          value={props.value ? props.value : ""}
          name={fieldName}
          onChange={props.handleChange}
          input={<Input />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {props.itemNames.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={props.value.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        {props.helperText && (
          <FormHelperText>{props.helperText}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
