// NOTE: dummy data (in 'dev_data' directory) for DevMode is from v1 APIs; needs to be updated for v2 usage
export const livePaperPlatformUrl = "/";
export const livePaperBuilderUrl = "/builder";
export const livePaperDocsUrl = "/docs";
export const baseUrl = "https://validation.brainsimulation.eu";
export const mc_baseUrl = "https://model-catalog.brainsimulation.eu";
export const nar_baseUrl =
  "https://neural-activity-resource.brainsimulation.eu";
export const modelDB_baseUrl = "http://modeldb.science/api/v1";
export const modelDB_viewUrl = "https://senselab.med.yale.edu/modeldb";
export const osb_baseUrl = "https://www.opensourcebrain.org";
export const neuromorpho_baseUrl = "https://neuromorpho.org/api";
export const neuromorpho_viewUrl = "https://neuromorpho.org";
export const allenbrain_baseUrl =
  "https://celltypes.brain-map.org/api/v2/data/ApiCellTypesSpecimenDetail";
export const allenbrain_downloadUrl =
  "https://celltypes.brain-map.org/api/v2/well_known_file_download";
export const allenbrain_viewTraceUrl =
  "https://celltypes.brain-map.org/experiment/electrophysiology";
export const allenbrain_viewMorphologyUrl =
  "https://celltypes.brain-map.org/experiment/morphology";
export const biomodels_baseUrl = "https://www.ebi.ac.uk/biomodels";

export const lp_tool_version = "0.2";
export const timeout = 1000;
// export const querySizeLimit = 10;
export const querySizeLimit = 1000000;
export const separator = "#-#";

export const filterKGModelsKeys = [
  "species",
  "brain_region",
  "cell_type",
  "model_scope",
  "abstraction_level",
];
export const filterKGTracesKeys = ["species", "brain_region", "cell_type"];
export const filterModelDBKeys = [
  "regions",
  "celltypes",
  "modeltypes",
  "modelconcepts",
  "simenvironments",
];
export const filterNeuroMorphoKeys = [
  "species",
  "brain_region_1",
  "cell_type_1",
  "reconstruction_software",
  "protocol",
];
export const filterBioModelsKeys = [
  "curationstatus",
  "modelflag",
  "modelformat",
  "modellingapproach",
];

export const isParent = window.opener == null;
export const isIframe = window !== window.parent;
export const isFramedApp = isIframe && isParent;
export const collaboratoryOrigin = "https://wiki.ebrains.eu";
export const hashChangedTopic = "/clb/community-app/hashchange";
export const updateHash = (value) => {
  window.location.hash = value;
  if (isFramedApp) {
    window.parent.postMessage(
      {
        topic: hashChangedTopic,
        data: value,
      },
      collaboratoryOrigin
    );
  }
};

// To access certain APIs that give CORS related issues
export const corsProxy = "https://corsproxy.hbpneuromorphic.eu/";
// previously used https://corsproxy-sa.herokuapp.com/
// other options: https://cors-clear.herokuapp.com/, https://cors-fixer.herokuapp.com/,
// https://cors-handler.herokuapp.com/, https://cors-anywhere.herokuapp.com/ - latter now has request limits
