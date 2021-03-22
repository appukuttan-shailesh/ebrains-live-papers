import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 700,
    maxWidth: 900,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

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

export default function SingleSelect(props) {
  const classes = useStyles();
  const fieldId = "select-" + props.label.replace(" ", "-");
  const fieldLabelId = fieldId + "-label";
  const fieldName = props.name.replace(" ", "_");

  return (
    <div>
      <FormControl
        className={classes.formControl}
        disabled={props.disabled || false}
      >
        <InputLabel id={fieldLabelId}>{props.label}</InputLabel>
        <Select
          labelId={fieldLabelId}
          id={fieldId}
          value={props.value ? props.value : ""}
          name={fieldName}
          onChange={props.handleChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {props.itemNames.map((name) => (
            <MenuItem key={name} value={name}>
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
