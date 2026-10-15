import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function VoiceAssistant({ onVoiceCommandAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [spokenResponse, setSpokenResponse] = useState('Namaste! I am KisanVaani, your agricultural voice assistant. How can I help you today?');
  const [recognition, setRecognition] = useState(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-IN'; // Indian English / Hindi mix

      recog.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        processTranscript(text);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processTranscript = (text) => {
    fetch('/api/ai/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          const { spoken_response, intent, entity, role } = json.data;
          setSpokenResponse(spoken_response);
          speakText(spoken_response);

          // Dispatch command to main app
          if (onVoiceCommandAction) {
            onVoiceCommandAction({ intent, entity, role, text });
          }
        }
      })
      .catch(() => {
        const fallback = `Processed command: "${text}". Navigating your request.`;
        setSpokenResponse(fallback);
        speakText(fallback);
      });
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognition) recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setSpokenResponse('Listening... speak now into your microphone.');
      setIsListening(true);
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
          // ignore
        }
      } else {
        // Fallback simulation for browsers without Web Speech mic permission
        setTimeout(() => {
          const simulated = 'Check Wheat MSP and Mandi rates';
          setTranscript(simulated);
          setIsListening(false);
          processTranscript(simulated);
        }, 2200);
      }
    }
  };

  const handleQuickChip = (promptText) => {
    setTranscript(promptText);
    processTranscript(promptText);
  };

  return (
    <div className="voice-assistant-fab">
      {/* Voice Assistant Modal Card */}
      {isOpen && (
        <div className="voice-dialog-card">
          <div className="voice-dialog-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#fcd34d" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>KisanVaani AI Voice</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isListening && (
                <div className="voice-wave-bars">
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                  <div className="wave-bar" />
                </div>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                style={{ color: 'white', opacity: 0.8 }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="voice-dialog-body">
            {/* Assistant Response Box */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <Volume2 size={20} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '2px' }}>
                  KisanVaani Assistant
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {spokenResponse}
                </div>
              </div>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#065f46',
                marginBottom: '16px'
              }}>
                <strong>You said:</strong> "{transcript}"
              </div>
            )}

            {/* Mic Button in Dialog */}
            <div style={{ textAlign: 'center', margin: '14px 0' }}>
              <button
                onClick={toggleListening}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: isListening ? '#ef4444' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {isListening ? 'Listening to speech...' : 'Tap to speak your command'}
              </div>
            </div>

            {/* Sample Voice Prompts */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Try Speaking or Clicking:
              </div>
              <div className="voice-prompt-chips">
                <button className="voice-chip" onClick={() => handleQuickChip('Check Wheat MSP and mandi rates')}>
                  🌾 Check Wheat MSP
                </button>
                <button className="voice-chip" onClick={() => handleQuickChip('Find organic tomatoes')}>
                  🍅 Show Tomatoes
                </button>
                <button className="voice-chip" onClick={() => handleQuickChip('Scan crop disease doctor')}>
                  🔬 Disease Scanner
                </button>
                <button className="voice-chip" onClick={() => handleQuickChip('Switch to Farmer Dashboard')}>
                  👨‍🌾 Farmer Dashboard
                </button>
                <button className="voice-chip" onClick={() => handleQuickChip('Open Industry bulk quotes')}>
                  🏢 Industry Quotes
                </button>
                <button className="voice-chip" onClick={() => handleQuickChip('Buy Nano Urea in Krishi Bazaar')}>
                  🧪 Buy Nano Urea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        className={`voice-mic-trigger ${isListening ? 'listening' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) toggleListening();
        }}
        title="KisanVaani Voice Assistant"
      >
        <Mic size={28} />
      </button>
    </div>
  );
}
