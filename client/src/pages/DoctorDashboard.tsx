import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, FileText, Pill, LogOut, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const patients = [
    {
      id: 1,
      name: "Rajesh Kumar",
      appointmentTime: "10:00 AM",
      status: "in_progress",
      chiefComplaint: "Chest pain",
      preChartStatus: "ready",
      confidence: 0.87,
    },
    {
      id: 2,
      name: "Priya Sharma",
      appointmentTime: "10:30 AM",
      status: "checked_in",
      chiefComplaint: "Headache and fever",
      preChartStatus: "ready",
      confidence: 0.92,
    },
    {
      id: 3,
      name: "Amit Patel",
      appointmentTime: "11:00 AM",
      status: "scheduled",
      chiefComplaint: "Follow-up",
      preChartStatus: "pending",
      confidence: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-sm text-gray-600">Dr. {user?.name || "Doctor"}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">3 in queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 min</div>
              <p className="text-xs text-gray-500">With AI pre-charts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-500">Prescriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-gray-500">Avg confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="queue" className="gap-2">
              <Users className="w-4 h-4" />
              Patient Queue
            </TabsTrigger>
            <TabsTrigger value="emr" className="gap-2">
              <FileText className="w-4 h-4" />
              EMR
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="gap-2">
              <Pill className="w-4 h-4" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          {/* Patient Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Patient Queue
                </CardTitle>
                <CardDescription>Real-time queue with AI pre-chart status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {patients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.appointmentTime} • {patient.chiefComplaint}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            patient.status === "in_progress" ? "default" :
                            patient.status === "checked_in" ? "secondary" :
                            "outline"
                          }
                        >
                          {patient.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        {patient.preChartStatus === "ready" ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700">AI Pre-Chart Ready</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">Waiting for Interview</span>
                          </>
                        )}
                      </div>
                      {patient.confidence > 0 && (
                        <div className="text-xs text-gray-600">
                          Confidence: <span className="font-semibold">{(patient.confidence * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        View EMR
                      </Button>
                      <Button size="sm" variant="outline">
                        Start Consultation
                      </Button>
                      {patient.preChartStatus === "ready" && (
                        <Button size="sm" variant="outline">
                          Review Pre-Chart
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EMR Tab */}
          <TabsContent value="emr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Electronic Medical Record</CardTitle>
                <CardDescription>Unified patient EMR with AI-assisted documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Patient: Rajesh Kumar</h4>
                  
                  <div className="space-y-4">
                    {/* AI Pre-Chart */}
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-900">AI-Generated Pre-Chart (SOAP)</h5>
                        <Badge variant="outline">87% Confidence</Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Subjective (88% confidence)</p>
                          <p className="text-gray-600 mt-1">Patient reports chest pain for 2 days, worse with exertion. Associated with shortness of breath. No fever or cough.</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Objective (85% confidence)</p>
                          <p className="text-gray-600 mt-1">BP: 140/90, HR: 88, RR: 18, SpO2: 98%. ECG shows normal sinus rhythm.</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Assessment (87% confidence)</p>
                          <p className="text-gray-600 mt-1">Possible angina or musculoskeletal chest pain. Rule out cardiac etiology.</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Plan (89% confidence)</p>
                          <p className="text-gray-600 mt-1">Troponin test, chest X-ray, cardiology referral if needed. Start aspirin 500mg daily.</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="default">
                          Approve & Save
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Vitals */}
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Vitals</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">BP</p>
                          <p className="font-semibold">140/90 mmHg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">HR</p>
                          <p className="font-semibold">88 bpm</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Temp</p>
                          <p className="font-semibold">98.6°F</p>
                        </div>
                        <div>
                          <p className="text-gray-600">SpO2</p>
                          <p className="font-semibold">98%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Prescription Management
                </CardTitle>
                <CardDescription>Review and approve prescriptions with DDI checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-amber-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900">Prescription for Rajesh Kumar</h5>
                      <p className="text-sm text-gray-600">Pending Approval</p>
                    </div>
                    <Badge variant="outline">DDI Check: Clear</Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">• Aspirin 500mg</span>
                      <span className="text-gray-900">2x daily for 7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">• Atorvastatin 20mg</span>
                      <span className="text-gray-900">1x daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">• Metoprolol 50mg</span>
                      <span className="text-gray-900">1x daily</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve & Generate e-Rx
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Recent Approvals</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priya Sharma - Approved 2 hours ago</span>
                      <Badge variant="secondary">3 medications</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amit Patel - Approved 1 day ago</span>
                      <Badge variant="secondary">2 medications</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
