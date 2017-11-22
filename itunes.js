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

//need to add sign up/sign in and wrap everything in that function
//i did sign in, need to add sign up and allow new user to choose from selection of songs and pick

console.log("Welcome to MiTunes (Mikael's Tunes)!") + "<br>";

var access = function(){ 
	inquirer.prompt([
		{
			type:"list",
			message: "What would you like to do?",
			choices: ["Sign up","Sign in"],
			name: "login",
		}
	]).then((login)=>{
		if(login.login === "Sign in"){
	// 	var signIn = function(){
	// 		inquirer.prompt([
	// 	{
	// 		type: "input",
	// 		message: "Please type your username.",
	// 		name: "username",
	// 	},
	// 	{
	// 		type: "input",
	// 		message: "Please type your password.",
	// 		name: "password",
	// 	}
	// ]).then((user_info) => {
	// 	pgClient.query(`SELECT * FROM users WHERE username='${user_info.username}'`, function(error, result) {
	// 		if(result.rows.length > 0){
	// 			if(result.rows[0].password === user_info.password){
	// 				console.log("Welcome "+ result.rows[0].name+ "! Here are your purchased songs")
	// 				pgClient.query('SELECT song_title FROM songs INNER JOIN song_purchased ON songs.id=song_purchased.song_id WHERE song_purchased.user_id='+result.rows[0].id, function(errortwo,queryResTwo){
	// 					if(queryResTwo.rows.length>0){
	// 						for(var i=0; i<queryResTwo.rows.length; i++){
	// 							console.log((i+1)+ ") "+queryResTwo.rows[i].song_title)
	// 						}
							
	// 					} else {
	// 						console.log("You haven't bought any music yet")
							
	// 					}
	// 				});

	// 			} else {
	// 				console.log("The password you entered is incorrect!");
	// 				signIn();
	// 			}	

	// 		} else {
	// 			console.log("Username dones't exist!");
	// 			signIn();
	// 		}
	// 	});
	// });
	// }
	signIn();
			
		} else {
			console.log("Let's create a Mitunes account.")
			//var customer_info = []
			inquirer.prompt([
				{
					type: "input",
					message: "What is your name?",
					name: "select_name"
				},
				{
					type: "input",
					message: "Select a username",
					name: "select_username"
				},
				{
					type: "input",
					message: "Choose a password",
					name: "select_password",
				}

		]).then((create_user)=>{
			pgClient.query('INSERT INTO users (name, username, password) VALUES ($1,$2,$3)', [create_user.select_name, create_user.select_username, create_user.select_password], function(errorthree, queryResThree) {
				if(errorthree){
					throw errorthree; 
				} else {
					console.log("New user created.")
					signIn();
				}

			})
		})
		}
	})
}
access();

var signIn = function(){
	inquirer.prompt([
		{
			type: "input",
			message: "Please type your username.",
			name: "username",
		},
		{
			type: "input",
			message: "Please type your password.",
			name: "password"
		}
	]).then((user_info) => {
		pgClient.query(`SELECT * FROM users WHERE username='${user_info.username}'`, function(error, result) {
			if(result.rows.length > 0){
				if(result.rows[0].password === user_info.password){
					console.log("Welcome "+ result.rows[0].name+ "! Here are your purchased songs")
					pgClient.query('SELECT song_title FROM songs INNER JOIN song_purchased ON songs.id=song_purchased.song_id WHERE song_purchased.user_id='+result.rows[0].id, function(errortwo,queryResTwo){
						if(queryResTwo.rows.length>0){
							for(var i=0; i<queryResTwo.rows.length; i++){
								console.log((i+1)+ ") "+queryResTwo.rows[i].song_title)
							}
							
						} else {
							console.log("You haven't bought any music yet")
							
						}
						
					});

				} else {
					console.log("The password you entered is incorrect!");
					signIn();
				}	

			} else {
				console.log("Username dones't exist!");
				signIn();
			}
		});
	});
}