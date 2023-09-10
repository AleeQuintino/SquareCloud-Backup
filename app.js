const config = require('./config.json');
const database = require('./db/database');
const { CronJob } = require('cron');
const { BackupUrl } = require('./db/schemas/backupUrl');
const { SquareCloudAPI } = require('@squarecloud/api');
const { deleteOldBackups } = require('./utils/backup');
const api = new SquareCloudAPI(config.square_token);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Crie uma função assíncrona para baixar e salvar arquivos para cada aplicação do usuário
const backupFiles = async () => {
    try {
        // Sincroniza o banco de dados
        await database.sync();

        // Exclua os dados antigos do banco de backups
        await deleteOldBackups();

        // Obtenha informações do usuário
        const user = await api.users.get();

        // intera sobre todos os apps do usuário
        for await (const app of user.applications) {

            // Define o application.id
            const application = app[1];

            // Console que inicia o backup
            console.log(`Backup iniciado para a aplicação\nNome:${application.tag}\nID:${application.id}`);

            // Aguarda um minuto antes da próxima requisição
            await delay(60000);

            // Obtenha o URL de backup da aplicação
            const backupUrl = await application.backupURL()
                .catch(e => {
                    console.log(e);
                    return false;
                })

            // Caso não haja uma URL de backup, ele pula para o próximo registro
            if (!backupUrl) {
                console.log(`Não há URL de backup disponível para a aplicação\nNome:${application.tag}\nID:${application.id}`);
                continue;
            }

            // Atualiza a URL de download
            const fileUrl = backupUrl.replace(
                'https://squarecloud.app/dashboard/backup/',
                'https://registry.squarecloud.app/v1/backup/download/'
            );

            // Registra na database a url de backup do app
            await BackupUrl.create({
                appId: application.id,
                appName: application.tag,
                appRam: application.ram,
                isWebsite: application.isWebsite,
                cluster: application.cluster,
                backupURL: fileUrl
            }).then(() => {
                console.log(`O backup da aplicação foi concluido com sucesso!\nNome:${application.tag}\nID:${application.id}`);
            }).catch(() => []);

        };

        return console.log('CronJob concluído com sucesso');

    } catch (err) {
        return console.error('Erro no CronJob:', err);
    }

}

// Crie um CronJob para executar a função a cada minuto
console.log('App iniciado com sucesso!');
new CronJob('0 0 0 * * *', backupFiles, null, true, 'America/Sao_Paulo'); //' Segundo | Minuto | Hora | Dia do mês 1 á 31 | Mês | Dia da semana 0 á 6|'
backupFiles();