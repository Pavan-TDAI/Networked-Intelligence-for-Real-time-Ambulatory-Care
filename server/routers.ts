import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Patient management
  patients: router({
    register: protectedProcedure
      .input(z.object({
        phoneNumber: z.string().optional(),
        preferredLanguage: z.enum(["en", "hi"]).default("en"),
      }))
      .mutation(async ({ ctx, input }) => {
        const existingPatient = await db.getPatientByUserId(ctx.user.id);
        if (existingPatient) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Patient already registered" });
        }
        await db.createPatient({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPatientByUserId(ctx.user.id);
    }),
  }),

  // Appointments
  appointments: router({
    book: protectedProcedure
      .input(z.object({
        doctorId: z.number(),
        appointmentDateTime: z.date(),
        chiefComplaint: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const patient = await db.getPatientByUserId(ctx.user.id);
        if (!patient) throw new TRPCError({ code: "FORBIDDEN" });
        
        await db.createAppointment({
          patientId: patient.id,
          doctorId: input.doctorId,
          appointmentDateTime: input.appointmentDateTime,
          chiefComplaint: input.chiefComplaint,
          status: "scheduled",
          appointmentType: "booked",
        });
        return { success: true };
      }),

    getMyAppointments: protectedProcedure.query(async ({ ctx }) => {
      const patient = await db.getPatientByUserId(ctx.user.id);
      if (!patient) return [];
      return await db.getAppointmentsByPatientId(patient.id);
    }),

    getQueue: protectedProcedure.query(async ({ ctx }) => {
      const doctor = await db.getDoctorByUserId(ctx.user.id);
      if (!doctor) return [];
      return await db.getAppointmentsByDoctorId(doctor.id);
    }),

    updateStatus: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        status: z.enum(["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateAppointment(input.appointmentId, { status: input.status });
        return { success: true };
      }),
  }),

  // Symptom Interviews
  interviews: router({
    start: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        language: z.enum(["en", "hi"]).default("en"),
      }))
      .mutation(async ({ ctx, input }) => {
        const patient = await db.getPatientByUserId(ctx.user.id);
        if (!patient) throw new TRPCError({ code: "FORBIDDEN" });
        
        await db.createSymptomInterview({
          appointmentId: input.appointmentId,
          patientId: patient.id,
          language: input.language,
          status: "started",
        });
        return { success: true };
      }),

    submitResponse: protectedProcedure
      .input(z.object({
        interviewId: z.number(),
        transcript: z.string(),
        duration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateSymptomInterview(input.interviewId, {
          transcript: input.transcript,
          status: "completed",
          duration: input.duration,
          completedAt: new Date(),
        });
        return { success: true };
      }),
  }),

  // Pre-Charts (AI-generated SOAP notes)
  preCharts: router({
    generate: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        interviewId: z.number(),
        subjective: z.string(),
        subjectiveConfidence: z.number().min(0).max(1),
        assessment: z.string(),
        assessmentConfidence: z.number().min(0).max(1),
      }))
      .mutation(async ({ input }) => {
        await db.createPreChart({
          appointmentId: input.appointmentId,
          interviewId: input.interviewId,
          subjective: input.subjective,
          subjectiveConfidence: input.subjectiveConfidence as any,
          assessment: input.assessment,
          assessmentConfidence: input.assessmentConfidence as any,
          status: "draft",
        });
        return { success: true };
      }),

    getByAppointment: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPreChartByAppointmentId(input.appointmentId);
      }),

    update: protectedProcedure
      .input(z.object({
        preChartId: z.number(),
        subjective: z.string().optional(),
        objective: z.string().optional(),
        assessment: z.string().optional(),
        plan: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updatePreChart(input.preChartId, {
          subjective: input.subjective,
          objective: input.objective,
          assessment: input.assessment,
          plan: input.plan,
        });
        return { success: true };
      }),
  }),

  // Vitals
  vitals: router({
    record: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        patientId: z.number(),
        systolicBP: z.number().optional(),
        diastolicBP: z.number().optional(),
        heartRate: z.number().optional(),
        temperature: z.number().optional(),
        respiratoryRate: z.number().optional(),
        spO2: z.number().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const bmi = (input.weight && input.height 
          ? input.weight / ((input.height / 100) ** 2)
          : undefined) as any;

        await db.createVitals({
          appointmentId: input.appointmentId,
          patientId: input.patientId,
          systolicBP: input.systolicBP as any,
          diastolicBP: input.diastolicBP as any,
          heartRate: input.heartRate,
          temperature: input.temperature as any,
          respiratoryRate: input.respiratoryRate,
          spO2: input.spO2,
          weight: input.weight as any,
          height: input.height as any,
          bmi: bmi as any,
          recordedBy: ctx.user.id,
          recordedAt: new Date(),
        });
        return { success: true };
      }),

    getByAppointment: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVitalsByAppointmentId(input.appointmentId);
      }),
  }),

  // Diagnoses
  diagnoses: router({
    suggest: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        patientId: z.number(),
        icd10Code: z.string(),
        diagnosisName: z.string(),
        confidence: z.number().min(0).max(1),
        isPrimary: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await db.createDiagnosis({
          appointmentId: input.appointmentId,
          patientId: input.patientId,
          icd10Code: input.icd10Code,
          diagnosisName: input.diagnosisName,
          confidence: input.confidence as any,
          aiSuggested: true,
          isPrimary: input.isPrimary,
          status: "suggested",
        });
        return { success: true };
      }),

    approve: protectedProcedure
      .input(z.object({
        diagnosisId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateDiagnosis(input.diagnosisId, {
          status: "approved",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
        });
        return { success: true };
      }),

    getByAppointment: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDiagnosesByAppointmentId(input.appointmentId);
      }),
  }),

  // Prescriptions
  prescriptions: router({
    create: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        patientId: z.number(),
        medications: z.array(z.object({
          drugName: z.string(),
          genericName: z.string().optional(),
          strength: z.string().optional(),
          form: z.string().optional(),
          frequency: z.string(),
          duration: z.string(),
          quantity: z.number().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const doctor = await db.getDoctorByUserId(ctx.user.id);
        if (!doctor) throw new TRPCError({ code: "FORBIDDEN" });
        
        const result = await db.createPrescription({
          appointmentId: input.appointmentId,
          patientId: input.patientId,
          doctorId: doctor.id,
          status: "draft",
        });

        if ((result as any)?.insertId) {
          for (const med of input.medications) {
            await db.createPrescriptionItem({
              prescriptionId: (result as any).insertId,
              ...med,
            });
          }
        }

        return { success: true };
      }),

    checkDDI: protectedProcedure
      .input(z.object({
        drugs: z.array(z.string()),
      }))
      .query(async ({ input }) => {
        const warnings: any[] = [];
        for (let i = 0; i < input.drugs.length; i++) {
          for (let j = i + 1; j < input.drugs.length; j++) {
            const interaction = await db.checkDrugInteraction(input.drugs[i], input.drugs[j]);
            if (interaction && interaction.severity !== "none") {
              warnings.push(interaction);
            }
          }
        }
        return { warnings, hasCritical: warnings.some(w => w.severity === "critical") };
      }),

    approve: protectedProcedure
      .input(z.object({
        prescriptionId: z.number(),
        pdfUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updatePrescription(input.prescriptionId, {
          status: "approved",
          approvedBy: ctx.user.id,
          approvedAt: new Date(),
          pdfUrl: input.pdfUrl,
        });
        return { success: true };
      }),

    getByPatient: protectedProcedure.query(async ({ ctx }) => {
      const patient = await db.getPatientByUserId(ctx.user.id);
      if (!patient) return [];
      return await db.getPrescriptionsByPatientId(patient.id);
    }),

    getByAppointment: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPrescriptionByAppointmentId(input.appointmentId);
      }),
  }),

  // Edit Logs
  editLogs: router({
    record: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        fieldName: z.string(),
        originalValue: z.string().optional(),
        editedValue: z.string(),
        reason: z.string().optional(),
        confidence: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const doctor = await db.getDoctorByUserId(ctx.user.id);
        if (!doctor) throw new TRPCError({ code: "FORBIDDEN" });
        
        await db.createEditLog({
          appointmentId: input.appointmentId,
          doctorId: doctor.id,
          fieldName: input.fieldName,
          originalValue: input.originalValue,
          editedValue: input.editedValue,
          reason: input.reason,
          confidence: input.confidence as any,
        });
        return { success: true };
      }),

    getByAppointment: protectedProcedure
      .input(z.object({ appointmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEditLogsByAppointmentId(input.appointmentId);
      }),
  }),

  // ABHA Integration
  abha: router({
    linkConsent: protectedProcedure
      .input(z.object({
        abhaId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const patient = await db.getPatientByUserId(ctx.user.id);
        if (!patient) throw new TRPCError({ code: "FORBIDDEN" });
        
        await db.createABHAConsent({
          patientId: patient.id,
          abhaId: input.abhaId,
          consentStatus: "pending",
        });
        return { success: true };
      }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const patient = await db.getPatientByUserId(ctx.user.id);
      if (!patient) return null;
      return await db.getABHAConsentByPatientId(patient.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
