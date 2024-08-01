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

    // Obtêm informações do usuário
    const { user, userErr } = await api.users.get()
        .then(r => ({ user: !r ? undefined : r, userErr: !r ? true : undefined }))
        .catch(err => ({ userErr: err }));

    // Caso não consiga obter os dados do usuário retorna erro
    if (userErr) return console.error('Erro ao inteirar sobre as informações do usuário:', { console: userErr })

    // Sincroniza o banco de dados
    await database.sync();

    // Exclui os dados antigos do banco de backups
    await deleteOldBackups();

    // intera sobre todos os apps do usuário
    for await (const app of user.applications) {

        try {

            // Define o application.id
            const application = await api.applications.get(app[0]);

            // Console que inicia o backup
            console.log(`\nBackup iniciado para a aplicação\nNome:${application.name}\nID:${application.id}`);

            // Aguarda um minuto antes da próxima requisição
            await delay(60000);

            // Obtenha o URL de backup da aplicação
            const backup = await application.backups.create().catch(e => { console.log(e); return false; })
            const backupUrl = backup?.url

            // Caso não haja uma URL de backup, ele pula para o próximo registro
            if (!backupUrl) {
                console.log(`Não há URL de backup disponível para a aplicação\nNome:${application.name}\nID:${application.id}\n------------------------------------------`);
                continue;
            }

            // Obtenha o buffer de backup da aplicação
            const backupFile = false //await application.backup.download().catch(e => { console.log(e); return false; })

            // Registra na database a url de backup do app
            await BackupUrl.create({
                appId: application.id,
                appName: application.name,
                appRam: application.ram,
                isWebsite: application.isWebsite(),
                cluster: application.cluster,
                backupURL: backupUrl,
                fileBuffer: backupFile
            }).then(() => {
                console.log(`O backup da aplicação foi concluido com sucesso!\nNome:${application.name}\nID:${application.id}\n------------------------------------------`);
            }).catch(() => []);

        } catch (error) {
            console.error('Erro ao inteirar sobre a aplicação', { id: application?.id, nome: application?.name, console: { error } }, '\n------------------------------------------');
            continue;
        }

    };

    return console.log('CronJob concluído com sucesso');

}

// Crie um CronJob para executar a função a cada minuto
console.log('App iniciado com sucesso!');
new CronJob('0 0 0 * * *', backupFiles, null, true, 'America/Sao_Paulo'); //' Segundo | Minuto | Hora | Dia do mês 1 á 31 | Mês | Dia da semana 0 á 6|'
backupFiles();