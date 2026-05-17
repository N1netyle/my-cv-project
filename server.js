const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Mailjet = require('node-mailjet');
require('dotenv').config();

const init = async () => {
    try {
        const server = Hapi.server({
            port: 3000,
            host: 'localhost'
        });

        await server.register(Inert);

        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: 'public',
                    index: ['index.html']
                }
            }
        });

        server.route({
            method: 'POST',
            path: '/api/contact',
            handler: async (request, h) => {
                const { name, email, subject, message } = request.payload;

                if (!name || !email || !subject || !message) {
                    return h.response('<h1>Помилка: Всі поля форми мають бути заповнені!</h1><a href="/">Назад</a>').code(400);
                }

                if (!email.includes('@')) {
                    return h.response('<h1>Помилка: Некоректний формат електронної пошти!</h1><a href="/">Назад</a>').code(400);
                }

                // ПРАВИЛЬНЫЙ СПОСОБ ПОДКЛЮЧЕНИЯ ДЛЯ ВЕРСИИ 3.1
                const mailjet = new Mailjet({
                    apiKey: process.env.MJ_APIKEY_PUBLIC,
                    apiSecret: process.env.MJ_APIKEY_PRIVATE
                });

                try {
                    await mailjet.post('send', { version: 'v3.1' }).request({
                        Messages: [
                            {
                                From: {
                                    Email: process.env.RECEIVER_EMAIL, 
                                    Name: "Node.js Сервер Романа"
                                },
                                To: [
                                    {
                                        Email: process.env.RECEIVER_EMAIL,
                                        Name: "Роман Капиніс"
                                    }
                                ],
                                Subject: `Лабораторна 6 (Варіант 11): ${subject}`,
                                TextPart: `Від: ${name} (${email})\n\nПовідомлення:\n${message}`
                            }
                        ]
                    });

                    console.log("Лист успішно надіслано через Mailjet API!");
                    return h.response('<h1>Успіх! Лист надіслано Роману через Mailjet API.</h1><a href="/">Назад</a>').code(200);

                } catch (error) {
                    console.error("=== ОШИБКА MAILJET ===");
                    console.error(error.statusCode, error.message);
                    return h.response(`<h1>Помилка Mailjet API: ${error.message} (Status: ${error.statusCode})</h1><a href="/">Назад</a>`).code(500);
                }
            }
        });

        await server.start();
        console.log('=== УСПІХ ===');
        console.log('Робочий сервер hapi успішно запущено на %s', server.info.uri);

    } catch (startError) {
        console.log('=== КРИТИЧНА ПОМИЛКА ЗАПУСКУ ===');
        console.error(startError);
        process.exit(1);
    }
};

init();