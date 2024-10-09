require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const pass = process.env.db_pass;

const db = knex({
    client: "pg",
    connection: {
        host: "aws-0-us-east-1.pooler.supabase.com",
        port: 6543,
        user: "postgres.qdgbfjyqocepednnfora",
        password: pass,
        database: "postgres"
    }
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/block/:slot", (req, res) => {
    const { slot } = req.params;

    db.select("*")
        .from("blocks")
        .where({ slot: slot})
        .then((block) => {
            if (block.length) {
                res.json(block[0]);
            } else {
                res.status(400).json("block not found");
            }
        })
        .catch((error) => res.status(400).json("Error getting block"));
});

app.get("/blocks/top", (req, res) => {
    db.select("*")
        .from("blocks")
        .orderBy("slot", "desc") 
        .limit(10)               
        .then((blocks) => {
            res.status(200).json(blocks);
        })
        .catch((error) => {
            console.error("Error retrieving blocks:", error); 
            res.status(500).json({ message: "Internal Server Error" });
        });
});


app.get("/txSuccess/:slot", (req, res) => {
    const { slot } = req.params;

    db('transactions')
        .count('*')
        .where({ slot:slot, success: true })
        .then((count) => {
            res.json(count[0]);
        })
        .catch((error) => {
            res.status(400).json("Error getting success count");
        }
    );
})

app.get("/tx/:sign", (req, res) => {
    const { sign } = req.params;

    db.select("*")
        .from("transactions")
        .where({signature: sign})
        .then((tx) => {
            if (tx.length) {
                res.json(tx[0]);
            } else {
                res.status(400).json("tx not found");
            }
        })
        .catch((error) => res.status(400).json("Error getting transaction"));
})

app.get("/txs/:slot", (req, res) => {
    const { slot } = req.params;

    db.select("signature")
        .from("transactions")
        .where({slot: slot})
        .then((sign) => {
            if (sign.length) {
                res.json(sign);
            } else {
                res.status(400).json("signature not found");
            }
        })
        .catch((error) => res.status(400).json("Error getting signatures details"));
})


app.get("/", (req, res) => {
    res.send("success");
});

module.exports = app;