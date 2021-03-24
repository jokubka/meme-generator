import axios from "axios";
import { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

interface MemeData {
    image: string;
    text: string;
}

const App: React.FC = () => {
    const [data, setData] = useState<MemeData>({ image: "", text: "" });
    const [loading, setLoading] = useState<boolean>(true);
    const [memeHistory, setMemeHistory] = useState<MemeData[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(1);
    const [isGenerated, setIsGenerated] = useState<boolean>(false);

    const addToMemeHistory = () => {
        if (isGenerated) setMemeHistory([data, ...memeHistory]);
        setLoading(false);
    };

    const loadFromMemeHistory = () => {
        if (memeHistory.length > historyIndex) {
            setIsGenerated(false);
            setData({ ...memeHistory[historyIndex] });
            setHistoryIndex((index) => index + 1);
        }
    };

    const fetchMeme = () => {
        const randomId = Math.floor(Math.random() * 250) + 1;
        const corsApiUrl = "https://api.allorigins.win/raw?url="; //Proxy server to fix cross-origin error

        setLoading(true);
        setIsGenerated(true);
        setHistoryIndex(1);

        axios
            .get(
                `${corsApiUrl}http://alpha-meme-maker.herokuapp.com/memes/${randomId}`
            )
            .then((result) => {
                if (result.data.code === 404) fetchMeme();

                setData({
                    image: result.data.data.image,
                    text: result.data.data.bottomText,
                });
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="app">
            <header>
                <h1>meme generator</h1>
            </header>
            <Container>
                <Row className="text-center">
                    <Col>
                        <Button
                            onClick={loadFromMemeHistory}
                            disabled={memeHistory.length < 2}
                            variant="secondary"
                            size="lg"
                            className="mt-20 mb-20 mr-20"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={fetchMeme}
                            disabled={loading}
                            variant="primary"
                            size="lg"
                            className="mt-20 mb-20"
                        >
                            {loading ? "Generating..." : "Generate Meme"}
                        </Button>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>
                        <div className="meme-wrapper">
                            <img
                                src={data.image}
                                onError={fetchMeme}
                                onLoad={addToMemeHistory}
                                alt=""
                            />
                            {!loading && (
                                <span className="meme-text">{data.text}</span>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default App;
