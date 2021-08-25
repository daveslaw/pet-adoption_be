const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const port = 3001;
const validation = require("./middlewares/validationMid");
const addPetSchema = require("./Validations/petSchema");
const addUserSchema = require("./Validations/userSchema");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const jwt = require("jsonwebtoken");

const db = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "password",
	database: "pet_adoption_db",
});

app.use(
	cors({
		origin: [`http://localhost:3000`],
		methods: ["GET", "POST"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		key: "userId",
		secret: "subscribe",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 60 * 60 * 24,
		},
	})
);

app.get("/getallpets", (req, res, next) => {
	const sql = `SELECT * FROM petlist`;
	db.query(sql, function (err, data) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 200,
			data,
			message: "Customer lists retrieved successfully",
		});
	});
});

app.post("/addpet", validation(addPetSchema), (req, res, next) => {
	const {
		pet_id,
		petName,
		petType,
		petStatus,
		breed,
		petColor,
		height,
		weight,
		petBio,
		allergy,
	} = req.body;

	let sql = `INSERT INTO petlist (
		pet_id,
		petName,
		petType,
		petStatus,
		breed,
		petColor,
		height,
		weight,
		petBio,
		allergy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
	db.query(
		sql,
		[
			pet_id,
			petName,
			petType,
			petStatus,
			breed,
			petColor,
			height,
			weight,
			petBio,
			allergy,
		],
		function (err, data) {
			if (err) {
				next(err);
			}
			res.json({
				status: 200,
				data,
				message: "User lists retrieved successfully",
			});
		}
	);
});

app.get("/getallusers", (req, res, next) => {
	const sql = `SELECT * FROM userlist`;
	db.query(sql, function (err, data) {
		if (err) {
			next(err);
			return;
		}
		res.json({
			status: 200,
			data,
			message: "Customer lists retrieved successfully",
		});
	});
});

app.post("/adduser", validation(addUserSchema), async (req, res, next) => {
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	console.log(salt, hashedPassword);

	const { user_id, email, userFirstName, userLastName, userContactNumber } =
		req.body;
	let sql = `INSERT INTO userlist (user_id, email, password, userFirstName, userLastName, userContactNumber) VALUES (?, ?, ?, ?, ?, ?)`;
	db.query(
		sql,
		[
			user_id,
			email,
			hashedPassword,
			userFirstName,
			userLastName,
			userContactNumber,
		],
		function (err, data) {
			if (err) {
				next(err);
			}
			res.json({
				status: 200,
				data,
				message: "User lists retrieved successfully",
			});
		}
	);
});

app.post("/users/login", (req, res, next) => {
	const { email, password } = req.body;

	db.query(
		`SELECT * FROM userlist WHERE email = (?);`,
		[email],
		(err, result) => {
			if (err) {
				res.send({ err: err });
				console.log("Invalid email address");
			}
			if (result.length > 0) {
				bcrypt.compare(password, result[0].password, (error, response) => {
					if (response) {
						const id = req.session.user_id;
						// const token = jwt.sign({ id }, "jwtSecret", {
						// 	expires: 300,
						// });
						req.session.user_id = result;
						res.json({ auth: true, result: result });

						console.log("Login successful");
					} else {
						res.send({ error: error });
						console.log("One of your details is incorrect");
					}
				});
			} else {
				res.send({ message: "User doesn't exist" });
			}
		}
	);
});

app.get("/users/login", (req, res) => {
	if (req.session.user_id) {
		res.send({ logged_in: true, user_id: req.session.user_id });
	} else {
		res.send({ logged_in: false });
	}
});


app.listen(port, () => {
	console.log(`Listening on https://localhost:${port}`);
});
