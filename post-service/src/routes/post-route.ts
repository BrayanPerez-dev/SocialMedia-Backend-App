import { Router } from "express";
import postController from "../controllers/post-controller";
import { postDataValidator ,postIdValidator} from "../validators/post-validator";

const router=Router();

router.post("/",postDataValidator,postController.addNewPost);
router.get("/",postIdValidator,postController.getAllPosts);
router.get("/:postId",postIdValidator,postController.getPost);
router.delete("/:postId",postIdValidator,postController.deletePostById);


export default router; 