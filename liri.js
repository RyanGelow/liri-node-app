require("dotenv").config();
var keys = require("./keys")
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

// Setup process.argv variable
// var nodeArgs = process.argv;

// let fillInPlus = nodeArgs.slice(3).join("+");
// let fillInSpace = nodeArgs.slice(3).join(" ");


const liri = function(value) {
    // if(process.argv[3] === ``){
    //     console.log("Please enter a item to be searched");
    // }
    if(process.argv[2] === `movie-this`) {
        movieThis(value)
    }if(process.argv[2] === `concert-this`) {
        concertThis(value);
    }if(process.argv[2] === `spotify-this-song`) {
        spotifyThisSong(value);
    }if(process.argv[2] === `do-what-it-says`) {
        doWhatItSays();
    }
}
// Called with "movie-this"
const movieThis = function(movieName) {
    if(!movieName) {
        movieName = `Mr. Nobody`;
    }
    // First command variable
    // var movieName = fillInPlus;
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${movieName}&apikey=trilogy`;
    axios.get(queryUrl)
    .then(function(response) {
        console.log("------------------------------");
        console.log(`Movie Title: ${response.data.Title}`);
        console.log(`Released: ${response.data.Year}`);
        console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}`);
        console.log("------------------------------");
    }).catch(function(error) {
        if (error.response) {
            console.log(error.response);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
            console.log(error.config);
    });
}
  
// Called with "concert-this"
const concertThis = function(artist) {
    if(!artist) {
        artist = `Goo Goo Dolls`;
    }
    // First command variable
    // var artist = fillInPlus;
    // Run the axios.get function to take in a URL and returns a promise (just like $.ajax)
    axios.get(`https://rest.bandsintown.com/artists/${artist}?app_id=codingbootcamp`)
    .then(function(response) {
        console.log("------------------------------");
        console.log("------------------------------");
        console.log(`Upcoming shows for <<>>${response.data.name}<<>>`);
        console.log("------------------------------");
        console.log("------------------------------");
    }).catch(function(error) {
        if (error.response) {
            console.log(error.response);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
            console.log(error.config);
    });
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function(response) {
        // If the axios was successful...
        // Then log the body from the site!
        // console.log(response.data);
        for(let i = 0; i < 10; i++) {
            console.log(`Venue: ${response.data[i].venue.name}`);
            if(response.data[i].venue.region === ""){
                console.log(`Location: ${response.data[i].venue.city}, ${response.data[i].venue.country}`)
            }else{
                console.log(`Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}`)
            };
            console.log(`Date: ${moment(response.data[i].datetime).format('LLLL')}`);
            console.log("------------------------------");
        };

    }).catch(function(error) {
        if (error.response) {
            console.log(error.response);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
            console.log(error.config);
    });
}

// Called with "spotify-this-song"
const spotifyThisSong = function(song) {
    if(!song) {
        song = `The Sign`;
    }
    // First command variable
    // let song = fillInSpace;
    spotify.search({ type: "track", query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for(let i = 0; i < 7; i++) {
            console.log("------------------------------");   
            console.log("Song Name: " + data.tracks.items[i].name);
            console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Song Preview Link: " + data.tracks.items[i].external_urls.spotify);
        }
        console.log("------------------------------");   
    });
}

// Called with "do-what-it-says"
const doWhatItSays = function() {
    // First command variable    
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        // Split it by comma 
        var dataArr = data.split(",");

        // liri( dataArr[0], dataArr.slice(1).join(" ") )
        if(dataArr[0] === 'movie-this') {
            movieName = dataArr[1];
            movieThis(movieName);
        };
        if(dataArr[0] === 'concert-this') {
            artist = dataArr[1];
            spotifyThisSong(artist);
        };
        if(dataArr[0] === 'spotify-this-song') {
            song = dataArr[1];
            spotifyThisSong(song);
        };
    });
}

const cmd = process.argv.slice(3).join(" ")

liri(cmd);