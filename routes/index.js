var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const upload = require('./multer')
const localstrategy = require('passport-local')
const postModel = require('./post')
passport.use(new localstrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', nav: false });
});

router.get('/profile', isloggedin,async function(req, res, next) {
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate("Posts")
  res.render('profile', { title: 'Express', user, nav: true });
});
router.get('/show/post', isloggedin,async function(req, res, next) {
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate("Posts")
  res.render('show', { title: 'Express', user, nav: true });
});

router.get('/feed', isloggedin,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  const Posts = await postModel.find(); 
  res.render('feed', { title: 'Express', user,Posts ,nav: true });
});

router.get('/createpost', isloggedin,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render('createpost', { title: 'Express', user, nav: true });
});


router.post('/fileupload', isloggedin,upload.single('image') ,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile')
});

router.post('/createpost', isloggedin, upload.single('postImage'), async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      Image: req.file.filename
    });
    user.Posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.error('Error creating post:', error);
    // Handle the error and respond accordingly
    res.status(500).send('Internal Server Error');
  }
});


router.route('/login')
  .get(function(req, res, next) {
    res.render('login',{ title: 'Express',nav:false });
  })
  .post(passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile'
  }));

router.post('/', function(req, res, next) {
  let data = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name
  });

  userModel.register(data, req.body.password, function(err, user) {
    if (err) {
      console.error('Error registering user:', err);
      return res.redirect('/');
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/profile');
    });
  });
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isloggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
