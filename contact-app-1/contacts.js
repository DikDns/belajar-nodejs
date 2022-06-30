const fs = require("fs");
const validator = require("validator");

const dataPath = "./data";
const contactsFile = "contacts.json";

// Membuat folder data jika belum ada
if (!fs.existsSync(dataPath)) {
	fs.mkdirSync(dataPath);
}

// Membuat file contacts jika belum ada
if (!fs.existsSync(`${dataPath}/${contactsFile}`)) {
	fs.writeFileSync(`${dataPath}/${contactsFile}`, `[]`, `utf-8`);
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

const simpanData = (newContact) => {
	const contacts = loadData(`${dataPath}/${contactsFile}`);

	// Cek Duplikat No Handphone dan Nama
	const duplicatedNoHp = contacts.find(
		(contact) => newContact.noHp === contact.noHp
	);
	const duplicatedNama = contacts.find(
		(contact) => newContact.nama === contact.nama
	);

	if (duplicatedNoHp) {
		console.log(`No Handphone ${newContact.noHp} sudah terdaftar!`);
		return false;
	}

	if (duplicatedNama) {
		console.log(`Nama ${newContact.nama} sudah terdaftar!`);
		return false;
	}

	// Validasi Alamat Email
	if (newContact.email) {
		if (!validator.isEmail(newContact.email)) {
			console.log(`Alamat Email tidak valid!`);
			return false;
		}
	} else {
		newContact.email = "";
	}

	// Validasi No Handphone
	if (newContact.noHp) {
		if (!validator.isMobilePhone(newContact.noHp, `id-ID`)) {
			console.log(`Nomor Handphone tidak valid!`);
			return false;
		}
	}

	// Memasukan contact baru
	contacts.push(newContact);

	fs.writeFileSync(`${dataPath}/${contactsFile}`, JSON.stringify(contacts));

	console.log(`Data berhasil disimpan!`);
};

const listData = () => {
	const contacts = loadData(`${dataPath}/${contactsFile}`);

	if (contacts.length < 1) {
		console.log(`Data kontak masih kosong!`);
		return;
	}

	contacts.forEach((contact, i) => {
		console.log(`${i + 1}. ${contact.nama} - ${contact.noHp}`);
	});
};

const detailData = (nama) => {
	const contacts = loadData(`${dataPath}/${contactsFile}`);

	const contact = contacts.find(
		(contact) => contact.nama.toLowerCase() === nama.toLowerCase()
	);

	if (!contact) {
		console.log(`Kontak dengan nama ${nama} tidak ada!`);
		return false;
	}

	console.log(`${contact.nama} - ${contact.noHp} (${contact.email})`);
};

const hapusData = (nama) => {
	const contacts = loadData(`${dataPath}/${contactsFile}`);
	const index = contacts.findIndex(
		(contact) => contact.nama.toLowerCase() === nama.toLowerCase()
	);

	if (index < 0) {
		console.log(`kontak dengan nama ${nama} tidak ada!`);
		return false;
	}

	contacts.splice(index, 1);

	fs.writeFileSync(`${dataPath}/${contactsFile}`, JSON.stringify(contacts));

	console.log(`Data dengan nama ${nama} berhasil dihapus!`);
};

module.exports = {
	simpanData,
	listData,
	detailData,
	hapusData,
};
