const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


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
          },
    
    show(req, res, next){
          res.render("users/show");
        },
    
    
    upgrade(req, res, next){
            const token = req.body.stripeToken;
            const charge = stripe.charges.create({
                amount: 15,
                currency: 'usd',
                description: 'Premium membership',
                source: token,
            });
            
           userQueries.upgrade(req, (err, result) => {
            let msg = {
              to: req.user.email,
              from: 'noreply@blocipedia.com',
              subject: 'Blocipedia Upgrade',
              text: 'Thanks for becoming a Premium Member! With Premium membership you can now create and access private wikis!'
            }
            
            if(err || result.id === undefined){
              req.flash("notice", "Your payment was unsuccessful");
			        res.redirect("/users/show");
            } else{
              req.flash("notice", "Your payment was successful, you are now a Premium Member!");
              sgMail.send(msg);
              res.redirect("/users/show", {...result});
            }
           })
            
        },
        
    downgrade(req, res, next){
      const token = req.body.stripeToken;
      const refund =  stripe.refunds.create({
        charge: 'ch_YWRQmPh5RBQSBzop9Bot',
        amount: 1500
      });

      userQueries.downgrade(req, (err, result) => {
        let msg = {
          to: req.user.email,
          from: 'noreply@blocipedia.com',
          subject: "Sorry to see you downgrade",
          text: "You've successfully downgraded your Premium membership to Standard membership"
        }
        if(err){
          req.flash("notice", "There was an error processing this request");
          res.redirect("users/show");
        } else{
          req.flash("notice", "Your account has been changed back to Standard Membership");
          sgMail.send(msg);
          res.redirect("users/show", {...result});
        }
      });
    }
  }