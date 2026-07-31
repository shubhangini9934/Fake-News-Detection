// import { Router } from "express";
// import axios from "axios";
// import { storageService } from "../services/storageService.js";
// import { getIo } from "../socket.js";

// const router = Router();

// router.post("/", async (request, response) => {
//   try {
//     const { text, articleId, source, title, url } = request.body;

//     if (!text?.trim()) {
//       return response.status(400).json({ message: "Text is required for verification." });
//     }

//     const mlResponse = await axios.post(
//       `${process.env.ML_SERVICE_URL || "http://127.0.0.1:5001"}/predict`,
//       { text, source, url, title }
//     );

//     const result = {
//       label: mlResponse.data.label,
//       confidence: mlResponse.data.confidence
//     };

//     await storageService.applyVerification(articleId, url, result);

//     const record = await storageService.saveVerification({
//       newsId: articleId || undefined,
//       title: title || text.slice(0, 120),
//       source: source || "Custom Search",
//       url: url || "",
//       text,
//       label: result.label,
//       confidence: result.confidence
//     });

//     getIo().emit("verify:created", record);
//     return response.json({ result });
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       error.message ||
//       "Verification service is unavailable.";
//     return response.status(500).json({ message });
//   }
// });

// export default router;

import { Router } from "express";
import axios from "axios";
import { storageService } from "../services/storageService.js";
import { getIo } from "../socket.js";

const router = Router();

router.post("/", async (req, res) => {
  console.log("========== VERIFY REQUEST ==========");
  console.log(req.body);

  try {
    const { text, articleId, source, title, url } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required for verification."
      });
    }

    const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

    console.log(`Calling ML Service: ${ML_URL}/predict`);

    const mlResponse = await axios.post(
      `${ML_URL}/predict`,
      {
        text,
        source,
        title,
        url
      },
      {
        timeout: 10000
      }
    );

    console.log("ML Response:", mlResponse.data);

    const result = {
      label: mlResponse.data.label,
      confidence: mlResponse.data.confidence
    };

    if (articleId || url) {
      await storageService.applyVerification(articleId, url, result);
    }

    const record = await storageService.saveVerification({
      newsId: articleId || null,
      title: title || text.substring(0, 120),
      source: source || "Custom Search",
      url: url || "",
      text,
      label: result.label,
      confidence: result.confidence
    });

    try {
      getIo().emit("verify:created", record);
    } catch (socketError) {
      console.error("Socket Error:", socketError);
    }

    return res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error("========== VERIFY ERROR ==========");
    console.error(error);

    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
});

export default router;