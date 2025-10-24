import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Camera, MapPin, Mic, ArrowLeft, Upload } from "lucide-react";

// Translation object for English, Tamil, Hindi
const translations = {
  en: {
    fileComplaint: "File a Complaint",
    capturePhoto: "Capture Photo",
    department: "Department *",
    description: "Description *",
    recordVoice: "Record Voice Message",
    reRecordVoice: "Re-record",
    duration: "How long has this existed? *",
    frequency: "Frequency *",
    personalDetails: "Personal Details (Optional)",
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    submit: "Submit Complaint",
    backHome: "Back to Home",
    locationTagged: "Location tagged",
    complaintSuccess: "Complaint Filed Successfully! ✓",
    complaintId: "Your Complaint ID:",
    continueHome: "Continue to Home",
    selectDepartment: "Select department",
    selectFrequency: "How often does this occur?",
    locationError: "Please turn on location services",
    locationDenied: "Location access is required to file a complaint",
    geolocationNotSupported: "Geolocation is not supported by your browser",
    captureImageLocation: "Please capture an image with location",
    fillRequiredFields: "Please fill all required fields",
    micDenied: "Microphone access denied",
    voiceRecorded: "Voice message recorded",
    locationSuccess: "Location captured successfully",
  },
  ta: {
    fileComplaint: "முடிவுகள் புகார் செய்யவும்",
    capturePhoto: "புகைப்படம் பிடிக்கவும்",
    department: "விபாகம் *",
    description: "விளக்கம் *",
    recordVoice: "குரல் செய்தியை பதிவு செய்க",
    reRecordVoice: "மீண்டும் பதிவு செய்க",
    duration: "இது எவ்வளவு காலமாக உள்ளது? *",
    frequency: "தொடர்ச்சி *",
    personalDetails: "பொதுப் தகவல்கள் (விருப்பத்தேர்வு)",
    name: "பெயர்",
    phone: "தொலைபேசி எண்",
    email: "மின்னஞ்சல்",
    submit: "புகாரை சமர்ப்பிக்கவும்",
    backHome: "முகப்பிற்கு திரும்பவும்",
    locationTagged: "இடம் குறிக்கப்பட்டது",
    complaintSuccess: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! ✓",
    complaintId: "உங்கள் புகார் ஐடி:",
    continueHome: "முகப்பிற்கு தொடரவும்",
    selectDepartment: "விபாகத்தைத் தேர்ந்தெடுக்கவும்",
    selectFrequency: "எவ்வளவு முறையாக இது நடைபெறுகிறது?",
    locationError: "தயவுசெய்து இடம் சேவைகளை இயக்கவும்",
    locationDenied: "புகார் பதிவு செய்ய இடம் அணுகல் தேவை",
    geolocationNotSupported: "உங்கள் உலாவியில் நிலைத்திருப்பு ஆதரிக்கப்படவில்லை",
    captureImageLocation: "இடத்துடன் படத்தைப் பிடிக்கவும்",
    fillRequiredFields: "அனைத்து தேவையான புலங்களையும் நிரப்பவும்",
    micDenied: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது",
    voiceRecorded: "குரல் செய்தி பதிவு செய்யப்பட்டது",
    locationSuccess: "இடம் வெற்றிகரமாக பிடிக்கப்பட்டது",
  },
  hi: {
    fileComplaint: "शिकायत दर्ज करें",
    capturePhoto: "फोटो लें",
    department: "विभाग *",
    description: "विवरण *",
    recordVoice: "वॉइस संदेश रिकॉर्ड करें",
    reRecordVoice: "पुनः रिकॉर्ड करें",
    duration: "यह कितने समय से है? *",
    frequency: "आवृत्ति *",
    personalDetails: "व्यक्तिगत विवरण (वैकल्पिक)",
    name: "नाम",
    phone: "फोन नंबर",
    email: "ईमेल",
    submit: "शिकायत सबमिट करें",
    backHome: "मुख्य पृष्ठ पर जाएँ",
    locationTagged: "स्थान टैग किया गया",
    complaintSuccess: "शिकायत सफलतापूर्वक दर्ज की गई! ✓",
    complaintId: "आपकी शिकायत आईडी:",
    continueHome: "मुख्य पृष्ठ पर जारी रखें",
    selectDepartment: "विभाग चुनें",
    selectFrequency: "यह कितनी बार होता है?",
    locationError: "कृपया स्थान सेवाएँ चालू करें",
    locationDenied: "शिकायत दर्ज करने के लिए स्थान की आवश्यकता है",
    geolocationNotSupported: "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है",
    captureImageLocation: "कृपया स्थान के साथ छवि लें",
    fillRequiredFields: "कृपया सभी आवश्यक फ़ील्ड भरें",
    micDenied: "माइक्रोफ़ोन एक्सेस अस्वीकृत",
    voiceRecorded: "वॉइस संदेश रिकॉर्ड किया गया",
    locationSuccess: "स्थान सफलतापूर्वक कैप्चर किया गया",
  },
};

const FileComplaint = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  // Load selected language from localStorage
  const savedLanguage = localStorage.getItem("selectedLanguage") as "en" | "ta" | "hi" | null;
  const [language] = useState<"en" | "ta" | "hi">(savedLanguage || "en");

  const [formData, setFormData] = useState({
    image: null as File | null,
    imagePreview: "",
    department: "",
    description: "",
    durationValue: "",
    durationType: "days",
    frequency: "",
    name: "",
    phone: "",
    email: "",
    audioBlob: null as Blob | null,
  });

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success(translations[language].locationSuccess);
        },
        (error) => {
          toast.error(translations[language].locationError, {
            description: translations[language].locationDenied,
          });
        }
      );
    } else {
      toast.error(translations[language].geolocationNotSupported);
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
      requestLocation();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setFormData({ ...formData, audioBlob: blob });
        toast.success(translations[language].voiceRecorded);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      }, 10000);
    } catch (error) {
      toast.error(translations[language].micDenied);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !location) {
      toast.error(translations[language].captureImageLocation);
      return;
    }

    if (!formData.department || !formData.description) {
      toast.error(translations[language].fillRequiredFields);
      return;
    }

    const newComplaintId = `FIN-${Date.now()}`;

    let audioData = null;
    if (formData.audioBlob) {
      const reader = new FileReader();
      audioData = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(formData.audioBlob!);
      });
    }

    const complaint = {
      id: newComplaintId,
      ...formData,
      audioBlob: null,
      audioData,
      location,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existingComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    localStorage.setItem("complaints", JSON.stringify([...existingComplaints, complaint]));

    setComplaintId(newComplaintId);
    setShowSuccessDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations[language].backHome}
        </Button>

        <Card className="max-w-3xl mx-auto p-8 shadow-elevation">
          <h1 className="text-3xl font-display font-bold mb-6">
            {translations[language].fileComplaint}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Capture */}
            <div>
              <Label>{translations[language].capturePhoto} *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />
              {formData.imagePreview ? (
                <div className="mt-2">
                  <img
                    src={formData.imagePreview}
                    alt="Captured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {location && (
                    <div className="mt-2 flex items-center text-sm text-success">
                      <MapPin className="w-4 h-4 mr-1" />
                      {translations[language].locationTagged}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {translations[language].capturePhoto}
                </Button>
              )}
            </div>

            {/* Department */}
            <div>
              <Label>{translations[language].department}</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={translations[language].selectDepartment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roads">Roads & Transport</SelectItem>
                  <SelectItem value="water">Water Supply</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="sanitation">Sanitation</SelectItem>
                  <SelectItem value="streetlight">Street Lighting</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label>{translations[language].description}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={translations[language].description}
                rows={4}
                required
              />
            </div>

            {/* Voice Message */}
            <div>
              <Label> {translations[language].recordVoice} </Label>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={startRecording}
                disabled={isRecording}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isRecording
                  ? "Recording..."
                  : formData.audioBlob
                  ? translations[language].reRecordVoice
                  : translations[language].recordVoice}
              </Button>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{translations[language].duration}</Label>
                <Input
                  type="number"
                  value={formData.durationValue}
                  onChange={(e) => setFormData({ ...formData, durationValue: e.target.value })}
                  placeholder="Enter number"
                  required
                />
              </div>
              <div>
                <Label>&nbsp;</Label>
                <Select
                  value={formData.durationType}
                  onValueChange={(value) => setFormData({ ...formData, durationType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <Label>{translations[language].frequency}</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={translations[language].selectFrequency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="often">Occurs Often</SelectItem>
                  <SelectItem value="rarely">Occurs Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">{translations[language].personalDetails}</h3>
              <div className="space-y-4">
                <div>
                  <Label>{translations[language].name}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={translations[language].name}
                  />
                </div>
                <div>
                  <Label>{translations[language].phone}</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={translations[language].phone}
                  />
                </div>
                <div>
                  <Label>{translations[language].email}</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={translations[language].email}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Upload className="mr-2 h-4 w-4" />
              {translations[language].submit}
            </Button>
          </form>
        </Card>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              {translations[language].complaintSuccess}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-4">
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {translations[language].complaintId}
                </p>
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                  <p className="text-2xl font-bold text-primary tracking-wider">{complaintId}</p>
                </div>
              </div>
              <p className="text-sm mt-4">
                {translations[language].continueHome}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/home");
              }}
              className="w-full"
            >
              {translations[language].continueHome}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FileComplaint;
