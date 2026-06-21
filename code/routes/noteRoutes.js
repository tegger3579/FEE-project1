import express from "express";

const router = express.Router();
import { notesController } from "../controller/notesController.js";

router.get("/", notesController.getNotes);
router.post("/", notesController.saveNote);

export const noteRoutes = router;
