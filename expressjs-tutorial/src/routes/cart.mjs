import { Router } from "express";

const router = Router();

// Cart System (Shopping Cart) 
router.post("/api/cart", (req,res) => { 
    if (!req.session.user) return res.sendStatus(401); // !req.session.user = undefined from auth then return 401
    const {body: item} = req; 
    const {cart} = req.session; 
    if (cart) { // if cart exists
        cart.push(item); // push item
    } else {
        req.session.cart = [item]; // if cart not exist create cart
    }
    return res.status(201).send(item);
});

// Get Cart System
router.get("/api/cart", (req,res) => {
    if (!req.session.user) return res.sendStatus(401); 
    return res.send(req.session.cart ?? []); // ?? = if null or undefined then return empty array (?? is the same as ||)
});

export default router;