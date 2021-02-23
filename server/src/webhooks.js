const Nylas = require('nylas');
const express = require('express');
const router = express.Router();

Nylas.config({
    clientId: 'dobey21wzxs80x955av1tsd6',
    clientSecret: '4uk1m5tlaitx3qc5e5qh8rtw3',
});

const webhookUpdateLog = (deltas) => {
    console.log("received a new update");
    console.log(deltas);

    try {
        const nylas = Nylas.with(process.env.NYLAS_ACCESS_TOKEN);
        nylas.events.find(deltas.object_data.id).then(event => console.log(event));
    } catch (err) {
        console.log('error with getting access to nylas with access token');
        console.error(err);
    }
}

router.get('/webhook', async (req, res) => {
        console.log("got to sending the challenge back!");
        res.send(req.query.challenge);
    }
);

router.post('/webhook', async (req, res) => {
        res.status(200).send({});
        const deltas = req.body.deltas[0];
        webhookUpdateLog(deltas);
    }
);

module.exports = router;
