export function showNotification(
  enqueueSnackbar,
  closeSnackbar,
  message,
  type = "default"
) {
  // type: default, success, error, warning, info
  const key = enqueueSnackbar(message, {
    variant: type,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    onClick: () => {
      closeSnackbar(key);
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

export function formatAuthors(authors) {
  if (authors) {
    return authors
      .map((author) => author.given_name + " " + author.family_name)
      .join(", ");
  } else {
    return "";
  }
}

export function formatTimeStampToLongString(ISOtimestamp) {
  if (ISOtimestamp) {
    const d = new Date(ISOtimestamp);
    return d.toUTCString();
  } else {
    return "";
  }
}

export const flattenNestedObject = (obj) => {
  const flattened = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(flattened, flattenNestedObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });
  return flattened;
};

export function formatLabel(label) {
  // function to format labels by converting underscores and hyphens to spaces, and
  // capitalizing each word; certain specific labels are changed entirely to uppercase
  if (["id", "uri"].indexOf(label) > -1) {
    label = label.toUpperCase();
  } else {
    if (label === "project_id") {
      label = "collab_id";
    }
    label = label.replace(/__/g, " "); // replace double underscores with spaces as well (for Allen Brain)
    label = label.replace(/_/g, " ");
    label = label.replace(/-/g, " ");
    label = label
      .toLowerCase()
      .split(" ")
      .map((word) =>
        word === "id" ? "ID" : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }
  return label;
}

export function buildQuery(filterDict, target = "") {
  let q = "";
  if (target === "NeuroMorpho") {
    // see: http://neuromorpho.org/apiReference.html#neuron-filter-query
    for (let key in filterDict) {
      if (q === "") {
        // first param
        q += "&q=" + key + ":" + filterDict[key].join(",");
      } else {
        // other params
        q += "&fq=" + key + ":" + filterDict[key].join(",");
      }
    }
    q += "&sort=neuron_id,asc";
  } else if (target === "BioModels") {
    // see: https://www.ebi.ac.uk/biomodels-static/user-guide/model_search.html
    for (let key in filterDict) {
      for (let value of filterDict[key]) {
        if (filterDict[key].indexOf(value) === 0) {
          // first item in list
          q += " (" + key + ':"' + value + '"';
        } else {
          // other items in list
          q += " OR " + key + ':"' + value + '"';
        }
      }
      q += ") AND ";
    }
    q = q.slice(0, -5); // to remove last AND
  } else {
    for (let key in filterDict) {
      for (let value of filterDict[key]) {
        q += `&${key}=${value}`;
      }
    }
  }
  return q.slice(1); // to remove leading &
}
