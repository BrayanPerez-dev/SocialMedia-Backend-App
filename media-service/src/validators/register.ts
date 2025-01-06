import {body} from 'express-validator';

export const registerValidator=[
    body("username")
    .isString()
    .trim()
    .isLength({min:4, max:50})
    .withMessage("Username must be between 4 and 50 characters long"),

    body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .trim(),
    
    body("password")
    .isString()
    .isLength({min:6})
    .withMessage("Password must be at least 6 characters long"),
    

]