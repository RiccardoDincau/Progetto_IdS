const request = require("supertest");
const app = require("./app");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//Token related to different users
let citizen_token;
let district_token;
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

let password_errata = {
    'email': 'marco@gmail.com',
    'password': 'marco2'
}

let account_inesistente = {
    'email': 'giuseppe@gmail.com',
    'password': 'giuseppe2'
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
            .set({'x-access-token' : citizen_token})
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
            user_level: 'admin'
        }

        district_token = jwt.sign(district_payload, process.env.SECRET, {});

        await request(app)
            .put('/api/reports/' + rand_report)
            .set({'x-access-token' : district_token})
            .send({ 'state': 'archived' })
            .expect(200);

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
            .send(account_inesistente)
            .expect(404);
    })
})

//Testing RF5
describe('Votazione segnalazione', () => {
    test('RF5 test case 1', () => {
        return request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': citizen_token })
            .expect(200);
    });

    test('RF5 test case 1.1', () => {
        return request(app)
            .put('/api/reports/' + rand_report + '/votes')
            .set({ 'x-access-token': district_token })
            .expect(200);
    })

    test('RF5 test case 2', () => {
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



