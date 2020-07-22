const mysql = require('mysql');

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const profiles = [
    { id: 1, name: 'Jhone Doue', email: 'company@demo.com', password:'NewPassword' },
    { id: 2, name: 'Digma', email: 'digma@gmail.com', password:'everLasting14324' },
    { id: 3, name: 'Leaf', email: 'leafens@gmail.com', password: 'Leaf25229' },
    { id: 4, name: 'Ciagyu', email: 'ciagyu@gmail.com', password: 'ciaGyu5229' },
    { id: 5, name: 'Kevin', email: 'kevin@hotmail.com', password: 'Kev1n14783' }
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome!');
})

app.get("/api/profiles", (req, res) => {
    return res.json(profiles);
});

app.get('/api/profiles/:id', (req, res) => {
    const profile = profiles.find( p => p.id === parseInt(req.params.id) );
    if (!profile) return res.status(404).send('ID not found.');
    return res.json(profile);
})

app.post('/api/profiles', (req, res) => {
    const {error} = validateProfile(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const profile = {
        id: profiles.length + 1,
        name: req.body.name
    };
    profiles.push(profile);
    return res.json(profile);
});

app.put('/api/profiles/:id', (req, res) => {
    const {error} = validateProfile(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const profile = profiles.find( p => p.id === parseInt(req.params.id) );
    if (!profile) return res.status(404).send('ID not found.');

    profile.name = req.body.name;
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
})

function validateProfile(profile) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(profile);
}