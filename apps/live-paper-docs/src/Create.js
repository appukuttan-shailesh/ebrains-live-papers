import React from "react";
import "./App.css";

export default class Create extends React.Component {
  render() {
    return (
      <div>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
            textAlign: "justify",
            fontSize: 16,
            lineHeight: 1.75,
            marginTop: "40px",
            marginBottom: "40px"
          }}
        >
          <div className="title-solid-style" style={{ fontSize: 44 }}>Live Paper Builder</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Online tool for creating live papers</div>
        </div>

        <div className="block">
          <div className="block-little-header">Live Paper Platform</div>
          <div className="block-main-header">Collection of all public live papers</div>
          <div className="block-text">
            The live paper builder tool has been developed with the primary
            focus on making the data sharing process as simple as possible. It
            allows authors to construct live papers by simply filling info into
            a form based interface.
            <br /><br />
            The first step towards creating a live paper is to apply for an
            EBRAINS account. Interested users can create an account{" "}
            <a href="https://iam.ebrains.eu/register" target="_blank" rel="noreferrer">here</a>.
            It is free and simple to create a new account, and mainly requires
            an institutional email account. Once they have an EBRAINS account,
            they can access the{" "}
            <a href="/builder" target="_blank">live paper builder tool</a>.
            <br /><br />
            On opening the tool, users are given an option to continue working
            on an existing project, either by loading a previously downloaded
            project file or selecting a live paper project saved on the
            KnowledgeGraph. Alternatively, they can start creating a new live
            paper project as we demonstrate here.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_homepage.png" width="95%" />
            </div>
            <br />
            Metadata about the associated publication can either be manually
            entered field by field, or users can avail of the feature to upload
            the PDF version of the manuscript and have the tool attempt to
            auto-extract all the relevant info and populate the corresponding
            fields.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_create_home.png" width="95%" />
            </div>
            <br />
            An example outcome of auto-extracting the metadata from the PDF is
            shown below. We employ {" "}
            <a href="https://github.com/kermitt2/grobid" target="_blank" rel="noreferrer">GROBID</a>
            , a tool for extracting metadata from scholarly publications, for
            this purpose. As this is an automated process, it is advised that
            the the output be verified, and corrections be made as required.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_pdf_extract.png" width="95%" />
            <br /><br />
            </div>
            The data extracted from the PDF would be auto-populated into the
            corresponding fields of the live paper builder. If no article PDF
            was upload at the earlier stage, then all fields would start empty
            and the authors would need to manually fill all of these. Also,
            there are some additional fields (such as the license to be applied
            to the shared resources) which are to be manually specified by the
            authors irrespective of the two approaches.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_main_filled.png" width="95%" />
            <br /><br />
            </div>
            Once all the metadata has been inserted, authors can proceed to
            listing the resources that they wish to share through the developed
            live paper. For computational modeling studies, we have found that
            the most common resources being distributed comprise of the
            following:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_resource_panel.png" width="95%" />
            </div>
            <ul>
              <li><a href="./morphology.html">Morphologies</a></li>
              <li><a href="./traces.html">Electrophysiological Recordings</a></li>
              <li><a href="./models.html">Models</a></li>
              <li><a href="./other.html">Other Content</a> (Generic, Custom)</li>
            </ul>
            Click on the above links for more details on how to share each type
            of resource in a live paper.
            <br /><br />
            As seen on the toolbar at the bottom of the live paper builder, it
            allows authors to preview any changes, download locally the
            resultant HTML file as well as the project file, with all data saved
            in JSON format, and also to save the project data on the KG. This
            allows users to develop the live papers across multiple sessions
            and/or enhance them over time, by either loading the previously
            downloaded project files, or via selecting from a list of live paper
            projects from the KG that the user has access to. Once the live
            paper development is completed, users can raise requests for them to
            be published on the platform.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_toolbar.png" width="95%" />
            </div>
            <br />
            Live papers can be set to be password-protected, thereby enabling
            them to be shared solely with reviewers prior to publication. When
            you're ready to share publicly, the authors need to submit the live
            paper for publication, after which it will undergo a review process.
            Once reviewed, the live paper will be published and made available
            to the scientific community.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src="/figures/create/lp_builder_submit_password.png" width="95%" />
            </div>
            The review process primarily involves verifying that all contained
            resources are actually accessible and that these are hosted on
            reliable data storage repositories. Resources hosted on authors' or
            universities' own websites are copied over to our own central data
            repository, to ensure long term accessibility and availability of
            these resources. In view of other established neuroscience data
            repositories, such as ModelDB, OSB, BioModels, NeuroMorpho and the Allen Brain
            Atlas, resources already hosted on these platforms are not
            duplicated, but instead we provide redirects to the corresponding
            entries on these platforms
          </div>
        </div>

      </div>
    );
  }
}
