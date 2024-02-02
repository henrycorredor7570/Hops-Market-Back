const { Router } = require("express");
const protectedRouter = Router();
const axios = require("axios");

protectedRouter.get("/", async (req,res) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1]
        const response = await axios.get("https://dev-ke2kmb45sqnv6r5n.us.auth0.com/userinfo",{
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });
        const userinfo = response.data
        res.send(userinfo);
    } catch (error) {
        res.send(error.message)
    }
});

module.exports = protectedRouter;