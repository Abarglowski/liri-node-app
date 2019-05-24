const fs = require("fs");
const dotenv = require("dotenv").config();
const moment = require('moment');
const inquirer = require('inquirer');
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');

inquirer.prompt([{
type: "list",
message: "Hello, I am Liri.  I am able to find concerts of your favorite artists, find your favorite song, or search your favorite movie.  Please give me a command.",
name: "prompt",
choices: ["concert-this", "spotify-this-song", "movie-this","do-what-it-says"]
}]).then(function (user) {
if(user.prompt == "concert-this") {
    inquirer.prompt([{
        type: "input",
        message: "Please enter an artist or a band.",
        name: "artist"}
    ]).then(function (user) {
        if (user.artist) {
            concertThis(user.artist)
        } else {
            console.log("Sorry I couldn't find that, please try again.")
        }
    })
}else if(user.prompt == "spotify-this-song") {
    inquirer.prompt([{
        type: "input",
        message: "Please enter a song name.",
        name: "song"}
    ]).then(function(user){
        if(user.song) {
            spotifyThisSong(user.song)
        } else {
            console.log("Sorry I couldn't find that, please try again.")
        }
})
} else if(user.prompt == "movie-this") {
    inquirer.prompt([{
        type: "input",
        message: "Please enter a movie name.",
        name: "movie"}
    ]).then(function(user){
        if(user.movie) {
            movieThis(user.movie)
        } else {
            console.log("Sorry I couldn't find that, please try again.")
        }
})
} else if(user.prompt == "do-what-it-says"){
    doWhatItSays()
};
})

let concertThis = (artist) => {
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`).then(
        function (response) {
            const data = response.data;
            if (data[0] == null) {
                console.log('No upcoming events, try another search')
            } else {
                data.forEach(function (item) {
                    let momentTime = moment(item.datetime).format('ddd, MM/DD/YYYY, HH:mm')
                    let concertInfo =
                `
                ----------------------------------
                CONCERT INFO:
                Name: ${item.venue.name}
                City/Country: ${item.venue.city}, ${item.venue.country}
                Date/time: ${momentTime}
                ----------------------------------
                `;
            console.log(concertInfo);
            })}          
        }).catch(function (err) {
            console.log("please enter a real artist");
        })
    };

let spotifyThisSong = (song) => {
    spotify
        .search({
            type: "track",
            limit: 1,
            query: song,
        }).then(function (response){
            let songInfo =
            `
            -----------------------------------------
            SONG INFO:
            Name: ${response.tracks.items[0].name}
            Artist: ${response.tracks.items[0].artists[0].name}
            Album: ${response.tracks.items[0].album.name}
            Preview: ${response.tracks.items[0].preview_nodurl}
            -----------------------------------------
            `;
            console.log(songInfo);
        })
        .catch(function (err) {
            console.log("please enter a real song name");
        });
}

let movieThis = (movie) => {
    axios.get(`https://www.omdbapi.com/?t=${movie}&plot=short&apikey=trilogy`)
    .then(function (response){
        let movieInfo =
        `
        ----------------------------------------------------------------------------------------------------------------
        MOVIE INFO:
        Title: ${response.data.Title}
        Year Released: ${response.data.Year}
        IMDB Rating: ${response.data.Ratings[0].Value}
        Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
        Produced In : ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Cast: ${response.data.Actors}
        ----------------------------------------------------------------------------------------------------------------
        `;
        console.log(movieInfo);
    }).catch(function (err){
        console.log("please enter a real movie");
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data){
        if(err){
            return console.log(err);
        }
        const arr = data.split(",");

        var action = arr[0];
        var query = arr[1];
        console.log(action);
        console.log(query);

        switch(action){
            case "concert-this":
                concertThis(query);
                break;
            case "spotify-this-song":
                spotifyThisSong(query);
                break;
            case "movie-this":
                movieThis(query);
                break;
        }
    });
}