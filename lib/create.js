const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function (name, options) {
    // 当前命令行目录
    const cwd = process.cwd()
    const targetDir = path.join(cwd, name);

    // 当前目录是否存在
    if (fs.existsSync(targetDir)) {
        // 是否强制创建
        if (options.force) {
            await fs.remove(targetDir);
        } else {
            // 询问用户是否确定要覆盖
            let {
                action
            } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: 'Target directory already exists Pick an action:',
                choices: [{
                    name: 'Overwrite',
                    value: 'overwrite'
                }, {
                    name: 'Cancel',
                    value: false
                }]
            }])

            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir)
            }


        }
    }

    // 创建项目
    const generator = new Generator(name, targetDir);

    // 开始创建项目
    generator.create()

}
