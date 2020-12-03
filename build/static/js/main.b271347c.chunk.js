(this["webpackJsonplive-paper-builder"]=this["webpackJsonplive-paper-builder"]||[]).push([[0],{102:function(e,t,a){},114:function(e,t,a){"use strict";a.r(t);var n=a(2),i=a(0),s=a.n(i),l=a(11),r=a.n(l),c=(a(102),a(19)),o=a(14),d=a(12),h=a(22),j=a(43),b=a(160),p=a(7),u=a(61),x=a.n(u),O=a(75),v=a(57),g=a(3),m=a(169),f=a(165),y=a(167),C=a(56),w=a(5),P=a(163),k=a(49),S=a(164),L=a(78),A=a.n(L),N=a(166),F=a(18),I=a(168),_=a(76),D=function(e){Object(h.a)(a,e);var t=Object(j.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={items:n.props.value},n}return Object(o.a)(a,[{key:"handleAdd",value:function(){var e=this.state.items;e.push({firstname:"",lastname:"",affiliation:""}),this.setState({items:e}),this.props.onChangeValue(e)}},{key:"handleItemChanged",value:function(e,t){var a=this.state.items;a[e][t.target.name]=t.target.value,this.setState({items:a}),this.props.onChangeValue(a)}},{key:"handleItemDeleted",value:function(e){var t=this.state.items;t.splice(e,1),this.setState({items:t}),this.props.onChangeValue(t)}},{key:"renderRows",value:function(){var e=this;return this.state.items.map((function(t,a){return Object(n.jsxs)("tr",{children:[Object(n.jsx)("td",{style:{width:"25%",padding:"5px 20px"},children:Object(n.jsx)("input",{name:"firstname",type:"text",value:t.firstname,onChange:e.handleItemChanged.bind(e,a)})}),Object(n.jsx)("td",{style:{width:"25%",padding:"5px 20px"},children:Object(n.jsx)("input",{name:"lastname",type:"text",value:t.lastname,onChange:e.handleItemChanged.bind(e,a)})}),Object(n.jsx)("td",{style:{padding:"5px 20px"},children:Object(n.jsx)("input",{name:"affiliation",type:"text",value:t.affiliation,onChange:e.handleItemChanged.bind(e,a)})}),Object(n.jsx)("td",{style:{padding:"5px 20px"},children:Object(n.jsx)(b.a,{variant:"contained",color:"secondary",onClick:e.handleItemDeleted.bind(e,a),children:"Delete"})})]},"item-"+a)}))}},{key:"render",value:function(){return Object(n.jsxs)("div",{children:[Object(n.jsxs)("table",{children:[Object(n.jsx)("thead",{children:Object(n.jsxs)("tr",{children:[Object(n.jsx)("th",{style:{padding:"5px 20px"},children:"First Name"}),Object(n.jsx)("th",{style:{padding:"5px 20px"},children:"Last Name"}),Object(n.jsx)("th",{style:{padding:"5px 20px"},children:"Affiliation"}),Object(n.jsx)("th",{style:{padding:"5px 20px"}})]})}),Object(n.jsx)("tbody",{children:this.renderRows()})]}),Object(n.jsx)(b.a,{variant:"contained",color:"primary",onClick:this.handleAdd.bind(this),children:"Add Author"}),Object(n.jsx)("hr",{})]})}}]),a}(s.a.Component),R=a(159),T=a(118),B=a(125),W=a(172),E=a(120),Y=a(117),U=a(162),G=a(122),M=Object(R.a)((function(e){return{formControl:{minWidth:700,maxWidth:900},noLabel:{marginTop:e.spacing(3)}}})),V={PaperProps:{style:{maxHeight:224,width:250}}};function q(e){var t=M(),a="select-"+e.label.replace(" ","-"),i=a+"-label",s=e.label.replace(" ","_");return Object(n.jsx)("div",{children:Object(n.jsxs)(Y.a,{className:t.formControl,children:[Object(n.jsx)(B.a,{id:i,children:e.label}),Object(n.jsx)(G.a,{labelId:i,id:a,value:e.value?e.value:"",name:s,onChange:e.handleChange,input:Object(n.jsx)(T.a,{}),MenuProps:V,children:e.itemNames.map((function(e){return Object(n.jsx)(W.a,{value:e,children:Object(n.jsx)(U.a,{primary:e})},e)}))}),Object(n.jsx)(E.a,{children:e.helperText})]})})}var z=a(62),H=a.n(z),J=a.p+"static/media/LivePaper.5b661eb0.template",K={backgroundColor:"#ffd180",fontSize:"20px",color:"black",borderTop:"1px solid #000000",textAlign:"center",position:"fixed",left:"50%",transform:"translateX(-50%)",bottom:"0",height:"70px",width:"70%",zIndex:"1"},X={display:"block",padding:"20px",height:"60px",width:"70%"};function Z(e){var t=e.children;return Object(n.jsxs)("div",{style:{zIndex:"2147483638"},children:[Object(n.jsx)("div",{style:X}),Object(n.jsx)("div",{style:K,children:t})]})}function Q(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"default";e(t,{variant:a,anchorOrigin:{vertical:"bottom",horizontal:"right"}})}function $(){var e=new Date,t=e.getFullYear(),a=e.getMonth()+1,n=e.getDate(),i=e.getHours(),s=e.getMinutes(),l=e.getSeconds();return t.toString()+a.toString()+n.toString()+"_"+i.toString()+s.toString()+l.toString()}var ee=Object(w.a)((function(e){return{root:{margin:0,padding:e.spacing(2)},closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}}}))((function(e){var t=e.children,a=e.classes,i=e.onClose,s=Object(g.a)(e,["children","classes","onClose"]);return Object(n.jsxs)(P.a,Object(v.a)(Object(v.a)({disableTypography:!0,className:a.root},s),{},{children:[Object(n.jsx)(k.a,{variant:"h6",children:t}),i?Object(n.jsx)(S.a,{"aria-label":"close",className:a.closeButton,onClick:i,children:Object(n.jsx)(A.a,{})}):null]}))})),te=["None","Apache License 2.0",'BSD 2-Clause "Simplified" License','BSD 3-Clause "New" or "Revised" License',"Creative Commons Attribution 4.0 International","Creative Commons Attribution Non Commercial 4.0 International","Creative Commons Attribution Share Alike 4.0 International","Creative Commons Zero v1.0 Universal","GNU General Public License v2.0 or later","GNU General Public License v3.0 or later","GNU Lesser General Public License v3.0 or later","MIT License"],ae=function(e){Object(h.a)(a,e);var t=Object(j.a)(a);function a(e){var n;return Object(c.a)(this,a),""===(n=t.call(this,e)).props.data?n.state={page_title:"",authors_string:"",affiliations_string:"",authors:[{firstname:"",lastname:"",affiliation:""}],corresponding_author:{firstname:"",lastname:"",email:""},year:new Date,paper_title:"",journal:"",url:"",citation:"",doi:"",license:"None",abstract:""}:n.state=Object(v.a)({},e.data),n.handleClose=n.handleClose.bind(Object(d.a)(n)),n.handleDownloadLivePaper=n.handleDownloadLivePaper.bind(Object(d.a)(n)),n.handlePreviewLivePaper=n.handlePreviewLivePaper.bind(Object(d.a)(n)),n.handleSaveProject=n.handleSaveProject.bind(Object(d.a)(n)),n.handleFieldChange=n.handleFieldChange.bind(Object(d.a)(n)),n.handleYearChange=n.handleYearChange.bind(Object(d.a)(n)),n.handleAuthorsChange=n.handleAuthorsChange.bind(Object(d.a)(n)),n.makePageTitleString=n.makePageTitleString.bind(Object(d.a)(n)),n.makeAuthorsString=n.makeAuthorsString.bind(Object(d.a)(n)),n.makeAffiliationsString=n.makeAffiliationsString.bind(Object(d.a)(n)),n}return Object(o.a)(a,[{key:"handleClose",value:function(){this.props.onClose()}},{key:"handleDownloadLivePaper",value:function(){var e;this.makeAuthorsString(),this.makeAffiliationsString(),e=this.state,fetch(J).then((function(e){return e.text()})).then((function(t){var a=H.a.renderString(t,e),n=document.createElement("a"),i=new Blob([a],{type:"text/html"});n.href=URL.createObjectURL(i),n.download="livepaper_"+$()+".html",document.body.appendChild(n),n.click()})),Q(this.props.enqueueSnackbar,"Live Paper downloaded...","success")}},{key:"handlePreviewLivePaper",value:function(){var e=Object(O.a)(x.a.mark((function e(){var t,a,n,i,s,l=this;return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=function(e){fetch(J).then((function(e){return e.text()})).then((function(t){var a=H.a.renderString(t,e),n=window.open("");n.document.write(a),n.document.close()}))},t=new Promise((function(e,t){l.makeAuthorsString(),e()})),a=new Promise((function(e,t){l.makeAffiliationsString(),e()})),n=new Promise((function(e,t){l.makePageTitleString(),e()})),e.next=6,Promise.all([t,a,n]);case 6:s=this.state,i(s),Q(this.props.enqueueSnackbar,"Preview generated...","info");case 9:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"handleSaveProject",value:function(){var e=JSON.stringify(this.state,null,4),t=new Blob([e],{type:"text/plain"}),a=URL.createObjectURL(t),n=document.createElement("a");n.download="livepaper_"+$()+".lpp",n.href=a,n.click(),Q(this.props.enqueueSnackbar,"Project downloaded...","success")}},{key:"handleFieldChange",value:function(e){console.log(e);var t=e.target,a=t.value,n=t.name;console.log(n+" => "+a),this.setState(Object(p.a)({},n,a))}},{key:"handleYearChange",value:function(e){this.setState({year:e._d})}},{key:"handleAuthorsChange",value:function(e){var t=e.filter((function(e){return""!==e.firstname.trim()||""!==e.lastname.trim()}));0===t.length&&(t=[{firstname:"",lastname:"",affiliation:""}]),this.setState({authors:t}),this.makePageTitleString(),this.makeAuthorsString(),this.makeAffiliationsString()}},{key:"makePageTitleString",value:function(){var e=this;return new Promise((function(t){var a=e.state.authors,n="";n=0===a.length?"":1===a.length?a[0].lastname+" "+e.state.year.getFullYear():2===a.length?a[0].lastname+" & "+a[1].lastname+" "+e.state.year:a[0].lastname+" et al. "+e.state.year.getFullYear(),e.setState({page_title:n})}))}},{key:"makeAuthorsString",value:function(){var e=this;return new Promise((function(t){var a="";e.state.authors.forEach((function(e,t){t>0&&(a+=", "),a=a+e.firstname+" "+e.lastname+" "+(t+1).toString().sup()})),e.setState({authors_string:a})}))}},{key:"makeAffiliationsString",value:function(){var e=this;return new Promise((function(t){var a=[];e.state.authors.forEach((function(e){e.affiliation.split(";").map((function(e){return e.trim()})).forEach((function(e){a.includes(e)||a.push(e)}))})),a.forEach((function(e,t){this[t]=(t+1).toString().sup()+" "+e}),a);var n=a.join(", ");e.setState({affiliations_string:n})}))}},{key:"render",value:function(){return Object(n.jsxs)(m.a,{fullScreen:!0,onClose:this.handleClose,"aria-labelledby":"simple-dialog-title",open:this.props.open,children:[Object(n.jsx)(ee,{onClose:this.handleClose}),Object(n.jsxs)(f.a,{children:[Object(n.jsxs)("div",{className:"container",style:{textAlign:"left"},children:[Object(n.jsxs)("div",{className:"box rounded centered",children:[Object(n.jsx)("a",{href:"../../index.html",className:"waves-effect waves-light",style:{textAlign:"center",color:"black"},children:Object(n.jsx)("table",{children:Object(n.jsx)("tbody",{children:Object(n.jsxs)("tr",{children:[Object(n.jsx)("td",{children:Object(n.jsx)("img",{className:"hbp-icon-small",src:"./imgs/hbp_diamond_120.png",alt:"HBP logo"})}),Object(n.jsx)("td",{children:Object(n.jsx)("span",{className:"title-style subtitle",style:{paddingLeft:"5px"},children:"EBRAINS Live Papers"})})]})})})}),Object(n.jsx)("h5",{className:"title-style",children:"Live Paper Builder"})]}),Object(n.jsxs)("div",{style:{paddingLeft:"5%",paddingRight:"5%",textAlign:"justify"},children:[Object(n.jsxs)("div",{children:["Follow the steps listed below to create the live paper. You can generate the live paper and/or save the project at any time by clicking on the buttons on the bottom of the page. It also provides you an option to preview any changes before proceeding.",Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),"When saving the project, a file with extension '.lpp' will be downloaded. You can upload this file later to update the live paper contents. Please do not manually edit these files, as it could render them unreadable by this tool."]}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Enter the complete title of your manuscript / paper:"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{label:"Title",variant:"outlined",fullWidth:!0,name:"paper_title",value:this.state.paper_title,onChange:this.handleFieldChange,InputProps:{style:{padding:"5px 15px"}}})}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Enter the year of publication (if unpublished, leave unchanged):"})})}),Object(n.jsx)("div",{children:Object(n.jsx)("div",{children:Object(n.jsx)(F.a,{utils:_.a,children:Object(n.jsx)(I.a,{label:"Year",inputVariant:"outlined",views:["year"],name:"year",value:this.state.year,minDate:new Date("2010","01","01","00","00","00","0"),maxDate:new Date,onChange:this.handleYearChange,animateYearScrolling:!0,InputProps:{style:{borderBottom:"0px",padding:"5px 15px 5px 15px",width:"100px"}}})})})}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Enter details of all authors in the required order:"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(D,{value:this.state.authors,onChangeValue:this.handleAuthorsChange})}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Specify the corresponding author, along with their email address:"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(q,{itemNames:this.state.authors?this.state.authors.map((function(e){return e.firstname+" "+e.lastname})):[],label:"Corresponding Author",name:"corresponding_author",value:this.state.corresponding_author.firstname+" "+this.state.corresponding_author.lastname,handleChange:this.handleFieldChange})}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{label:"Corresponding Author Email",variant:"outlined",fullWidth:!0,name:"corresponding_author_email",value:this.state.corresponding_author.email,onChange:this.handleFieldChange,InputProps:{style:{padding:"5px 15px"}},style:{width:700}})}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Specify the journal in which paper is published (leave empty if awaiting publication):"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{label:"Journal",variant:"outlined",fullWidth:!0,name:"journal",value:this.state.journal,onChange:this.handleFieldChange,InputProps:{style:{padding:"5px 15px"}}})}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Provide the URL to access article (leave empty if awaiting publication or link to bioRxiv, if relevant):"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{label:"Article URL",variant:"outlined",fullWidth:!0,name:"url",value:this.state.url,onChange:this.handleFieldChange,InputProps:{style:{padding:"5px 15px"}}})}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Specify the citation text to be used for article (leave empty if awaiting publication):"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{multiline:!0,rows:"3",label:"Citation",variant:"outlined",fullWidth:!0,name:"citation",value:this.state.citation,onChange:this.handleFieldChange,InputProps:{style:{padding:"15px 15px"}}})}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Indicate the DOI entry for article (leave empty if awaiting publication):"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(N.a,{label:"DOI",variant:"outlined",fullWidth:!0,name:"doi",value:this.state.doi,onChange:this.handleFieldChange,InputProps:{style:{padding:"5px 15px"}}})}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Provide the abstract of your manuscript / paper:"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(y.a,{item:!0,xs:12,children:Object(n.jsx)(N.a,{multiline:!0,rows:"8",label:"Abstract",variant:"outlined",fullWidth:!0,helperText:"The description may be formatted with Markdown",name:"abstract",value:this.state.abstract,onChange:this.handleFieldChange,InputProps:{style:{padding:"15px 15px"}}})})}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:Object(n.jsx)("p",{children:Object(n.jsx)("strong",{children:"Specify the license to be applied for the contents displayed in this live paper:"})})}),Object(n.jsx)("div",{children:Object(n.jsx)(q,{itemNames:te,label:"License",name:"license",value:this.state.license,handleChange:this.handleFieldChange,helperText:"For guidance on choosing a licence, see https://choosealicense.com"})}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("h5",{children:"Resources"}),Object(n.jsx)("p",{children:"Add a line of description:"}),Object(n.jsxs)("ul",{className:"collapsible","data-collapsible":"expandable",children:[Object(n.jsxs)("li",{className:"active",children:[Object(n.jsxs)("div",{className:"collapsible-header amber lighten-5",children:[Object(n.jsx)("i",{className:"material-icons",children:"settings_input_antenna"}),"Add heading"]}),Object(n.jsx)("div",{className:"collapsible-body ",children:"Add content here"})]}),Object(n.jsxs)("li",{children:[Object(n.jsxs)("div",{className:"collapsible-header amber lighten-5",children:[Object(n.jsx)("i",{className:"material-icons",children:"timeline"}),"Add heading"]}),Object(n.jsx)("div",{className:"collapsible-body",children:"Add content here"})]}),Object(n.jsxs)("li",{children:[Object(n.jsxs)("div",{className:"collapsible-header amber lighten-5",children:[Object(n.jsx)("i",{className:"material-icons",children:"note_add"}),"Add heading"]}),Object(n.jsx)("div",{className:"collapsible-body",children:"Add content here"})]}),Object(n.jsxs)("li",{children:[Object(n.jsxs)("div",{className:"collapsible-header amber lighten-5",children:[Object(n.jsx)("i",{className:"material-icons",children:"local_play"}),"Add heading"]}),Object(n.jsx)("div",{className:"collapsible-body",children:"Add content here"})]})]}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{})]})]}),Object(n.jsxs)(Z,{children:[Object(n.jsxs)("div",{className:"rainbow-row",children:[Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{})]}),Object(n.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"center"},children:[Object(n.jsx)(b.a,{variant:"contained",color:"primary",style:{width:"25%",backgroundColor:"#FF9800",color:"#000000",fontWeight:"bold"},onClick:this.handlePreviewLivePaper,children:"Preview Live Paper"}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)(b.a,{variant:"contained",color:"primary",style:{width:"25%",backgroundColor:"#009688",color:"#000000",fontWeight:"bold"},onClick:this.handleDownloadLivePaper,children:"Download Live Paper"}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)(b.a,{variant:"contained",color:"secondary",style:{width:"25%",backgroundColor:"#01579b",fontWeight:"bold"},onClick:this.handleSaveProject,children:"Save & Download Project"})]})]})]})]})}}]),a}(s.a.Component),ne=Object(C.b)(ae),ie=function(e){Object(h.a)(a,e);var t=Object(j.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={createLivePaperOpen:!1,projectData:{}},n.inputFileRef=s.a.createRef(),n.handleCreateLivePaperOpen=n.handleCreateLivePaperOpen.bind(Object(d.a)(n)),n.handleCreateLivePaperClose=n.handleCreateLivePaperClose.bind(Object(d.a)(n)),n.handleLoadProject=n.handleLoadProject.bind(Object(d.a)(n)),n.onFileSelect=n.onFileSelect.bind(Object(d.a)(n)),n}return Object(o.a)(a,[{key:"handleCreateLivePaperOpen",value:function(){this.setState({projectData:"",createLivePaperOpen:!0})}},{key:"handleCreateLivePaperClose",value:function(){this.setState({createLivePaperOpen:!1})}},{key:"handleLoadProject",value:function(){this.inputFileRef.current.click()}},{key:"onFileSelect",value:function(e){if(1===e.target.files.length){var t="",a=this,n=new FileReader;n.onload=function(e){t=JSON.parse(n.result),a.setState({projectData:t,createLivePaperOpen:!0})},n.readAsText(e.target.files[0])}else this.setState({projectData:{}})}},{key:"render",value:function(){var e="";return this.state.createLivePaperOpen&&(e=Object(n.jsx)(ne,{open:this.state.createLivePaperOpen,onClose:this.handleCreateLivePaperClose,data:this.state.projectData})),Object(n.jsxs)("div",{className:"container",style:{textAlign:"left"},children:[Object(n.jsx)("br",{}),Object(n.jsxs)("div",{className:"box rounded centered",children:[Object(n.jsx)("a",{href:"../../index.html",className:"waves-effect waves-light",style:{textAlign:"center",color:"black"},children:Object(n.jsx)("table",{children:Object(n.jsx)("tbody",{children:Object(n.jsxs)("tr",{children:[Object(n.jsx)("td",{children:Object(n.jsx)("img",{className:"hbp-icon-small",src:"./imgs/hbp_diamond_120.png",alt:"HBP logo"})}),Object(n.jsx)("td",{children:Object(n.jsx)("span",{className:"title-style subtitle",style:{paddingLeft:"5px"},children:"EBRAINS Live Papers"})})]})})})}),Object(n.jsx)("h5",{className:"title-style",children:"Live Paper Builder"})]}),Object(n.jsxs)("div",{style:{paddingLeft:"5%",paddingRight:"5%",textAlign:"justify"},children:[Object(n.jsx)("strong",{children:"Welcome to the EBRAINS live paper builder!"}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),"Here you can start building a new live paper linked to your manuscript or published article. The live paper builder allows you to build the live paper without any web development skills. Various functionalities for building a simple to moderately complex live paper is made available via this tool. For more advanced features and customizations, the users can edit the live Papers generated by this tool.",Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),'Live papers are often not produced in one go, and might require revisions over time. Keeping this in mind, we allow users to download "live paper projects" at any point of development. These projects can be uploaded later, to continue from where you had left off. Please note, that these project files should not be manually edited as it could render them unreadable by the tool.']}),Object(n.jsx)("br",{}),Object(n.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"center"},children:[Object(n.jsx)(b.a,{variant:"contained",color:"primary",style:{width:"40%",backgroundColor:"#FF9800",color:"#000000",fontWeight:"bold"},onClick:this.handleCreateLivePaperOpen,children:"Create New Live Paper"}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)(b.a,{variant:"contained",color:"secondary",style:{width:"40%",backgroundColor:"#01579b",fontWeight:"bold"},onClick:this.handleLoadProject,children:"Load Existing Project"})]}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsxs)("div",{className:"rainbow-row",children:[Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{})]}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("div",{children:e}),Object(n.jsx)("div",{children:Object(n.jsx)("input",{id:"fileInput",type:"file",ref:this.inputFileRef,style:{display:"none"},accept:".lpp",onChange:this.onFileSelect})})]})}}]),a}(s.a.Component),se=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,173)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,s=t.getLCP,l=t.getTTFB;a(e),n(e),i(e),s(e),l(e)}))};r.a.render(Object(n.jsx)(s.a.StrictMode,{children:Object(n.jsx)(C.a,{maxSnack:3,children:Object(n.jsx)(ie,{})})}),document.getElementById("root")),se()}},[[114,1,2]]]);
//# sourceMappingURL=main.b271347c.chunk.js.map