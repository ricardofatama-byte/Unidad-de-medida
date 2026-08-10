import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./llaves.env" });

function encode(str) {
    return encodeURIComponent(str)
        .replace(/\!/g, "%21")
        .replace(/\*/g, "%2A")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${encode(key)}=${encode(params[key])}`)
        .join("&");

    const baseString = [
        method.toUpperCase(),
        encode(url),
        encode(sortedParams),
    ].join("&");

    const signingKey = `${encode(consumerSecret)}&${encode(tokenSecret)}`;

    return crypto
        .createHmac("sha256", signingKey)
        .update(baseString)
        .digest("base64");
}

export async function netsuiteRequest(body) {
    const method = "POST";
    const url = "https://11541254.suitetalk.api.netsuite.com/services/rest/record/v1/unitsType";

    const oauth_timestamp = Math.floor(Date.now() / 1000).toString();
    const oauth_nonce = crypto.randomBytes(16).toString("hex");

    const oauthParams = {
        oauth_consumer_key: process.env.CONSUMER_KEY,
        oauth_token: process.env.TOKEN_ID,
        oauth_signature_method: "HMAC-SHA256",
        oauth_timestamp,
        oauth_nonce,
        oauth_version: "1.0",
    };

    const signature = generateOAuthSignature(
        method,
        url,
        oauthParams,
        process.env.CONSUMER_SECRET,
        process.env.TOKEN_SECRET
    );

    const authHeader = `OAuth realm="${process.env.ACCOUNT_ID}",` +
        `oauth_consumer_key="${oauthParams.oauth_consumer_key}",` +
        `oauth_token="${oauthParams.oauth_token}",` +
        `oauth_signature_method="HMAC-SHA256",` +
        `oauth_timestamp="${oauth_timestamp}",` +
        `oauth_nonce="${oauth_nonce}",` +
        `oauth_version="1.0",` +
        `oauth_signature="${encode(signature)}"`;

    const headers = {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "Cookie": "NS_ROUTING_VERSION=LAGGING",
    };

    try {
        const res = await axios.post(url, body, { headers });
        return res.data;
    } catch (e) {
        console.error("NetSuite Error:", e.response?.data || e.message);
        throw e;
    }
}
