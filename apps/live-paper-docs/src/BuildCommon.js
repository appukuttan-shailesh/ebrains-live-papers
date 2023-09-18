import React from "react";
import "./App.css";

export default class BuildCommon extends React.Component {
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
          <div className="title-solid-style" style={{ fontSize: 44 }}>Resource Sections</div>
          <div className="title-solid-style" style={{ fontSize: 32, color: "#00A595" }}>Handling resource sections in live paper builder tool</div>
        </div>

        <div className="block">
          <div className="block-little-header">Add Section</div>
          <div className="block-main-header">Add a new resource section</div>
          <div className="block-text">
            The live paper builder tool provides a resource toolbar for adding
            resource sections, as illustrated below. Authors are free to add as
            many resource sections as required, including multiple sections of
            the same resource type.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/lp_resource_toolbar.png"} width="85%" />
            </div>
            <br />
            Just click on the required section and a new resource section will
            be added to your live paper. For purposes of demonstration we have
            chosen the morphology section in the below examples.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_example_new.png"} width="85%" />
            </div>
          </div>
        </div>

        <div className="block">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0.5 }}>
              <div className="block-little-header">Basic Info</div>
              <div className="block-main-header">Adding basic info to resource section</div>
              <div className="block-text">
                Every resource section will require a section title, an icon and
                a description (optional). By default, each resource will have a
                title corresponding to its reource type, but authors can replace
                with more informative/relevant titles corresponding to their
                study. Only the 'Custom' resource section does not offer an
                explicit field for description, as it can easily be accommodated
                within the custom content.
                <br /><br />
                To change the existing icon, simply click on it. A variety of
                icons are available to choose from, with the option to textually
                search through them if required.
              </div>
            </div>
            <div style={{ flex: 0.5 }}>
              <img
                alt=""
                src="/figures/share_common/resource_change_icon.png"
                width="100%"
                style={{ paddingLeft: "40px" }}
              />
            </div>
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Re-order / Delete / Expand Sections</div>
          <div className="block-main-header">Change order of sections or remove a section</div>
          <div className="block-text">
            The order of resource sections inside a live paper can be adjusted
            using the arrow buttons on the resource header - see buttons (2) and
            (3) below. A grayed button indicates that the resource is already
            the top-most or bottom-most.
            <br /><br />
            Resource sections can be deleted, along with all their contents, by
            clicking on the trash button - see button (1) below. Do note that
            once a resource has been deleted, it cannot be recovered!
            <br /><br />
            When your live paper has several resource sections you may wish to
            minimize certain resource sections to aid accessibility to other
            parts. You may click on the double arrow button - see button (4)
            below - or click anywhere else on the resource header, to minimize
            that particular resource section. By clicking it again, the resource
            section will expand.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_title_bar_marked.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Add Row</div>
          <div className="block-main-header">Adding an entry manually</div>
          <div className="block-text">
            Each resource is described using a single row in the table. Authors
            can input as many as rows as required. To add a new row, simply
            click on 'ADD ROW' button.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_row.png"} width="85%" />
            </div>
            <br />
            Authors can then enter the requested info in the cells of the newly
            added row.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_row_enter.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Add From DB</div>
          <div className="block-main-header">Adding an entry from a repository</div>
          <div className="block-text">
            Instead of entering the resources manually, authors have the option
            of importing and linking to corresponding entries in other
            neuroscience repositories such as the EBRAINS Knowledge Graph,
            ModelDB, OSB, BioModels, NeuroMorpho and the Allen Brain Atlas. Each
            resource section is integrated with repositories relevant to that
            resource type. E.g. the morphology resource section, currently,
            allows linking to NeuroMorpho and the Allen Brain Atlas for
            importing neuronal morphologies.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db.png"} width="85%" />
            </div>
            <br />
            Clicking on 'ADD FROM DB' button shows the user the list of
            available repositories. Most repositories allow users to specify the
            resources to be imported via their IDs or shortlist using filters.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db_repos.png"} width="50%" />
            </div>
            <br />
            Once specified, the requested resources are fetched from the
            specified repository. The details are tabulated for the authors to
            verify the entries. Clicking on each row, provides more details for
            the entry. It also provides options for adding that specific entry
            to the live paper resource section. Click on 'ADD' button in the
            expanded row view to select this resource. Simiarly, users can
            select multiple other rows to be entered into the live paper
            section.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db_repos_expand.png"} width="85%" />
            </div>
            <br />
            On selecting a particular resource entry, the counter on the bottom
            of the window will get updated. This helps keep track how many items
            were selected. Once finalized, click on the 'ADD ITEMS' button to
            add the selected entries in the live paper resource section.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db_repos_done.png"} width="85%" />
            </div>
            <br />
            This will update the resource section table with details of the
            selected resource entries. You would notice that entries imported
            from repositories will show a small bubble next to the index number,
            to indicate the same.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db_repos_added.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Expand Table</div>
          <div className="block-main-header">Expand each entry in table</div>
          <div className="block-text">
            As the values for each attribute (cell) of a resource can be quite
            lengthy, it is often difficult to view it in its entirety easily. To
            assist with this, when required, users may click on the 'EXPAND
            TABLE' button to obtain a more detailed view of these attributes.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_expand_table.png"} width="85%" />
            </div>
            <br />
            This will result in an expanded view, with one attribute per line.
            Clicking it again will collapse the table back to the original
            compressed view.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_add_from_db_repos_expand_show.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Re-order / Delete</div>
          <div className="block-main-header">Re-ordering or deleting rows</div>
          <div className="block-text">
            The order in which resource entries appear in the resource section
            can be adjusted using the arrows on the right of each entry. A
            grayed button indicates that the resource is already the top-most or
            bottom-most. Entries can be deleted by clicking on the circled 'X'
            button to their right. Do note that once a resource has been
            deleted, it cannot be recovered!
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_order_delete.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Edit Source</div>
          <div className="block-main-header">Edit table contents manually</div>
          <div className="block-text">
            For advanced users, the live paper builder allows the input/editing
            of resource section contents via accessing their source code. This
            might be particularly useful for users who wish to develop the list
            of resource entries programmatically, and then simply copy-paste the
            contents into the live paper builder.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_edit_source.png"} width="85%" />
            </div>
            <br />
            Click on 'EDIT SOURCE' to access the resource section's source code.
            Clicking on the 'HELP' button will provide some guidelines on how to
            edit the source code. Clicking 'PROCEED' will save the changes.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_edit_panel.png"} width="85%" />
            </div>
            <br />
          </div>
        </div>

        <div className="block">
          <div className="block-little-header">Using Tabs</div>
          <div className="block-main-header">Grouping entries into categories</div>
          <div className="block-text">
            Resource items within a single resource section can be grouped into
            categories, if required. To do so, slide the below button to 'YES'
            for that resource section. By default it is disabled (set to 'NO').
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_use_tabs.png"} width="85%" />
            </div>
            <br />
            On enabling this, you will a new column named 'Tab Name' added to
            the table for that particular resource section:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_use_tabs_column.png"} width="85%" />
            </div>
            <br />
            All items to be grouped together should be assigned the exact same
            tab name. The order of tabs displayed in the live paper will be
            based on the order of their appearance. To alter this order, simply
            re-order the resource entry rows such that the required tab names
            appear in the required order.
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_use_tabs_enter.png"} width="85%" />
            </div>
            <br />
            This will produce an output, in the published live paper, as shown
            below:
            <br /><br />
            <div style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/figures/share_common/resource_use_tabs_enter_demo.png"} width="85%" />
            </div>
            <br />
            <b>Note: </b>Another way to categorize items is by creating multiple
            resource sections of the same type; one for each target group. E.g.
            in the above example, the authors could create three morphology
            resource sections with titles "Morphologies - Group A",
            "Morphologies - Group B" and "Morphologies - Group C". This avoids
            the use of tabs within resource sections.
            <br /><br />
          </div>  
        </div>

      </div>
    );
  }
}
