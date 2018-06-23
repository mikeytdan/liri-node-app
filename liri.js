require("dotenv").config();
var keys = require(`./keys`);
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var inquirer = require("inquirer");
var request = require("request");
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

start();

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "Select a Command",
            choices: ["Show My tweets", "Get Spotify Song Info", "Get Movie Info", "Do What It Says"],
            name: "command"
        }
    ]).then(function (response) {
        switch (response.command) {
            case "Show My tweets":
                selectedShowMyTweets()
                break
            case "Get Spotify Song Info":
                selectedSpotify()
                break
            case "Get Movie Info":
                selectedGetMovieInfo()
                break
            case "Do What It Says":
                selectedDoWhatItSays()
                break
        }
    })
}

function selectedShowMyTweets() {
    var params = { screen_name: 'DanielsMikiel' };
    console.log("Showing tweets from @" + params.screen_name);
    twitter.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log("Error: " + error);
            return
        } else {
            for (tweet of tweets.reverse()) {
                console.log("> " + tweet.text);
            }
        }
    });
}

function selectedSpotify() {
    inquirer.prompt([
        {
            type: "input",
            message: "Song Name?",
            default: "The Sign Ace of Base",
            name: "song"
        }
    ]).then(function (response) {
        var song = response.song;
        spotify.search({ type: 'track', query: response.song })
            .then(function (response) {
                var items = response.tracks.items;
                for (item of items) {
                    console.log("------------------------------");
                    console.log("Song: " + item.name);
                    var artists = [];
                    for (artist of item.album.artists) {
                        artists.push(artist.name);
                    }

                    if (artists.length > 1) {
                        console.log("Artists: " + artists.join(", "));
                    } else {
                        console.log("Artist: " + artists.shift());
                    }

                    console.log("Preview: " + item.external_urls.spotify);
                    console.log("Album: " + item.album.name);
                    console.log("------------------------------");
                }
            })
            .catch(function (error) {
                console.log("Error: " + error);
            });
    })
}

function selectedGetMovieInfo() {
    console.log("Get Movie Info");
    inquirer.prompt([
        {
            type: "input",
            message: "Movie Name?",
            default: "Mr. Nobody",
            name: "movie"
        }
    ]).then(function (response) {
        var movieName = response.movie;
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function (error, response, body) {
            console.log("------------------------------");
            if (error) {
                console.log("Error: " + error);
                selectedGetMovieInfo();
                return
            } else if (response.statusCode === 200) {
                var movie = JSON.parse(body);
                console.log("Title: " + movie.Title);
                for (rating of movie.Ratings) {
                    console.log(`${rating.Source}: ${rating.Value}`);
                }
                console.log("Country:: " + movie.Country);
                console.log("Language: " + movie.Language);
                console.log("Plot: " + movie.Plot);
                console.log("Actors: " + movie.Actors);
            } else {
                console.log("Error: Something went wrong...");
                selectedGetMovieInfo();
            }
            console.log("------------------------------");
        });
    })
}

function selectedDoWhatItSays() {
    console.log("Do What It Says");
}