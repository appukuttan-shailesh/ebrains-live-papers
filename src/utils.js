export function copyToClipboard(
  value,
  enqueueSnackbar,
  message,
  type = "default"
) {
  // type: default, success, error, warning, info
  navigator.clipboard.writeText(value);
  enqueueSnackbar(message, {
    variant: type,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
  });
}

export function showNotification(enqueueSnackbar, message, type = "default") {
  // type: default, success, error, warning, info
  enqueueSnackbar(message, {
    variant: type,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
  });
}

export function replaceEmptyStringsWithNull(param) {
  if (param === null) {
    return param;
  } else if (typeof param === "string") {
    return param === "" ? null : param;
  } else if (Array.isArray(param)) {
    return param.map((element) => replaceEmptyStringsWithNull(element));
  } else if (typeof param === "object") {
    Object.entries(param).map(function ([key, val]) {
      return (param[key] = replaceEmptyStringsWithNull(val));
    });
    return param;
  } else {
    // e.g. number, boolean
    return param;
  }
}


export function replaceNullWithEmptyStrings(param) {
    if (param === null) {
      // Note: null is also object, but explictly comared before testing for object below
      return "";
    } else if (typeof param === "string") {
      return param;
    } else if (Array.isArray(param)) {
      return param.map((element) => replaceNullWithEmptyStrings(element));
    } else if (typeof param === "object") {
      Object.entries(param).map(function ([key, val]) {
        return (param[key] = replaceNullWithEmptyStrings(val));
      });
      return param;
    } else {
      // e.g. number, boolean
      return param;
    }
  }
  

export function compareArrayoOfObjectsByOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  } else {
    return 1;
  }
}
