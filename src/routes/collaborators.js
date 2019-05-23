const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:wikiId/collaborators/add", collaboratorController.addCollaborator);
router.post("/wikis/:wikiId/collaborators/:collaboratorId/destroy", collaboratorController.removeCollaborator);

module.exports = router;