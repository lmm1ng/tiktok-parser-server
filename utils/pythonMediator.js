const { PythonShell } = require('python-shell')
const config = require('config')

const initialOptions = {
    mode: 'json',
    scriptPath: `${config.get('pythonDirName')}`
}

class PythonMediator {
    runScript (scriptName, args) {
        return new Promise((resolve, reject) => {
            PythonShell.run(`${scriptName}.py`, { args, ...initialOptions }, (err, res) => {
                if (err) {
                    console.log(err)
                    reject('Python script runtime error')
                }
                if (res) {
                    resolve(res[0])
                }
                resolve(undefined)
            })
        })
    }
}

module.exports = new PythonMediator()