import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Download, Send } from "lucide-react";

export default function PrescriptionApproval() {
  const [isApproved, setIsApproved] = useState(false);
  const [ddiWarnings, setDdiWarnings] = useState<any[]>([]);

  const prescription = {
    id: 1,
    patientName: "Rajesh Kumar",
    doctorName: "Dr. Smith",
    medications: [
      { name: "Aspirin", strength: "500mg", form: "Tablet", frequency: "2x daily", duration: "7 days" },
      { name: "Atorvastatin", strength: "20mg", form: "Tablet", frequency: "1x daily", duration: "30 days" },
      { name: "Metoprolol", strength: "50mg", form: "Tablet", frequency: "1x daily", duration: "30 days" },
    ],
    ddiCheckPassed: true,
  };

  const handleApprove = async () => {
    // Simulate DDI check
    setDdiWarnings([]);
    setIsApproved(true);
  };

  const handleGeneratePDF = () => {
    // Simulate PDF generation
    console.log("Generating e-Rx PDF...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescription Approval</h1>
            <p className="text-gray-600">Review and approve prescription with DDI checks</p>
          </div>
          <Badge variant={isApproved ? "default" : "secondary"}>
            {isApproved ? "Approved" : "Pending Review"}
          </Badge>
        </div>

        {/* Patient & Doctor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="text-lg font-semibold text-gray-900">{prescription.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prescribed By</p>
              <p className="text-lg font-semibold text-gray-900">{prescription.doctorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prescription ID</p>
              <p className="text-lg font-semibold text-gray-900">RX-{prescription.id.toString().padStart(6, "0")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-900">April 8, 2026</p>
            </div>
          </CardContent>
        </Card>

        {/* DDI Check Status */}
        <Card className={prescription.ddiCheckPassed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {prescription.ddiCheckPassed ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Drug-Drug Interaction Check: PASSED
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Drug-Drug Interaction Check: WARNINGS
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescription.ddiCheckPassed ? (
              <p className="text-sm text-green-800">
                ✓ No significant drug-drug interactions detected. All medications are safe to use together.
              </p>
            ) : (
              <div className="space-y-2">
                {ddiWarnings.map((warning, idx) => (
                  <Alert key={idx} variant="destructive">
                    <AlertDescription>
                      <strong>{warning.drug1}</strong> + <strong>{warning.drug2}</strong>: {warning.severity} severity - {warning.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Medications</CardTitle>
            <CardDescription>{prescription.medications.length} medications prescribed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescription.medications.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <p className="text-sm text-gray-600">{med.strength} • {med.form}</p>
                    </div>
                    <Badge variant="outline">{med.duration}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      <strong>Frequency:</strong> {med.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflow */}
        {!isApproved ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>One-Click Approval Workflow</CardTitle>
              <CardDescription>Approve prescription and generate e-Rx instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Click the button below to approve this prescription. An e-Rx PDF will be generated and sent to the patient immediately.
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button 
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  size="lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Generate e-Rx
                </Button>
                <Button variant="outline" size="lg">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5" />
                Prescription Approved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Prescription approved by Dr. {prescription.doctorName}</p>
                <p>✓ e-Rx PDF generated and ready for download</p>
                <p>✓ Patient notification sent</p>
                <p>✓ Prescription available in patient portal</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleGeneratePDF}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download e-Rx PDF
                </Button>
                <Button 
                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  Send to Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Log & AI Feedback</CardTitle>
            <CardDescription>Track all changes for continuous AI improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="border rounded-lg p-3 bg-gray-50">
                <p className="font-medium text-gray-900">No edits made to this prescription</p>
                <p className="text-gray-600">This prescription was approved as-is from the AI pre-chart.</p>
              </div>
              <p className="text-xs text-gray-500">
                Any edits or changes made to AI-generated content are logged here and used to improve the AI model's accuracy over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
