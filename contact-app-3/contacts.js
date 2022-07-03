const fs = require("fs");
const validator = require("validator");

const dataPath = "./data";
const contactsFile = "contacts.json";
const contactsPath = `${dataPath}/${contactsFile}`;

// Membuat folder data jika belum ada
if (!fs.existsSync(dataPath)) {
	fs.mkdirSync(dataPath);
}

// Membuat file contacts jika belum ada
if (!fs.existsSync(contactsPath)) {
	fs.writeFileSync(contactsPath, `[]`, `utf-8`);
}

const loadData = (dir, type = "utf-8") => {
	const fileBuffer = fs.readFileSync(dir, type);
	let contacts;

	// Cek Isi File Data
	if (!fileBuffer) {
		contacts = [];
		return contacts;
	}

	contacts = JSON.parse(fileBuffer);
	return contacts;
};

const findData = (nama) => {
	const contacts = loadData(contactsPath);

	const contact = contacts.find(
		(contact) => contact.nama.toLowerCase() === nama.toLowerCase()
	);

	if (!contact) {
		return false;
	}

	return contact;
};

const addData = (data) => {
	const contacts = loadData(contactsPath);
	contacts.push(data);
	fs.writeFileSync(contactsPath, JSON.stringify(contacts));
	return true;
};

const deleteData = (nama) => {
	const contacts = loadData(contactsPath);

	const index = contacts.findIndex(
		(contact) => contact.nama.toLowerCase() === nama.toLowerCase()
	);

	if (index < 0) {
		return false;
	}

	contacts.splice(index, 1);

	fs.writeFileSync(contactsPath, JSON.stringify(contacts));
	return true;
};

const editData = (data) => {
	const contacts = loadData(contactsPath);

	const index = contacts.findIndex(
		(contact) => contact.nama.toLowerCase() === data.oldNama.toLowerCase()
	);

	if (index < 0) {
		return false;
	}

	contacts.splice(index, 1);

	contacts.unshift({
		nama: data.nama,
		noHp: data.noHp,
		email: data.email,
	});

	fs.writeFileSync(contactsPath, JSON.stringify(contacts));
	return true;
};

// Validators Functions

const checkDuplicate = (value, object = undefined) => {
	const duplicated = findData(value);
	if (object) {
		if (value !== object.req.body.oldNama && duplicated) {
			throw new Error(`Kontak dengan nama ${value} sudah terdaftar!`);
		}
		return true;
	} else {
		if (duplicated) {
			throw new Error(`Kontak dengan nama ${value} sudah terdaftar!`);
		}
		return true;
	}
};

const checkEmail = (value) => {
	if (value) {
		if (!validator.isEmail(value)) {
			throw new Error(`Email ${value} tidak valid!`);
		}
	}
	return true;
};

module.exports = {
	contactsPath,
	loadData,
	findData,
	addData,
	deleteData,
	editData,
	checkDuplicate,
	checkEmail,
};
