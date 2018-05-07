let express = require('express');
let router = express.Router();
let transaction = require('../models/transaction');
let user = require("../models/user");

/* GET transactions listing. */
router.get('/', async (req, res, next) => {
    let token = req.param("token");
    if(token && await user.checkTokenAndPermission(token, "transaction", 1)){
        res.send(await transaction.listAll());
    }else{
        res.send(403);
    }
});


/* CREATE transaction. */
router.post('/', async (req, res, next) => {
    let token = req.param("token");
    let rawData = req.body;
    if(token && await user.checkTokenAndPermission(token, "transaction", 2)){
        let response = {}, fieldsMissing = [];
        response.success = false;
        if(!rawData.description){
            fieldsMissing.push("description");
        }
        if(!rawData.amount){
            fieldsMissing.push("amount");
        }
        if(!rawData.paymentType){
            fieldsMissing.push("paymentType");
        }
        if(fieldsMissing.length > 0){
            response.error = "The folowing fields are missing: " + fieldsMissing.toLocaleString();
        }else{
            const result = await transaction.create(rawData.description, rawData.amount, rawData.paymentType, user.getIdFromToken(token));
            if(result !== true){
                response.error = result;
            }else{
                response.success = true;
            }
        }
        res.json(response);
    }else{
        res.send(403);
    }
});


/* UPDATE transaction. */
router.patch('/', async (req, res, next) => {
    let token = req.param("token");
    let rawData = req.body;
    if(token && await user.checkTokenAndPermission(token, "transaction", 3)){
        let response = {}, fields = {};
        response.success = false;
        fields.description = rawData.description;
        fields.amount = rawData.amount;
        fields.paymentType = rawData.paymentType;
        if(!rawData.id){
            response.error = "The ID is missing";
        }else{
            const result = await transaction.update(fields, rawData.id);
            if(result !== true){
                response.error = result;
            }else{
                response.success = true;
            }
        }
        res.json(response);
    }else{
        res.send(403);
    }
});


/* DELETE transaction. */
router.delete('/', async (req, res, next) => {
    let token = req.param("token");
    let id = req.param("id");
    if(token && await user.checkTokenAndPermission(token, "transaction", 4)){
        let response = {};
        if(id){
            response.success = await transaction.delete(id);
        }else{
            response.success = false;
            response.error = "Missing fields";
        }
        res.send(response);
    }else{
        res.send(403);
    }
});




module.exports = router;
