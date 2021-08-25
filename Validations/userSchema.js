const yup = require("yup");

addUserSchema = yup.object().shape({
	user_id: yup.string(),
	newPassword: yup.string().required(),
	newEmail: yup.string().email().required(),
	userFirstName: yup.string().min(2).required(),
	userLastName: yup.string().min(2).required(),
	userContactNumber: yup.string(),
});

module.exports = addUserSchema;
