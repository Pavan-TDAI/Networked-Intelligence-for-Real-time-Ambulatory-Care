import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Pill, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function PatientPortal() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || "Patient"}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  My Appointments
                </CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Appointment with Dr. Smith</h4>
                      <p className="text-sm text-gray-600">General Consultation</p>
                      <p className="text-sm text-gray-500 mt-1">April 10, 2026 - 10:30 AM</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="default">
                      Start AI Interview
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Book New Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  My Prescriptions
                </CardTitle>
                <CardDescription>View and download your prescriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-amber-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Prescription from Dr. Smith</h4>
                      <p className="text-sm text-gray-600">Issued on April 8, 2026</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">• Aspirin 500mg - 2x daily</p>
                        <p className="text-xs text-gray-600">• Vitamin D 1000IU - 1x daily</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Records Tab */}
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Health Records
                </CardTitle>
                <CardDescription>Your medical history and vitals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Latest Vitals</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Pressure:</span>
                        <span className="font-medium">120/80 mmHg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heart Rate:</span>
                        <span className="font-medium">72 bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-medium">98.6°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BMI:</span>
                        <span className="font-medium">23.5</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Diagnoses</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span>Hypertension (Controlled)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span>Type 2 Diabetes (Managed)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-gray-900 mb-2">ABHA Status</h4>
                  <p className="text-sm text-gray-600 mb-3">Link your Ayushman Bharat Health Account for unified health records</p>
                  <Button size="sm" variant="default">
                    Link ABHA Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
