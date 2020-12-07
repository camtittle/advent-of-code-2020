const { spawn } = require("child_process");
const args = process.argv.slice(2);

const day = args[0];
console.log('Running day ' + day + '...')

const runCmd = (cmd, parameters) => {

    const isWindows = /win32/.test(process.platform);

    let executableCmd = cmd;
    let executableCmdParams = parameters;
    if (isWindows) {
        if (!executableCmdParams) {
            executableCmdParams = [];
        } else {
            executableCmdParams = parameters.slice();
        }
        executableCmdParams.unshift(cmd);
        executableCmdParams.unshift('/c');
        executableCmd = process.env.comspec;
    }

    return new Promise((resolve, reject) => {
        let options = {};
        let output = '';
        let errOutput = '';

        const spawnedProcess = spawn(executableCmd, executableCmdParams, options);

        spawnedProcess.stdout.on('data', (data) => {
            console.log(data.toString());
            output += data.toString();
        });
        spawnedProcess.stderr.on('data', (data) => {
            console.error(data.toString());
            errOutput += data.toString();
        });
        spawnedProcess.on('close', (code) => {
            if (code !== 0) {
                reject(errOutput);
            }
            resolve(output);
        });
        spawnedProcess.on('error', (error) => {
            console.log(error);
            reject(error.toString());
        });
    });
}

(async () => {
    try {
        // await runCmd('npx', ['tsc', `${day}/${day}.ts`, '-t', 'ES6']);
        await runCmd('npx', ['tsc']);
        
        console.log('running...')
        await runCmd('node', [`${day}/${day}.js`]);
    } catch (e) {
        console.error(e);
    }
})();