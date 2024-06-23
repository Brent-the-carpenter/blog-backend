import router from "./postRoute";
// GET all comments
router.get("/comments");
//  GET comment by id
router.get("/comments/:id");
//POST comment
router.post("/comments");
//PUT update  comment
router.put("/comments/:id");
// DELETE comment
router.delete("/comment/:id");
