const Sequelize = require('sequelize')
const database = require('../database')

const BackupUrl = database.define('backupUrl', {
    appId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    appName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    appRam: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isWebsite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    cluster: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    backupURL: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports.BackupUrl = BackupUrl;