const cors = require('cors');
const express = require('express');
const Session = require('express-session');
const ethers = require('ethers');

const { generateNonce, SiweMessage} = require('siwe');


const app = express()
const path = require('path');


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.use(Session({
    name: 'siwe-quickstart',
    secret: "siwe-quickstart-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true }
}));

app.get('/nonce', async function (req, res) {
    req.session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(req.session.nonce);
});

app.post('/verify', async function (req, res) {
    try {
        if (!req.body.message) {
            res.status(422).json({ message: 'Expected prepareMessage object as body.' });
            return;
        }

        let message = new SiweMessage(req.body.message);
        const fields = await message.validate(req.body.signature);
        if (fields.nonce !== req.session.nonce) {
            console.log(req.session);
            res.status(422).json({
                message: `Invalid nonce.`,
            });
            return;
        }
        req.session.siwe = fields;
        req.session.cookie.expires = new Date(fields.expirationTime);
        req.session.save(() => res.status(200).end());
    } catch (e) {
        req.session.siwe = null;
        req.session.nonce = null;
        console.error(e);
        switch (e) {
            case ErrorTypes.EXPIRED_MESSAGE: {
                req.session.save(() => res.status(440).json({ message: e.message }));
                break;
            }
            case ErrorTypes.INVALID_SIGNATURE: {
                req.session.save(() => res.status(422).json({ message: e.message }));
                break;
            }
            default: {
                req.session.save(() => res.status(500).json({ message: e.message }));
                break;
            }
        }
    }
});


app.get('/test', function (req, res) {
    console.log("hello");
    console.log(req);
    res.send("hello world");
});


app.get('/personal_information', function (req, res) {
    if (!req.session.siwe) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }
    console.log("User is authenticated!");
    res.setHeader('Content-Type', 'text/plain');
    res.send(`You are authenticated and your address is: ${req.session.siwe.address}`);
});

app.get('/auth', function (req, res) {
    if (!req.session.siwe) {
        res.status(401).json({ message: 'You have to first sign_in' });
        return;
    }
    if (ethers.utils.getAddress(req.session.siwe.address) !== ethers.utils.getAddress('0x4E05e811C428e3ee03A7D4F40A99Fd4D1baF3caE')) {
        res.status(401).json({ message: 'Auth failed' });
        return;
    }
    console.log("User is authenticated!");
    res.setHeader('Content-Type', 'text/plain');
    res.send(`You are authenticated and your address is: ${req.session.siwe.address}`);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(3005);
/*
const express = require("express")
const app = express()
const path = require('path');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blogdb.sqlite');

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", function(req, res) {
    db.serialize(function () {
        db.all("SELECT * FROM posts", function(err, rows) {
            console.log(err);
            res.send(rows)
        });
    });
})


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
  
app.listen(3000, () => {
    console.log("app listening on port 3000")
})
*/