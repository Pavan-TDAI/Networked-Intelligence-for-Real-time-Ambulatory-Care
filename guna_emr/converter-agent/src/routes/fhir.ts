import { Router, Request, Response } from "express";
import { fhirClient } from "../services/hapiFhir";

export const fhirRouter = Router();

/**
 * GET /api/fhir/patient/:id - Get patient FHIR resource
 */
fhirRouter.get("/patient/:id", async (req: Request, res: Response) => {
  try {
    const patient = await fhirClient.getResource("Patient", req.params.id);
    return res.json(patient);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fhir/patient/:id/everything - Get all resources for a patient
 */
fhirRouter.get("/patient/:id/everything", async (req: Request, res: Response) => {
  try {
    const [encounters, observations, conditions, compositions, medications] =
      await Promise.all([
        fhirClient.searchResource("Encounter", { patient: req.params.id }),
        fhirClient.searchResource("Observation", { patient: req.params.id }),
        fhirClient.searchResource("Condition", { patient: req.params.id }),
        fhirClient.searchResource("Composition", { patient: req.params.id }),
        fhirClient.searchResource("MedicationRequest", { patient: req.params.id }),
      ]);

    return res.json({
      patientId: req.params.id,
      encounters,
      observations,
      conditions,
      compositions,
      medications,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fhir/encounter/:id - Get encounter details
 */
fhirRouter.get("/encounter/:id", async (req: Request, res: Response) => {
  try {
    const encounter = await fhirClient.getResource("Encounter", req.params.id);
    return res.json(encounter);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fhir/search/:resourceType - Search FHIR resources
 */
fhirRouter.get("/search/:resourceType", async (req: Request, res: Response) => {
  try {
    const allowedTypes = [
      "Patient", "Encounter", "Observation", "Condition",
      "Composition", "MedicationRequest",
    ];
    const resourceType = req.params.resourceType;
    if (!allowedTypes.includes(resourceType)) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === "string") params[key] = value;
    }

    const result = await fhirClient.searchResource(resourceType, params);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
