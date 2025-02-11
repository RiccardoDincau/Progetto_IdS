const request = require("supertest");
const app = require("./app");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user.js');
const { user_level } = require("./models/enums");

//Token related to different users
let citizen_token;
let district_token;
let admin_token;

//Report and user' databases at the beginning
let userDB;
let reportsDB;

//Id of a random report
let rand_report;

jest.setTimeout(10000);
beforeAll(async () => {
    app.locals.db = await mongoose.connect(process.env.DB);

    userDB = await request(app).get('/api/users/');
    userDB = userDB.body;

    reportsDB = (await request(app).get('/api/reports/')).body;
    rand_report = reportsDB[0]._id;
});

let report_corretto_senza_immagine = {
    'title': 'Buca in strada',
    'content': "C'è una buca in strada oddio",
    'position': 'Piazza Duomo',
    'kind': 'report',
    'category': 'road',
    'state': 'active'
};

let report_contenuto_non_corretto = {
    'title': 'Buca in strada',
    'content': 'a' * 501,
    'position': 'Piazza Duomo',
    'kind': 'report',
    'category': 'road',
    'state': 'active'
};

let report_titolo_non_corretto = {
    'title': 'a' * 101,
    'content': 'Ciao a tutti',
    'position': 'Piazza Duomo',
    'kind': 'report',
    'category': 'road',
    'state': 'active'
}

let report_senza_un_campo = {
    'title': 'Buca in strada',
    'content': "C'è una buca in strada oddio",
    'kind': 'report',
    'category': 'road',
    'state': 'active'
}

let credentiali_corrette_comune = {
    'email': 'riccardo@gmail.com',
    'password': 'riccardo1'
}

let credenziali_corrette_cittadino = {
    'email': 'marco@gmail.com',
    'password': 'marco1'
}

let credenziali_corrette_amministratore = {
    'email': 'giacomo@gmail.com',
    'password': 'giacomo1'
}

let password_errata = {
    'email': 'marco@gmail.com',
    'password': 'marco2'
}

let account_inesistente = {
    'email': 'franco@gmail.com',
    'password': 'franco5'
}

let nuovo_account_cittadino = {
    'name': 'giuseppe',
    'email': 'giuseppe@gmail.com',
    'password': 'giuseppe2',
}

let nuovo_account_campo_vuoto = {
    'email': 'edoardo@gmail.com',
    'password': 'edoardo1',
}

let nuovo_account_comune = {
    'name': 'antonio',
    'email': 'antonio@gmail.com',
    'password': 'antonio1',
}

let account_email_esistente = {
    'name': 'ismael',
    'email': 'marco@gmail.com',
    'password': 'adjsa',
}


let account_campo_vuoto = {
    'email': 'marco@gmail.com'
}

let nuovo_commento = {
    'content': 'Grande segnalazione!'
}

let nuovo_account_comune_2 = {
    'name': 'giorgio',
    'email': 'giorgio@gmail.com',
    'password': 'giorgio1',
}

let nuovo_account_comune_3 = {
    'name': 'giovanni',
    'email': 'giovanni@gmail.com',
    'password': 'giovanni1',
}

test('App dovrebbe esser definito', () => {
    expect(app).toBeDefined();
});

//Testing RF1 
describe('Login', () => {
    test('RF1 test case 1', async () => {
        await request(app)
            .post('/api/authentication/')
            .send(credenziali_corrette_cittadino)
            .expect(200);

        let citizen_user;
        for (let el of userDB) {
            if (el.name == 'marco')
                citizen_user = el;
        }

        var citizen_payload = {
            email: 'marco@gmail.com',
            id: citizen_user._id,
            user_level: 'citizen',
        };

        citizen_token = jwt.sign(citizen_payload, process.env.SECRET, {});

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': citizen_token })
            .send({ 'state': 'archived' })
            .expect(403);

        await request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': citizen_token })
            .send({ 'liked': true });

        await request(app)
            .put('/api/reports/' + reportsDB[1]._id + '/votes')
            .set({ 'x-access-token': citizen_token })
            .send({ 'liked': true });

    });

    test('RF1 test case 1.1', async () => {
        await request(app)
            .post('/api/authentication/')
            .send(credentiali_corrette_comune)
            .expect(200);

        let district_user;
        for (let el of userDB) {
            if (el.name == 'riccardo')
                district_user = el;
        }

        var district_payload = {
            email: 'riccardo@gmail.com',
            id: district_user._id,
            user_level: 'district'
        }

        district_token = jwt.sign(district_payload, process.env.SECRET, {});

        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': district_token })
            .send(nuovo_commento);

        //Verifico che il token fornito sia effettivamente relativo ad un utente comune 
        //controllando se permette il cambiamento di stato
        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': district_token })
            .send({ 'state': 'archived' })
            .expect(200);

    });

    test('RF1 test case 1.2', async () => {
        await request(app)
            .post('/api/authentication/')
            .send(credenziali_corrette_amministratore)
            .expect(200);

        let admin_user;
        for (let el of userDB) {
            if (el.name == 'giacomo')
                admin_user = el;
        }

        var admin_payload = {
            email: 'giacomo@gmail.com',
            id: admin_user._id,
            user_level: 'admin'
        }

        admin_token = jwt.sign(admin_payload, process.env.SECRET, {});

        //Controllo se il token fornito sia relativo ad un utente amministratore
        //verificando che permetta la creazione di un nuovo account comune
        await request(app)
            .post('/api/district_user')
            .set({ 'x-access-token': admin_token })
            .send(nuovo_account_comune)
            .expect(201);

    });

    test('RF1 test case 2', async () => {
        await request(app)
            .post('/api/authentication/')
            .send(password_errata)
            .expect(400);
    });

    test('RF1 test case 3', () => {
        return request(app)
            .post('/api/authentication/')
            .send(account_inesistente).expect(404);
    })

    test('RF1 test case 4', () => {
        return request(app)
            .post('/api/authentication/')
            .send(account_campo_vuoto)
            .expect(400);
    });
})

//Testing RF2
describe('Registrazione', () => {
    test('RF2 test case 1', async () => {
        await request(app)
            .post('/api/users')
            .send(nuovo_account_cittadino)
            .expect(201);

        const new_users = await User
            .find({ 'email': nuovo_account_cittadino.email })
            .exec();
        expect(new_users.length).toBe(1);
    })

    test('RF2 test case 2', async () => {
        await request(app)
            .post('/api/users')
            .send(nuovo_account_campo_vuoto)
            .expect(400);

        const new_users = await User
            .find({ 'email': nuovo_account_campo_vuoto.email })
            .exec();
        expect(new_users.length).toBe(0);
    })

    test('RF2 test case 3', async () => {
        await request(app)
            .post('/api/users')
            .send(account_email_esistente)
            .expect(400);

        const new_users = await User
            .find({ 'email': account_email_esistente.email })
            .exec();
        expect(new_users.length).toBe(1);
    })
})

//Testing RF3
describe('Commento', () => {
    var initial_length;
    test('RF3 test case 1', async () => {
        initial_length = (await request(app).get('/api/reports/' + rand_report + '/comments'))
            .body
            .length;

        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': citizen_token })
            .send(nuovo_commento)
            .expect(201);

        let comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments')).body;

        await expect(comments.length).toBe(initial_length + 1);
        initial_length = initial_length + 1;

    })

    test('RF3 test case 1.1', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .send(nuovo_commento)
            .expect(400)

        let comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments')).body;

        await expect(comments.length).toBe(initial_length);
    })

    test('RF3 test case 1.2', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': district_token })
            .send(nuovo_commento)
            .expect(201);

        let comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments')).body;

        await expect(comments.length).toBe(initial_length + 1);
    })
})

//Testing RF4
describe('Votazione segnalazione', () => {
    var initial_length = 0;
    test('RF4 test case 1', async () => {
        let result = await request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': citizen_token })
            .send({ 'liked': true })
            .expect(200);

        await expect(result.body).toBe(initial_length + 1);
    });

    test('RF4 test case 1.1', async () => {
        let result = await request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': district_token })
            .expect(200);

        await expect(result.body).toBe(initial_length + 1);
    })

    test('RF4 test case 2', async () => {
        await request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .expect(400);
    })
})

//Testing RF6
describe('Creazione Segnalazione', () => {
    var initial_length;

    test('RF6 test case 1', async () => {
        initial_length = (await request(app).get('/api/reports')).body.length;

        await request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_corretto_senza_immagine)
            .expect(201);

        let result = (await request(app).get('/api/reports')).body.length;
        expect(result).toBe(initial_length + 1);
        initial_length = initial_length + 1;
    });

    test('RF6 test case 2', async () => {
        await request(app)
            .post('/api/reports/')
            .send(report_corretto_senza_immagine)
            .expect(400);

        let result = (await request(app).get('/api/reports')).body.length;
        expect(result).toBe(initial_length);
    });

    test('RF6 test case 3', async () => {
        await request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_contenuto_non_corretto)
            .expect(400);

        let result = (await request(app).get('/api/reports')).body.length;
        expect(result).toBe(initial_length);
    });

    test('RF6 test case 3.1', async () => {
        await request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_titolo_non_corretto)
            .expect(400);

        let result = (await request(app).get('/api/reports')).body.length;
        expect(result).toBe(initial_length);
    });

    test('RF6 test case 4', async () => {
        await request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_senza_un_campo)
            .expect(400);

        let result = (await request(app).get('/api/reports')).body.length;
        expect(result).toBe(initial_length);
    });
})

//Testing RF9 
describe('Cambio stato', () => {

    test('RF9 test case 1', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': district_token })
            .send(nuovo_commento)

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': district_token })
            .send({ 'state': 'archived' })
            .expect(200)
    })

    test('RF9 test case 1.1', async () => {

        let district_id = (await User.findOne({ 'name': 'antonio' }).exec())._id;
        let district_payload = {
            email: 'antonio@gmail.com',
            user_level: 'district',
            id: district_id
        }

        return request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': jwt.sign(district_payload, process.env.SECRET, {}) })
            .send({ 'state': 'archived' })
            .expect(403)
    })

    test('RF9 test case 1.2', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': citizen_token })
            .send(nuovo_commento)

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': citizen_token })
            .send({ 'state': 'work_in_progress' })
            .expect(403)
    })
})

//Testing RF10
describe('Notifica segnalazione', () => {
    test('RF10 test case 1', async () => {
        let user_id = (await User.findOne({ name: 'marco' }).exec())._id;
        let res = await request(app)
            .get('/api/users/' + user_id + '/notifications')
            .set({ 'x-access-token': citizen_token });
        expect(res.body.length).toBe(2);
    })

    let giuseppe_id;
    let giuseppe_token;

    test('RF10 test case 2', async () => {
        giuseppe_id = (await User.findOne({ name: 'giuseppe' }).exec())._id;
        let giuseppe_payload = {
            'id': giuseppe_id,
            'user_level': 'citizen',
            'email': 'giuseppe@gmail.com'
        };

        giuseppe_token = jwt.sign(giuseppe_payload, process.env.SECRET, {});
        let res = await request(app)
            .get('/api/users/' + giuseppe_id + '/notifications')
            .set({ 'x-access-token': giuseppe_token });
        expect(res.body.length).toBe(0);
    })

    test('RF10 test case 3', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/votest')
            .set({ 'x-access-token': giuseppe_token })
            .send({ 'liked': true });

        await request(app)
            .post('/api/reports/' + rand_report + '/votest')
            .set({ 'x-access-token': giuseppe_token })
            .send({ 'liked': false });

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': district_token })
            .send({ 'state': 'active' })

        let result = await request(app)
            .get('/api/users/' + giuseppe_id + '/notifications')
            .set({ 'x-access-token': giuseppe_token })

        expect(result.body.length).toBe(0);
    })
})

//Testing RF17
describe('Registrazione account comune', () => {
    test('RF17 test case 1', async () => {
        await request(app)
            .post('/api/district_user')
            .set({ 'x-access-token': admin_token })
            .send(nuovo_account_comune_2)
            .expect(201);

        return request(app)
            .post('/api/authentication')
            .send({
                'email': nuovo_account_comune_2.email,
                'password': nuovo_account_comune_2.password
            })
            .expect(200);
    })

    test('RF17 test case 1.1', async () => {
        return request(app)
            .post('/api/district_user')
            .set({ 'x-access-token': district_token })
            .send(nuovo_account_comune_3)
            .expect(403)
    })

    test('RF17 test case 1.2', async () => {
        return request(app)
            .post('/api/district_user')
            .set({ 'x-access-token': admin_token })
            .send(nuovo_account_comune_2)
            .expect(400)
    })
})

//Testing RF18
describe('Moderazione commenti e segnalazioni', () => {
    test('RF18 test case 1', async () => {
        let comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments'))
            .body;

        let prev_length = comments.length;
        await request(app)
            .delete('/api/reports/' + rand_report + '/comments/' + comments[0]._id)
            .set({ 'x-access-token': district_token })
            .expect(204);

        comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments')).body;

        return expect(comments.length).toBe(prev_length - 1);
    })

    test('RF18 test case 1.1', async () => {
        let reports = (await request(app)
            .get('/api/reports/'))
            .body;

        let prev_length = reports.length;
        await request(app)
            .delete('/api/reports/' + reports[1]._id)
            .set({ 'x-access-token': district_token })
            .expect(204);

        reports = (await request(app)
            .get('/api/reports/')).body;

        return expect(reports.length).toBe(prev_length - 1);
    })

    test('RF18 test case 2', async () => {
        let comments = (await request(app)
            .get('/api/reports/' + rand_report + '/comments'))
            .body;

        return request(app)
            .delete('/api/reports/' + rand_report + '/comments/' + comments[0]._id)
            .set({ 'x-access-token': citizen_token })
            .expect(403);
    })

    test('RF18 test case 2.1', async () => {
        return request(app)
            .delete('/api/reports/' + rand_report)
            .set({ 'x-access-token': citizen_token })
            .expect(403);
    })
})