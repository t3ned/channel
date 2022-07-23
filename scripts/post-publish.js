const { readdirSync, rmSync } = require("fs");
const { join } = require("path");

const supportedModulesPath = join(process.cwd(), "src", "modules");
const supportedModuleNames = readdirSync(supportedModulesPath, "utf-8");

const deleteFileInRoot = (name) => {
	rmSync(join(process.cwd(), name));
	console.log(`DELETE ${name}`);
};

for (const supportedModuleName of supportedModuleNames) {
	deleteFileInRoot(`${supportedModuleName}.js`);
	deleteFileInRoot(`${supportedModuleName}.d.ts`);
}
