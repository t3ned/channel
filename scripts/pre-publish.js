const { readdirSync, writeFileSync } = require("fs");
const { join } = require("path");

const supportedModulesPath = join(process.cwd(), "src", "modules");
const supportedModuleNames = readdirSync(supportedModulesPath, "utf-8");

const createFileInRoot = (name, content) => {
	writeFileSync(join(process.cwd(), name), content, "utf-8");
	console.log(`CREATE ${name}`);
};

for (const supportedModuleName of supportedModuleNames) {
	const js = `module.exports = require("./dist/${supportedModuleName}");\n`;
	const ts = `export * from "./dist/${supportedModuleName}";\n`;

	createFileInRoot(`${supportedModuleName}.js`, js);
	createFileInRoot(`${supportedModuleName}.d.ts`, ts);
}
