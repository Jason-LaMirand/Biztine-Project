const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");




router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
        return res.json({ "companies": results.rows })
    } catch (e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code])
        console.log(code);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${id}`, 404)
        }
        const company = results.rows[0]
        return res.json({ "company": company });
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        let code = slugify(name, { lower: true });
        const results = await db.query('INSERT INTO companies (name, description) VALUES ($1, $2) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

router.put("/:code", async function (req, res, next) {
    try {
        let { name, description } = req.body;
        let code = req.params.code;

        const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);

        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({ "company": result.rows[0] });
        }
    }

    catch (err) {
        return next(err);
    }

});

router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM companies', [req.params.code])
        return res.send({ msg: "status: DELETED!" })
    } catch (e) {
        return next(e)
    }
})

module.exports = router;