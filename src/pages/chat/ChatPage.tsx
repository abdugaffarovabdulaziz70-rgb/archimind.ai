import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/layout';
import { MessageBubble, ChatInput, TypingIndicator } from '../../components/chat';
import { Sparkles, Building2, MapPin, DollarSign, Clock, Download, Share2, Users, Thermometer, Sun, Shield, Zap, Leaf, Car, TreeDeciduous, Wifi, Heart, MessageSquarePlus, Check } from 'lucide-react';
import { Card } from '../../components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface ProjectRequirements {
  projectType?: string;
  style?: string;
  plotSize?: string;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  budget?: string;
  country?: string;
  climate?: string;
  familySize?: number;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasGarage?: boolean;
  hasRooftop?: boolean;
  hasSolarEnergy?: boolean;
  hasAccessibility?: boolean;
  hasSecuritySystem?: boolean;
  hasNaturalLighting?: boolean;
  hasOpenConcept?: boolean;
  timeline?: string;
}

interface ConceptResult {
  floorPlan?: string;
  exterior?: string;
  interior?: string[];
  landscape?: string;
  materials?: string[];
  estimatedCost?: { min: number; max: number };
  timeline?: string;
  energyEfficiency?: string[];
  advantages?: string[];
  improvements?: string[];
}

// Smart AI Architect - Analyzes requirements and asks follow-up questions
const PROJECT_TYPES = ['villa', 'house', 'apartment', 'office', 'restaurant', 'hotel', 'school', 'mosque', 'cafe', 'warehouse', 'farm', 'clinic', 'gym', 'shop', 'studio'];
const ARCHITECTURAL_STYLES = ['modern', 'minimalist', 'luxury', 'scandinavian', 'japanese', 'islamic', 'mediterranean', 'contemporary', 'industrial', 'futuristic', 'traditional', 'colonial', 'tropical', 'ranch'];
const CLIMATE_TYPES = ['tropical', 'desert', 'temperate', 'mediterranean', 'continental', 'arctic'];
const BUDGET_RANGES = ['low', 'medium', 'high', 'luxury'];

const analyzeRequirements = (messages: string[]): ProjectRequirements => {
  const allText = messages.join(' ').toLowerCase();
  const req: ProjectRequirements = {};

  // Detect project type
  for (const type of PROJECT_TYPES) {
    if (allText.includes(type)) {
      req.projectType = type;
      break;
    }
  }

  // Detect style
  for (const style of ARCHITECTURAL_STYLES) {
    if (allText.includes(style)) {
      req.style = style;
      break;
    }
  }

  // Detect numbers
  const bedroomMatch = allText.match(/(\d+)\s*bedroom/);
  if (bedroomMatch) req.bedrooms = parseInt(bedroomMatch[1]);

  const bathroomMatch = allText.match(/(\d+)\s*bathroom/);
  if (bathroomMatch) req.bathrooms = parseInt(bathroomMatch[1]);

  const floorMatch = allText.match(/(\d+)\s*(?:floor|story|storey)/);
  if (floorMatch) req.floors = parseInt(floorMatch[1]);

  // Detect area/plot
  const areaMatch = allText.match(/(\d+)\s*[x*]\s*(\d+)/);
  if (areaMatch) req.plotSize = `${areaMatch[1]}x${areaMatch[2]}m`;

  const sqmMatch = allText.match(/(\d+)\s*(?:sqm|square meter|square meter)/);
  if (sqmMatch) req.plotSize = `${sqmMatch[1]}sqm`;

  // Detect features
  req.hasPool = allText.includes('pool') || allText.includes('swimming');
  req.hasGarden = allText.includes('garden') || allText.includes('landscape');
  req.hasGarage = allText.includes('garage') || allText.includes('parking');
  req.hasRooftop = allText.includes('rooftop') || allText.includes('roof terrace') || allText.includes('roof garden');
  req.hasSolarEnergy = allText.includes('solar') || allText.includes('renewable');
  req.hasAccessibility = allText.includes('accessible') || allText.includes('disability') || allText.includes('wheelchair');
  req.hasSecuritySystem = allText.includes('security') || allText.includes('smart home') || allText.includes('automation');
  req.hasNaturalLighting = allText.includes('natural light') || allText.includes('large windows') || allText.includes('skylight');
  req.hasOpenConcept = allText.includes('open concept') || allText.includes('open floor') || allText.includes('open plan');
  req.hasNaturalLighting = allText.includes('natural light') || allText.includes('large windows') || allText.includes('skylight') || allText.includes('open concept');

  // Detect budget
  for (const budget of BUDGET_RANGES) {
    if (allText.includes(budget)) {
      req.budget = budget;
      break;
    }
  }

  // Detect family size
  const familyMatch = allText.match(/family of\s*(\d+)/);
  if (familyMatch) req.familySize = parseInt(familyMatch[1]);

  // Detect climate
  for (const climate of CLIMATE_TYPES) {
    if (allText.includes(climate)) {
      req.climate = climate;
      break;
    }
  }

  return req;
};

const generateFollowUpQuestions = (req: ProjectRequirements): string[] => {
  const questions: string[] = [];

  if (!req.projectType) {
    questions.push('What type of building would you like to design? (e.g., villa, house, apartment, office, hotel)');
  }

  if (!req.plotSize) {
    questions.push('What is your plot size or total area? (e.g., 20x30m, 500sqm)');
  }

  if (!req.bedrooms && (req.projectType === 'villa' || req.projectType === 'house' || req.projectType === 'apartment')) {
    questions.push('How many bedrooms would you like?');
  }

  if (!req.budget) {
    questions.push('What is your budget range? (low, medium, high, luxury)');
  }

  if (!req.floors) {
    questions.push('How many floors do you envision?');
  }

  if (!req.style) {
    questions.push('What architectural style do you prefer? (modern, minimalist, luxury, mediterranean, etc.)');
  }

  if (!req.climate) {
    questions.push('What is the climate of your location? This affects insulation, ventilation, and materials.');
  }

  return questions.slice(0, 3); // Ask max 3 questions at a time
};

const generateArchitectureResponse = (message: string, conversationHistory: string[]): { content: string; concept?: ConceptResult; needsMoreInfo?: boolean } => {
  const lowerMessage = message.toLowerCase();
  const req = analyzeRequirements([...conversationHistory, message]);
  const questions = generateFollowUpQuestions(req);

  // If we're still collecting requirements, ask follow-up questions
  if (questions.length > 0 && !lowerMessage.includes('generate') && !lowerMessage.includes('create design')) {
    const response = `To create the perfect design for your project, I'd like to understand a few more details:\n\n${questions.map((q, i) => `${i + 1}. **${q}**`).join('\n\n')}\n\nPlease share these details, or type **"generate design"** if you'd like me to proceed with what I know so far.`;
    return { content: response, needsMoreInfo: true };
  }

  // Now generate the full architectural response
  const projectType = req.projectType || 'house';
  const style = req.style || 'modern';
  const bedrooms = req.bedrooms || 3;
  const bathrooms = req.bathrooms || Math.min(bedrooms, 2) + 1;
  const floors = req.floors || 2;
  const plotSize = req.plotSize || '20x30m';

  // Calculate costs based on requirements
  let costPerSqm = 1500; // base
  if (req.budget === 'luxury') costPerSqm = 4000;
  else if (req.budget === 'high') costPerSqm = 2500;
  else if (req.budget === 'low') costPerSqm = 1000;

  let totalArea = 200; // default sqm
  if (plotSize.includes('x')) {
    const [w, h] = plotSize.replace('m', '').split('x').map(Number);
    totalArea = w * h;
  } else if (plotSize.includes('sqm')) {
    totalArea = parseInt(plotSize);
  }

  let baseCost = totalArea * costPerSqm * floors;

  // Add feature costs
  if (req.hasPool) baseCost += 50000;
  if (req.hasGarden) baseCost += 30000;
  if (req.hasRooftop) baseCost += 40000;
  if (req.hasSolarEnergy) baseCost += 25000;
  if (req.hasSecuritySystem) baseCost += 15000;

  const concept: ConceptResult = {
    floorPlan: `${style.charAt(0).toUpperCase() + style.slice(1)} ${projectType} concept - ${floors} ${floors > 1 ? 'floors' : 'floor'} with ${bedrooms} bedrooms, ${bathrooms} bathrooms`,
    exterior: `Contemporary ${style} facade featuring sustainable materials, ${req.hasNaturalLighting ? 'floor-to-ceiling windows' : 'strategically placed windows'} for optimal natural light`,
    interior: [
      `Spacious open-concept living area`,
      `Master suite with walk-in closet and ensuite`,
      `Gourmet kitchen with ${req.hasOpenConcept ? 'island breakfast bar' : 'separate dining space'}`,
      `${bedrooms} well-appointed bedrooms`,
      `${bathrooms} modern bathrooms`,
      `${req.hasAccessibility ? 'Accessible design with wider doorways and step-free access' : 'Traditional layout'}`,
    ],
    landscape: req.hasGarden ? `Designed outdoor spaces with native plants, sustainable irrigation, and ${req.hasPool ? 'swimming pool' : 'water feature'}` : undefined,
    materials: [
      'Sustainable timber flooring',
      'Natural stone countertops',
      'Energy-efficient double-glazed windows',
      'Low-VOC paints and finishes',
      'Locally sourced materials to reduce carbon footprint',
    ],
    estimatedCost: {
      min: Math.round(baseCost * 0.85),
      max: Math.round(baseCost * 1.25),
    },
    timeline: '12-18 months',
    energyEfficiency: [
      req.hasSolarEnergy ? 'Solar panel system with battery storage' : 'Solar-ready electrical system',
      'Passive cooling and heating design',
      'Rainwater harvesting system',
      'Energy-efficient HVAC system',
    ],
    advantages: [
      `Optimized for ${req.climate || 'your local'} climate`,
      'Sustainable and eco-friendly design',
      `${req.hasSecuritySystem ? 'Smart home security integrated' : 'Security-ready infrastructure'}`,
      `${req.hasRooftop ? 'Usable rooftop space for relaxation or entertainment' : 'Expandable roof structure'}`,
    ],
    improvements: [
      'Consider adding a backup power system',
      'Explore smart home automation options',
      'Think about future room for expansion',
      'Evaluate rainwater collection for irrigation',
    ],
  };

  const content = `# Architectural Design Generated

I've created a comprehensive conceptual design for your **${style} ${projectType}**.

---

## Project Summary

| Specification | Detail |
|---------------|--------|
| **Type** | ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} |
| **Style** | ${style.charAt(0).toUpperCase() + style.slice(1)} |
| **Plot Size** | ${plotSize} |
| **Floors** | ${floors} |
| **Bedrooms** | ${bedrooms} |
| **Bathrooms** | ${bathrooms} |
${req.hasPool ? `| **Pool** | Swimming pool |` : ''}${req.hasGarden ? `| **Garden** | Landscaped outdoor space |` : ''}${req.hasGarage ? `| **Garage** | Multi-car garage |` : ''}${req.hasRooftop ? `| **Rooftop** | Terrace design |` : ''}${req.hasSolarEnergy ? `| **Solar** | Renewable energy system |` : ''}${req.hasAccessibility ? `| **Accessibility** | Universal design |` : ''}

---

## Floor Plan Concept

${req.hasOpenConcept ? `The layout features a seamless **open-concept design** connecting living, dining, and kitchen spaces for modern family life.` : `The floor plan offers a practical layout with clearly defined living zones.`}

**Key Features:**
- ${concept.interior?.join('\n- ')}

---

## Exterior Design

${concept.exterior}

The building orientation is optimized for natural light exposure and ${req.hasSolarEnergy ? 'solar panel efficiency' : 'energy efficiency'}.

---

## Material Suggestions

${concept.materials?.map(m => `- ${m}`).join('\n')}

---

## Energy Efficiency Features

${concept.energyEfficiency?.map(e => `- ${e}`).join('\n')}

---

## Estimated Cost

**Range**: $${(concept.estimatedCost?.min || 0).toLocaleString()} - $${(concept.estimatedCost?.max || 0).toLocaleString()}

*Based on ${req.budget || 'medium'} budget parameters and current market rates.*

---

## Estimated Timeline

* ${concept.timeline}
* **Planning Phase**: 2-3 months
* **Design Phase**: 1-2 months
* **Construction**: 8-12 months

---

## Advantages of This Design

${concept.advantages?.map(a => `- ${a}`).join('\n')}

---

## Improvement Suggestions

${concept.improvements?.map(i => `- ${i}`).join('\n')}

---

**Note:** *All designs are conceptual and should be reviewed by a licensed architect and structural engineer before construction.*

---

Would you like me to:
- Make the living room larger
- Add more bedrooms
- Change the architectural style
- Adjust the budget range
- Add specific features (pool, solar panels, etc.)
- Modify the materials`;

  return { content, concept };
};

export function ChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (currentChatId && user) {
      loadMessages(currentChatId);
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [currentChatId, user]);

  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt && !currentChatId && messages.length === 0) {
      handleSendMessage(state.initialPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentChatId(chatId || null);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Build conversation history
      const history = (data || []).map(m => m.content);
      setConversationHistory(history);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string, firstMessage: string): Promise<string | null> => {
    try {
      const { data: chat, error: chatError } = await supabase
        .from('chats')
        .insert({ title, user_id: user?.id })
        .select()
        .single();

      if (chatError) throw chatError;

      await supabase.from('messages').insert({
        chat_id: chat.id,
        role: 'user',
        content: firstMessage,
      });

      setChats(prev => [{ id: chat.id, title, created_at: chat.created_at }, ...prev]);

      return chat.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const handleSendMessage = async (message: string, image?: File | null) => {
    if (!message.trim() && !image) return;

    let activeChatId = currentChatId;

    if (!activeChatId) {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      activeChatId = await createChat(title, message);
      if (!activeChatId) return;

      navigate(`/chat/${activeChatId}`, { replace: true });
      setCurrentChatId(activeChatId);

      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      setMessages([userMessage]);
      setConversationHistory([message]);
    } else {
      const { error: msgError } = await supabase.from('messages').insert({
        chat_id: activeChatId,
        role: 'user',
        content: message,
      });

      if (msgError) {
        console.error('Error saving message:', msgError);
        return;
      }

      setMessages(prev => [...prev, {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      }]);
      setConversationHistory(prev => [...prev, message]);
    }

    setIsGenerating(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const { content, concept } = generateArchitectureResponse(message, conversationHistory);

    if (concept) {
      setCurrentConcept(concept);
    }

    const { data: aiMessage, error: aiError } = await supabase
      .from('messages')
      .insert({
        chat_id: activeChatId,
        role: 'assistant',
        content,
      })
      .select()
      .single();

    if (aiError) {
      console.error('Error saving AI message:', aiError);
    } else {
      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [...prev, content]);
    }

    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', activeChatId);

    setIsGenerating(false);

    if (activeChatId) {
      loadMessages(activeChatId);
    }
  };

  const handleNewChat = () => {
    navigate('/chat');
    setCurrentChatId(null);
    setMessages([]);
    setCurrentConcept(null);
    setConversationHistory([]);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await supabase.from('chats').delete().eq('id', chatId);
      setChats(prev => prev.filter(c => c.id !== chatId));

      if (currentChatId === chatId) {
        navigate('/chat');
        setCurrentChatId(null);
        setMessages([]);
        setCurrentConcept(null);
        setConversationHistory([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <MainLayout
      chats={chats}
      onNewChat={handleNewChat}
      onDeleteChat={handleDeleteChat}
      currentChatId={currentChatId || undefined}
    >
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={48} className="text-gold-500" />
              </motion.div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-6">
                  <Building2 size={40} className="text-gold-400" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Design Your Dream Space</h3>
                <p className="text-luxury-silver max-w-lg mb-6">
                  Tell me about your architectural vision. I'll guide you through creating the perfect design with professional floor plans and visualizations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { text: 'Modern villa with 5 bedrooms and pool', icon: Building2 },
                    { text: 'Minimalist Japanese house with zen garden', icon: TreeDeciduous },
                    { text: 'Luxury apartment with rooftop terrace', icon: Sun },
                    { text: 'Contemporary office for 50 employees', icon: Users },
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(example.text)}
                      className="p-4 rounded-xl bg-luxury-charcoal/30 border border-gold-500/10 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-left flex items-center gap-3 group"
                    >
                      <example.icon size={18} className="text-gold-400/60 group-hover:text-gold-400 transition-colors" />
                      <span>{example.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.created_at}
                  />
                ))}
              </AnimatePresence>

              {isGenerating && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold-500/10 border border-gold-500/20">
                    <Sparkles size={20} className="text-gold-400" />
                  </div>
                  <div className="flex-1 glass-subtle rounded-2xl rounded-bl-md px-4 py-3">
                    <TypingIndicator />
                    <p className="text-xs text-luxury-silver mt-2">Analyzing your requirements...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Concept Summary Panel */}
        <AnimatePresence>
          {currentConcept && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t border-gold-500/10 px-4 py-4"
            >
              <div className="max-w-4xl mx-auto">
                <Card className="p-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20">
                        <MapPin size={14} className="text-gold-400" />
                        <span className="text-xs font-medium text-gold-300">Plot</span>
                        <span className="text-xs">{currentConcept.floorPlan?.split(' - ')[1] || 'Custom'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                        <DollarSign size={14} className="text-green-400" />
                        <span className="text-xs font-medium text-green-300">Cost</span>
                        <span className="text-xs">
                          ${(currentConcept.estimatedCost?.min || 0).toLocaleString()} - ${(currentConcept.estimatedCost?.max || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Clock size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-blue-300">Timeline</span>
                        <span className="text-xs">{currentConcept.timeline}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const exportText = `# ArchiMind Design Export\n\n**Plot:** ${currentConcept.floorPlan || 'Custom'}\n**Cost:** ${(currentConcept.estimatedCost?.min || 0).toLocaleString()} - ${(currentConcept.estimatedCost?.max || 0).toLocaleString()}\n**Timeline:** ${currentConcept.timeline}\n\n## Interior\n${currentConcept.interior?.map(i => `- ${i}`).join('\n') || ''}\n\n## Materials\n${currentConcept.materials?.map(m => `- ${m}`).join('\n') || ''}\n\n## Energy Efficiency\n${currentConcept.energyEfficiency?.map(e => `- ${e}`).join('\n') || ''}`;
                          const blob = new Blob([exportText], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `archimind-design-${Date.now()}.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors text-xs"
                      >
                        <Download size={14} className="text-gold-400" />
                        Export
                      </button>
                      <button
                        onClick={async () => {
                          const shareText = `Check out my ArchiMind AI design: ${currentConcept.floorPlan || 'Custom'} - Est. ${(currentConcept.estimatedCost?.min || 0).toLocaleString()} - ${(currentConcept.estimatedCost?.max || 0).toLocaleString()}`;
                          if (navigator.share) {
                            try { await navigator.share({ title: 'ArchiMind Design', text: shareText }); } catch {}
                          } else {
                            navigator.clipboard.writeText(shareText);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors text-xs"
                      >
                        <Share2 size={14} className="text-gold-400" />
                        Share
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="max-w-4xl mx-auto w-full px-4 pb-4">
          <ChatInput
            onSend={handleSendMessage}
            onStop={() => setIsGenerating(false)}
            disabled={loading}
            isGenerating={isGenerating}
            placeholder="Describe your project or request modifications..."
          />
        </div>
      </div>
    </MainLayout>
  );
}
