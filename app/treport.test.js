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
let userDB;

//Id of a random report
let rand_report;

jest.setTimeout(10000);
beforeAll(async () => {
    app.locals.db = await mongoose.connect(process.env.DB);

    userDB = await request(app).get('/api/users/');
    userDB = userDB.body;

    let reports = await request(app).get('/api/reports/');
    reports = reports.body;
    rand_report = reports[0]._id;

    
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
    'user_level': 'citizen'
}

let nuovo_account_campo_vuoto = {
    'email': 'edoardo@gmail.com',
    'password': 'edoardo1',
    'user_level': 'citizen'
}

let nuovo_account_comune = {
    'name': 'antonio',
    'email': 'antonio@gmail.com',
    'password': 'antonio',
    'user_level': 'district'
}

let account_email_esistente = {
    'name': 'ismael',
    'email': 'marco@gmail.com',
    'password': 'adjsa',
    'user_level': 'citizen'
}


let account_campo_vuoto = {
    'email': 'marco@gmail.com'
}

let nuovo_commento = {
    'content': 'Grande segnalazione!'
}

test('App dovrebbe esser definito', () => {
    expect(app).toBeDefined();
});

//Testing RF3 
describe('Login', () => {
    test('RF3 test case 1', async () => {
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

    });

    test('RF3 test case 1.1', async () => {
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
        
        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': district_token })
            .send({ 'state': 'archived' })
            .expect(200);

    });

    test('RF3 test case 1.2', async () => {
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

        await request(app)
            .post('/api/district_user')
            .set({ 'x-access-token': admin_token })
            .send(nuovo_account_comune)
            .expect(201);

    });

    test('RF3 test case 2', () => {
        return request(app)
            .post('/api/authentication/')
            .send(password_errata)
            .expect(400);
    });

    test('RF3 test case 3', () => {
        return request(app)
            .post('/api/authentication/')
            .send(account_inesistente).expect(404);
    })

    test('RF3 test case 4', () => {
        return request(app)
            .post('/api/authentication/')
            .send(account_campo_vuoto)
            .expect(400);
    });
})

//Testing RF4
describe('Registrazione', () => {
    test('RF4 test case 1', () => {
        return request(app)
            .post('/api/users')
            .send(nuovo_account_cittadino)
            .expect(201)
    })

    test('RF4 test case 2', () => {
        return request(app)
            .post('/api/users')
            .send(nuovo_account_campo_vuoto)
            .expect(400)
    })

    test('RF4 test case 3', () => {
        return request(app)
            .post('/api/users')
            .send(account_email_esistente)
            .expect(400)
    })
})

//Testing RF5
describe('Commento', () => {
    test('RF5 test case 1', () => {
        return request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': citizen_token })
            .send(nuovo_commento)
            .expect(201)
    })

    test('RF5 test case 1.1', () => {
        return request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .send(nuovo_commento)
            .expect(400)
    })

    test('RF5 test case 1.2', () => {
        return request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': district_token })
            .send(nuovo_commento)
            .expect(201)
    })
})

//Testing RF6
describe('Votazione segnalazione', () => {
    test('RF6 test case 1', () => {
        return request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': citizen_token })
            .expect(200);
    });

    test('RF6 test case 1.1', () => {
        return request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': district_token })
            .expect(200);
    })

    test('RF6 test case 2', () => {
        return request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .expect(400);
    })
})

//Testing RF8
describe('Creazione Segnalazione', () => {
    test('RF8 test case 1', () => {
        return request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_corretto_senza_immagine)
            .expect(201);
    });

    test('RF8 test case 2', () => {
        return request(app)
            .post('/api/reports/')
            .send(report_corretto_senza_immagine)
            .expect(400);
    });

    test('RF8 test case 3', () => {
        return request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_contenuto_non_corretto)
            .expect(400);
    });

    test('RF8 test case 3.1', () => {
        return request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_titolo_non_corretto)
            .expect(400);
    });

    test('RF8 test case 4', () => {
        return request(app)
            .post('/api/reports/')
            .set({ 'x-access-token': citizen_token })
            .send(report_senza_un_campo)
            .expect(400);
    });
})

//Testing RF11 
describe('Cambio stato', () => {
    
    test('RF11 test case 1', async () => {
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
    
    test('RF11 test case 1.1', async () => {

        let district_id = (await User.findOne({'name' : 'antonio'}).exec())._id;
        let district_payload = {
            email : 'antonio@gmail.com',
            user_level : 'district',
            id : district_id
        }

        return request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': jwt.sign(district_payload, process.env.SECRET, {}) })
            .send({ 'state': 'archived' })
            .expect(403)
    })

    test('RF11 test case 1.2', async () => {
        await request(app)
            .post('/api/reports/' + rand_report + '/comments')
            .set({ 'x-access-token': citizen_token })
            .send(nuovo_commento)

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({ 'x-access-token': citizen_token })
            .send({ 'state': 'archived' })
            .expect(403)
    })
})

//Testing RF12
describe('Notifica segnalazione', () => {
    test('RF12 test case 1')
})



