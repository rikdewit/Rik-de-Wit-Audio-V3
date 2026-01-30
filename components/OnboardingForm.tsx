
import React, { useState, useCallback, useMemo } from 'react';
import { Send, CheckCircle2, ArrowRight, ArrowLeft, Check, Mail, Phone, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- Types ---
type StepId = 
  | 'main' 
  | 'live-type' | 'live-hire-role' | 'live-hire-details' 
  | 'live-hire-location-category' | 'live-hire-practical'
  | 'live-event-type' | 'live-music-check' | 'speakers-only' 
  | 'performers' | 'instruments' | 'location-equipment' | 'location-name' | 'live-practical'
  | 'studio-type' | 'studio-recording-method' | 'studio-locatie-keuze' | 'studio-details'
  | 'nabewerking-type' | 'nabewerking-details'
  | 'advies-who' | 'advies-goal' | 'advies-ruimte' | 'advies-doel' | 'advies-methode'
  | 'advies-gebruik' | 'advies-kopen-details' | 'advies-kopen-type' | 'advies-muzikant-details'
  | 'anders-beschrijving'
  | 'contact' | 'success' | 'error';

interface FormData {
  [key: string]: any;
}

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StepId>('main');
  const [formData, setFormData] = useState<FormData>({
    'contact-pref': 'email'
  });
  const [stepHistory, setStepHistory] = useState<StepId[]>(['main']);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // --- EMAILJS CONFIGURATIE ---
  const EMAILJS_SERVICE_ID = 'service_k3tk1lw'; 
  const EMAILJS_TEMPLATE_ID = 'template_r6rg82d'; 
  const EMAILJS_PUBLIC_KEY = 'lDC9vj_pKNBf2ZzyG'; 
  const MIJN_EMAIL = 'audio@rikdewit.nl';

  const progress = useMemo(() => {
    if (currentStep === 'success') return 100;
    if (currentStep === 'contact') return 95;
    const stepWeight = 6;
    const calculated = 10 + (stepHistory.length * stepWeight);
    return Math.min(calculated, 90);
  }, [stepHistory, currentStep]);

  const currentPhase = useMemo(() => {
    if (currentStep === 'main') return 1;
    if (currentStep === 'contact' || currentStep === 'success' || currentStep === 'error') return 3;
    return 2;
  }, [currentStep]);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phone);

  // Validatie helpers voor UI
  const emailValue = formData['contact-email'] || '';
  const phoneValue = formData['contact-phone'] || '';
  const nameValue = formData['contact-name'] || '';

  const isEmailInvalid = useMemo(() => showValidationErrors && !validateEmail(emailValue), [showValidationErrors, emailValue]);
  const isPhoneInvalid = useMemo(() => showValidationErrors && !validatePhone(phoneValue), [showValidationErrors, phoneValue]);

  const isContactStepValid = useMemo(() => {
    return nameValue.trim().length > 1 && validateEmail(emailValue) && validatePhone(phoneValue);
  }, [nameValue, emailValue, phoneValue]);

  const isContactStepFilled = useMemo(() => {
    return nameValue.trim().length > 1 && emailValue.trim().length > 0 && phoneValue.trim().length > 0;
  }, [nameValue, emailValue, phoneValue]);

  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'main': return !!formData['main-service'];
      case 'live-type': return !!formData['live-type'];
      case 'live-hire-role': return !!formData['hire-role'];
      case 'live-hire-location-category': return !!formData['hire-location-category'];
      case 'live-hire-practical': return !!formData['hire-work-location'] && !!formData['hire-frequency'];
      case 'studio-type': return !!formData['studio-type'];
      case 'studio-recording-method': return !!formData['studio-recording-method'];
      case 'studio-locatie-keuze': return !!formData['studio-locatie-keuze'];
      case 'studio-details': return !!formData['studio-details'];
      case 'nabewerking-type': return !!formData['nabewerking-type'];
      case 'advies-who': return !!formData['advies-who'];
      case 'advies-goal': return !!formData['advies-goal'];
      case 'advies-ruimte': return !!formData['advies-ruimte'];
      case 'advies-doel': return !!formData['advies-doel'];
      case 'advies-methode': return !!formData['advies-methode'];
      case 'advies-gebruik': return !!formData['advies-gebruik'];
      case 'advies-kopen-type': return !!formData['advies-kopen-type'];
      case 'live-hire-details': return !!formData['hire-details'];
      case 'nabewerking-details': return !!formData['nabewerking-details'];
      case 'advies-kopen-details': return !!formData['advies-kopen-details'];
      case 'anders-beschrijving': return !!formData['anders-details'];
      case 'advies-muzikant-details': return !!formData['advies-muzikant-details'];
      case 'live-event-type': return !!formData['event-type'];
      case 'live-music-check': return !!formData['has-live-music'];
      case 'performers': return !!formData['performers'];
      case 'instruments': return true;
      case 'location-equipment': 
        return Object.keys(formData).some(k => k.startsWith('equip-') && formData[k]);
      case 'location-name': return !!formData['loc-name'];
      case 'live-practical': return !!formData['event-date'] && !!formData['event-location'];
      case 'contact': return isContactStepFilled;
      default: return true;
    }
  }, [currentStep, formData, isContactStepFilled]);

  const dynamicOrgLabel = useMemo(() => {
    const service = formData['main-service'];
    const who = formData['advies-who'];
    const studioType = formData['studio-type'];

    if (service === 'live') {
      if (formData['live-type'] === 'hire') return "Naam Bedrijf / Organisatie";
      return "Naam Evenement / Act";
    }
    if (service === 'studio') {
      if (studioType === 'Podcast opname' || studioType === 'Voice-over') return "Projectnaam";
      return "Project / Band Naam";
    }
    if (service === 'advies') {
      if (who === 'Particulier') return "Projectnaam";
      if (who === 'Evenementen organisator') return "Bedrijf / Evenementnaam";
      if (who) return who; 
    }
    return "Bedrijfsnaam / Organisatie";
  }, [formData]);

  const dynamicOrgPlaceholder = useMemo(() => {
    const service = formData['main-service'];
    const who = formData['advies-who'];
    const studioType = formData['studio-type'];

    if (service === 'live') {
      if (formData['live-type'] === 'hire') return "Bijv. Bedrijfsnaam of Locatie";
      return "Bijv. Festivalnaam of Bandnaam";
    }
    if (service === 'studio') {
      if (studioType === 'Podcast opname' || studioType === 'Voice-over') return "Naam van het project";
      return "Naam van de band of het project";
    }
    if (service === 'advies') {
      if (who === 'Horeca / Retail') return "Naam van de zaak of restaurant";
      if (who === 'Evenementen organisator') return "Naam van het bureau of de organisatie";
      if (who === 'Muzikant / Band') return "Naam van de band of act";
      if (who === 'Particulier') return "Naam van het project";
    }
    return "Naam van je bedrijf or organisatie";
  }, [formData]);

  const formatProjectSummary = (data: FormData): string => {
    const items: string[] = [];
    
    Object.keys(data).forEach(key => {
      const skipKeys = [
        'contact-name', 'contact-org', 'contact-email', 
        'contact-phone', 'contact-location', 'contact-pref', 
        'main-service', 'hire-details', 'event-details', 
        'studio-details', 'nabewerking-details', 
        'advies-muzikant-details', 'anders-details'
      ];

      if (!skipKeys.includes(key)) {
        const value = data[key];
        const label = key.replace(/-/g, ' ').replace('equip ', 'APP: ').replace('instrument ', 'INSTR: ').toUpperCase();
        
        if (typeof value === 'boolean') {
           if (value) items.push(`${label}: JA`);
        } else if (value && value !== '') {
           items.push(`${label}: ${value}`);
        }
      }
    });
    return items.join('\n');
  };

  const handleFinalSubmit = async () => {
    setIsSending(true);
    try {
      const serviceMap: any = { 'live': 'Live Geluid', 'studio': 'Studio Opname', 'nabewerking': 'Nabewerking', 'advies': 'Advies', 'anders': 'Overig' };
      const projectSummary = formatProjectSummary(formData);
      const customerEmail = formData['contact-email'];
      const customerName = formData['contact-name'];
      const projectType = serviceMap[formData['main-service']] || formData['main-service'];
      
      const baseParams = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: formData['contact-phone'],
        customer_location: formData['contact-location'] || 'Niet opgegeven',
        customer_org: formData['contact-org'] || 'Niet opgegeven',
        contact_preference: formData['contact-pref'],
        project_type: projectType,
        project_summary: projectSummary,
        customer_message: formData['hire-details'] || formData['event-details'] || formData['studio-details'] || formData['nabewerking-details'] || formData['advies-muzikant-details'] || formData['anders-details'] || 'Geen extra toelichting.',
        current_year: new Date().getFullYear()
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { ...baseParams, recipient_email: MIJN_EMAIL, email_subject: `Nieuwe aanvraag: ${projectType} - ${customerName}`, reply_to: customerEmail }, EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { ...baseParams, recipient_email: customerEmail, email_subject: `Bevestiging van je aanvraag: ${projectType}`, reply_to: MIJN_EMAIL }, EMAILJS_PUBLIC_KEY);
      setIsSending(false);
      setCurrentStep('success');
    } catch (error) {
      console.error("EmailJS Error:", error);
      setIsSending(false);
      setCurrentStep('error');
    }
  };

  const determineNextStep = useCallback((step: StepId): StepId | null => {
    if (step === 'main') {
      const service = formData['main-service'];
      if (service === 'live') return 'live-type';
      if (service === 'studio') return 'studio-type';
      if (service === 'nabewerking') return 'nabewerking-type';
      if (service === 'advies') return 'advies-who';
      if (service === 'anders') return 'anders-beschrijving';
    }
    if (step === 'live-type') return formData['live-type'] === 'hire' ? 'live-hire-role' : 'live-event-type';
    if (step === 'live-hire-role') return 'live-hire-location-category';
    if (step === 'live-hire-location-category') return 'live-music-check';
    if (step === 'live-hire-details') return 'contact';
    if (step === 'live-event-type') return (formData['event-type'] === 'concert' || formData['event-type'] === 'Concert / Festival') ? 'performers' : 'live-music-check';
    
    if (step === 'live-music-check') {
        const isHire = formData['live-type'] === 'hire';
        if (isHire) return 'live-hire-practical';
        return formData['has-live-music'] === 'ja' ? 'performers' : 'location-equipment';
    }

    if (step === 'performers') return (formData['performers']?.includes('Band')) ? 'instruments' : 'location-equipment';
    if (step === 'instruments') return 'location-equipment';
    if (step === 'location-equipment') return (formData['equip-Weet ik (nog) niet']) ? 'location-name' : 'live-practical';
    if (step === 'location-name') return 'live-practical';
    if (step === 'live-practical') return 'contact';
    if (step === 'live-hire-practical') return 'contact';
    
    // Studio Flow
    if (step === 'studio-type') {
      const t = formData['studio-type'];
      if (t === 'Band / Instrumenten') return 'studio-recording-method';
      if (t === 'Podcast opname' || t === 'Voice-over') return 'studio-locatie-keuze';
      return 'studio-details';
    }
    if (step === 'studio-recording-method') return 'studio-locatie-keuze';
    if (step === 'studio-locatie-keuze') return 'studio-details';
    if (step === 'studio-details') return 'contact';

    if (step === 'nabewerking-type') return 'nabewerking-details';
    if (step === 'nabewerking-details') return 'contact';
    
    // Advies Flow
    if (step === 'advies-who') {
      const who = formData['advies-who'];
      if (who === 'Muzikant / Band') return 'advies-muzikant-details';
      if (who === 'Evenementen organisator' || who === 'Particulier' || who === 'Anders') return 'anders-beschrijving';
      return 'advies-goal';
    }
    if (step === 'advies-goal') {
      if (formData['advies-who'] === 'Horeca / Retail') return 'anders-beschrijving';
      
      const g = formData['advies-goal'];
      if (g === 'Geluidsinstallatie voor event') return 'live-event-type';
      if (g === 'Ruimte verbeteren (akoestiek)') return 'advies-ruimte';
      if (g === 'Apparatuur aanschaffen' || g === 'Beter geluidssysteem aanschaffen') return 'advies-gebruik';
      return 'anders-beschrijving';
    }
    if (step === 'advies-muzikant-details') return 'contact';
    if (step === 'advies-ruimte') return 'advies-doel';
    if (step === 'advies-doel') return 'advies-methode';
    if (step === 'advies-methode') return 'contact';
    if (step === 'advies-gebruik') return 'advies-kopen-details';
    if (step === 'advies-kopen-details') return 'advies-kopen-type';
    if (step === 'advies-kopen-type') return 'contact';
    if (step === 'anders-beschrijving') return 'contact';
    return null;
  }, [formData]);

  const handleNext = () => {
    if (currentStep === 'contact') { 
      if (!isContactStepValid) {
        setShowValidationErrors(true);
        return;
      }
      handleFinalSubmit(); 
      return; 
    }
    const next = determineNextStep(currentStep);
    if (next) {
      setIsAnimating(true);
      setTimeout(() => {
        setStepHistory(prev => [...prev, next]);
        setCurrentStep(next);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (stepHistory.length > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        const h = [...stepHistory]; h.pop();
        setStepHistory(h); setCurrentStep(h[h.length - 1]);
        setIsAnimating(false);
        // Reset validatie view bij teruggaan van contact naar een eerdere stap
        if (currentStep === 'contact') setShowValidationErrors(false);
      }, 300);
    }
  };

  const OptionCard = ({ label, isSelected, onClick, icon: Icon }: any) => (
    <div onClick={onClick} className={`relative overflow-hidden p-3 sm:p-4 border cursor-pointer transition-all duration-300 rounded-sm group w-full ${isSelected ? 'border-black bg-white shadow-lg sm:translate-x-2' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/10 to-[#71E2E4]/10 transition-all duration-500 ease-out ${isSelected ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400 group-hover:border-black group-hover:text-black'}`}>
            {Icon ? <Icon size={12} /> : <Check size={12} className={isSelected ? 'opacity-100' : 'opacity-0'} />}
          </div>
          <span className={`mono text-[10px] sm:text-xs uppercase tracking-widest font-bold ${isSelected ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>{label}</span>
        </div>
      </div>
    </div>
  );

  const CheckboxCard = ({ label, isSelected, onToggle, disabled = false }: any) => (
    <div 
      onClick={!disabled ? onToggle : undefined} 
      className={`relative overflow-hidden p-3 sm:p-4 border transition-all duration-300 rounded-sm group w-full ${disabled ? 'bg-gray-100 border-gray-100 cursor-not-allowed opacity-50' : 'cursor-pointer'} ${!disabled && isSelected ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}
    >
      {/* Fixed: Added missing backtick to close template literal correctly */}
      {!disabled && <div className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/5 to-[#71E2E4]/5 transition-all duration-500 ease-out ${isSelected ? 'w-full' : 'w-0 group-hover:w-full'}`} />}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
        <div className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 border flex items-center justify-center transition-all duration-300 ${!disabled && isSelected ? 'bg-black border-black scale-110' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
          {isSelected && <Check size={10} className="text-white" />}
        </div>
        <span className={`mono text-[9px] sm:text-[10px] uppercase tracking-widest font-bold transition-colors ${!disabled && isSelected ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>{label}</span>
      </div>
    </div>
  );

  const NavButton = ({ onClick, disabled, variant = 'primary', children, isLoading = false }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading} 
      className={`px-4 sm:px-8 py-3 sm:py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-2 sm:gap-3 rounded-sm relative overflow-hidden flex-1 sm:flex-none ${variant === 'primary' ? 'bg-black text-white hover:bg-black/90 shadow-lg disabled:bg-gray-200 disabled:text-gray-400' : 'border border-gray-300 text-gray-500 hover:border-black hover:text-black bg-white'}`}
    >
      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>{variant === 'secondary' && <ArrowLeft size={14} />}{children}{variant === 'primary' && <ArrowRight size={14} />}</>}
    </button>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'main':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black leading-tight">Wat kan ik voor je <span className="italic">betekenen</span>?</h2>
            <div className="grid gap-2 mb-2 sm:mb-3">
              {[{ id: 'live', label: 'Live geluid voor een evenement' }, { id: 'studio', label: 'Studio opname' }, { id: 'nabewerking', label: 'Audio Nabewerking' }, { id: 'advies', label: 'Audio Advies' }, { id: 'anders', label: 'Anders' }].map(opt => (
                <OptionCard key={opt.id} label={opt.label} isSelected={formData['main-service'] === opt.id} onClick={() => updateFormData('main-service', opt.id)} />
              ))}
            </div>
          </div>
        );
      case 'live-type':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Hoe kan ik helpen?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              <OptionCard label="Ik organiseer een evenement - Help mij de juiste keuzes maken" isSelected={formData['live-type'] === 'organize'} onClick={() => updateFormData('live-type', 'organize')} />
              <OptionCard label="Huur mij direct in als technicus" isSelected={formData['live-type'] === 'hire'} onClick={() => updateFormData('live-type', 'hire')} />
            </div>
          </div>
        );
      case 'live-hire-role':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">In welke rol?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Audio Technicus', 'Monitor Technicus', 'Stagehand / Crew', 'Systeemontwerper', 'Anders'].map(role => (
                <OptionCard key={role} label={role} isSelected={formData['hire-role'] === role} onClick={() => updateFormData('hire-role', role)} />
              ))}
            </div>
          </div>
        );
      case 'live-hire-location-category':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Wat voor soort locatie?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Bar / café', 'Festival', 'Theater / Podium', 'Anders'].map(cat => (
                <OptionCard key={cat} label={cat} isSelected={formData['hire-location-category'] === cat} onClick={() => updateFormData('hire-location-category', cat)} />
              ))}
            </div>
          </div>
        );
      case 'live-hire-practical':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Praktische gegevens</h2>
            <div className="grid gap-3 sm:gap-4">
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Locatie (Stad/Plek)</label>
                 <input type="text" className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="Bijv. Paradiso, Amsterdam" value={formData['hire-work-location'] || ''} onChange={e => updateFormData('hire-work-location', e.target.value)} />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Frequentie</label>
                 <div className="grid grid-cols-2 gap-2">
                    {['Eenmalig', 'Meerdere keren'].map(freq => (
                        <div key={freq} onClick={() => updateFormData('hire-frequency', freq)} className={`p-3 border text-center cursor-pointer transition-all text-[10px] uppercase tracking-widest font-bold ${formData['hire-frequency'] === freq ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
                            {freq}
                        </div>
                    ))}
                 </div>
               </div>
               <div className="flex flex-col gap-0.5 pt-2">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Toelichting</label>
                 <textarea className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light min-h-[80px] sm:min-h-[100px] resize-none bg-transparent text-black" placeholder="Bijv. specifieke tijden of andere bijzonderheden." value={formData['hire-details'] || ''} onChange={e => updateFormData('hire-details', e.target.value)} />
               </div>
            </div>
          </div>
        );
      case 'studio-type':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Type studio sessie?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Band / Instrumenten', 'Podcast opname', 'Mixage / Mastering', 'Voice-over', 'Anders'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['studio-type'] === t} onClick={() => updateFormData('studio-type', t)} />
              ))}
            </div>
          </div>
        );
      case 'studio-recording-method':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Hoe wil je opnemen?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Live opname', 'Multitrack / Overdubs'].map(m => (
                <OptionCard key={m} label={m} isSelected={formData['studio-recording-method'] === m} onClick={() => updateFormData('studio-recording-method', m)} />
              ))}
            </div>
          </div>
        );
      case 'studio-locatie-keuze':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Waar vindt de opname plaats?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Op locatie', 'Bij jou in de studio', 'Nee, help mij een geschikte plek zoeken'].map(l => (
                <OptionCard key={l} label={l} isSelected={formData['studio-locatie-keuze'] === l} onClick={() => updateFormData('studio-locatie-keuze', l)} />
              ))}
            </div>
          </div>
        );
      case 'studio-details':
        const isOpLocatie = formData['studio-locatie-keuze'] === 'Op locatie';
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Vertel meer over de aanvraag</h2>
            <div className="grid gap-3 sm:gap-4">
               {isOpLocatie && (
                 <div className="flex flex-col gap-0.5">
                   <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Opnamelocatie</label>
                   <input 
                     type="text" 
                     className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" 
                     placeholder="Adres, stad of locatienaam" 
                     value={formData['studio-location-text'] || ''} 
                     onChange={e => updateFormData('studio-location-text', e.target.value)} 
                   />
                 </div>
               )}
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Toelichting</label>
                 <textarea 
                   className="w-full border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light min-h-[120px] sm:min-h-[140px] resize-none bg-transparent text-black" 
                   placeholder="Wat is belangrijk om te weten over je project?" 
                   value={formData['studio-details'] || ''} 
                   onChange={e => updateFormData('studio-details', e.target.value)} 
                 />
               </div>
            </div>
          </div>
        );
      case 'nabewerking-type':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Wat moet er bewerkt worden?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Podcast-montage & editing', 'Mixen van een muziekopname', 'Geluid onder video editen / mixen', 'Anders'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['nabewerking-type'] === t} onClick={() => updateFormData('nabewerking-type', t)} />
            ))}</div>
          </div>
        );
      case 'advies-who':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Voor wie is het advies?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Horeca / Retail', 'Evenementen organisator', 'Particulier', 'Muzikant / Band', 'Anders'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-who'] === t} onClick={() => updateFormData('advies-who', t)} />
            ))}</div>
          </div>
        );
      case 'advies-goal':
        const isHoreca = formData['advies-who'] === 'Horeca / Retail';
        const goalOptions = isHoreca 
          ? ['Beter geluidssysteem aanschaffen', 'Ruimte verbeteren (akoestiek)', 'Bestaand geluidssysteem afstellen', 'Anders']
          : ['Geluidsinstallatie voor event', 'Ruimte verbeteren (akoestiek)', 'Apparatuur aanschaffen', 'Anders'];
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Wat is het doel?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{goalOptions.map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-goal'] === t} onClick={() => updateFormData('advies-goal', t)} />
            ))}</div>
          </div>
        );
      case 'advies-ruimte':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Type ruimte?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Woonkamer', 'Project studio', 'Kantoor / Vergaderruimte', 'Horeca / Zaal'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-ruimte'] === t} onClick={() => updateFormData('advies-ruimte', t)} />
            ))}</div>
          </div>
        );
      case 'advies-doel':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Wat wil je bereiken?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Minder galm', 'Betere isolatie naar buren', 'Eerlijkere luisterervaring', 'Anders'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-doel'] === t} onClick={() => updateFormData('advies-doel', t)} />
            ))}</div>
          </div>
        );
      case 'advies-methode':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Voorkeur voor advies?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Online (Video call)', 'Bezoek op location', 'Weet ik nog niet'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-methode'] === t} onClick={() => updateFormData('advies-methode', t)} />
            ))}</div>
          </div>
        );
      case 'advies-gebruik':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Voor welk gebruik?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Opname / Studio setup', 'Live geluid / Band setup', 'Hi-Fi / Thuisgebruik'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-gebruik'] === t} onClick={() => updateFormData('advies-gebruik', t)} />
            ))}</div>
          </div>
        );
      case 'advies-kopen-type':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Kwaliteitsniveau?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Budget / Beginner', 'Semi-pro', 'High-end / Pro'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['advies-kopen-type'] === t} onClick={() => updateFormData('advies-kopen-type', t)} />
            ))}</div>
          </div>
        );
      case 'live-hire-details':
      case 'nabewerking-details':
      case 'advies-kopen-details':
      case 'anders-beschrijving':
      case 'advies-muzikant-details':
        const fieldName = currentStep === 'live-hire-details' ? 'hire-details' : 
                          currentStep === 'nabewerking-details' ? 'nabewerking-details' : 
                          currentStep === 'advies-kopen-details' ? 'advies-kopen-details' : 
                          currentStep === 'advies-muzikant-details' ? 'advies-muzikant-details' :
                          'anders-details';
        
        const isAdviceStep = formData['main-service'] === 'advies';
        const adviceHeading = isAdviceStep ? "Waar kan ik je mee helpen?" : "Vertel meer over de aanvraag";
        const placeholder = currentStep === 'advies-muzikant-details' 
          ? "Vertel me waar je als muzikant of band naar op zoek bent. Bijvoorbeeld advies over je setup, sound, of een technische uitdaging." 
          : "Wat is belangrijk om te weten?";

        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">{adviceHeading}</h2>
            <textarea className="w-full border-b border-gray-300 py-3 sm:py-4 text-base sm:text-lg focus:border-black outline-none font-light min-h-[140px] sm:min-h-[160px] resize-none bg-transparent text-black" placeholder={placeholder} value={formData[fieldName] || ''} onChange={e => updateFormData(fieldName, e.target.value)} />
          </div>
        );
      case 'live-event-type':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Type event?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              {['Concert / Festival', 'Bedrijfsevent', 'Presentatie / Congres', 'Privéfeest / Bruiloft', 'Anders'].map(t => (
                <OptionCard key={t} label={t} isSelected={formData['event-type'] === t} onClick={() => updateFormData('event-type', t)} />
              ))}
            </div>
          </div>
        );
      case 'live-music-check':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Is er live muziek?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">
              <OptionCard label="Ja, live muziek" isSelected={formData['has-live-music'] === 'ja'} onClick={() => updateFormData('has-live-music', 'ja')} />
              <OptionCard label="Nee, alleen sprekers of audio playback" isSelected={formData['has-live-music'] === 'nee'} onClick={() => updateFormData('has-live-music', 'nee')} />
            </div>
          </div>
        );
      case 'performers':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Wie treedt er op?</h2>
            <div className="grid gap-2 mb-1 sm:mb-2">{['Solo artiest / DJ', 'Duo / Trio', 'Band (2-5 personen)', 'Grote Band / Ensemble (6+ personen)', 'Meerdere acts'].map(p => (
                <OptionCard key={p} label={p} isSelected={formData['performers'] === p} onClick={() => updateFormData('performers', p)} />
            ))}</div>
          </div>
        );
      case 'instruments':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Welke instrumenten?</h2>
            <div className="grid grid-cols-2 gap-2 mb-1 sm:mb-2">{['Drums', 'Basgitaar', 'Gitaar', 'Keys / Piano', 'Zang', 'Blazers', 'Percussie', 'Elektronisch'].map(i => (
                <CheckboxCard key={i} label={i} isSelected={formData[`instrument-${i}`]} onToggle={() => updateFormData(`instrument-${i}`, !formData[`instrument-${i}`])} />
            ))}</div>
          </div>
        );
      case 'location-equipment':
        const baseEquipOptions = ['Speakers (PA)', 'Mixer', 'Microfoons', 'Monitoren', 'Backline', 'Bekabeling', 'Stroomtoevoer', 'Weet ik (nog) niet'];
        const equipOptions = formData['has-live-music'] === 'nee' 
          ? baseEquipOptions.filter(opt => opt !== 'Backline')
          : baseEquipOptions;
          
        const isEquipmentBlocked = formData['equip-Weet ik (nog) niet'];
        
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Aanwezig op locatie?</h2>
            <div className="grid grid-cols-2 gap-2 mb-1 sm:mb-2">
              {equipOptions.map(e => {
                const isBlockingOption = e === 'Weet ik (nog) niet';
                const isDisabled = !isBlockingOption && isEquipmentBlocked;
                
                return (
                  <CheckboxCard 
                    key={e} 
                    label={e} 
                    isSelected={formData[`equip-${e}`]} 
                    disabled={isDisabled}
                    onToggle={() => {
                      if (isDisabled) return;
                      const newValue = !formData[`equip-${e}`];
                      
                      if (isBlockingOption && newValue) {
                        const nextData = { ...formData };
                        equipOptions.forEach(opt => {
                          if (opt !== e) delete nextData[`equip-${opt}`];
                        });
                        nextData[`equip-${e}`] = true;
                        setFormData(nextData);
                      } else {
                        updateFormData(`equip-${e}`, newValue);
                      }
                    }} 
                  />
                );
              })}
            </div>
          </div>
        );
      case 'location-name':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Welke locatie?</h2>
            <input type="text" className="border-b border-gray-300 py-3 sm:py-4 text-lg sm:text-xl focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="Naam van the locatie of evenement" value={formData['loc-name'] || ''} onChange={e => updateFormData('loc-name', e.target.value)} />
          </div>
        );
      case 'live-practical':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Info over je event</h2>
            <div className="grid gap-3 sm:gap-4 mb-1 sm:mb-2">
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Datum</label>
                 <input type="date" className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" value={formData['event-date'] || ''} onChange={e => updateFormData('event-date', e.target.value)} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Locatie</label>
                 <input type="text" className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="Stad of specifieke plek" value={formData['event-location'] || ''} onChange={e => updateFormData('event-location', e.target.value)} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Verwacht aantal bezoekers</label>
                 <input type="number" className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="Bijv. 150" value={formData['event-visitors'] || ''} onChange={e => updateFormData('event-visitors', e.target.value)} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Toelichting</label>
                 <textarea className="border-b border-gray-300 py-1.5 text-base sm:text-lg focus:border-black outline-none font-light min-h-[60px] sm:min-h-[80px] resize-none bg-transparent text-black" placeholder="Aanvullende wensen of bijzonderheden?" value={formData['event-details'] || ''} onChange={e => updateFormData('event-details', e.target.value)} />
               </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-black">Contactgegevens</h2>
            <div className="grid gap-4 sm:gap-5 mb-1 sm:mb-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div className="flex flex-col gap-1">
                  <label className="mono text-[10px] uppercase text-gray-500 font-bold tracking-widest">Naam *</label>
                  <input type="text" className="border-b border-gray-300 py-2 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="" value={formData['contact-name'] || ''} onChange={e => updateFormData('contact-name', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="mono text-[10px] uppercase text-gray-500 font-bold tracking-widest">{dynamicOrgLabel}</label>
                  <input type="text" className="border-b border-gray-300 py-2 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder={dynamicOrgPlaceholder} value={formData['contact-org'] || ''} onChange={e => updateFormData('contact-org', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div className="flex flex-col gap-1">
                  <label className="mono text-[10px] uppercase text-gray-500 font-bold tracking-widest">E-mail *</label>
                  <input 
                    type="email" 
                    className={`border-b py-2 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full transition-colors ${isEmailInvalid ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="" 
                    value={emailValue} 
                    onChange={e => updateFormData('contact-email', e.target.value)} 
                  />
                  {isEmailInvalid && <span className="text-[9px] text-red-500 mono font-bold uppercase tracking-widest mt-1">Ongeldig e-mailadres</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="mono text-[10px] uppercase text-gray-500 font-bold tracking-widest">Telefoon *</label>
                  <input 
                    type="tel" 
                    className={`border-b py-2 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full transition-colors ${isPhoneInvalid ? 'border-red-500' : 'border-gray-300'}`} 
                    placeholder="" 
                    value={phoneValue} 
                    onChange={e => updateFormData('contact-phone', e.target.value)} 
                  />
                  {isPhoneInvalid && <span className="text-[9px] text-red-500 mono font-bold uppercase tracking-widest mt-1">Ongeldig nummer</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="mono text-[10px] uppercase text-gray-500 font-bold tracking-widest">Waar ben je gevestigd?</label>
                <input type="text" className="border-b border-gray-300 py-2 text-base sm:text-lg focus:border-black outline-none font-light bg-transparent text-black w-full" placeholder="Stad of regio" value={formData['contact-location'] || ''} onChange={e => updateFormData('contact-location', e.target.value)} />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 mt-1 sm:mt-2"><label className="mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">Voorkeur</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">{[{ id: 'email', label: 'Mail', icon: Mail }, { id: 'telefoon', label: 'Bel', icon: Phone }, { id: 'whatsapp', label: 'App', icon: MessageSquare }].map(opt => (
                    <div key={opt.id} onClick={() => updateFormData('contact-pref', opt.id)} className={`relative overflow-hidden flex flex-col items-center justify-center p-2 sm:p-3 border cursor-pointer transition-all rounded-sm gap-1 group ${formData['contact-pref'] === opt.id ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-r from-[#87E8A0]/10 to-[#71E2E4]/10 transition-all duration-500 ease-out ${formData['contact-pref'] === opt.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                      <div className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5"><opt.icon size={14} className={formData['contact-pref'] === opt.id ? 'text-black' : 'text-gray-400'} /><span className={`mono text-[8px] uppercase tracking-widest font-bold ${formData['contact-pref'] === opt.id ? 'text-black' : 'text-gray-500'}`}>{opt.label}</span></div>
                    </div>
                  ))}</div>
              </div>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="text-center py-4 sm:py-6 space-y-4 sm:space-y-6 flex flex-col items-center justify-center flex-grow">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 mb-2 sm:mb-4 shadow-xl">
              <AlertCircle className="text-red-500 w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1} />
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-black">Oeps! Er ging iets mis.</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed">Versturen mislukt. Mail naar <a href="mailto:audio@rikdewit.nl" className="underline font-medium">audio@rikdewit.nl</a>.</p>
            <div className="pt-4 sm:pt-6"><NavButton onClick={() => setCurrentStep('contact')}>Opnieuw proberen</NavButton></div>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-4 sm:py-6 space-y-4 sm:space-y-6 flex flex-col items-center justify-center flex-grow">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black mb-2 sm:mb-4 shadow-xl relative">
              <div className="absolute inset-0 rounded-full bg-[#87E8A0]/20 animate-ping duration-1000" />
              <CheckCircle2 className="text-[#87E8A0] relative z-10 w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black">Ontvangen!</h2>
            <p className="text-gray-500 text-base sm:text-lg font-light max-w-sm mx-auto leading-relaxed">Bedankt voor de details. Ik kom zo snel mogelijk bij je terug.</p>
            <div className="pt-4 sm:pt-6"><button onClick={() => { setFormData({'contact-pref': 'email'}); setCurrentStep('main'); setStepHistory(['main']); setShowValidationErrors(false); }} className="text-[10px] font-bold tracking-[0.4em] uppercase underline underline-offset-[8px] text-black hover:text-gray-400 transition-colors">Nieuwe aanvraag</button></div>
          </div>
        );
      default: return null;
    }
  };

  const isNavigationVisible = currentStep !== 'success' && currentStep !== 'error';

  return (
    <section id="diensten" className="min-h-screen flex items-center py-12 sm:py-20 md:py-24 px-4 sm:px-6 bg-white overflow-hidden border-y border-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {/* We gebruiken sticky positioning voor de linkerkolom om te zorgen dat de tekst niet verspringt als de formulierhoogte verandert */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-20 items-start relative">
          
          {/* Linkerkolom: lg:sticky zorgt ervoor dat deze stabiel blijft terwijl men door het formulier scrolt of klikt */}
          <div className="lg:col-span-2 flex flex-col lg:sticky lg:top-32 self-start pt-0 lg:pt-8 transition-all duration-300">
            <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-gray-500 mb-6 sm:mb-8">Diensten</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-[1.1] sm:leading-[0.95] mb-6 sm:mb-8 text-black">Klaar om je geluid naar een <br className="hidden sm:block" /><span className="italic">hoger niveau</span> te tillen?</h3>
            <p className="text-gray-500 font-light text-base sm:text-lg leading-relaxed max-w-md">Vul dit formulier in voor een vliegende start. Dit helpt mij om direct inzicht te krijgen in de technische eisen van jouw project.</p>
          </div>

          <div className="lg:col-span-3 w-full max-w-full">
            {/* Een stabiele minimale hoogte voorkomt dat de rest van de pagina (zoals Portfolio) omhoog/omlaag springt bij stap-wisselingen */}
            <div className="bg-gray-50 rounded-sm border border-gray-200 shadow-xl relative overflow-hidden h-auto min-h-[500px] sm:min-h-[600px] flex flex-col transition-all duration-500 w-full max-h-[95vh] sm:max-h-[90vh]">
              
              <div className="px-5 sm:px-8 pt-4 sm:pt-6 pb-1 shrink-0">
                <div className="flex justify-between mb-2 sm:mb-3">
                  <div className={`flex flex-col transition-all duration-500 ${currentPhase >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                    <span className="mono text-[8px] font-bold tracking-widest mb-1 text-gray-400">01</span>
                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${currentPhase === 1 ? 'text-black' : 'text-gray-400'}`}>Selectie</span>
                  </div>
                  <div className={`flex flex-col items-center transition-all duration-500 ${currentPhase >= 2 ? 'opacity-100' : 'opacity-20'}`}>
                    <span className="mono text-[8px] font-bold tracking-widest mb-1 text-gray-400">02</span>
                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${currentPhase === 2 ? 'text-black' : 'text-gray-400'}`}>Details</span>
                  </div>
                  <div className={`flex flex-col items-end transition-all duration-500 ${currentPhase >= 3 ? 'opacity-100' : 'opacity-20'}`}>
                    <span className="mono text-[8px] font-bold tracking-widest mb-1 text-gray-400">03</span>
                    <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${currentPhase === 3 ? 'text-black' : 'text-gray-400'}`}>Contact</span>
                  </div>
                </div>
                <div className="h-[2px] w-full bg-gray-200 relative overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r from-[#87E8A0] via-[#71E2E4] to-[#87E8A0] transition-all duration-1000 ease-out bg-[length:200%_100%] ${isSending ? 'animate-[gradient-shift_1s_linear_infinite]' : 'animate-[gradient-shift_3s_linear_infinite]'}`} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              {/* Binnenkant heeft ook een min-hoogte om te zorgen dat de kaart niet inklapt */}
              <div className={`px-5 sm:px-8 md:px-12 py-1 flex-grow transition-all duration-500 ${isAnimating || isSending ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'} flex flex-col w-full overflow-y-auto custom-scrollbar min-h-[300px]`}>
                {renderStepContent()}
              </div>

              {isNavigationVisible && (
                <div className="px-5 sm:px-8 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50 shrink-0 w-full mt-auto">
                  <div className="flex gap-3 sm:gap-4 w-full">
                    {stepHistory.length > 1 && (
                      <NavButton variant="secondary" onClick={handleBack} disabled={isSending}>Terug</NavButton>
                    )}
                    <div className="hidden sm:block sm:flex-grow" />
                    <NavButton 
                      onClick={handleNext} 
                      disabled={!canGoNext || isSending} 
                      isLoading={isSending}
                    >
                      {currentStep === 'contact' ? (isSending ? 'Versturen...' : 'Verstuur') : 'Volgende'}
                    </NavButton>
                  </div>
                </div>
              )}

              {isSending && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-white/40 backdrop-blur-sm animate-in fade-in duration-500">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-black animate-spin" strokeWidth={1} />
                    <div className="text-center">
                      <h4 className="mono text-xs font-bold uppercase tracking-[0.4em] text-black">Verwerken...</h4>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </section>
  );
};

export default OnboardingForm;
