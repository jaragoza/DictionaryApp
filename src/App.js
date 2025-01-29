import { useState } from "react";
import { Pane, TextInput, Button, Heading, Paragraph } from "evergreen-ui";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function App() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordDetails, setWordDetails] = useState(null);
  const [error, setError] = useState("");

  const searchWord = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError(""); // Reset error before searching

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!res.ok) {
        throw new Error("Word not found");
      }

      const data = await res.json();
      setWordDetails(data[0]);
    } catch (e) {
      console.error(e);
      setWordDetails(null);
      setError("Word not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    setWord("");
    setWordDetails(null);
    setError("");
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

      {error && (
        <Pane textAlign="center" color="red" marginBottom={20}>
          <Heading size={600} color="red">
            {error}
          </Heading>
        </Pane>
      )}

      {wordDetails && (
        <Pane
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            width: "60%",
            margin: "5vh auto",
            padding: 20,
            background: "#e9e2d0",
            textAlign: "center",
          }}
        >
          <Heading size={800} marginBottom={20}>
            {wordDetails.word.charAt(0).toUpperCase() +
              wordDetails.word.slice(1)}
          </Heading>

          {wordDetails.phonetics?.map((phonetic, idx) => (
            <Pane key={idx} marginBottom={10}>
              <Paragraph>{phonetic?.text}</Paragraph>
              {phonetic?.audio && (
                <AudioPlayer
                  src={phonetic.audio}
                  onPlay={() => console.log("Playing audio")}
                  style={{ maxWidth: "100%", margin: "auto" }}
                />
              )}
            </Pane>
          ))}

          {wordDetails.meanings?.map((meaning, idx) => (
            <Pane key={idx} marginTop={15}>
              <Heading size={700}>
                {meaning.partOfSpeech.charAt(0).toUpperCase() +
                  meaning.partOfSpeech.slice(1)}
              </Heading>

              {meaning.definitions?.map(({ definition, example }, defIdx) => (
                <Pane key={defIdx} marginTop={10}>
                  <Heading size={600}>Definition:</Heading>
                  <Paragraph>{definition}</Paragraph>
                  {example && (
                    <Paragraph fontStyle="italic">Example: {example}</Paragraph>
                  )}
                </Pane>
              ))}
            </Pane>
          ))}

          <Heading size={700} marginTop={20}>
            Synonyms
          </Heading>
          <Paragraph>
            {wordDetails.meanings[0]?.synonyms?.length
              ? wordDetails.meanings[0].synonyms.join(", ")
              : "N/A"}
          </Paragraph>

          <Button appearance="primary" marginTop={20} onClick={handleReturn}>
            Return
          </Button>
        </Pane>
      )}
    </div>
  );
}

export default App;
