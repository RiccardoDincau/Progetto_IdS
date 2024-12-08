const app = require("../app/app.js");
const mongoose = require("mongoose");

const User = require("../app/models/user.js");
const Report = require("../app/models/report.js");

const PORT = process.env.PORT;
const DB = process.env.DB;

mongoose
    .connect(DB)
    .then(async () => {
        let users_id = {};
        const test_users = [
            make_user("riccardo", "riccardo@gmail.com", "riccardo1", "admin"),
            make_user("marco", "marco@gmail.com", "marco1", "citizen"),
            make_user("tommaso", "tommaso@gmail.com", "tommaso1", "admin"),
        ];

        await User.deleteMany({}).then(async () => {
            test_users.forEach(async (u) => {
                var new_user = new User(u);
                console.log("New user:", new_user);
                users_id[new_user.name] = new_user._id;
                console.log(users_id);
                await new_user.save();
            });
        });

        const test_reports = [
            make_report(
                "Cestino pieno in Piazza Duomo",
                "Un cestino stradale vicino a Piazza Duomo è stracolmo, causando disagi e sporcizia nell'area. Sarebbe opportuno svuotarlo al più presto per evitare ulteriori accumuli di rifiuti.",
                "marco",
                "Piazza Duomo",
                "complaint",
                "trash",
                "archived",
                users_id
            ),

            make_report(
                "Marciapiede dissestato in Via Manci",
                "Il marciapiede in Via Manci presenta crepe e avvallamenti pericolosi per i pedoni, in particolare per anziani e disabili. Un intervento è necessario per prevenire possibili incidenti.",
                "riccardo",
                "Via Manci",
                "report",
                "road",
                "work_in_progress",
                users_id

            ),

            make_report(
                "Lampione spento in Via dei Giardini",
                "Un lampione in Via dei Giardini è spento da diversi giorni, rendendo l'area poco sicura nelle ore serali. Si consiglia una riparazione urgente per garantire la sicurezza dei residenti.",
                "tommaso",
                "Via dei Giardini",
                "suggestion",
                "lights",
                "active",
                users_id
            ),

            make_report(
                "Schiamazzi notturni in Piazza Venezia",
                "Schiamazzi continui disturbano i residenti nelle ore notturne presso il parco vicino a Piazza Venezia. Sarebbe utile un maggiore controllo per ripristinare il rispetto del silenzio.",
                "marco",
                "Parco di Piazza Venezia",
                "complaint",
                "trash",
                "archived",
                users_id
            ),

            make_report(
                "Auto in divieto in Corso Tre Novembre",
                "Un'auto è parcheggiata in divieto di sosta lungo Corso Tre Novembre, causando intralcio al traffico e disagi ai pedoni. Si richiede un intervento immediato.",
                "riccardo",
                "Corso Tre Novembre",
                "complaint",
                "road",
                "active",
                users_id
            ),

            make_report(
                "Graffiti in Via Verdi",
                "In Via Verdi sono comparsi graffiti offensivi su un muro di proprietà pubblica. La rimozione rapida è necessaria per mantenere il decoro urbano e rispettare i residenti.",
                "tommaso",
                "Via Verdi",
                "report",
                "trash",
                "work_in_progress",
                users_id
            ),

            make_report(
                "Rifiuti abbandonati in Via Brennero",
                "Cumuli di rifiuti abbandonati lungo Via Brennero stanno attirando animali e generando cattivi odori. Un intervento di pulizia è urgente per ripristinare le condizioni igieniche dell'area.",
                "marco",
                "Via Brennero",
                "complaint",
                "trash",
                "work_in_progress",
                users_id
            ),

            make_report(
                "Segnaletica sbiadita in Viale Verona",
                "La segnaletica orizzontale in Viale Verona è quasi completamente sbiadita, causando confusione agli automobilisti. Una nuova verniciatura è necessaria per migliorare la sicurezza stradale.",
                "riccardo",
                "Viale Verona",
                "report",
                "road",
                "active",
                users_id
            ),

            make_report(
                "Illuminazione carente in Piazza Dante",
                "L'illuminazione in Piazza Dante è insufficiente, specialmente nelle ore notturne. Questo rende la zona poco sicura per i pedoni. Si richiede l'installazione di nuovi punti luce.",
                "tommaso",
                "Piazza Dante",
                "suggestion",
                "lights",
                "archived",
                users_id
            ),

            make_report(
                "Strada dissestata in Via del Brennero",
                "Buche e avvallamenti lungo Via del Brennero stanno rendendo il transito difficoltoso e pericoloso. È necessario un intervento di manutenzione urgente.",
                "marco",
                "Via del Brennero",
                "report",
                "road",
                "work_in_progress",
                users_id
            ),

            make_report(
                "Cestino mancante in Parco Santa Chiara",
                "Nel Parco Santa Chiara manca un cestino vicino all'area giochi, causando accumuli di rifiuti abbandonati. Sarebbe utile installarne uno per mantenere l'area pulita.",
                "riccardo",
                "Parco Santa Chiara",
                "suggestion",
                "trash",
                "active",
                users_id
            ),

            make_report(
                "Lampioni guasti in Via Bolghera",
                "Diversi lampioni lungo Via Bolghera sono guasti, lasciando la strada al buio. Si richiede un controllo generale e la sostituzione delle lampadine.",
                "tommaso",
                "Via Bolghera",
                "report",
                "lights",
                "archived",
                users_id
            ),

            make_report(
                "Rumori molesti in Piazza Fiera",
                "Durante le ore serali, si registrano rumori molesti provenienti dai locali in Piazza Fiera. I residenti chiedono maggiori controlli per limitare il disturbo.",
                "marco",
                "Piazza Fiera",
                "complaint",
                "trash",
                "work_in_progress",
                users_id
            ),

            make_report(
                "Strada bloccata in Via Romagnosi",
                "Un tratto di Via Romagnosi è bloccato da lavori non segnalati, creando caos nel traffico. Una migliore segnaletica è necessaria per evitare disagi.",
                "riccardo",
                "Via Romagnosi",
                "report",
                "road",
                "active",
                users_id
            ),

            make_report(
                "Illuminazione intermittente in Via Perini",
                "Le luci in Via Perini si accendono e si spengono a intermittenza, creando disagio e insicurezza. Si richiede una verifica degli impianti per risolvere il problema.",
                "tommaso",
                "Via Perini",
                "suggestion",
                "lights",
                "work_in_progress",
                users_id
            ),

            make_report(
                "Rifiuti accumulati in Via Venezia",
                "Rifiuti non raccolti si stanno accumulando lungo Via Venezia, causando un evidente disagio ai residenti. Si richiede un intervento immediato per la raccolta.",
                "marco",
                "Via Venezia",
                "complaint",
                "trash",
                "active",
                users_id
            ),

            make_report(
                "Buche pericolose in Via Crosina Sartori",
                "Via Crosina Sartori presenta numerose buche di grandi dimensioni, che rappresentano un rischio per le auto e i pedoni. Un intervento tempestivo è indispensabile.",
                "riccardo",
                "Via Crosina Sartori",
                "report",
                "road",
                "archived",
                users_id
            ),
        ];

        await Report.deleteMany({}).then(async () => {
            test_reports.forEach(async (r) => {
                var new_reports = new Report(r);
                await new_reports.save();
            });
        });

        console.log("Setup completed!");
        return;
    })
    .catch(() => {
        console.error("Database connection error");
    });

function make_user(name, email, password, user_level) {
    return { name, email, password, user_level };
}

function make_report(
    title,
    content,
    user,
    position,
    kind,
    category,
    state,
    users_id
) {
    // let id = await nameToId(user);
    let id = users_id[user];
    console.log("name:", user, ", id:", id);
    return {
        title,
        content,
        user: id,
        position,
        kind,
        category,
        state,
    };
}

// function nameToId(name) {
// let user = await User.find({ name }).exec();
// console.log("name:", name, "user:", user);
// return user[0]._id;
// }
