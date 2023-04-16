import jwt from 'jsonwebtoken';

//To GENERATE TOKEN
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export default generateToken;



//TO RESET PASSWORD
/*
export const baseUrl = () =>
process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? "http://localhost:5000"
    : "http://yourdomaine.com"
*/

// MAILGUN
/*
export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  });*/