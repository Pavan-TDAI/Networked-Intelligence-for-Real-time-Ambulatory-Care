import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Stethoscope, Users, Activity, Clock } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) return;

    // Redirect based on role
    if (user.role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (user.role === "patient") {
      navigate("/patient/home");
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">NIRA MVP</h1>
          </div>
          <p className="text-sm text-gray-600">AI-Powered Healthcare Platform</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Healthcare at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              NIRA combines AI-powered symptom analysis with clinical workflows to deliver faster, smarter healthcare
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Patient Card */}
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <CardTitle>For Patients</CardTitle>
                </div>
                <CardDescription>Access your health records and appointments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    AI-powered symptom interviews (Hindi & English)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Easy appointment booking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    View prescriptions and health records
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    ABHA integration for unified health account
                  </li>
                </ul>
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Login as Patient
                </Button>
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card className="border-2 border-indigo-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Stethoscope className="w-8 h-8 text-indigo-600" />
                  <CardTitle>For Doctors</CardTitle>
                </div>
                <CardDescription>Manage patients and streamline consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    Real-time patient queue management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    AI-generated SOAP notes with confidence scores
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    Prescription management with DDI checks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    One-click approval workflow
                  </li>
                </ul>
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Login as Doctor
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">5-8 Minute Interviews</h4>
                  <p className="text-sm text-gray-600">Adaptive AI symptom interviews that complete quickly</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Activity className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Confidence Scores</h4>
                  <p className="text-sm text-gray-600">All AI suggestions include confidence metrics</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Stethoscope className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Clinical Workflows</h4>
                  <p className="text-sm text-gray-600">Seamless EMR, vitals, and prescription management</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Bilingual Support</h4>
                  <p className="text-sm text-gray-600">Full Hindi and English language support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            <p>NIRA MVP © 2026 | Transforming Healthcare with AI</p>
          </div>
        </div>
      </main>
    </div>
  );
}
