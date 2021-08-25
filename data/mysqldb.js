const mysql = require("mysql");
const SQL = require("@nearform/sql");

const getUserByEmail = async (email) => {
	try {
		const queryResult = await query(
			SQL`SELECT * from userlist WHERE email = ${email}`
		);
		console.log({ queryResult });
		return queryResult[0];
	} catch (error) {
		console.log(error);
	}
};
exports.getUserByEmail = getUserByEmail;
