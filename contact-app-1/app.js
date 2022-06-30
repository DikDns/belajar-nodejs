const yargs = require("yargs");
const {
	simpanData,
	listData,
	detailData,
	hapusData,
} = require("./contacts.js");

yargs
	.command({
		command: "add",
		describe: "Menambahkan data baru",
		builder: {
			nama: {
				describe: "Nama lengkap",
				demandOption: true,
				type: "string",
			},
			noHp: {
				describe: "Nomor Handphone",
				demandOption: true,
				type: "string",
			},
			email: {
				describe: "Alamat email",
				demandOption: false,
				type: "string",
			},
		},
		handler(argv) {
			simpanData({
				nama: argv.nama,
				noHp: argv.noHp,
				email: argv.email,
			});
		},
	})
	.demandCommand();

yargs.command({
	command: "list",
	describe: "Menampilkan semua kontak",
	handler(argv) {
		listData();
	},
});

yargs.command({
	command: "detail",
	describe: "Menampilkan detail kontak berdarkan nama",
	builder: {
		nama: {
			describe: "Nama lengkap",
			demandOption: true,
			type: "string",
		},
	},
	handler(argv) {
		detailData(argv.nama);
	},
});
yargs.command({
	command: "delete",
	describe: "Menghapus kontak berdarkan nama",
	builder: {
		nama: {
			describe: "Nama lengkap",
			demandOption: true,
			type: "string",
		},
	},
	handler(argv) {
		hapusData(argv.nama);
	},
});

try {
	yargs.parse();
} catch (e) {
	console.error(e);
}

// const { tulisPertanyaan, simpanData } = require("./contacts.js");

// const main = async () => {
// 	const nama = await tulisPertanyaan(`Masukkan nama anda : `);
// 	const email = await tulisPertanyaan(`Masukkan email anda : `);
// 	const noHP = await tulisPertanyaan(`Masukkan no HP anda : `);

// 	simpanData({ nama, email, noHP });
// };
