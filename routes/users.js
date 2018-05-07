let express = require('express');
let router = express.Router();
let user = require('../models/user');

/* GET users listing. */

router.get('/auth', async (req, res, next) => {
  let username = req.param("username");
  let password = req.param("password");
  if(username !== undefined && password !== undefined){
      res.send(await user.authenticate(username, password));
  }else{
      res.send(403);
  }
});

router.get('/info', async (req, res, next) => {
    let token = req.param("token");
    if(token !== undefined){
        res.send(await user.userInfo(token));
    }else{
        res.send(403);
    }
});


module.exports = router;
