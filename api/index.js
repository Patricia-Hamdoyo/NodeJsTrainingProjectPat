const mysql = require('mysql');

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const profiles = [
    { id: 1, fullname: 'Jhone Doue', username: 'Jhone Doue', email: 'company@demo.com', password:'NewPassword' },
    { id: 2, fullname: 'Paradigma', username: 'Digma', email: 'digma@gmail.com', password:'everLasting14324' },
    { id: 3, fullname: 'Leafens', username: 'Leaf', email: 'leafens@gmail.com', password: 'Leaf25229' },
    { id: 4, fullname: 'Cia Gyu', username: 'Ciagyu', email: 'ciagyu@gmail.com', password: 'ciaGyu5229' },
    { id: 5, fullname: 'Kevin HA', username: 'Kevin', email: 'kevin@hotmail.com', password: 'Kev1n14783' }
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.get("/api/profiles", (req, res) => {
    return res.json(profiles);
});

app.get("/api/profiles/:email_or_username/:password", (req, res) => {
    console.log("\nNew Incoming Login HTTP Request");

    http_email_or_username = req.params.email_or_username;
    http_password = req.params.password;

    //cari user yg sesuai sm yg dikirim
    const profile = profiles.find(p => ((p.email === http_email_or_username && p.password === http_password) || (p.username === http_email_or_username && p.password === http_password)));
    console.log("\nDone matching data");
    if (!profile){
        // alert('Invalid login. Please try again.');
        return res.status(404).json('Invalid login. Please try again.');
    }

    console.log("Finish Process");
    return res.json(profile);
});

app.get('/api/profiles/:id', (req, res) => {
    const profile = profiles.find( p => p.id === parseInt(req.params.id) );
    if (!profile) return res.status(404).send('ID not found.');
    return res.json(profile);
});

app.post('/api/profiles', (req, res) => {
    const {error} = validateProfile(req.body);
    if (error) {
        return res.status(400).send(error); //error.details[0].message (pas terakhir aja)
    }

    const profile = {
        id: profiles.length + 1,
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    // console.log("\nNew Incoming Register HTTP Request");

    //cari username/email biar ga double
    const profile2 = profiles.find(p => (p.email === req.body.email || p.username === req.body.username));
    console.log("\nDone matching data");
    if (profile2){
        // alert('Invalid login. Please try again.');
        return res.status(404).json('Invalid register. Email or Username had been used by another account. Please try again.');
    } else{
        profiles.push(profile);
        return res.json(profile);
    }
});

app.put('/api/profiles/:id', (req, res) => {
    const {error} = validateProfile(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const profile = profiles.find( p => p.id === parseInt(req.params.id) );
    if (!profile) return res.status(404).send('ID not found.');

    profile.fullname = req.body.fullname;
    profile.username = req.body.username;
    profile.email = req.body.email;
    profile.password = req.body.password;
    return res.json(profile);
});

app.delete('/api/profiles/:id', (req, res) => {
    const profile = profiles.find( p => p.id === parseInt(req.params.id) );
    if (!profile) return res.status(404).send('ID not found.');

    const index = profiles.indexOf(profile);
    profiles.splice(index, 1);
    return res.json(profile);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function validateProfile(profile) {
    const schema = Joi.object({
        fullname: Joi.string().min(3).required(),
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(profile);
}