import JWT from "jsonwebtoken";

export const agentAuth = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authorization,
      process.env.JSON_SECRET
    );
    next();
  } catch (error) {
    console.log(error);
    res.send("unauthorized access");
  }
};
