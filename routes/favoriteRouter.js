const express = require("express");
const favoriteRouter = express.Router();
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const user = require("../models/user");

/* ------------------------FAVORITEROUTER ----------------------------*/
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
    res.sendStatus(200)
  )
  .get(cors.cors, (req, res, next) => {
    favorite
      .find({ user: req.user._id })
      .populate("user")
      .populate("campsite")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    favorite
      .findone({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.foreach((campsite) => {
            if (!favorite.campsites.includes(campsite._id)) {
              favorite.campsites.push(campsite._Id);
            } else {
              console.log(`Campsite ${campsite._id} is already a favorite!`);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user, campsite: req.body })
            .then((favorite) => {
              console.log(`Favorite created`, favortie);
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })

      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorite");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        favorite
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => next(err));
      } else {
        res.json(favorite);
      }
    });
  });
/*-------------------------------------------------------------------------------"/:campsiteId"-------------------------------------------------------*/

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId);
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end(
      `GET operation not supported on /favorite/${req.params.campsiteId}`
    );
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorite.findone({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        if (!favorite.campsites.includes(req.params.campsiteId)) {
          favorite.campsites.push(req.params.campsiteId);

          favorite
            .save()
            .then((favorite) => { 
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.json(`This campsite is already a favorite!`);
        }
      } else {
        res.json(favorite);
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /favorite/${req.params.campsiteId}`
    );
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index > -1) {
            favorite.campsites.splice(index, 1);
          }
          favorite
            .save()
            .then((favorite) => {
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.json(favorite);
        }
      })
      .catch((err) => next(err));
  });
module.exports = favoriteRouter;
