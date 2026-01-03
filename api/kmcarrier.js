const http = require("http");
const zlib = require("zlib");

module.exports = async (req, res) => {
  const get = (url, headers) =>
    new Promise((resolve, reject) => {
      const request = http.get(url, { headers }, (response) => {
        let chunks = [];

        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const encoding = response.headers["content-encoding"];

          if (encoding === "gzip") {
            zlib.gunzip(buffer, (err, decoded) => {
              if (err) return reject(err);
              resolve(decoded.toString("utf8"));
            });
          } else if (encoding === "deflate") {
            zlib.inflate(buffer, (err, decoded) => {
              if (err) return reject(err);
              resolve(decoded.toString("utf8"));
            });
          } else {
            resolve(buffer.toString("utf8"));
          }
        });
      });

      request.on("error", reject);
    });

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 15; V2520 Build/AP3A.240905.015.A2_NNCS_V000L1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.7499.146 Mobile Safari/537.36",

    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",

    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",

    "X-Requested-With": "mark.via.gp",
    Referer: "http://54.36.173.235/ints/login",
    Cookie: "PHPSESSID=YOUR_SESSION_ID",
  };

  try {
    const data = await get(
      "http://54.36.173.235/ints/client/SMSDashboard",
      headers
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(data);
  } catch (e) {
    res.statusCode = 500;
    res.end("Fetch failed: " + e.message);
  }
};
