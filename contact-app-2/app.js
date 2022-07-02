const express = require("express");
const ejs = require("ejs");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const {
	contactsPath,
	loadData,
	findData,
	addData,
	deleteData,
	editData,
	checkDuplicate,
	checkEmail,
} = require("./contacts.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Built-in middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Flash
app.use(cookieParser("secret"));
app.use(
	session({
		cookie: {
			maxAge: 6000,
		},
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(flash());

app.post(
	"/contact",
	[
		body("nama").custom((value) => checkDuplicate(value)),
		body("email").custom((value) => checkEmail(value)),
		check("noHp", "No Handphone tidak valid!").isMobilePhone("id-ID"),
	],
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// return res.status(404).jsos({ errors: errors.array() });
			res.render("vTemplate", {
				title: "Add Contact",
				content: "add-contact",
				errors: errors.array(),
				inputValues: true,
				body: req.body,
			});
		} else {
			addData(req.body);
			req.flash("msg", "Kontak berhasil disimpan!");
			res.redirect("/contact");
		}
	}
);

app.post(
	"/contact/update",
	[
		body("nama").custom((value, { req }) => checkDuplicate(value, { req })),
		body("email").custom((value) => checkEmail(value)),
		check("noHp", "No Handphone tidak valid!").isMobilePhone("id-ID"),
	],
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// return res.status(404).jsos({ errors: errors.array() });
			res.render("vTemplate", {
				title: "Edit Contact",
				content: "edit-contact",
				errors: errors.array(),
				inputValues: true,
				body: req.body,
			});
		} else {
			editData(req.body);
			req.flash("msg", "Kontak berhasil diubah!");
			res.redirect("/contact");
		}
	}
);

app.get(["/", "/home"], (req, res) => {
	res.render("vTemplate", {
		nama: "DikDns",
		title: "Home",
		content: "home",
	});
});

app.get("/about", (req, res) => {
	res.render("vTemplate", { title: "About", content: "about" });
});

app.get("/contact", (req, res) => {
	const contacts = loadData(contactsPath);
	res.render("vTemplate", {
		title: "Contact",
		content: "contact",
		contacts: contacts,
		msg: req.flash("msg"),
	});
});

app.get("/contact/add", (req, res) => {
	res.render("vTemplate", {
		title: "Add Contact",
		content: "add-contact",
		inputValues: false,
		errors: [],
	});
});

app.get("/contact/edit/:nama", (req, res) => {
	const contact = findData(req.params.nama);
	if (contact) {
		res.render("vTemplate", {
			title: "Edit Contact",
			content: "edit-contact",
			inputValues: true,
			body: contact,
			errors: [],
		});
	} else {
		res.redirect("/contact");
	}
});

app.get("/contact/delete/:nama", (req, res) => {
	const contact = findData(req.params.nama);

	if (contact) {
		if (deleteData(req.params.nama)) {
			req.flash(
				"msg",
				`Kontak dengan nama ${req.params.nama} berhasil dihapus!`
			);
		}
	}
	res.redirect("/contact");
});

app.get("/contact/:nama", (req, res) => {
	const contact = findData(req.params.nama);
	res.render("vTemplate", {
		title: "Detail Contact",
		content: "read-contact",
		contact: contact,
	});
});

app.use("/", (req, res) => {
	res.status(404);
	res.render("vTemplate", { title: "Not Found", content: "error" });
});

app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
