const { DB_ROOT } = require("./config/database");
const path = require("path");
const fs = require("fs");

module.exports = {

	async setProperty(studentId, propPath, option) {
		const exist = await isExistStudent(studentId);
		if (!exist) createStudent(studentId);

		const data = await readStudent(studentId);
		const properties = propPath.split('/');

		let item = data;
		for (let property of properties) {
			if (!item[property]) {
				item[property] = {};
			}

			item = item[property];
		}

		for (let key in option) {
			item[key] = option[key];
		}

		return await saveStudent(studentId, data);
	},

	async getProperty(studentId, propPath) {
		const exist = await isExistStudent(studentId);
		if (!exist) throw `Student ${studentId} doesn't exist`;

		const data = await readStudent(studentId) || {};
		const properties = propPath.split('/');

		let item = data;
		let props = '';
		for (let property of properties) {
			props += `${property}/`;
			item = item[property];
			if (!item) throw `Property ${props} doesn't exist`;
		}

		return item;
	},

	async deleteProperty(studentId, propPath) {
		const exist = await isExistStudent(studentId);
		if (!exist) throw `Student ${studentId} doesn't exist`;

		const data = await readStudent(studentId);
		const properties = propPath.split('/');

		// option 1
		let code = 'delete data';
		for (let property of properties) {
			code += `['${property}']`;
		}

		console.log('delete code: ', code);
		const result = eval(code);

		// // option 2
		// let parent = data, child = data;
		// let props = '';
		// for (let property of properties) {
		// 	props += `${property}/`;
		// 	parent = child;
		// 	child = child[property];
		// 	if (!child) throw `Property ${props} doesn't exist`;
		// }

		// delete parent[child];
		if (!result) {
			console.log('Some error occurs');
			throw 'Some error occurs';
		}

		return saveStudent(studentId, data);
	}
};

const isExistStudent = studentId => isExist(`${DB_ROOT}/${studentId}.json`);

const createStudent = studentId => createFile(`${DB_ROOT}/${studentId}.json`);

const readStudent = studentId => new Promise((resolve, reject) => {
	fs.readFile(`${DB_ROOT}/${studentId}.json`, {}, (error, data) => {
		if (error) return reject(error);

		resolve(JSON.parse(data));
	});
});

const saveStudent = (studentId, data) => new Promise((resolve, reject) => {
	fs.writeFile(`${DB_ROOT}/${studentId}.json`,
		JSON.stringify(data),
		error => {
			if (!error) return resolve(true);

			console.log('Saving student failed', studentId);
			reject(error);
		})
})

const isExist = (path) => new Promise(resolve => {
	fs.access(path, error => {
		if (!error) return resolve(true);

		console.log("File or Folder does not exist", path);
		resolve(false);
	})
});

const createFile = (path) => new Promise((resolve, reject) => {
	fs.writeFile(path, "{}", error => {
		if (!error) return resolve(true);

		console.log('Create file failed', path)
		reject(error);
	})
});

