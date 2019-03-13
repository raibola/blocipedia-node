const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signUp(req, res, next){
      res.render("users/signup");
    },

    create(req, res, next){
             let newUser = {
               username: req.body.username,
               email: req.body.email,
               password: req.body.password,
               passwordConfirmation: req.body.passwordConfirmation
             };
    
             userQueries.createUser(newUser, (err, user) => {
              const msg = {
                to: req.body.email,
                from: 'welcome@blocipedia.com',
                subject: 'Thanks for signing up with Blocipedia',
                text: 'Thanks for registering a free account today!',
                html: '<strong>Thanks for registering with Blocipedia</strong>',
              };
       
               if(err){
                 req.flash("error", err);
                 res.redirect("/users/signup");
               } else {
                   passport.authenticate("local")(req, res, () => {
                   req.flash("notice", "You've successfully signed up!");
                   sgMail.send(msg);
                   res.redirect("/");
                   })
               }
             });
           },
    signInForm(req, res, next){
            res.render("users/signin");
          },
    signIn(req, res, next){
            passport.authenticate("local")(req, res, function () {
              if(!req.user){
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/signin");
              } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
              }
            })
        },
    
    signOut(req, res, next){
            req.logout();
            req.flash("notice", "You've successfully signed out!");
            res.redirect("/");
          }
  }