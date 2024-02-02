const {OAuth2Client}=require("google-auth-library");
require("dotenv").config();

const { YOUR_CLIENT_ID } = process.env;

const decodeTokenOauth = async (token) => {
    // Decodificar el token
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: YOUR_CLIENT_ID, // Reemplaza 'tu_client_id' con el ID de cliente de tu aplicación
    });
    const payload = ticket.getPayload();
    return payload;
}

module.exports = {
    decodeTokenOauth,
}

