const router = require("express").Router();
const { readdirSync } = require('fs-extra');
const path = require('path');
const { green, blue, cyan, red } = require('kleur');

try {
    let n = 0;
    const srcPath = path.join(__dirname, "/api/");
    const apiFiles = readdirSync(srcPath).filter(file => file.endsWith(".js"));

    console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Detected API files: ${apiFiles}`)}`); // Log detected files

    for (const file of apiFiles) {
        const filePath = path.join(srcPath, file);
        const script = require(filePath);

        if (script.config && script.initialize) {
            const routePath = '/' + script.config.name;
            router.get(routePath, (req, res) => script.initialize({ req, res }));
            global.api.set(script.config.name, script); // Register API to global.api map
            n++;
            console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${file}`)}`);
        } else {
            console.log(`${red('Error:')} ${file} does not have config or initialize.`);
        }
    }

    console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${n} API files`)}`);
} catch (error) {
    console.log(`${red('Error loading APIs:')}`, error);
}

module.exports = router;
                                                      
