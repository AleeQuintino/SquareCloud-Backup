const { Op } = require('sequelize');
const { BackupUrl } = require('../db/schemas/backupUrl');

async function deleteOldBackups() {
    try {
        // Calcule a data limite (14 dias atrás)
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 14);

        // Use o método `destroy` do Sequelize para excluir as linhas
        const linhasExcluidas = await BackupUrl.destroy({
            where: {
                createdAt: {
                    [Op.lt]: dataLimite, // Op.lt é "menos que"
                },
            },
        });

        console.log(`${linhasExcluidas} backups antigos excluídos.`);
    } catch (error) {
        console.error('Erro ao excluir backups antigos:', error);
    }
}

// Exporte a função para que ela possa ser usada em outros arquivos
module.exports = { deleteOldBackups };
