import { Router, Request, Response } from "express";
import { universalConvert } from "../services/universalConverter";

export const converterRouter = Router();

/**
 * POST /api/convert
 * Universal endpoint - accepts ANY input format.
 * Body can be JSON object or plain text.
 */
converterRouter.post("/", async (req: Request, res: Response) => {
  try {
    const data = typeof req.body === "string" ? req.body : req.body;

    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return res.status(400).json({ error: "Empty input" });
    }

    const result = await universalConvert(data);

    // Notify doctor portal via Socket.IO
    const io = req.app.get("io");
    if (io && result.success) {
      io.emit("queue-update", {
        type: result.inputType,
        patientId: result.patientId,
        encounterId: result.encounterId,
        queueToken: result.queueToken,
        resourcesCreated: result.resourcesCreated,
        timestamp: new Date().toISOString(),
      });
    }

    const status = result.success ? 200 : 500;
    return res.status(status).json(result);
  } catch (error: any) {
    console.error("Converter error:", error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/convert/booking
 * Explicit booking endpoint.
 */
converterRouter.post("/booking", async (req: Request, res: Response) => {
  try {
    const result = await universalConvert({ type: "booking", data: req.body });
    const io = req.app.get("io");
    if (io && result.success) io.emit("queue-update", result);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/convert/symptoms
 * Explicit symptom interview endpoint.
 */
converterRouter.post("/symptoms", async (req: Request, res: Response) => {
  try {
    const result = await universalConvert({ type: "symptom", data: req.body });
    const io = req.app.get("io");
    if (io && result.success) io.emit("queue-update", result);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/convert/doctor-notes
 * Explicit doctor notes endpoint.
 */
converterRouter.post("/doctor-notes", async (req: Request, res: Response) => {
  try {
    const result = await universalConvert({ type: "doctor_notes", data: req.body });
    const io = req.app.get("io");
    if (io && result.success) io.emit("queue-update", result);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/convert/vitals
 * Explicit vitals endpoint.
 */
converterRouter.post("/vitals", async (req: Request, res: Response) => {
  try {
    const result = await universalConvert({ type: "vitals", data: req.body });
    const io = req.app.get("io");
    if (io && result.success) io.emit("queue-update", result);
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
