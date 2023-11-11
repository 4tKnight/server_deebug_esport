const express = require("express");
const Player = require("../models/player");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");


// register endpoint
router.post("/register", upload.single("image"), async (req, res) => {
  const { fullname, game_choice, reg_day, reg_month, reg_year, phone_no, email, ign, teamName, payment_method, payment_status } = req.body;

  // check for required fields
  if (!fullname || !phone_no || !email || !ign || !payment_method || !payment_status || !req.file || !reg_day || !reg_month || !reg_year || !game_choice) {
    return res.status(400).send({ status: "error", msg: "All fields should be filled" });
  }

  try {
    let found = await Player.findOne({ ign }).sort({timestamp: -1}).lean();

    if (found) 
      return res.status(400).send({status: "error", msg: "An account with this in game name already exists"});
    
    const timestamp = Date.now();

    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "images",
    });

    const player = new Player;
    player.fullname = fullname;
    player.phone_no = phone_no;
    player.ign = ign;
    player.email = email;
    player.teamName = teamName || "";
    player.img_url = result.secure_url;
    player.img_id = result.public_id;
    player.payment_method = payment_method;
    player.timestamp = timestamp;
    player.payment_status = payment_status;
    player.reg_day = reg_day;
    player.reg_month = reg_month;
    player.reg_year = reg_year;
    player.game_choice = game_choice;

    await player.save();

    return res.status(200).send({ status: "ok", msg: "Player created", player });
  } catch (e) {
    console.error(e);
    // something went wrong, let the program crash and restart on the server
    return res.status(500).send({ status: "error", msg: "some error occurred", error: e.message });
  }
});

// view registered players endpoint
router.post("/view_players", async (req, res) => {
  try {
    let registered_players = await Player.find({ }).lean();

    if (registered_players.lenght === 0) 
      return res.status(200).send({status: "success", msg: "no registered players at the moment", count: 0});
    
    return res.status(200).send({ status: "ok", msg: "success", registered_players, count: registered_players.lenght });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ status: "error", msg: "some error occurred", error: e.message });
  }
});

module.exports = router;