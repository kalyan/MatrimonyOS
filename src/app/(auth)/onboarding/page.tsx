'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Sliders,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { MockRepository } from '@/lib/mock/mock-repository';
import { SEED_COMMUNITIES } from '@/lib/mock/seed-data';
import { Profile, Gender, MaritalStatus, EmploymentType, DietaryHabits, CreatedByRelation } from '@/lib/types';
import AIBioModal from '@/components/ai/AIBioModal';

export default function OnboardingPage() {
  const router = useRouter();
  const { loginAsDemo, refreshProfile } = useAuth();

  // Current Step: 0 = 18+ confirmation gate, 1 = Basic, 2 = Education/Career, 3 = About/AI, 4 = Lifestyle, 5 = Preferences, 6 = Photo
  const [step, setStep] = useState(0);
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [showAiBioModal, setShowAiBioModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    createdBy: 'self' as CreatedByRelation,
    firstName: '',
    lastName: '',
    gender: 'female' as Gender,
    dob: '1998-05-20',
    heightCm: 165,
    maritalStatus: 'never_married' as MaritalStatus,
    motherTongue: 'Hindi',
    languages: 'Hindi, English',
    city: 'Bengaluru',
    state: 'Karnataka',
    willingToRelocate: true,
    highestEducation: "Master's in Technology",
    educationField: 'Computer Science',
    institution: 'BITS Pilani',
    profession: 'Software Development Engineer',
    industry: 'Technology',
    employmentType: 'full_time' as EmploymentType,
    annualIncome: '₹25 - ₹35 Lakhs',
    dietaryHabits: 'vegetarian' as DietaryHabits,
    familyValues: 'moderate' as 'traditional' | 'moderate' | 'liberal',
    interests: 'Reading, Classical Music, Hiking, Coffee',
    aboutMe: 'Passionate about engineering and thoughtful living. Value family traditions and personal growth.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    // Partner Preferences
    prefMinAge: 25,
    prefMaxAge: 32,
    prefEducations: "Master's, B.Tech, MBA",
    prefCities: 'Bengaluru, Mumbai, Pune, Delhi',
    prefDietary: 'vegetarian, eggetarian',
  });

  // Calculate age from DOB
  const calculateAge = (dobString: string): number => {
    const birth = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 0) {
      if (!isAgeConfirmed) {
        setErrorMsg('You must confirm that you are 18 years or older.');
        return;
      }
      const age = calculateAge(formData.dob);
      if (age < 18) {
        setErrorMsg('Registration is strictly restricted to individuals aged 18 and above.');
        return;
      }
    }

    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrorMsg('Please provide your first and last name.');
        return;
      }
    }

    if (step === 2) {
      if (!formData.highestEducation || !formData.profession) {
        setErrorMsg('Please fill in your education and profession.');
        return;
      }
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = () => {
    const age = calculateAge(formData.dob);
    const newProfileId = `prof-${Date.now()}`;
    const newUserId = `user-${Date.now()}`;

    const newProfile: Profile = {
      id: newProfileId,
      user_id: newUserId,
      first_name: formData.firstName || 'Candidate',
      last_name: formData.lastName || 'Member',
      gender: formData.gender,
      date_of_birth: formData.dob,
      age,
      height_cm: formData.heightCm,
      marital_status: formData.maritalStatus,
      mother_tongue: formData.motherTongue,
      languages_spoken: formData.languages.split(',').map((s) => s.trim()),
      city: formData.city,
      state: formData.state,
      country: 'India',
      citizenship: 'Indian',
      willing_to_relocate: formData.willingToRelocate,
      highest_education: formData.highestEducation,
      education_field: formData.educationField,
      institution: formData.institution,
      profession: formData.profession,
      industry: formData.industry,
      employment_type: formData.employmentType,
      annual_income_range: formData.annualIncome,
      dietary_habits: formData.dietaryHabits,
      smoking: 'no',
      drinking: 'no',
      interests: formData.interests.split(',').map((s) => s.trim()),
      hobbies: ['Reading', 'Travel'],
      family_values: formData.familyValues,
      about_me: formData.aboutMe,
      completeness_score: 95,
      profile_visibility: 'registered',
      photo_visibility: 'registered',
      contact_visibility: 'mutual_consent',
      is_verified: true,
      created_by_relation: formData.createdBy,
      primary_photo_url: formData.photoUrl,
      photos: [
        {
          id: `photo-${Date.now()}`,
          profile_id: newProfileId,
          url: formData.photoUrl,
          is_primary: true,
          order_index: 0,
          is_approved: true,
          created_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save in repository
    const profiles = MockRepository.getProfiles();
    profiles.unshift(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('matrimony_os_profiles', JSON.stringify(profiles));
    }

    // Save preferences
    MockRepository.savePreferences(newProfileId, {
      profile_id: newProfileId,
      min_age: formData.prefMinAge,
      max_age: formData.prefMaxAge,
      preferred_marital_status: [formData.maritalStatus],
      preferred_mother_tongues: [formData.motherTongue],
      preferred_countries: ['India'],
      preferred_states: [formData.state],
      preferred_cities: formData.prefCities.split(',').map((c) => c.trim()),
      preferred_educations: formData.prefEducations.split(',').map((e) => e.trim()),
      preferred_professions: [],
      preferred_dietary_habits: [formData.dietaryHabits],
    });

    // Login as newly created profile
    loginAsDemo(newProfileId, 'member');
    refreshProfile();
    router.push('/home');
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Stepper Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {step + 1} of 7</span>
          <span>
            {step === 0 && 'Age Confirmation'}
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Education & Career'}
            {step === 3 && 'About Me & AI Polish'}
            {step === 4 && 'Lifestyle & Values'}
            {step === 5 && 'Partner Preferences'}
            {step === 6 && 'Profile Photos'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300 rounded-full"
            style={{ width: `${((step + 1) / 7) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 0: 18+ AGE CONFIRMATION GATE */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">18+ Eligibility Confirmation</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Matrimony OS is exclusively dedicated to marriage seekers aged 18 and older. We enforce strict age verification to maintain trust and safety.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  max="2008-01-01"
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Calculated age: <strong className="text-slate-800">{calculateAge(formData.dob)} years</strong>
                </span>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isAgeConfirmed}
                  onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                  className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500 mt-0.5"
                />
                <span className="text-xs font-medium text-slate-700 leading-relaxed">
                  I solemnly declare that I am 18 years of age or older, and that I am registering on Matrimony OS for genuine matrimonial matchmaking.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sharma"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Created By</label>
                <select
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value as CreatedByRelation })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="self">Self</option>
                  <option value="parent">Parent (Mother / Father)</option>
                  <option value="sibling">Sibling (Brother / Sister)</option>
                  <option value="relative">Relative / Guardian</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mother Tongue</label>
                <input
                  type="text"
                  value={formData.motherTongue}
                  onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                checked={formData.willingToRelocate}
                onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded border-slate-300"
              />
              <span className="text-xs text-slate-700">Open to relocation after marriage</span>
            </div>
          </div>
        )}

        {/* STEP 2: EDUCATION & CAREER */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Education & Career</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Education Degree</label>
              <input
                type="text"
                placeholder="e.g. Master's in Computer Science, MBA, MBBS"
                value={formData.highestEducation}
                onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering, Law, Finance"
                  value={formData.educationField}
                  onChange={(e) => setFormData({ ...formData, educationField: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  placeholder="e.g. BITS Pilani, IIM"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profession / Designation</label>
              <input
                type="text"
                placeholder="e.g. Lead Product Manager, Doctor, CA"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="full_time">Private Sector (Full Time)</option>
                  <option value="government">Government / Public Sector</option>
                  <option value="business">Business / Entrepreneur</option>
                  <option value="self_employed">Self Employed / Consultant</option>
                  <option value="defence">Defence</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Income Bracket</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25 - ₹35 Lakhs"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ABOUT ME & AI POLISH */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">About Me</h2>
              <button
                type="button"
                onClick={() => setShowAiBioModal(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-rose-500 text-white text-xs font-bold shadow-sm hover:from-brand-700 hover:to-rose-600 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Polish with AI</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Write a thoughtful description of your values, work-life outlook, and what you cherish. You can also click <strong>Polish with AI</strong> to refine your points without exaggerations.
            </p>

            <div>
              <textarea
                rows={5}
                value={formData.aboutMe}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 4: LIFESTYLE & INTERESTS */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Lifestyle & Interests</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary Habits</label>
                <select
                  value={formData.dietaryHabits}
                  onChange={(e) => setFormData({ ...formData, dietaryHabits: e.target.value as DietaryHabits })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="jain">Jain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Family Values</label>
                <select
                  value={formData.familyValues}
                  onChange={(e) => setFormData({ ...formData, familyValues: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="moderate">Moderate / Balanced</option>
                  <option value="traditional">Traditional</option>
                  <option value="liberal">Progressive / Liberal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interests & Hobbies <span className="text-slate-400 font-normal">(Comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Classical Dance, Trekking, Reading, Yoga"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        )}

        {/* STEP 5: PARTNER PREFERENCES */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Partner Preferences</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Min Age</label>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={formData.prefMinAge}
                  onChange={(e) => setFormData({ ...formData, prefMinAge: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Max Age</label>
                <input
                  type="number"
                  min={formData.prefMinAge}
                  max={60}
                  value={formData.prefMaxAge}
                  onChange={(e) => setFormData({ ...formData, prefMaxAge: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Education Levels</label>
              <input
                type="text"
                value={formData.prefEducations}
                onChange={(e) => setFormData({ ...formData, prefEducations: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Cities</label>
              <input
                type="text"
                value={formData.prefCities}
                onChange={(e) => setFormData({ ...formData, prefCities: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        )}

        {/* STEP 6: PHOTO & PRIVACY */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Profile Photo & Privacy</h2>
            <p className="text-xs text-slate-500">
              Profiles with photos receive 4x more meaningful responses. You can choose to keep your photo visible only to registered members or mutual matches.
            </p>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={formData.photoUrl}
                alt="Preview"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-500/30 flex-shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-xs font-bold text-slate-800">Primary Photo URL</span>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
                <p className="text-[10px] text-slate-400">Provide an image URL or keep default for demo</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Default Privacy Controls Activated</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Your phone number is hidden. Search engine indexing is disabled (`noindex`). You have 100% control over contact sharing.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md shadow-brand-500/25 flex items-center space-x-1.5"
          >
            <span>{step === 6 ? 'Complete & View Matches' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Bio Assistant Modal */}
      {showAiBioModal && (
        <AIBioModal
          initialBio={formData.aboutMe}
          name={formData.firstName}
          profession={formData.profession}
          city={formData.city}
          onApply={(newBio) => setFormData({ ...formData, aboutMe: newBio })}
          onClose={() => setShowAiBioModal(false)}
        />
      )}
    </div>
  );
}
