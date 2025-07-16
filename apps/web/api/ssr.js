const { Writable } = require("stream");
const { default: handleRequest } = require("../build/server/index.js");

module.exports = async (req, res) => {
  const webRequest = new Request(`https://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? null : req,
  });

  const response = await handleRequest(webRequest);

  res.statusCode = response.status;
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  if (response.body?.pipeTo) {
    await response.body.pipeTo(Writable.toWeb(res));
  } else if (response.body) {
    // Fallback: manually pipe ReadableStream to Node.js response
    const reader = response.body.getReader();
    const writer = res;
    function pump() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          writer.end();
          return;
        }
        writer.write(Buffer.from(value), pump);
      });
    }
    await pump();
  } else {
    res.end(await response.text());
  }
};
