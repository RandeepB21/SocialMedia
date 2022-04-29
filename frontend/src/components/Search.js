import { useState } from "react";
import { Form, Button, ListGroup, Card} from "react-bootstrap";
import ProfileItem from "./ProfileItem.js";
import "../css/Search.css";

export default function Search() {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    function search() {
        fetch("/searchForUsername?text=" + searchText)
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((error) => console.error(error));
    }

    return <div className="search">

        <div className="search-wrapper">
            <Form className="search-form">
                <Form.Group className="search-field">
                    <Form.Control 
                        type="text" 
                        onInput={(e) => setSearchText(e.target.value)} 
                        placeholder="Search for a User"
                    />
                </Form.Group>

                <Button varaint="primary" onClick={search}>Search</Button>
            </Form>

            {searchResults.length > 0 ? (<div className="search-results-wrapper">
                <Card style={{ width: "100%"}}>
                    <ListGroup variant="flush">
                        {searchResults.map((item, index) => (
                            <ProfileItem {...item} index={index}/>
                        ))}

                    </ListGroup>
                </Card>

            </div>) 
            
            : <p>No Results</p>}

        </div>

    </div>
}
