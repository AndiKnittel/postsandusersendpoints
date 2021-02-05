const pool = require("../dbconfig");

const tokensController = {
  verify: async (req, res, next) => {
    const token = req.query.auth_token;
    const id = req.query.auth_id;
    if (!(token && id && /^\d+$/.test(id))) {
      res.status(401).json({
        code: 401,
        message: "invalid authentification",
      });
      return;
    }
    try {
      const data = await pool.query(
        "SELECT (tokens.value=$1) AS valid FROM tokens JOIN users ON (tokens.id = users.token_id) WHERE users.id=$2",
        [token, id]
      );
      if (data.rows[0] && data.rows[0].valid) {
        next();
      } else {
        res.status(401).json({
          code: 401,
          message: "invalid authentifictaion",
        });
      }
    } catch (e) {
      console.error(e);
      res.json({
        code: 500,
        message: "authentification failed unexpectedly",
      });
    }
  },
};
module.exports = tokensController;
