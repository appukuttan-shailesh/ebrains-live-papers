import React from "react";

const ContextMain = React.createContext();

const ContextMainProvider = (props) => {
  // Context state
  const [auth, setAuth] = React.useState({});
  const [collabList, setCollabList] = React.useState({});
  const [validKGFilterValues, setValidKGFilterValues] = React.useState(null);
  const [validModelDBFilterValues, setValidModelDBFilterValues] =
    React.useState(null);
  const [validNeuroMorphoFilterValues, setValidNeuroMorphoFilterValues] =
    React.useState(null);
  const [validBioModelsFilterValues, setValidBioModelsFilterValues] =
    React.useState(null);

  return (
    <ContextMain.Provider
      value={{
        auth: [auth, setAuth],
        collabList: [collabList, setCollabList],
        validKGFilterValues: [validKGFilterValues, setValidKGFilterValues],
        validModelDBFilterValues: [
          validModelDBFilterValues,
          setValidModelDBFilterValues,
        ],
        validNeuroMorphoFilterValues: [
          validNeuroMorphoFilterValues,
          setValidNeuroMorphoFilterValues,
        ],
        validBioModelsFilterValues: [
          validBioModelsFilterValues,
          setValidBioModelsFilterValues,
        ],
      }}
    >
      {props.children}
    </ContextMain.Provider>
  );
};

export default ContextMain;

export { ContextMainProvider };
