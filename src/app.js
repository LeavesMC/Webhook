const port = 3000;

const { infolog, warnlog, errlog } = require("./logger");
const { urlTest } = require("./urltest");
const { upload } = require("./s3");

const crypto = require("crypto");
const express = require("express");
const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  if (PASSWORD) {
    const PASSWORD = process.env.PASSWORD;
    const authHeader = req.headers["x-leavesmc-authorization"];
    if (!authHeader) {
      errlog("Auth", "Missing header.");
      return res.status(401).json({
        reason: "Missing header.",
      });
    }
    try {
      const hash = crypto
        .createHash("md5")
        .update(
          parseInt(String(Math.floor(Date.now() / 1000)).slice(0, -1), 10) +
            PASSWORD
        )
        .digest("hex");
      if (authHeader !== hash) {
        warnlog("Auth", `Hash mismatch.`);
        return res.status(403).json({
          message: "Try again later.",
        });
      }
    } catch (error) {
      errlog("Auth", `Error parsing authorization header: ${error.message}`);
      return res.status(500).json({
        message: "Try again later.",
      });
    }
  }

  const { repo, project, version, build, commit } = req.body;

  let url = null;

  if (repo && project && version && build && commit) {
    url = `https://github.com/${repo}/releases/download/${version}-${build}-${commit}/${project}-${version}.jar`;
  } else {
    errlog("HTTP", "Insufficient data received.");
    return res.status(400).json({
      message: "Insufficient data received.",
    });
  }

  const urlResult = await urlTest(url);

  if (urlResult.success) {
    upload(
      project,
      `${version}-${build}-${commit}/${project}-${version}.jar`,
      url
    );
    return res.status(202).end();
  } else {
    return res.status(500).json({
      reason: `${urlResult.reason}`,
    });
  }
});

app.listen(port, () => {
  infolog("Server", `Listening on port ${port}`);
});
