import passport from "passport";
import { Router } from "express";

const router = Router();

// Authentication
router.post(
    '/api/auth', 
    passport.authenticate('local'), // {session: false} is for security. This ensures that the user object is not stored in the session. Instead, it is sent as the response in the POST request.
    (req,res) => {
        res.sendStatus(200); 
    }
);

// Authentication Status
router.get('/api/auth/status', (req,res) => {
    console.log(req.session);
    console.log(req.sessionID);
    return req.user ? res.send((req.user)) : res.sendStatus(401); // ternary operator
});

// Logout
router.post('/api/auth/logout', (req,res) => {
    if(!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send(200);
    });
})

export default router;