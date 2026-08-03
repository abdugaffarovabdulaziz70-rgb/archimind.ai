import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, image?: File | null) => void;
  onStop?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
}

export const ChatInput = memo(function ChatInput({
  onSend,
  onStop,
  disabled,
  isGenerating,
  placeholder = "Describe your architectural project..."
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = useCallback(() => {
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setIsRecording(true);
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setMessage(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsListening(false);
  }, []);

  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="card-luxury p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-5 py-4 rounded-2xl bg-luxury-black/50 border border-gold-500/10 text-luxury-pearl placeholder:text-luxury-silver/40 focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none min-h-[56px] max-h-[200px]"
            disabled={disabled}
            rows={1}
            aria-label="Message input"
            aria-describedby="chat-input-hint"
          />

          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center bg-luxury-black/90 rounded-2xl" role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-red-500"
                  aria-hidden="true"
                />
                <span className="text-sm text-luxury-silver">Listening...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasSpeechRecognition && (
            <motion.button
              onClick={isRecording ? stopRecording : handleVoiceInput}
              disabled={disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                isRecording
                  ? 'bg-red-500/20 border border-red-500/30'
                  : 'bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5'
              }`}
              aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
              aria-pressed={isRecording}
            >
              {isRecording ? (
                <MicOff size={20} className="text-red-400" aria-hidden="true" />
              ) : (
                <Mic size={20} className="text-luxury-silver" aria-hidden="true" />
              )}
            </motion.button>
          )}

          {isGenerating ? (
            <motion.button
              onClick={onStop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 rounded-xl bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Stop generating"
            >
              <StopCircle size={20} aria-hidden="true" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              className="p-3.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-black disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              aria-label="Send message"
            >
              <Send size={20} aria-hidden="true" />
            </motion.button>
          )}
        </div>
      </div>

      <p id="chat-input-hint" className="text-xs text-luxury-silver/40 mt-3 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
});
