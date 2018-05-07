let express = require('express');
let router = express.Router();
let paymentType = require('../models/paymentType');
let user = require("../models/user");

/* GET transactions listing. */
router.get('/', async (req, res, next) => {
    let token = req.param("token");
    if(token && await user.checkTokenAndPermission(token, "transaction", 1)){
        res.send(await paymentType.listAll());
    }else{
        res.send(403);
    }
});


module.exports = router;
