import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Clock, Volume2 } from "lucide-react";

export default function SymptomInterview() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [duration, setDuration] = useState(0);

  const questions = {
    en: [
      "What is your main complaint or reason for visiting today?",
      "How long have you been experiencing this symptom?",
      "On a scale of 1-10, how severe is your symptom?",
      "Have you experienced this before? If yes, when?",
      "Are there any other symptoms you're experiencing?",
      "Do you have any known allergies or chronic conditions?",
      "Are you currently taking any medications?",
      "Have you tried any home remedies or treatments?",
    ],
    hi: [
      "आज आप मुख्य रूप से किस समस्या के लिए आए हैं?",
      "आप कितने समय से इस लक्षण का अनुभव कर रहे हैं?",
      "1-10 के पैमाने पर, आपके लक्षण की गंभीरता कितनी है?",
      "क्या आपने पहले यह अनुभव किया है? हाँ तो कब?",
      "क्या आप कोई अन्य लक्षण का अनुभव कर रहे हैं?",
      "क्या आपको कोई ज्ञात एलर्जी या पुरानी बीमारी है?",
      "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
      "क्या आपने कोई घरेलू उपचार आजमाया है?",
    ],
  };

  const handleNext = () => {
    if (currentResponse.trim()) {
      const newResponses = [...responses, currentResponse];
      setResponses(newResponses);
      setCurrentResponse("");

      if (currentQuestion < questions[language].length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setDuration(duration + 1);
      } else {
        setIsComplete(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setResponses(responses.slice(0, -1));
      setCurrentResponse(responses[currentQuestion - 1] || "");
    }
  };

  const progress = ((currentQuestion + 1) / questions[language].length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center">Interview Complete!</CardTitle>
            <CardDescription className="text-center">Your responses have been recorded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Summary</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Interview Duration: ~{duration} minutes</p>
                <p>✓ Questions Answered: {responses.length}</p>
                <p>✓ AI Analysis: In Progress</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-gray-900 mb-3">Your Responses</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {responses.map((response, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium text-gray-700 mb-1">Q{idx + 1}: {questions[language][idx]}</p>
                    <p className="text-gray-600 ml-4 italic">"{response}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Next Step:</strong> Your responses will be analyzed by our AI system to generate a pre-chart for your doctor. This typically takes 1-2 minutes.
              </p>
            </div>

            <Button className="w-full" size="lg">
              Return to Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <CardTitle>AI Symptom Interview</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">~{duration} min</span>
              </div>
            </div>
            <CardDescription>
              Language: 
              <div className="flex gap-2 mt-2">
                <Badge 
                  variant={language === "en" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setLanguage("en")}
                >
                  English
                </Badge>
                <Badge 
                  variant={language === "hi" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setLanguage("hi")}
                >
                  हिंदी
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {questions[language].length}
                </span>
                <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {questions[language][currentQuestion]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please provide a detailed response to help us better understand your condition.
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="gap-2">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Response Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Your Response</label>
              <Textarea
                placeholder={language === "en" ? "Type your response here..." : "अपना उत्तर यहाँ टाइप करें..."}
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                className="min-h-32"
              />
              <p className="text-xs text-gray-500 mt-2">
                {currentResponse.length} characters
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!currentResponse.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {currentQuestion === questions[language].length - 1 ? "Complete Interview" : "Next Question"}
              </Button>
            </div>

            {/* Helpful Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-green-900 mb-2">💡 Tips for Better Results:</p>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• Be as detailed as possible in your responses</li>
                <li>• Mention when symptoms started and how they've progressed</li>
                <li>• Include any related symptoms or medical history</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
