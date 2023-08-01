
const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM connections`);
        return res.json({ "industries": results.rows })
    } catch (e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM industry WHERE code = $1`, [code])
        console.log(code);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find industry with code of ${id}`, 404)
        }
        const industry = results.rows[0]
        return res.json({ "industry": industry });
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        let code = slugify(name, { lower: true });
        const results = await db.query('INSERT INTO industry (name, description) VALUES ($1, $2) RETURNING code, name, description', [code, name]);
        return res.status(201).json({ industries: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})


router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM industry', [req.params.code])
        return res.send({ msg: "status: DELETED!" })
    } catch (e) {
        return next(e)
    }
})

module.exports = router;