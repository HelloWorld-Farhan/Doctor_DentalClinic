import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

export interface PatientRecord {
  id: string;
  name: string;
  initials: string;
  color: string;
  age: string;
  gender: string;
  visitDate: string;
  dr: string;
  proc: string;
  procColor: string;
  alert: string;
  alertColor: string;
  alertIcon: string;
  ins: string;
  insIcon: string;
  insColor: string;
  phone?: string;
  email?: string;
  policyId?: string;
}

export type ToothCondition = 'Healthy' | 'Crown' | 'Root Canal' | 'Implant' | 'Caries' | 'Extracted';

export interface ToothData {
  num: number;
  name: string;
  arch: 'Upper' | 'Lower';
  condition: ToothCondition;
  notes?: string;
}

// 16 Realistic Patients covering multiple pagination pages
const MASTER_PATIENTS: PatientRecord[] = [
  // Page 1
  { 
    id: "DC-88495", name: "Jonathan Chopra", initials: "JC", color: "bg-surface-container-high text-on-surface-variant", 
    age: "52 yrs", gender: "Male", 
    visitDate: "Jan 15, 2024", dr: "Dr. Rohan Vance",
    proc: "Dental Implants", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "Hypertension", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Cigna Dental Care", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 567-8901", email: "jonathan.chopra@example.com", policyId: "#CG-58291"
  },
  { 
    id: "DC-88494", name: "Amara Patel", initials: "AP", color: "bg-primary-fixed-dim text-on-primary-fixed", 
    age: "28 yrs", gender: "Female", 
    visitDate: "Dec 01, 2023", dr: "Dr. Priya Patel",
    proc: "Orthodontic Adjustment", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Penicillin Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Verification Pending", insIcon: "error", insColor: "text-error",
    phone: "+1 (555) 456-7890", email: "amara.patel@example.com", policyId: "#PENDING-04"
  },
  { 
    id: "DC-88493", name: "Marcus Chen", initials: "MC", color: "bg-secondary-fixed text-on-secondary-fixed", 
    age: "45 yrs", gender: "Male", 
    visitDate: "Nov 04, 2023", dr: "Dr. Rohan Vance",
    proc: "Crown & Bridge", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "MetLife Dental PPO", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 345-6789", email: "marcus.chen@example.com", policyId: "#ML-39102"
  },
  { 
    id: "DC-88492", name: "Ananya Sterling", initials: "AS", color: "bg-primary-fixed text-on-primary-fixed", 
    age: "34 yrs", gender: "Female", 
    visitDate: "Oct 12, 2023", dr: "Dr. Priya Patel",
    proc: "Root Canal Therapy", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Latex Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 234-5678", email: "ananya.sterling@example.com", policyId: "#DD-84920"
  },

  // Page 2
  { 
    id: "DC-88491", name: "David Miller", initials: "DM", color: "bg-teal-100 text-teal-800", 
    age: "61 yrs", gender: "Male", 
    visitDate: "Oct 08, 2023", dr: "Dr. Sarah Sharma",
    proc: "Routine Cleaning & Exam", procColor: "bg-primary-fixed text-on-primary-fixed",
    alert: "Diabetic (Type 2)", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 678-1234", email: "david.miller@example.com", policyId: "#DD-92817"
  },
  { 
    id: "DC-88490", name: "Elena Rostova", initials: "ER", color: "bg-rose-100 text-rose-800", 
    age: "24 yrs", gender: "Female", 
    visitDate: "Sep 29, 2023", dr: "Dr. Priya Patel",
    proc: "Porcelain Veneers", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "Cigna Dental Care", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 789-2345", email: "elena.rostova@example.com", policyId: "#CG-19482"
  },
  { 
    id: "DC-88489", name: "Carlos Hernandez", initials: "CH", color: "bg-amber-100 text-amber-800", 
    age: "39 yrs", gender: "Male", 
    visitDate: "Sep 15, 2023", dr: "Dr. Rohan Vance",
    proc: "Wisdom Tooth Extraction", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "Penicillin Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "MetLife Dental PPO", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 890-3456", email: "carlos.h@example.com", policyId: "#ML-48291"
  },
  { 
    id: "DC-88488", name: "Sophia Washington", initials: "SW", color: "bg-indigo-100 text-indigo-800", 
    age: "50 yrs", gender: "Female", 
    visitDate: "Aug 22, 2023", dr: "Dr. Sarah Sharma",
    proc: "Periodontal Scaling", procColor: "bg-primary-fixed text-on-primary-fixed",
    alert: "Hypertension", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 901-4567", email: "sophia.w@example.com", policyId: "#DD-38194"
  },

  // Page 3
  { 
    id: "DC-88487", name: "Liam O'Connor", initials: "LO", color: "bg-emerald-100 text-emerald-800", 
    age: "41 yrs", gender: "Male", 
    visitDate: "Aug 14, 2023", dr: "Dr. Rohan Vance",
    proc: "Crown & Bridge", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "Guardian Dental Network", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 012-5678", email: "liam.oconnor@example.com", policyId: "#GD-94812"
  },
  { 
    id: "DC-88486", name: "Zoe Ramirez", initials: "ZR", color: "bg-purple-100 text-purple-800", 
    age: "19 yrs", gender: "Female", 
    visitDate: "Jul 30, 2023", dr: "Dr. Priya Patel",
    proc: "Orthodontic Adjustment", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Latex Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 123-6789", email: "zoe.ramirez@example.com", policyId: "#DD-59281"
  },
  { 
    id: "DC-88485", name: "Robert Taylor", initials: "RT", color: "bg-blue-100 text-blue-800", 
    age: "67 yrs", gender: "Male", 
    visitDate: "Jul 18, 2023", dr: "Dr. Sarah Sharma",
    proc: "Dental Implants", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "Hypertension", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Cigna Dental Care", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 234-7890", email: "robert.taylor@example.com", policyId: "#CG-94817"
  },
  { 
    id: "DC-88484", name: "Aaliyah Khan", initials: "AK", color: "bg-sky-100 text-sky-800", 
    age: "31 yrs", gender: "Female", 
    visitDate: "Jun 25, 2023", dr: "Dr. Priya Patel",
    proc: "Laser Teeth Whitening", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "Self-Pay / Direct Billing", insIcon: "credit_card", insColor: "text-on-surface-variant",
    phone: "+1 (555) 345-8901", email: "aaliyah.khan@example.com", policyId: "#SELF-PAY"
  },

  // Page 62 (Archive / Long-term patients)
  { 
    id: "DC-86004", name: "William Becker", initials: "WB", color: "bg-slate-200 text-slate-800", 
    age: "58 yrs", gender: "Male", 
    visitDate: "Jan 10, 2022", dr: "Dr. Sarah Sharma",
    proc: "Root Canal Therapy", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Penicillin Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 456-9012", email: "william.becker@example.com", policyId: "#DD-10293"
  },
  { 
    id: "DC-86003", name: "Grace Lin", initials: "GL", color: "bg-pink-100 text-pink-800", 
    age: "33 yrs", gender: "Female", 
    visitDate: "Dec 14, 2021", dr: "Dr. Rohan Vance",
    proc: "Crown & Bridge", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "MetLife Dental PPO", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 567-0123", email: "grace.lin@example.com", policyId: "#ML-84910"
  },
  { 
    id: "DC-86002", name: "Arthur Pendelton", initials: "AP", color: "bg-orange-100 text-orange-800", 
    age: "72 yrs", gender: "Male", 
    visitDate: "Nov 02, 2021", dr: "Dr. Priya Patel",
    proc: "Dental Implants", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "Hypertension", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Cigna Dental Care", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 678-1235", email: "arthur.p@example.com", policyId: "#CG-84729"
  },
  { 
    id: "DC-86001", name: "Chloe Bennett", initials: "CB", color: "bg-cyan-100 text-cyan-800", 
    age: "26 yrs", gender: "Female", 
    visitDate: "Oct 19, 2021", dr: "Dr. Sarah Sharma",
    proc: "Routine Cleaning & Exam", procColor: "bg-primary-fixed text-on-primary-fixed",
    alert: "Latex Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Guardian Dental Network", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 789-2346", email: "chloe.bennett@example.com", policyId: "#GD-38190"
  }
];

const QUICK_ALERTS = [
  "Latex Allergy",
  "Penicillin Allergy",
  "Hypertension",
  "Diabetic (Type 2)",
  "None Reported"
];

// Initial 32 Adult Universal Teeth Odontogram Template
const INITIAL_TEETH_DATA: ToothData[] = [
  // Upper Right (1 - 8)
  { num: 1, name: "Upper Right 3rd Molar (Wisdom)", arch: "Upper", condition: "Extracted", notes: "Surgically extracted in 2020." },
  { num: 2, name: "Upper Right 2nd Molar", arch: "Upper", condition: "Healthy", notes: "Sound structure, no caries." },
  { num: 3, name: "Upper Right 1st Molar", arch: "Upper", condition: "Crown", notes: "Zirconia full contour crown placed." },
  { num: 4, name: "Upper Right 2nd Premolar", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 5, name: "Upper Right 1st Premolar", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 6, name: "Upper Right Canine", arch: "Upper", condition: "Healthy", notes: "Good gingival margin." },
  { num: 7, name: "Upper Right Lateral Incisor", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 8, name: "Upper Right Central Incisor", arch: "Upper", condition: "Healthy", notes: "Mild incisal wear." },

  // Upper Left (9 - 16)
  { num: 9, name: "Upper Left Central Incisor", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 10, name: "Upper Left Lateral Incisor", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 11, name: "Upper Left Canine", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 12, name: "Upper Left 1st Premolar", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 13, name: "Upper Left 2nd Premolar", arch: "Upper", condition: "Caries", notes: "Incipient occlusal enamel caries - watch." },
  { num: 14, name: "Upper Left 1st Molar", arch: "Upper", condition: "Root Canal", notes: "Root canal therapy completed. Core buildup intact." },
  { num: 15, name: "Upper Left 2nd Molar", arch: "Upper", condition: "Healthy", notes: "Sound." },
  { num: 16, name: "Upper Left 3rd Molar (Wisdom)", arch: "Upper", condition: "Extracted", notes: "Extracted." },

  // Lower Left (17 - 24)
  { num: 17, name: "Lower Left 3rd Molar (Wisdom)", arch: "Lower", condition: "Extracted", notes: "Extracted." },
  { num: 18, name: "Lower Left 2nd Molar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 19, name: "Lower Left 1st Molar", arch: "Lower", condition: "Implant", notes: "Titanium fixture integrated. Screw-retained crown." },
  { num: 20, name: "Lower Left 2nd Premolar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 21, name: "Lower Left 1st Premolar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 22, name: "Lower Left Canine", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 23, name: "Lower Left Lateral Incisor", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 24, name: "Lower Left Central Incisor", arch: "Lower", condition: "Healthy", notes: "Sound." },

  // Lower Right (25 - 32)
  { num: 25, name: "Lower Right Central Incisor", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 26, name: "Lower Right Lateral Incisor", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 27, name: "Lower Right Canine", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 28, name: "Lower Right 1st Premolar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 29, name: "Lower Right 2nd Premolar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 30, name: "Lower Right 1st Molar", arch: "Lower", condition: "Crown", notes: "PFM crown on distal abutment." },
  { num: 31, name: "Lower Right 2nd Molar", arch: "Lower", condition: "Healthy", notes: "Sound." },
  { num: 32, name: "Lower Right 3rd Molar (Wisdom)", arch: "Lower", condition: "Extracted", notes: "Extracted." }
];

export default function Patients() {
  const [patients, setPatients] = useState<PatientRecord[]>(MASTER_PATIENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [historyPatientName, setHistoryPatientName] = useState<string | null>(null);
  const [odontogramPatient, setOdontogramPatient] = useState<PatientRecord | null>(null);

  // Odontogram state
  const [teethList, setTeethList] = useState<ToothData[]>(INITIAL_TEETH_DATA);
  const [selectedTooth, setSelectedTooth] = useState<ToothData>(INITIAL_TEETH_DATA[13]); // Default tooth #14
  const [archFilter, setArchFilter] = useState<'All' | 'Upper' | 'Lower'>('All');

  // Filter Popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedInsuranceFilter, setSelectedInsuranceFilter] = useState("All");
  const [selectedAlertFilter, setSelectedAlertFilter] = useState("All");
  const [selectedProcFilter, setSelectedProcFilter] = useState("All");
  const filterRef = useRef<HTMLDivElement>(null);

  // Sort Popover state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const sortRef = useRef<HTMLDivElement>(null);

  // New Patient Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [procedure, setProcedure] = useState("Routine Cleaning & Exam");
  const [medicalAlert, setMedicalAlert] = useState("");
  const [insurance, setInsurance] = useState("Delta Dental Premier");
  const [policyId, setPolicyId] = useState("");

  // Edit Patient Form state
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editGender, setEditGender] = useState("Female");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editProcedure, setEditProcedure] = useState("");
  const [editMedicalAlert, setEditMedicalAlert] = useState("");
  const [editInsurance, setEditInsurance] = useState("");
  const [editPolicyId, setEditPolicyId] = useState("");
  const [editDr, setEditDr] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Close filter/sort popovers when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Search Logic
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.proc.toLowerCase().includes(q) ||
      p.alert.toLowerCase().includes(q) ||
      p.ins.toLowerCase().includes(q);

    const matchesInsurance = selectedInsuranceFilter === "All" || p.ins.includes(selectedInsuranceFilter);
    const matchesAlert = selectedAlertFilter === "All" || 
      (selectedAlertFilter === "Has Alert" ? p.alert !== "None Reported" : p.alert.includes(selectedAlertFilter));
    const matchesProc = selectedProcFilter === "All" || p.proc.includes(selectedProcFilter);

    return matchesSearch && matchesInsurance && matchesAlert && matchesProc;
  });

  // Sort Logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (selectedSort === "name_asc") return a.name.localeCompare(b.name);
    if (selectedSort === "name_desc") return b.name.localeCompare(a.name);
    if (selectedSort === "age_asc") return parseInt(a.age) - parseInt(b.age);
    if (selectedSort === "age_desc") return parseInt(b.age) - parseInt(a.age);
    if (selectedSort === "id_asc") return a.id.localeCompare(b.id);
    if (selectedSort === "id_desc") return b.id.localeCompare(a.id);
    return 0; // default order
  });

  // Pagination Logic (4 items per page)
  const itemsPerPage = 4;
  const totalPages = 62;
  
  // Get slice of patients according to currentPage
  const getPagePatients = () => {
    // If active search or filters, paginate filtered list
    const isFiltered = searchQuery || selectedInsuranceFilter !== "All" || selectedAlertFilter !== "All" || selectedProcFilter !== "All";
    if (isFiltered) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return sortedPatients.slice(startIndex, startIndex + itemsPerPage);
    }

    // Default multi-page representation for 1..62
    if (currentPage === 1) return sortedPatients.slice(0, 4);
    if (currentPage === 2) return sortedPatients.slice(4, 8);
    if (currentPage === 3) return sortedPatients.slice(8, 12);
    if (currentPage === 62) return sortedPatients.slice(12, 16);

    // Any intermediate page procedurally mapped
    const offset = ((currentPage - 1) * 2) % (sortedPatients.length - 3);
    return sortedPatients.slice(offset, offset + 4);
  };

  const paginatedPatients = getPagePatients();

  // Open Edit Patient Modal
  const handleOpenEdit = (patient: PatientRecord) => {
    setEditingPatient(patient);
    const parts = patient.name.split(" ");
    setEditFirstName(parts[0] || "");
    setEditLastName(parts.slice(1).join(" ") || "");
    setEditAge(patient.age);
    setEditGender(patient.gender);
    setEditPhone(patient.phone || "+1 (555) 000-0000");
    setEditEmail(patient.email || `${patient.name.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    setEditProcedure(patient.proc);
    setEditMedicalAlert(patient.alert);
    setEditInsurance(patient.ins);
    setEditPolicyId(patient.policyId || "#INS-84920");
    setEditDr(patient.dr);
  };

  // Save Patient Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    const fullName = `${editFirstName.trim()} ${editLastName.trim()}`;
    const initials = `${editFirstName.trim()[0]}${editLastName.trim()[0]}`.toUpperCase();

    const updated: PatientRecord = {
      ...editingPatient,
      name: fullName,
      initials: initials,
      age: editAge.includes("yrs") ? editAge : `${editAge} yrs`,
      gender: editGender,
      phone: editPhone,
      email: editEmail,
      proc: editProcedure,
      alert: editMedicalAlert.trim() || "None Reported",
      alertColor: editMedicalAlert.trim() && editMedicalAlert.trim() !== "None Reported" 
        ? "bg-error-container text-on-error-container" 
        : "bg-surface-container-high text-on-surface-variant",
      alertIcon: editMedicalAlert.trim() && editMedicalAlert.trim() !== "None Reported" ? "warning" : "",
      ins: editInsurance,
      policyId: editPolicyId,
      dr: editDr
    };

    setPatients(prev => prev.map(p => p.id === editingPatient.id ? updated : p));
    setEditingPatient(null);
    showToast(`Updated clinical record for ${fullName}!`);
  };

  // Open Odontogram Modal
  const handleOpenOdontogram = (patient: PatientRecord) => {
    setOdontogramPatient(patient);
    // customize selected tooth for patient procedure
    if (patient.proc.includes("Root Canal")) {
      setSelectedTooth(INITIAL_TEETH_DATA.find(t => t.num === 14) || INITIAL_TEETH_DATA[0]);
    } else if (patient.proc.includes("Implants")) {
      setSelectedTooth(INITIAL_TEETH_DATA.find(t => t.num === 19) || INITIAL_TEETH_DATA[0]);
    } else {
      setSelectedTooth(INITIAL_TEETH_DATA[2]); // tooth #3
    }
  };

  // Update tooth condition in Odontogram
  const updateToothCondition = (newCond: ToothCondition) => {
    setTeethList(prev => prev.map(t => t.num === selectedTooth.num ? { ...t, condition: newCond } : t));
    setSelectedTooth(prev => ({ ...prev, condition: newCond }));
    showToast(`Tooth #${selectedTooth.num} updated to "${newCond}".`);
  };

  // Create Patient Form submit
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const initials = `${firstName.trim()[0]}${lastName.trim()[0]}`.toUpperCase();
    
    let ageStr = "32 yrs";
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      if (!isNaN(birthYear)) {
        const calculatedAge = new Date().getFullYear() - birthYear;
        if (calculatedAge > 0 && calculatedAge < 120) {
          ageStr = `${calculatedAge} yrs`;
        }
      }
    }

    const newRecord: PatientRecord = {
      id: `DC-${Math.floor(88500 + Math.random() * 9000)}`,
      name: fullName,
      initials: initials,
      color: "bg-primary-fixed text-on-primary-fixed",
      age: ageStr,
      gender: gender,
      visitDate: "Today",
      dr: "Dr. Sarah Sharma",
      proc: procedure,
      procColor: "bg-primary-fixed text-on-primary-fixed",
      alert: medicalAlert.trim() || "None Reported",
      alertColor: medicalAlert.trim() && medicalAlert.trim() !== "None Reported" 
        ? "bg-error-container text-on-error-container" 
        : "bg-surface-container-high text-on-surface-variant",
      alertIcon: medicalAlert.trim() && medicalAlert.trim() !== "None Reported" ? "warning" : "",
      ins: insurance,
      insIcon: insurance.includes("Self-Pay") ? "credit_card" : "verified",
      insColor: insurance.includes("Self-Pay") ? "text-on-surface-variant" : "text-tertiary-container",
      phone: phone || "+1 (555) 000-0000",
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      policyId: policyId || "#NEW-POL"
    };

    setPatients([newRecord, ...patients]);
    setShowNewPatientModal(false);
    showToast(`Patient record created for ${fullName}!`);

    // Reset Form
    setFirstName("");
    setLastName("");
    setDob("");
    setPhone("");
    setEmail("");
    setMedicalAlert("");
    setPolicyId("");
  };

  const activeFilterCount = (selectedInsuranceFilter !== "All" ? 1 : 0) + 
                            (selectedAlertFilter !== "All" ? 1 : 0) + 
                            (selectedProcFilter !== "All" ? 1 : 0);

  const getConditionStyle = (cond: ToothCondition) => {
    switch (cond) {
      case 'Healthy': return 'bg-emerald-500/10 text-emerald-700 border-emerald-400';
      case 'Crown': return 'bg-amber-500/15 text-amber-700 border-amber-400';
      case 'Root Canal': return 'bg-blue-500/15 text-blue-700 border-blue-400';
      case 'Implant': return 'bg-purple-500/15 text-purple-700 border-purple-400';
      case 'Caries': return 'bg-rose-500/15 text-rose-700 border-rose-400';
      case 'Extracted': return 'bg-gray-200 text-gray-500 border-gray-300 line-through';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 relative pb-12"
    >
      {/* Shared Non-Intrusive Portaled Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Power BI Analytics Summary Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-container via-surface-container-low to-surface-container-high rounded-2xl p-6 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span className="text-xs font-semibold tracking-wider uppercase">Power BI Clinical Analytics</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Patient Demographics & Treatment Flow</h2>
          </div>
          <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 bg-tertiary-container rounded-full animate-pulse"></span>
            <span className="text-sm text-on-surface-variant font-medium">Live Sync: Active Database</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Active Patients", val: "2,482", sub: "+12% this month", subColor: "text-tertiary-container", barColor: "bg-primary", pct: "78%" },
            { label: "Preventive Care Ratio", val: "64.5%", sub: "Optimal", subColor: "text-secondary", barColor: "bg-secondary", pct: "64.5%" },
            { label: "Insurance Verified", val: "91.2%", sub: "High tier", subColor: "text-tertiary-container", barColor: "bg-tertiary-container", pct: "91.2%" },
            { label: "Medical Alerts Flagged", val: "142", sub: "Requires Review", subColor: "text-error", barColor: "bg-error", pct: "25%" }
          ].map((kpi, i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-md p-4 rounded-xl shadow-xs">
              <div className="text-xs font-medium text-on-surface-variant mb-1">{kpi.label}</div>
              <div className="text-xl font-bold text-on-surface flex items-baseline justify-between">
                <span>{kpi.val}</span>
                <span className={`text-[10px] ${kpi.subColor} font-semibold`}>{kpi.sub}</span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`${kpi.barColor} h-full rounded-full`} style={{ width: kpi.pct }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Directory Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-container-lowest text-on-surface pl-10 pr-4 py-2.5 rounded-xl text-sm shadow-xs border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline" 
              placeholder="Search by patient name, ID, or procedure..." 
              type="text"
            />
          </div>

          {/* Filter Button & Popover */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xs border transition-all cursor-pointer ${
                activeFilterCount > 0 || isFilterOpen
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Menu Popover */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 left-0 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high p-4 z-50 ring-1 ring-black/5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-surface-container-low pb-2">
                    <span className="font-bold text-sm text-on-surface">Filter Patient Records</span>
                    {activeFilterCount > 0 && (
                      <button 
                        onClick={() => {
                          setSelectedInsuranceFilter("All");
                          setSelectedAlertFilter("All");
                          setSelectedProcFilter("All");
                          showToast("Filters reset to default.");
                        }}
                        className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Medical Alerts Filter */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Medical Alerts</label>
                    <select 
                      value={selectedAlertFilter}
                      onChange={(e) => {
                        setSelectedAlertFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="All">All Medical Alerts</option>
                      <option value="Has Alert">Flagged Alert (Any)</option>
                      <option value="Latex Allergy">Latex Allergy</option>
                      <option value="Penicillin Allergy">Penicillin Allergy</option>
                      <option value="Hypertension">Hypertension</option>
                      <option value="None Reported">None Reported</option>
                    </select>
                  </div>

                  {/* Insurance Filter */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Insurance Provider</label>
                    <select 
                      value={selectedInsuranceFilter}
                      onChange={(e) => {
                        setSelectedInsuranceFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="All">All Providers</option>
                      <option value="Delta Dental">Delta Dental Premier</option>
                      <option value="MetLife">MetLife Dental PPO</option>
                      <option value="Cigna">Cigna Dental Care</option>
                      <option value="Guardian">Guardian Dental</option>
                      <option value="Pending">Verification Pending</option>
                    </select>
                  </div>

                  {/* Procedure Filter */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Procedure</label>
                    <select 
                      value={selectedProcFilter}
                      onChange={(e) => {
                        setSelectedProcFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="All">All Procedures</option>
                      <option value="Root Canal">Root Canal Therapy</option>
                      <option value="Implants">Dental Implants</option>
                      <option value="Crown">Crown & Bridge</option>
                      <option value="Orthodontic">Orthodontic Adjustment</option>
                      <option value="Cleaning">Routine Cleaning & Exam</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-surface-container-low flex justify-end">
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="px-4 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Apply Filter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Button & Popover */}
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xs border transition-all cursor-pointer ${
                isSortOpen || selectedSort !== "default"
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>Sort</span>
            </button>

            {/* Sort Menu Popover */}
            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 left-0 w-64 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high p-2 z-50 ring-1 ring-black/5 space-y-1"
                >
                  <div className="px-3 py-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Sort Patient Records
                  </div>
                  {[
                    { id: "default", label: "Default Order (Recent Visit)" },
                    { id: "name_asc", label: "Patient Name (A → Z)" },
                    { id: "name_desc", label: "Patient Name (Z → A)" },
                    { id: "age_asc", label: "Age (Youngest First)" },
                    { id: "age_desc", label: "Age (Oldest First)" },
                    { id: "id_asc", label: "Patient ID (Ascending)" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSort(s.id);
                        setIsSortOpen(false);
                        showToast(`Sorted by ${s.label}`);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                        selectedSort === s.id 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{s.label}</span>
                      {selectedSort === s.id && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Add Patient Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewPatientModal(true)}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-primary/20 hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Add New Patient</span>
        </motion.button>
      </div>

      {/* Patient Table Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container-high">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider border-b border-surface-container-high">
                <th className="py-3.5 px-4 font-semibold">PATIENT NAME & ID</th>
                <th className="py-3.5 px-4 font-semibold">AGE / GENDER</th>
                <th className="py-3.5 px-4 font-semibold">LAST VISIT</th>
                <th className="py-3.5 px-4 font-semibold">PRIMARY PROCEDURE</th>
                <th className="py-3.5 px-4 font-semibold">MEDICAL ALERTS</th>
                <th className="py-3.5 px-4 font-semibold">INSURANCE STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm text-on-surface">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[36px] block text-outline/60 mb-2">person_search</span>
                    No patients found matching the selected search query or filters.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${patient.color} shadow-xs`}>
                          {patient.initials}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{patient.name}</div>
                          <div className="text-xs text-on-surface-variant font-mono">ID: #{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-on-surface">{patient.age}</div>
                      <div className="text-xs text-on-surface-variant">{patient.gender}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-on-surface">{patient.visitDate}</div>
                      <div className="text-xs text-secondary font-medium">{patient.dr}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${patient.procColor}`}>
                        {patient.proc}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${patient.alertColor}`}>
                        {patient.alertIcon && <span className="material-symbols-outlined text-[14px]">{patient.alertIcon}</span>}
                        {patient.alert}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-sm ${patient.insColor}`}>
                        <span className="material-symbols-outlined text-[16px]">{patient.insIcon}</span>
                        {patient.ins}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. History Icon */}
                        <button 
                          onClick={() => setHistoryPatientName(patient.name)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer" 
                          title="View Clinical History"
                        >
                          <span className="material-symbols-outlined text-[18px]">history</span>
                        </button>

                        {/* 2. Edit Icon -> Opens Edit Patient Modal with existing record */}
                        <button 
                          onClick={() => handleOpenEdit(patient)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all cursor-pointer" 
                          title="Edit Patient Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        {/* 3. Tooth Icon -> Opens Interactive Odontogram Chart */}
                        <button 
                          onClick={() => handleOpenOdontogram(patient)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all cursor-pointer" 
                          title="Odontogram Dental Chart"
                        >
                          <span className="material-symbols-outlined text-[18px]">dentistry</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Accurate Working Pagination 1 to 62 */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-surface-container-low/30 border-t border-surface-container-high gap-4">
          <div className="text-xs text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">
              {currentPage === 62 ? '2445-2482' : `${(currentPage - 1) * 4 + 1}-${Math.min(currentPage * 4, 2482)}`}
            </span> of <span className="font-bold text-on-surface">2,482</span> patients
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 1 
                  ? 'bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              Previous
            </button>

            {/* Page 1 */}
            <button 
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 1 
                  ? 'bg-primary text-on-primary shadow-xs' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button 
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 2 
                  ? 'bg-primary text-on-primary shadow-xs' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button 
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 3 
                  ? 'bg-primary text-on-primary shadow-xs' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              3
            </button>

            <span className="px-1 text-on-surface-variant font-bold text-xs">...</span>

            {/* Page 62 */}
            <button 
              onClick={() => setCurrentPage(62)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 62 
                  ? 'bg-primary text-on-primary shadow-xs' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              62
            </button>

            {/* Next Button */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentPage === totalPages 
                  ? 'bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. EDIT PATIENT RECORD MODAL (Pre-filled with Existing Data)              */}
      {/* ========================================================================= */}
      {editingPatient && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fullscreen Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingPatient(null)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px] sm:text-[26px]">edit_note</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-on-surface">Edit Patient Record</h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono font-bold rounded-md">
                      #{editingPatient.id}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-outline mt-0.5">
                    Update clinical demographics, medical alerts & insurance for {editingPatient.name}.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer shrink-0" 
                onClick={() => setEditingPatient(null)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Section 1: Demographics */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>1. Personal & Contact Information</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">First Name</label>
                    <input 
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      required 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Last Name</label>
                    <input 
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      required 
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Age</label>
                    <input 
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="e.g. 34 yrs"
                      required 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Gender</label>
                    <select 
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-Binary / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Phone Number</label>
                    <input 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
                    <input 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      type="email"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Clinical Alerts & Procedure */}
              <div className="space-y-3 pt-2 border-t border-surface-container-low">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                  <span className="material-symbols-outlined text-[16px]">medical_services</span>
                  <span>2. Clinical Care & Safety Alerts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Primary Procedure</label>
                    <select 
                      value={editProcedure}
                      onChange={(e) => setEditProcedure(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Root Canal Therapy</option>
                      <option>Dental Implants</option>
                      <option>Crown & Bridge</option>
                      <option>Orthodontic Adjustment</option>
                      <option>Routine Cleaning & Exam</option>
                      <option>Porcelain Veneers</option>
                      <option>Wisdom Tooth Extraction</option>
                      <option>Laser Teeth Whitening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Attending Doctor</label>
                    <select 
                      value={editDr}
                      onChange={(e) => setEditDr(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Dr. Sarah Sharma</option>
                      <option>Dr. Priya Patel</option>
                      <option>Dr. Rohan Vance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Medical Alerts & Allergies</label>
                  <input 
                    value={editMedicalAlert}
                    onChange={(e) => setEditMedicalAlert(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium mb-2" 
                    placeholder="e.g. Latex Allergy, Penicillin allergy" 
                    type="text"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ALERTS.map((alertText, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (alertText === "None Reported") {
                            setEditMedicalAlert("None Reported");
                          } else if (!editMedicalAlert || editMedicalAlert === "None Reported") {
                            setEditMedicalAlert(alertText);
                          } else {
                            setEditMedicalAlert(`${editMedicalAlert}, ${alertText}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px] text-primary">add</span>
                        <span>{alertText}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Insurance */}
              <div className="space-y-3 pt-2 border-t border-surface-container-low">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>3. Insurance Provider & Billing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Insurance Provider</label>
                    <select 
                      value={editInsurance}
                      onChange={(e) => setEditInsurance(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Delta Dental Premier</option>
                      <option>MetLife Dental PPO</option>
                      <option>Cigna Dental Care</option>
                      <option>Guardian Dental Network</option>
                      <option>Verification Pending</option>
                      <option>Self-Pay / Direct Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Subscriber / Policy ID</label>
                    <input 
                      value={editPolicyId}
                      onChange={(e) => setEditPolicyId(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-surface-container-low shrink-0">
                <button 
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-outline hover:text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors cursor-pointer text-center" 
                  onClick={() => setEditingPatient(null)} 
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer text-center" 
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE ODONTOGRAM DENTAL CHART MODAL (Tooth Icon Action)         */}
      {/* ========================================================================= */}
      {odontogramPatient && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fullscreen Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOdontogramPatient(null)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest rounded-2xl w-full max-w-4xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[94vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px] sm:text-[26px]">dentistry</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-on-surface">Adult Odontogram Dental Chart</h3>
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md">
                      {odontogramPatient.name} (#{odontogramPatient.id})
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-outline mt-0.5">
                    Universal Numbering System (Teeth 1–32) • Maxillary & Mandibular Arches
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer shrink-0" 
                onClick={() => setOdontogramPatient(null)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Odontogram Controls & Arch Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Arch View:</span>
                  <div className="flex gap-1 bg-surface-container-lowest p-1 rounded-lg border border-surface-container-high text-xs font-semibold">
                    {(['All', 'Upper', 'Lower'] as const).map(arch => (
                      <button
                        key={arch}
                        onClick={() => setArchFilter(arch)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                          archFilter === arch ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {arch === 'All' ? 'Full Mouth (1-32)' : arch === 'Upper' ? 'Upper Arch (1-16)' : 'Lower Arch (17-32)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-outline font-medium">Click any tooth to examine & update</span>
                </div>
              </div>

              {/* Upper Arch (1 to 16) */}
              {(archFilter === 'All' || archFilter === 'Upper') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">expand_less</span>
                      Maxillary Arch (Upper Teeth 1 – 16)
                    </span>
                    <span className="text-[11px] text-outline">Right Quadrant (1-8) | Left Quadrant (9-16)</span>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                    {teethList.filter(t => t.arch === 'Upper').map(tooth => {
                      const isSelected = selectedTooth.num === tooth.num;
                      return (
                        <button
                          key={tooth.num}
                          onClick={() => setSelectedTooth(tooth)}
                          className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all border text-center cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-primary ring-offset-1 shadow-md scale-105 z-10' 
                              : 'hover:border-primary/50'
                          } ${getConditionStyle(tooth.condition)}`}
                          title={`#${tooth.num}: ${tooth.name} (${tooth.condition})`}
                        >
                          <span className="text-[10px] font-bold">#{tooth.num}</span>
                          <span className="material-symbols-outlined text-[20px] my-1">dentistry</span>
                          <span className="text-[8px] font-semibold truncate w-full block">{tooth.condition}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lower Arch (17 to 32) */}
              {(archFilter === 'All' || archFilter === 'Lower') && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">expand_more</span>
                      Mandibular Arch (Lower Teeth 17 – 32)
                    </span>
                    <span className="text-[11px] text-outline">Left Quadrant (17-24) | Right Quadrant (25-32)</span>
                  </div>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                    {teethList.filter(t => t.arch === 'Lower').map(tooth => {
                      const isSelected = selectedTooth.num === tooth.num;
                      return (
                        <button
                          key={tooth.num}
                          onClick={() => setSelectedTooth(tooth)}
                          className={`p-2 rounded-xl flex flex-col items-center justify-between transition-all border text-center cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-primary ring-offset-1 shadow-md scale-105 z-10' 
                              : 'hover:border-primary/50'
                          } ${getConditionStyle(tooth.condition)}`}
                          title={`#${tooth.num}: ${tooth.name} (${tooth.condition})`}
                        >
                          <span className="text-[10px] font-bold">#{tooth.num}</span>
                          <span className="material-symbols-outlined text-[20px] my-1">dentistry</span>
                          <span className="text-[8px] font-semibold truncate w-full block">{tooth.condition}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Tooth Detail & Diagnostic Notes */}
              <div className="p-4 bg-surface rounded-2xl border border-surface-container-high space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                      #{selectedTooth.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{selectedTooth.name}</h4>
                      <p className="text-xs text-outline font-medium">{selectedTooth.arch} Arch • Adult Dentition</p>
                    </div>
                  </div>

                  {/* Condition Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant">Update Status:</span>
                    <div className="flex flex-wrap gap-1">
                      {(['Healthy', 'Crown', 'Root Canal', 'Implant', 'Caries', 'Extracted'] as ToothCondition[]).map(cond => (
                        <button
                          key={cond}
                          onClick={() => updateToothCondition(cond)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            selectedTooth.condition === cond 
                              ? 'bg-primary text-on-primary border-primary shadow-xs' 
                              : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:bg-surface-container-high'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tooth Notes */}
                <div className="text-xs text-on-surface-variant font-mono bg-surface-container-lowest p-3 rounded-xl border border-surface-container-high">
                  <span className="font-bold text-primary block mb-0.5 font-sans">Clinical Finding:</span>
                  {selectedTooth.notes || "No pathological lesions detected on periapical radiograph. Bone levels normal."}
                </div>

                {/* Clinical Legend */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-outline font-medium">
                  <span className="font-bold text-on-surface">Color Legend:</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy (Sound)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Crown / Bridge</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Root Canal Treated</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Dental Implant</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Caries / Watch</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> Extracted / Missing</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-surface-container-low bg-surface-container-lowest flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
              <button 
                onClick={() => showToast(`Exported full mouth Odontogram report for ${odontogramPatient.name}`)}
                className="w-full sm:w-auto px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print / Export Chart
              </button>
              <button 
                onClick={() => setOdontogramPatient(null)}
                className="w-full sm:w-auto px-6 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold shadow-xs hover:bg-primary-container transition-all cursor-pointer text-center"
              >
                Close Odontogram
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 3. ADD NEW PATIENT MODAL (Portaled to document.body)                     */}
      {/* ========================================================================= */}
      {showNewPatientModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fullscreen Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowNewPatientModal(false)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px] sm:text-[26px]">person_add</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface">Add New Patient Record</h3>
                  <p className="text-[11px] sm:text-xs text-outline mt-0.5">
                    Register clinical demographics, medical alerts & insurance provider.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer shrink-0" 
                onClick={() => setShowNewPatientModal(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePatient} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Section 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>1. Personal & Contact Information</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">First Name</label>
                    <input 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="e.g. John" 
                      required 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Last Name</label>
                    <input 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="e.g. Doe" 
                      required 
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Date of Birth</label>
                    <input 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      required 
                      type="date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Non-Binary / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Phone Number</label>
                    <input 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="+1 (555) 000-0000" 
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
                    <input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="patient@example.com" 
                      type="email"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-3 pt-2 border-t border-surface-container-low">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                  <span className="material-symbols-outlined text-[16px]">medical_services</span>
                  <span>2. Clinical Care & Safety Alerts</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Primary Procedure</label>
                  <select 
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                  >
                    <option>Routine Cleaning & Exam</option>
                    <option>Root Canal Therapy</option>
                    <option>Dental Implants</option>
                    <option>Porcelain Veneers</option>
                    <option>Crown & Bridge</option>
                    <option>Orthodontic Adjustment</option>
                    <option>Wisdom Tooth Extraction</option>
                    <option>Laser Teeth Whitening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Medical Alerts & Allergies</label>
                  <input 
                    value={medicalAlert}
                    onChange={(e) => setMedicalAlert(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium mb-2" 
                    placeholder="e.g. Latex Allergy, Penicillin allergy, Hypertension" 
                    type="text"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ALERTS.map((alertText, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (alertText === "None Reported") {
                            setMedicalAlert("None Reported");
                          } else if (!medicalAlert || medicalAlert === "None Reported") {
                            setMedicalAlert(alertText);
                          } else {
                            setMedicalAlert(`${medicalAlert}, ${alertText}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs rounded-lg transition-colors flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px] text-primary">add</span>
                        <span>{alertText}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3 pt-2 border-t border-surface-container-low">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>3. Insurance Provider & Billing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Insurance Provider</label>
                    <select 
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium"
                    >
                      <option>Delta Dental Premier</option>
                      <option>MetLife Dental PPO</option>
                      <option>Cigna Dental Care</option>
                      <option>Guardian Dental Network</option>
                      <option>Self-Pay / Direct Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">Policy ID</label>
                    <input 
                      value={policyId}
                      onChange={(e) => setPolicyId(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-medium" 
                      placeholder="#INS-84920" 
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-4 border-t border-surface-container-low shrink-0">
                <button 
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-outline hover:text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors cursor-pointer text-center" 
                  onClick={() => setShowNewPatientModal(false)} 
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer text-center" 
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Patient Record</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 4. PATIENT HISTORY DRAWER (Portaled to document.body)                     */}
      {/* ========================================================================= */}
      {historyPatientName && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-end">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setHistoryPatientName(null)}
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="bg-surface-container-lowest h-full w-full max-w-lg shadow-2xl flex flex-col p-4 sm:p-6 relative z-10"
          >
            <div className="flex justify-between items-center pb-4 border-b border-surface-variant/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">history_edu</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface">{historyPatientName}</h3>
                  <div className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5">Clinical timeline & treatment records</div>
                </div>
              </div>
              <button 
                className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer shrink-0" 
                onClick={() => setHistoryPatientName(null)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              <div className="relative pl-6 border-l-2 border-primary/30 space-y-8">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-lowest shadow-sm"></span>
                  <div className="text-xs text-primary font-bold font-mono">January 15, 2024</div>
                  <div className="font-bold text-on-surface text-base mt-1">Dental Implant Restoration</div>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Fixture torque verified at 35 Ncm. Screw-retained zirconia crown seated and occlusal clearance verified.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest shadow-sm"></span>
                  <div className="text-xs text-secondary font-bold font-mono">October 12, 2023</div>
                  <div className="font-bold text-on-surface text-base mt-1">Root Canal Therapy (Tooth #14)</div>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Completed successful endodontic treatment. Placed temporary crown. Follow-up scheduled in 2 weeks.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-tertiary-container ring-4 ring-surface-container-lowest shadow-sm"></span>
                  <div className="text-xs text-tertiary font-bold font-mono">May 04, 2023</div>
                  <div className="font-bold text-on-surface text-base mt-1">Routine Cleaning & Exam</div>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Periodontal probing showed healthy pocket depths (2-3mm). Minor plaque buildup removed via ultrasonic scaling.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-variant/20 flex justify-end shrink-0">
              <button 
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-xs hover:bg-primary-container transition-all cursor-pointer text-center" 
                onClick={() => setHistoryPatientName(null)}
              >
                Close History
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
