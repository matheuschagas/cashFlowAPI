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

module.exports = router;
