import React, { Component } from 'react';
import { TwitterShareButton } from 'react-share';
import { TwitterIcon } from 'react-share';
import "./index.css";

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentJoke: '',
            jokeArray: [],
            author: '',
            error: null,
            isLoaded: false
        };

        this.newJoke = this.newJoke.bind(this);
        this.formatAuthor = this.formatAuthor.bind(this);
    }

    newJoke() {
        let user_Agent = new Headers({
            "Accept": "application/json",
            "User-Agent": "React Dad Joke Site: mckelveygreg.github.io/dad-jokes"
        });

        fetch('https://icanhazdadjoke.com/', {headers: user_Agent})
        .then(res => res.json())
        .then(
            (result) => {
                //console.log('made it to result? ' + result);
                this.setState({
                    isLoaded: true,
                    currentJoke: result.joke,
                    jokeArray: result.joke.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|") // from https://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
                });
            },
            // Error Handling, so not to get mixed up with react errors
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
        .then(this.makeAuthor());

        
    }

    formatAuthor(name) {
        console.log(name);
        const title = name.title.charAt(0).toUpperCase() + name.title.slice(1) + '. ';
        let lastName = name.last.charAt(0).toUpperCase() + name.last.slice(1);
        return '- ' + title + lastName;
    }

    makeAuthor() {
        let url = 'https://randomuser.me/api/?gender=male&inc=title,name&nat=us';
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                let formattedAuthor = this.formatAuthor(result.results[0].name);
                this.setState({
                    isLoaded: true,
                    author: formattedAuthor
                });
            },
            // Error handling that saved me last time
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    componentDidMount() {
        this.newJoke();
    }

    render() {
        const { currentJoke, jokeArray, author, error, isLoaded } = this.state;
        //console.log(currentJoke + ' currentJoke; ' + error + ' error; ' + isLoaded + " isLoaded" );
        const jokeSentences = jokeArray.map((joke, indx) => (
            <p key={indx}>
                {joke}
            </p>
        ));

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div id='quote-box'>
                    {/*<p id='text'>{currentJoke}</p> */}
                    
                    <div id='text'>{jokeSentences}</div>
                    
                    <p id='author'>{author}</p>
                    <div id='buttons'>
                        <TwitterShareButton id='tweet-quote' className='button' url={window.location.href} title={currentJoke + ' ' + author}>
                            <p>Tweet Joke!</p>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                        <a href="#" id='new-quote' class='button' onClick={this.newJoke}>Moar Jokes!</a>
                        {/* <a id='tweet-quote' href='twitter.com/intent/tweet'>Tweet Joke!</a> */}
                    </div>
                </div>
            );
        }
    }
}

export default Main;