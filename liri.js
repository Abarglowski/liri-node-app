const fs = require('fs');
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
choices: ["concert-this", "spotify-this-song", "movie-this", 'do-what-it-says"]
,]).then(function (user) {
if (user.prompt == "concert-this") {
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
}})


let concertThis = (artist) => {
    axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`).then(
        function (response) {
            const data = response.data;
            if (data[0] == null) {
                console.log('No upcoming events, try another search')
            } else {
                data.forEach(function (item) {
                    let item = item;
                    let momentTime = moment(item.datetime).format('ddd, MM/DD/YYYY, HH:mm')
                    console.log(`Address: ${item.venue.name}`);
                    console.log(`City/Country: ${item.venue.city}, ${item.venue.country}`);
                    console.log(`Date/time: ${momentTime}`);
                    let concertInfo =
                `
                ----------------------------------
                CONCERT INFO:
                Address: ${item.venue.name}
                City/Country: ${item.venue.city}, ${item.venue.country}
                Date/time: ${momentTime}
                ----------------------------------
                `;})}
        })};
