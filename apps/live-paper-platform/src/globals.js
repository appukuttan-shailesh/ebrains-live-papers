export const livePaperBuilderUrl = "/builder";
export const livePaperDocsUrl = "/";
export const baseUrl = "https://validation-v2.brainsimulation.eu";
// export const querySizeLimit = 10;
export const querySizeLimit = 1000000;
export const separator = "#-#";

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
