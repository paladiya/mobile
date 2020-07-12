const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");

// googleRegister

router.post("/googleRegister", async (req, res) => {
  // const { error } = registerValidation(req.body)
  // if (error) {
  //   return res.status(400).json(error.details[0].message)
  // }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    const token = jwt.sign({ _id: emailExist._id }, process.env.JSON_SECRET);
    return res
      .header("authentication", token)
      .send({ status: 200, id: emailExist.id });
  }

  const salt = await bcrypt.genSalt(10);
  // const hashPass = await bcrypt.hash(req.body.gwt, salt)
  const hashPass = req.body.gwt;

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JSON_SECRET);
    return res.header("authentication", token).send({
      status: 200,
      id: savedUser.id,
    });
  } catch (error) {
    res.send({
      title: error,
      status: 403,
    });
  }
});

router.post("/verifyUser", async (req, res) => {
  try {
    const token = req.body.jwt;
    if (!token) {
      return res.status(422).json("Data missing");
    }
    const verified = jwt.verify(token, process.env.JSON_SECRET);
    if (verified) {
      User.findById(verified, (error, user) => {
        if (user) {
          user.password = undefined;
          res.send(user);
        } else {
          res.status(422).send(error);
        }
      });
    } else {
      res.status(422).send("User not verified");
    }
  } catch (error) {
    res.status(422).send(error);
  }
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(422).json(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(422).send({
      message: `${req.body.email} is already taken`,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
  });
  try {
    var savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.JSON_SECRET);
    res.status(200).send({ user: { ...savedUser, password: token } });
  } catch (error) {
    return res.status(422).send({
      message: error,
    });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(422).json(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(403).json("Incorrect username or password.");
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(403).json("Incorrect username or password.");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JSON_SECRET);
  user.password = undefined;
  user.date = undefined;
  user.jwt = token;
  console.log(user);
  return res.status(200).send({
    user,
    jwt: token,
  });
});

router.post("/updateProfile", async (req, res) => {
  const file = req.files.file;
  const userId = req.body.userId;
  let fileType = file.name.split(".").pop().toLowerCase();

  if (file && userId) {
    let newFileName = userId + "." + fileType;

    file.mv(`uploads/profile/${newFileName}`, async (err) => {
      if (err) {
        return res.status(403).json({ msg: err });
      }
      User.findByIdAndUpdate(
        { _id: userId },
        { profile: newFileName },
        (err, result) => {
          if (err) {
            return res.status(403).json({ msg: err });
          }
          return res
            .status(200)
            .json({ msg: "Updated successfully", profile: result.profile });
        }
      );
    });
  } else {
    return res.status(403).json({ msg: "something went wrong" });
  }
  console.log("updateProfile");
});

module.exports = router;
