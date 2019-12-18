const fs = require("fs");

const DB_ROOT = './data';
module.exports = {
	DB_ROOT,
	connectDB() {
		if (!fs.existsSync(DB_ROOT)) {
			fs.mkdirSync(DB_ROOT, { recursive: true });
		}
	}
};
