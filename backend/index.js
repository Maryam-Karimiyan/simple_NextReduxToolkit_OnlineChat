const express = require("express");
const cors = require("cors");
const axios = require("axios");
//by cors we call the server from any other origin
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    // Get or create user on Chat Engine!
    // return res.json({username:username,secret:"1234"})
    try {
      const r = await axios.put(
        "https://api.chatengine.io/users/",
       JSON.stringify({ username: username, secret: username, first_name: username }),
        { headers: { "Private-Key": "ec6223c1-5822-4874-bf83-4e097183930c" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
      return res.status(e.response.status).json(e.response.data);
    }
  });

app.listen(3001);