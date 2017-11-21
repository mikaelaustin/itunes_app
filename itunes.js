//setup for connection database

//node modules to request
var pg = require('pg');
var inquirer = require('inquirer');

//you have to pick the database to connect to;
var dbUrl = {
	user: process.argv.POSTGRES_USER,
	password: process.argv.POSTGRES_PASSWORD,
	database: 'itunes',
	host: 'localhost',
	port: 5432
};

//creating a client to connect to, which as you see, uses the object that we set up
var pgClient = new pg.Client(dbUrl);

//officially connecting to that postgres database
pgClient.connect();

///////////////////////////

console.log("Welcome to MiTunes (Mikael's Tunes)!") + "<br>";
console.log("Sign up/Sign in:");

inquirer.prompt([
	{
		type: "input",
		message: "Please type your username.",
		name: "username",
	},
	{
		type: "input",
		message: "Please type your password.",
		name: "password",
	}

]).then((user_info) => {
	pgClient.query(`SELECT * FROM users WHERE username='${user_info.username}'`, function(err, result) {
		if(result.rows.length > 0){
			if(result.rows[0].password === user_info.password){
				console.log("Welcome "+ result.rows[0].name+ "! Here are your purchased songs")
				pgClient.query('SELECT song_title FROM songs INNER JOIN song_purchased ON songs.id=song_purchased.song_id WHERE song_purchased.user_id='+result.rows[0].id, function(error,queryResTwo){
					if(queryResTwo.rows.length>0){
						for(var i=0; i<queryResTwo.rows.length; i++){
							console.log((i+1)+ ") "+queryResTwo.rows[i].song_title)
						}
						pgClient.end();
					} else {
						console.log("You haven't bought any music yet")
						pgClient.end();
					}
				});

			} else {
				console.log("The password you entered is incorrect!");
				pgClient.end();
			}
			

		} else {
			console.log("Username dones't exist!");
			pgClient.end();
		}
	});
});
