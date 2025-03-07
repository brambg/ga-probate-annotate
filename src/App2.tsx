import React, { Component, useState } from "react";

// Annotation package - IMPORTANT: import from src!
import { Recogito } from "@recogito/recogito-js/src";
import GeotaggingWidget from "@recogito/geotagging-widget/src";

import "@recogito/recogito-js/dist/recogito.min.css";

// Theming only
import "semantic-ui-css/semantic.min.css";
import { Container, Header, Segment, Button, Icon } from "semantic-ui-react";

// interface Doc {
//   text: string;
//   annotations: {}[];
// };

interface DocumentProps {
  doc: any;
  setDoc: (doc: any) => void;
  // annotations: {}[];
  // setAnnotations: (annotations: {}[]) => void;
  // text: string;
  // setText: (text: string) => void;
}

const basenames:string[] = require("./ga-selection-basenames.json");
const annotations0:{}[] = require("./annotations.json");
const text0:string = '';
const doc0={text:text0,annotations:annotations0};

class TextSelector extends Component<{selection:string, onChange}> {

  render = () => {
    const options = basenames.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
    return (
      <span>
      Text: &nbsp;
      <select onChange = { (e) => this.props.onChange(e.target.value) }>
        {options}
      </select>
      </span>
    )
  }
}

// Make own component 'Document' for the annotatable source
class Document extends Component<DocumentProps> {
  htmlId = "text-content";
  r; // the Recogito instance

  VOCABULARY = [
    { label: "firstname", uri: "http://vocab.getty.edu/aat/300008347?" },
    { label: "familyname", uri: "http://vocab.getty.edu/aat/300008347?" },
    { label: "person",   uri: "http://vocab.getty.edu/aat/300024979" },
    { label: "occupation", uri: "http://vocab.getty.edu/aat/300008347?" },
    { label: "material", uri: "http://vocab.getty.edu/aat/300010358" },
    { label: "object",   uri: "http://vocab.getty.edu/aat/300311889" },
    { label: "streetname", uri: "http://vocab.getty.edu/aat/300008347?" },
    { label: "location", uri: "http://vocab.getty.edu/aat/300008347" },
  ];

  shouldComponentUpdate = (newProps,_) => {
    return newProps.doc !== this.props.doc;
  }

  componentDidUpdate = () => {
    // console.log('componentDidUpdate');
    // this.r.destroy();
    this.componentDidMount();
  }

  // Initialize the Recogito instance after the component is mounted in the page
<<<<<<< HEAD
  componentDidMount = () => {
    // console.debug("componentDidMount");
    this.r = new Recogito({
=======
  componentDidMount() {
    const storeAnnotation = () => {
      this.props.setAnnotations(r.getAnnotations());
    };

    // Geotagging widget config
    const config = {
      // TODO...
    }

    const r = new Recogito({
>>>>>>> upstream/master
      content: this.htmlId,
      locale: "auto",
      mode: "pre",
      widgets: [
        { widget: GeotaggingWidget(config) },
        { widget: "COMMENT" },
        {
          widget: "TAG",
          vocabulary: this.VOCABULARY,
        },
      ],
      relationVocabulary: ["isRelated", "isPartOf", "isSameAs "],
      formatter: (annotation: any) => {
        // Get all tags in the bodies of the annotation
        const tags = annotation.bodies.flatMap((body: any) =>
          body.purpose === "tagging" ? body.value : []
        );

        // See CSS for the actual styling
        const tagClasses: string[] = [];

        for (const tag of tags) {
          if (tag === "material") {
            tagClasses.push("tag-material");

          } else if (tag === "object") {
            tagClasses.push("tag-object");

          } else if (tag === "person") {
            tagClasses.push("tag-person");

          } else if (tag === "firstname") {
            tagClasses.push("tag-firstname");

          } else if (tag === "familyname") {
            tagClasses.push("tag-familyname");

          } else if (tag === "location") {
            tagClasses.push("tag-place");

          } else if (tag === "streetname") {
            tagClasses.push("tag-streetname");

          } else if (tag === "occupation") {
            tagClasses.push("tag-occupation");
          }
        }

        return tagClasses.join(" ");
      },
    });

    const storeAnnotation = () => {
      let currentDoc = this.props.doc;
      currentDoc.annotations = this.r.getAnnotations();
      this.props.setDoc(currentDoc);
    };

    // Make sure that the annotations are stored in the state
    this.r.on("createAnnotation", storeAnnotation);
    this.r.on("deleteAnnotation", storeAnnotation);
    this.r.on("updateAnnotation", storeAnnotation);

    console.info(this.props);
    this.props.doc.annotations.map((annotation: {}) => this.r.addAnnotation(annotation));

    // For debugging, this can be helpful
    // console.log(r);
  }

  componentWillUnmount = () => {
    console.log('unmounting...');
    this.r.destroy();
  }

  render() {
    return (
      <div id={this.htmlId}>
        <div className="code">{this.props.doc.text}</div>
      </div>
    );
  }
}

const App = () => {
  const [doc, setDoc] = useState(doc0);
  const [selection, setSelection] = useState(basenames[0]);

  const fetchText = async (selected:string) => {
    const res = await fetch(selected+".txt", {
      headers: {
        "Content-Type": "text/plain",
        Accept: "text/plain",
      },
    });
    const text = await res.text();
    return text;
  }

  const fetchAnnotations = async (selected:string) => {
    const res = await fetch(selected+".json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const annotations = await res.json();
    return annotations;
  }

  const putAnnotations = (basename:string, annotations:{}[]) => {
    console.debug("TODO: PUT http://backend.com/documents/"+basename+"/annotations");
    console.info(annotations);
  }

  const handleSelectionChange = async (newSelection) => {
    putAnnotations(selection,doc.annotations);
    setSelection(newSelection);
    var newText;
    var newAnnotations;
    await fetchText(newSelection).then(t => newText = t);
    await fetchAnnotations(newSelection).then(a => newAnnotations = a);
    const newDoc = {text:newText,annotations:newAnnotations};

    setDoc(newDoc);
  }

  return (
    <div className="App">
      <Container>
        <Header as="h1">Golden Agents: Annotation Evaluation</Header>

        <div>
          <TextSelector selection={selection} onChange={handleSelectionChange}/>
        &nbsp;

        <Button primary icon className="downloadbutton">
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(doc.annotations, null, 2)
            )}`}
            download="annotations.json"
          >
            {`Download Json`}
          </a>{" "}
          <Icon name="download" />
        </Button>
        </div>

        <div>
        Tag Legend: &nbsp;
        <span className="tag-firstname">firstname</span>  &nbsp;
        <span className="tag-familyname">familyname</span>  &nbsp;
        <span className="tag-person">person</span>  &nbsp;
        <span className="tag-occupation">occupation</span>  &nbsp;
        <span className="tag-streetname">streetname</span>  &nbsp;
        <span className="tag-place">location</span>  &nbsp;
        <span className="tag-object">object</span>  &nbsp;
        <span className="tag-material">material</span>  &nbsp;
        </div>

        <Segment>
          <Document doc={doc} setDoc={setDoc} />
        </Segment>
      </Container>
    </div>
  );
};

export default App;
