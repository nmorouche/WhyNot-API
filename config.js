const JWT_KEY = process.env.JWT_KEY || "why-not";
const PORT = process.env.PORT || 3000;
const BASEAPPURL = process.env.BASEAPPURL || "http://localhost:3000/";

module.exports = {
  BASEAPPURL,
  JWT_KEY,
  PORT,
};
