const yup = require("yup");

const addPetSchema = yup.object().shape({
	petName: yup.string().min(2).max(20),
	petType: yup.string(),
	petStatus: yup.string(),
	height: yup.number(),
	weight: yup.number(),
	petColor: yup.string().min(2),
	petBio: yup.string().min(2),
	allergy: yup.string().min(2),
	breed: yup.string().min(2),
});

module.exports = addPetSchema;
