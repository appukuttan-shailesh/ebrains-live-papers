export function isUUID(uuid) {
  let s = "" + uuid;

  s = s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (s === null) {
    return false;
  }
  return true;
}

export function compareArrayoOfObjectsByOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  } else {
    return 1;
  }
}

export function replaceNullWithEmptyStrings(param) {
  if (param === null) {
    // Note: null is also object, but explicitly comared before testing for object below
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
