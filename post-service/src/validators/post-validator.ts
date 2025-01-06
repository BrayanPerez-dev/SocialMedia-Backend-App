import {body,param} from 'express-validator';

export const postDataValidator=[
    body("userId")
    .notEmpty()
    .withMessage("UserID field is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),

    body("content")
    .notEmpty()
    .withMessage("content field is required")

  
]

export const postIdValidator=[
    param("postId")
    .isMongoId()
    .withMessage("Post Id should be a valid mongoID")
]