import { logger } from '@/utils/logger';

export interface SaathiChatContext {
  artisanName?: string;
  artisanLocation?: string;
  craftSpecialty?: string;
  todayEarnings?: number;
  escrowBalance?: number;
  pendingOrdersCount?: number;
  recentOrders?: {
    id: string;
    buyerName: string;
    item: string;
    amount: number;
    deadline?: string;
  }[];
  inventorySummary?: {
    item: string;
    stock: number;
    price: number;
  }[];
  activeLanguage?: 'hi-IN' | 'mr-IN' | 'en-IN' | string;
}

export interface SaathiAiResponse {
  query: string;
  replyText: string;
  audioText: string;
  actionType?: 'orders' | 'earnings' | 'price' | 'delivery' | 'schemes' | 'create' | 'mela' | 'general';
  actionTitle?: string;
  actionTarget?: string;
  data?: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export class GeminiSaathiService {
  private apiKey: string = '';
  private primaryModel: string = 'gemini-3.6-flash';
  private fallbackModels: string[] = ['gemini-3.5-flash', 'gemini-flash-latest'];

  public setApiKey(key: string) {
    if (key && key.trim().length > 10) {
      this.apiKey = key.trim();
    } else {
      this.apiKey = '';
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Main chat function that connects user's query and store context to Google Gemini AI.
   */
  public async askSaathi(
    query: string,
    context: SaathiChatContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<SaathiAiResponse> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        query: '',
        replyText: 'Kripya kuch boliye ya type karein.',
        audioText: 'Kripya kuch boliye ya type karein.',
        actionType: 'general',
      };
    }

    // If no client-side Gemini API key is configured, gracefully use the Indic Smart Local Fallback
    if (!this.apiKey || this.apiKey.trim().length < 10) {
      logger.info('SAATHI_AI', 'Gemini API key not configured on client. Using Indic Smart Assistant fallback.');
      return this.generateSmartLocalFallback(trimmed, context);
    }

    try {
      logger.info('SAATHI_AI', `Sending query to Gemini AI: "${trimmed}"`);
      const response = await this.callGeminiChat(trimmed, context, conversationHistory);
      return response;
    } catch (err: any) {
      const safeError = (err?.message || String(err)).replace(/[A-Za-z0-9_-]{20,}/g, '[REDACTED]');
      logger.warn('SAATHI_AI', 'Gemini API call failed, falling back to Indic NLP Assistant', {
        error: safeError,
      });
      return this.generateSmartLocalFallback(trimmed, context);
    }
  }

  /**
   * Invokes Google Gemini generateContent with structured prompt & JSON output.
   */
  private async callGeminiChat(
    query: string,
    context: SaathiChatContext,
    conversationHistory: ChatMessage[]
  ): Promise<SaathiAiResponse> {
    const languageCode = context.activeLanguage || 'hi-IN';
    const isMarathi = languageCode.startsWith('mr');
    const isEnglish = languageCode.startsWith('en');

    let languageDirective = 'Respond in warm, respectful Hinglish/Hindi (Indian artisan colloquial style).';
    if (isMarathi) {
      languageDirective = 'Respond in warm, respectful Marathi (मराठी). Audio text must be clean Marathi without English script.';
    } else if (isEnglish) {
      languageDirective = 'Respond in warm, clear, encouraging English with Indian handicraft context.';
    }

    const artisanName = context.artisanName || 'Ramesh Kumbhar';
    const artisanLocation = context.artisanLocation || 'Kolhapur Studio, Maharashtra';
    const craft = context.craftSpecialty || 'Terracotta Pottery & Clay Handicrafts';

    const systemPrompt = `
You are "Voice Saathi" (साथी), the dedicated AI Assistant for ${artisanName}, an Indian artisan craftsman specializing in ${craft} at ${artisanLocation} on the Kalakar Setu handicraft platform.

Live Artisan Dashboard & Store Context:
- Today's Earnings: ₹${context.todayEarnings ?? 2400} (Day-over-Day: +30%)
- Total Khata / Balance: ₹24,800
- Nodal Escrow Vault: ₹${context.escrowBalance ?? 2892} (100% safe & protected)
- Pending Orders: ${context.pendingOrdersCount ?? 2} new orders
  * Order 1: Priya Sharma (Pune) - Terracotta Festive Diya Set (₹1,250) - Status: Pending Acceptance
  * Order 2: Rajesh Patel (Mumbai) - Handcrafted Clay Matka (₹650) - Status: In Crafting
- Delivery: India Post parcel pickup scheduled for tomorrow at 10:00 AM
- Inventory in Stock: 85 Terracotta Diyas (₹850/set), 12 Clay Water Matkas (₹450/pc), 8 Hand-painted Vases (₹1,200/pc)
- Government Schemes Eligible:
  * PM Vishwakarma Yojana: ₹15,000 Tool Kit Incentive approved + 5% Collateral-Free Credit up to ₹1,00,000
  * PMEGP / Mudra Loan: ₹50,000 Pre-approved
  * ODOP (One District One Product) GI Tag Authenticity Certification available
- Raw Material Mandi Rates: Riverbed Clay: ₹18/kg, Wood/Kiln Fuel: ₹12/kg, Natural Glazes: ₹45/kg

Instructions:
1. ${languageDirective}
2. Be concise, highly practical, warm, and helpful. Address the artisan respectfully (${isMarathi ? 'रमेशजी' : isEnglish ? 'Ramesh' : 'रमेश जी'}).
3. audioText MUST be plain readable phonetic text for SpeechSynthesis:
   - NO markdown asterisks (no ** or *), NO emojis in audioText, NO bullet characters, NO weird symbols.
   - Spell out key numbers and amounts phonetically for natural voice (e.g. "चौबीस हजार" or "दो हज़ार चार सौ रुपये" or "two thousand four hundred rupees").
4. Choose the best matching actionType:
   - 'orders' -> viewing orders/fulfillment
   - 'earnings' -> checking khata/income/escrow
   - 'price' -> fair pricing calculation/advice
   - 'delivery' -> India Post dispatch/tracking
   - 'schemes' -> PM Vishwakarma, Mudra loans, grants
   - 'create' -> AI Smart Catalogue / taking photo
   - 'mela' -> Mela Mode POS
   - 'general' -> general query/craft advice

Return strict JSON matching this structure:
{
  "replyText": "...",
  "audioText": "...",
  "actionType": "orders" | "earnings" | "price" | "delivery" | "schemes" | "create" | "mela" | "general",
  "actionTitle": "Short button text e.g. 'ऑर्डर देखें' or 'View Orders'"
}
`;

    const contents: any[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [
          {
            text: JSON.stringify({
              replyText: isMarathi
                ? 'नमस्कार रमेशजी! मी तुमचा व्हॉइस साथी आहे. सांगा, मी तुमची काय मदत करू?'
                : isEnglish
                ? 'Hello Ramesh! I am your Voice Saathi. How can I assist you in your craft studio today?'
                : 'नमस्ते रमेश जी! मैं आपका वॉइस साथी हूँ। बताइए, आज आपकी दुकान या काम में क्या मदद करूँ?',
              audioText: isMarathi
                ? 'नमस्कार रमेशजी, मी तुमचा व्हॉइस साथी आहे. आज काय मदत हवी आहे?'
                : isEnglish
                ? 'Hello Ramesh, I am your Voice Saathi. How can I assist you today?'
                : 'नमस्ते रमेश जी, मैं आपका वॉइस साथी हूँ। बोलिए, क्या सहायता चाहिए?',
              actionType: 'general',
              actionTitle: isMarathi ? 'मदत' : isEnglish ? 'Help' : 'मदद',
            }),
          },
        ],
      },
    ];

    // Append recent history
    for (const msg of conversationHistory.slice(-4)) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.text }],
      });
    }

    // Append current query
    contents.push({
      role: 'user',
      parts: [{ text: query }],
    });

    const modelsToTry = [this.primaryModel, ...this.fallbackModels];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.apiKey,
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.25,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Model ${model} returned HTTP ${response.status}`);
        }

        const resData = await response.json();
        const candidateText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error(`No text returned by ${model}`);
        }

        const parsed = JSON.parse(candidateText);
        return {
          query,
          replyText: parsed.replyText || candidateText,
          audioText: parsed.audioText || parsed.replyText || candidateText,
          actionType: parsed.actionType || 'general',
          actionTitle: parsed.actionTitle,
        };
      } catch (e: any) {
        lastError = e;
        const safeError = (e?.message || String(e)).replace(/[A-Za-z0-9_-]{20,}/g, '[REDACTED]');
        logger.warn('SAATHI_AI', `Failed calling model ${model}, trying next...`, { error: safeError });
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Local Smart Fallback in case of network unavailability
   */
  private generateSmartLocalFallback(
    query: string,
    context: SaathiChatContext
  ): SaathiAiResponse {
    const q = query.toLowerCase().trim();
    const isMarathi = (context.activeLanguage || '').startsWith('mr');
    const isEnglish = (context.activeLanguage || '').startsWith('en');

    if (q.includes('order') || q.includes('ऑर्डर') || q.includes('ऑर्डर्स') || q.includes('ग्राहक')) {
      return {
        query,
        replyText: isMarathi
          ? '📦 रमेशजी, तुमच्याकडे २ नवीन ऑर्डर्स आहेत:\n1. प्रिया शर्मा (पुणे): टेराकोटा दिवा सेट (₹१,२५०)\n2. राजेश पटेल: मातीचा माठ (₹६५०)\n\nइंडिया पोस्ट पिकअप उद्या सकाळी १० वाजता आहे.'
          : isEnglish
          ? '📦 Ramesh, you have 2 pending orders:\n1. Priya Sharma (Pune): Terracotta Diya Set (₹1,250)\n2. Rajesh Patel: Handcrafted Clay Matka (₹650)\n\nIndia Post pickup is tomorrow at 10:00 AM.'
          : '📦 रमेश जी, आपके पास 2 नए ऑर्डर्स पेंडिंग हैं:\n1. प्रिया शर्मा (पुणे): टेराकोटा दीया सेट (₹1,250)\n2. राजेश पटेल: मिट्टी का मटका (₹650)\n\nइंडिया पोस्ट पिकअप कल सुबह 10 बजे तय है।',
        audioText: isMarathi
          ? 'रमेशजी, तुमच्याकडे दोन नवीन ऑर्डर्स आहेत. प्रिया शर्मा यांचा दिवा सेट आणि राजेश पटेल यांचा माठ. पिकअप उद्या सकाळी दहा वाजता आहे.'
          : isEnglish
          ? 'Ramesh, you have two pending orders. Priya Sharma for diya set and Rajesh Patel for clay matka. Pickup is tomorrow at ten AM.'
          : 'रमेश जी, आपके पास दो नए ऑर्डर्स पेंडिंग हैं। प्रिया शर्मा का दीया सेट और राजेश पटेल का मटका। पिकअप कल सुबह दस बजे है।',
        actionType: 'orders',
        actionTitle: isMarathi ? 'ऑर्डर्स पहा' : isEnglish ? 'View Orders' : 'ऑर्डर्स देखें',
      };
    }

    if (q.includes('kamai') || q.includes('kamaya') || q.includes('earning') || q.includes('पैसे') || q.includes('कमाई') || q.includes('khata')) {
      return {
        query,
        replyText: isMarathi
          ? '💰 रमेशजी, आज तुमची एकूण कमाई ₹२,४०० झाली आहे (+३०% वाढ). एस्क्रो खात्यात ₹२,८९२ पूर्णपणे सुरक्षित आहेत.'
          : isEnglish
          ? '💰 Ramesh, your earnings today are ₹2,400 (+30% growth). ₹2,892 is fully secured in the Nodal Escrow Vault.'
          : '💰 रमेश जी, आज आपकी कुल कमाई ₹2,400 हुई है (+30% बढ़ोत्तरी)। नोडल एस्क्रो में ₹2,892 सुरक्षित हैं।',
        audioText: isMarathi
          ? 'रमेशजी, आज तुमची कमाई दोन हजार चारशे रुपये झाली आहे, जी कालपेक्षा तीस टक्के जास्त आहे.'
          : isEnglish
          ? 'Ramesh, your earnings today are two thousand four hundred rupees, thirty percent higher than yesterday.'
          : 'रमेश जी, आज आपकी कमाई दो हज़ार चार सौ रुपये हुई है, जो कल से तीस प्रतिशत ज़्यादा है।',
        actionType: 'earnings',
        actionTitle: isMarathi ? 'खाते तपासा' : isEnglish ? 'Check Khata' : 'खाता देखें',
      };
    }

    if (q.includes('yojana') || q.includes('scheme') || q.includes('योजना') || q.includes('mudra') || q.includes('vishwakarma')) {
      return {
        query,
        replyText: isMarathi
          ? '🏛️ पीएम विश्वकर्मा योजनेअंतर्गत ₹१५,००० टूलकिट अनुदान मंजूर झाले आहे आणि ₹५०,००० मुद्रा कर्ज ५% व्याजाने उपलब्ध आहे.'
          : isEnglish
          ? '🏛️ Under PM Vishwakarma Yojana, ₹15,000 tool kit incentive is approved, and ₹50,000 Mudra loan is pre-approved at 5% interest.'
          : '🏛️ पीएम विश्वकर्मा योजना में ₹15,000 टूलकिट ग्रांट मंजूर है, और ₹50,000 मुद्रा लोन 5% ब्याज पर प्री-अप्रूव्ड है।',
        audioText: isMarathi
          ? 'पीएम विश्वकर्मा योजनेत पंधरा हजार रुपये टूलकिट अनुदान मंजूर आहे आणि मुद्रा कर्ज उपलब्ध आहे.'
          : isEnglish
          ? 'Under PM Vishwakarma Yojana, fifteen thousand rupees tool kit grant is approved.'
          : 'पीएम विश्वकर्मा योजना में पंद्रह हज़ार रुपये टूलकिट ग्रांट मंज़ूर है और मुद्रा लोन उपलब्ध है।',
        actionType: 'schemes',
        actionTitle: isMarathi ? 'योजना अर्ज' : isEnglish ? 'View Scheme' : 'योजना देखें',
      };
    }

    return {
      query,
      replyText: isMarathi
        ? `नमस्कार रमेशजी! मी तुमचे ऐकले: "${query}". मी तुम्हाला ऑर्डर्स, कमाई, सरकारी योजना किंवा क्राफ्ट पासपोर्ट बनवण्यात मदत करू शकतो.`
        : isEnglish
        ? `Hello Ramesh! I heard: "${query}". I am ready to help you with your orders, earnings, schemes, or AI product cataloging.`
        : `नमस्ते रमेश जी! मैंने सुना: "${query}"। मैं आपके ऑर्डर्स, कमाई, सरकारी योजनाओं और नए क्राफ्ट प्रॉडक्ट्स में पूरी सहायता करूँगा।`,
      audioText: isMarathi
        ? `नमस्कार रमेशजी, मी तुमचे बोलणे ऐकले आहे. सांगा काय करायचे आहे?`
        : isEnglish
        ? `Hello Ramesh, I heard your voice. How would you like me to proceed?`
        : `नमस्ते रमेश जी, मैंने आपकी बात सुन ली है। बताइए आगे क्या करना है?`,
      actionType: 'general',
    };
  }
}

export const geminiSaathiService = new GeminiSaathiService();
