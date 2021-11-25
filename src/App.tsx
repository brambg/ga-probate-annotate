import React, { Component, useState } from "react";

// Annotation package
import { Recogito } from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";

// Theming only
import "semantic-ui-css/semantic.min.css";
import { Container, Header, Segment, Button, Icon } from "semantic-ui-react";

interface DocumentProps {
  annotations: {}[];
  setAnnotations: (annotations: {}[]) => void;
  text: string;
  setText: (text: string) => void;
}

let text0 = `Inventaris ende specificatie van
432
alle den huysraet Imboel porceleijne
Liwaet potgelt gout en silverwerck
by Catharina Cleyburgh naergelaten
voor soo veel desselfs gesamentlycke
Erfgenamen competeren in gevolgen
van d Testamente van deselve Catharina
Cleyburgh
en nooteboome kas
Twaelf ses karsseboome stoelen
ses spaense stoelen
-
Een spiegeltje
Een schildery van bedesda
Een dito van een hondt
Een dito van een appelkopertje
Een Landschap schildery
f
2
Een printebortje van d' langenins
Een printebortje synde een vogelaertje
Twee sackwerckse doofpotjens
Drie delfs werckse schootels
en schuymspaen
Een koopere visketel,
Een koopere Vijsel en stampert
Een metale podtsen koper decksel
Een groote tinne schotel
drie dito kleynder
ses Tinne taeffelborden
acht
Een Tinne Water pot
Een coopere Taartpan
Twee Een dito Blaeckers
-
noch eenigh kenckengoet
Twee groote porceleyne kommen
drie porceleyne drjlingen
„
seven
drie
Twee dubbelde porceleyne boterschotels
Twee dito boterschaeltjens
acht porceleyne boterschotels,
Twee groote papegays Coppen en vyfdito cleynder
Vier
Twee halve porceleyne lampet schootels
Een pleugkom
vier mostertschaeltjens
Twee kommetjens en twee Clapmutsjens
noch negen kopjens en tweebrandewyns
pimpeltjens
Tien doornickse Trype stoel cussens
Een groen Taeffelkleeden
Twee
ƒ
alle welcke voorsz. effecten en Contanten tsamen
ter somme van ses duijsent seven hondert acht
gls. negentien stver acht penningen door de voors.
Sr. Liscalhet sullen werden overgelevert ende
behaedight ten behoeve van de voorn. Erfgenamen
van Catharina Cleijburgh onderde aen de voorsz.
Sr David van der meer Somme door deselven
geadministrerde vruchten ende Interessen daervan ontf. ende aen
hem liscaljet uytgereijckt te werdn sijn
leven langh gedurende ingevolge van de Testa
mente van deselve Catharina Cleyburgh
bekennende oock mede hy Compt. Daniel liscaljet
van sijn duarie by huwelycxse voorwaerde
hem competerende ende van sijn gelogateerde
buyten de voorsz. vruchten ende Interessen voldaen ende
betaelt te sijn mitsgaders de gemelte Erfge
e
namen daervan oock bij desen te quiteren
met welcke voorsz. scheydinge ende delinge resp
de voorn. Compten verclaren seer wel te
vreede te syn ende te vergenoegen Belovende
de ee de anderen dh effecte van desen te
sullen doen ende laten genieten sonder daertegens
te doen ofte gedoogen gedaen te werden in
rechte noch daer buijten in geenderley
manieren, verbindende tot naercominge
deses haere persoonen ende goederen deselve
stellende ten bedwangh van allen rechten ende
rechteren Alles oprecht gedaen t Amst. ter
presentie van Jacob van der groe ende gere. Mnnick
als getuijgen hier toe versocht
Daniel E is kalijet
Harmen Dirckse Modeiller
huybert lieileers
wdijle blijbingh
GvGroe
DMannek
Quod attestor rogatus
d van der groe Nots. P.`;

const basenames = require("./ga-selection-basenames.json");

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

  VOCABULARY = [
    { label: "material", uri: "http://vocab.getty.edu/aat/300010358" },
    { label: "object",   uri: "http://vocab.getty.edu/aat/300311889" },
    { label: "person",   uri: "http://vocab.getty.edu/aat/300024979" },
    { label: "place",    uri: "http://vocab.getty.edu/aat/300008347" },
  ];

  // Initialize the Recogito instance after the component is mounted in the page
  componentDidUpdate = () => {
    const r = new Recogito({
      content: this.htmlId,
      locale: "auto",
      mode: "pre",
      widgets: [
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

        console.log(tags);

        // See CSS for the actual styling
        const tagClasses: string[] = [];

        for (const tag of tags) {
          if (tag === "material") {
            tagClasses.push("tag-material");

          } else if (tag === "object") {
            tagClasses.push("tag-object");

          } else if (tag === "person") {
            tagClasses.push("tag-person");

          } else if (tag === "place") {
            tagClasses.push("tag-place");
          }
        }

        return tagClasses.join(" ");
      },
    });

    const storeAnnotation = () => {
      this.props.setAnnotations(r.getAnnotations());
    };

    // Make sure that the annotations are stored in the state
    r.on("createAnnotation", storeAnnotation);
    r.on("deleteAnnotation", storeAnnotation);
    r.on("updateAnnotation", storeAnnotation);

    this.props.annotations.map((annotation: {}) => r.addAnnotation(annotation));

    // For debugging, this can be helpful
    // console.log(r);
  }

  render() {
    return (
      <div id={this.htmlId}>
        <div className="code">{this.props.text}</div>
      </div>
    );
  }
}

  // Get the annotations from a static file in this case
const getAnnotations = async () => {
    const res = await fetch("annotations.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    console.log(data)
    return data;
  };
var annotations0;
getAnnotations().then((a)=>annotations0=a);

const App = () => {
  const [annotations, setAnnotations] = useState<{}[]>(annotations0);
  const [text, setText] = useState(text0);
  const [selection, setselection] = useState(basenames[0]);

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
    console.log(annotations);
    return annotations;
  }

  const handleSelectionChange = (newSelection) => {
    setselection(newSelection);
    fetchText(newSelection).then(t => setText(t));
    fetchAnnotations(newSelection).then(a => setAnnotations(a));
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
              JSON.stringify(annotations, null, 2)
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
        <span className="tag-person">person</span>  &nbsp;
        <span className="tag-place">place</span>  &nbsp;
        <span className="tag-object">object</span>  &nbsp;
        <span className="tag-material">material</span>  &nbsp;
        </div>

        <Segment>
          <Document annotations={annotations} setAnnotations={setAnnotations} text={text} setText={setText}/>
        </Segment>
      </Container>
    </div>
  );
};

export default App;
