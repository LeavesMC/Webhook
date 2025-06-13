const { infolog, errlog } = require("./logger");

async function urlTest(url) {
  try {
    const result = await fetch(url, { method: "HEAD" });
    if (result.ok) {
      infolog("URLTest", `Download link available: ${url}`);
      return {
        success: true,
      };
    } else {
      errlog("URLTest", `Unable to connect to: ${url}`);
      return {
        reason: result.statusText,
        success: false,
      };
    }
  } catch (error) {
    errlog(
      "URLTest",
      `Unable to connect to: ${url} - Error: ${error.message}`
    );
    return {
      reason: error.message,
      success: false,
    };
  }
}

module.exports = {
  urlTest,
};
