require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Database } = require("arangojs");
const pass = process.env.db_pass;

const db = new Database ({
    url: "http://127.0.0.1:8529",
    databaseName: "solana",
    auth: { username: 'root' , password: pass},
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("success");
});

// get the block by slot number
app.get("/block/:slot", (req, res) => {
    const { slot } = req.params;

    db.query({
        query: `FOR block IN @@c FILTER block.slot ==${slot} RETURN block`,
        bindVars: { 
            "@c": 'blocks',
        },
    })
    .then(cursor => {
        return cursor.all();
    })
    .then(blocks => {
        if (blocks.length) {
            res.status(200).json(blocks[0]); 
        } else {
            res.status(404).json({ message: "Block not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving block:", error); 
        res.status(500).json({ message: "Internal Server Error" }); 
    });
})

app.get("/blocks/top", (req, res) => {
    db.query({
        query: "FOR block IN @@c SORT block.slot DESC LIMIT 10 RETURN block",
        bindVars: { "@c": "blocks"}
    })
    .then(cursor => cursor.all())
    .then(blocks => {
        res.status(200).json(blocks);
    })
    .catch(error => {
        console.error("Error retrieving blocks:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    });
});


// get the recent slot 
app.get("/recent", (req, res) => {
    db.query({
        query: "RETURN MAX((FOR doc IN @@c RETURN doc.slot))",
        bindVars: { "@c": "blocks"}
    })
    .then(cursor => {
        return cursor.all();
    })
    .then(slot => {
        if (slot.length) {
            res.status(200).json(slot[0]); 
        } else {
            res.status(404).json({ message: "Block not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving block:", error); 
        res.status(500).json({ message: "Internal Server Error" }); 
    });
})

// get transactions of the slot
app.get("/txs/:slot", (req, res) => {
    const { slot } = req.params;

    db.query({
        query: `FOR tx IN @@c FILTER tx.slot == ${slot} RETURN tx.signature`,
        bindVars: { 
            "@c": 'transactions',
        },
    })
    .then((cursor) => {
        return cursor.all();
    })
    .then((tx) => {
        if(tx.length) {
            res.status(200).json({"length ": tx.length,"transactions": tx})
        } else {
            res.status(404).json({ message: "Block not found not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving transactions:", error); 
        res.status(500).json({ message: "Internal Server Error" }); 
    });
})

app.get("/txSuccess/:slot", (req, res) => {
    const { slot } = req.params;

    db.query({
        query: `FOR tx IN @@c FILTER tx.slot == ${slot} AND tx.success == true RETURN tx.signature`,
        bindVars: { 
            "@c": 'transactions',
        },
    })
    .then((cursor) => {
        return cursor.all();
    })
    .then((tx) => {
        if(tx.length) {
            res.status(200).json({"length": tx.length,"transactions": tx})
        } else {
            res.status(404).json({ message: "Block not found not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving transactions:", error); 
        res.status(500).json({ message: "Internal Server Error" }); 
    });
})

// get the transaction details by signature
app.get("/tx/:sign", (req, res) => {
    const { sign } = req.params;

    db.query({
        query: `FOR tx IN @@c FILTER tx.signature=="${sign}" RETURN tx`,
        bindVars: {
            "@c": "transactions"
        }
    })
    .then((cursor) => {
        return cursor.all();
    })
    .then((tx) => {
        if(tx.length) {
            res.status(200).json(tx[0])
        } else {
            res.status(404).json({ message: "Transaction not found not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving transactions:", error); 
        res.status(500).json({ message: "Internal Server Error" }); 
    });
})

app.listen(3000, () => {
    console.log("app is running on port 3000");
});