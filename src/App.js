import { Button, Heading, Pane, TextInput, Paragraph } from "evergreen-ui";
import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function App() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordDetails, setWordDetails] = useState({});

  const searchWord = async () => {
    if (!word?.length) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
      );

      const data = await res?.json();

      console.log(data);

      setWordDetails(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={16}
        margin={40}
      >
        <Heading size={900}>My Dictionary</Heading>

        <Paragraph size={500} textAlign="center">
          What Word Do You Want To Look Up?
        </Paragraph>

        <TextInput
          onChange={(e) => setWord(e.target.value)}
          value={word}
          placeholder="Search for word..."
          width="50%"
        />

        <Button
          appearance="primary"
          onClick={searchWord}
          isLoading={loading}
          disabled={loading}
        >
          Search
        </Button>
      </Pane>

      {wordDetails?.word?.length ? (
        <Pane
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            width: "60%",
            margin: "5vh auto",
            padding: 20,
            background: "#e9e2d0",
          }}
        >
          <Heading size={800} marginBottom={20} textAlign="center">
            {wordDetails?.word
              ? wordDetails.word.charAt(0).toUpperCase() +
                wordDetails.word.slice(1)
              : ""}
          </Heading>

          {wordDetails?.phonetics?.map((phonetic) => (
            <Pane style={{ marginLeft: 20 }}>
              <p>{phonetic?.text}</p>
              <AudioPlayer
                src={phonetic?.audio}
                onPlay={(e) => console.log("onPlay")}
              />
            </Pane>
          ))}

          {wordDetails?.meanings?.map((meaning, idx) => (
            <Pane key={idx} marginTop={15}>
              <h2>
                {meaning?.partOfSpeech
                  ? meaning.partOfSpeech.charAt(0).toUpperCase() +
                    meaning.partOfSpeech.slice(1)
                  : ""}{" "}
              </h2>
              {meaning?.definitions?.map(({ definition, example }, defIdx) => (
                <Pane>
                  <h4>Definition:</h4>
                  <p>{definition}</p>
                  {example?.length > 0 ? (
                    <p style={{ fontStyle: "italic" }}>Example: {example}</p>
                  ) : (
                    ""
                  )}
                </Pane>
              ))}
            </Pane>
          ))}

          <Heading size={800}> Synonyms</Heading>
          <Pane>
            <Paragraph>
              {wordDetails?.meanings[0]?.synonyms?.map((synonym, idx) => (
                <span key={idx}> {synonym}, </span>
              ))}
              {wordDetails?.meanings[0]?.synonyms?.length === 0 ? "N/A" : ""}
            </Paragraph>
          </Pane>
        </Pane>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
