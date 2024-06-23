import express from "express";

const router = express.Router();
//GET all post
router.get("/");

//GET post by id
router.get("/:id");

//POST Create post
router.post("/");

//PUT Update post
router.put("/:id");

//Delete Post
router.delete("/:id");

export default router;
