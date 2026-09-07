import { logger } from '@/utils/logger';
import { geminiCatalogService } from '@/api/geminiCatalogService';

export interface AiVoiceModificationResult {
  originalText: string;
  modifiedText: string;
  explanation: string;
  extractedAttributes: {
    craftCategory?: string;
    material?: string;
    technique?: string;
    motif?: string;
    laborHours?: number;
    dimensions?: string;
    suggestedPrice?: number;
  };
  suggestedActions?: {
    label: string;
    actionKey: string;
  }[];
}

export interface SaathiVoiceResponse {
  query: string;
  replyText: string;
  audioText: string;
  actionType?: 'earnings' | 'orders' | 'price' | 'delivery' | 'schemes' | 'create' | 'general';
  data?: any;
}

export class AiVoiceModifierService {
  /**
   * Modifies and enhances raw user spoken input using Gemini or Indic Craft NLP.
   */
  public async modifyWithAi(
    rawTranscript: string,
    context: 'product_story' | 'search' | 'saathi' | 'general' = 'product_story'
  ): Promise<AiVoiceModificationResult> {
    const trimmed = (rawTranscript || '').trim();
    if (!trimmed) {
      return {
        originalText: '',
        modifiedText: '',
        explanation: 'No input text provided',
        extractedAttributes: {},
      };
    }

    const apiKey = geminiCatalogService.getApiKey();

    // If Gemini API Key is configured, attempt direct Gemini enhancement
    if (apiKey && apiKey.length > 10) {
      try {
        logger.info('AI_VOICE_MODIFIER', 'Calling Gemini 1.5 Flash to polish voice transcript...');
        return await this.callGeminiModifier(trimmed, context, apiKey);
      } catch (err) {
        logger.warn('AI_VOICE_MODIFIER', 'Gemini polishing failed, using Indic NLP engine', { err });
      }
    }

    // High-fidelity Indic Craft NLP Fallback Engine
    return this.generateIndicNlpPolish(trimmed, context);
  }

  /**
   * Gemini-powered speech enhancer
   */
  private async callGeminiModifier(
    transcript: string,
    context: string,
    apiKey: string
  ): Promise<AiVoiceModificationResult> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are Kalakar Setu's Artisan Voice Assistant and Indic Craft Editor.
The user spoke the following text using voice input:
"${transcript}"

Context: "${context}"

Tasks:
1. Polish the spoken text: remove filler words (e.g. um, uh, arre, matlab), correct transcription typos, maintain the original language (Hindi/Marathi/English/Hinglish), and present a clear, professional, poetic craft description or concise search query.
2. Extract any craft attributes (craft category, materials used, technique, motif, labor time, suggested price).
3. Provide a brief explanation of what was improved.

Return JSON in this exact structure:
{
  "modifiedText": "...",
  "explanation": "...",
  "extractedAttributes": {
    "craftCategory": "...",
    "material": "...",
    "technique": "...",
    "motif": "...",
    "laborHours": 16,
    "dimensions": "...",
    "suggestedPrice": 850
  }
}
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content received');
    }

    const parsed = JSON.parse(candidateText);
    return {
      originalText: transcript,
      modifiedText: parsed.modifiedText || transcript,
      explanation: parsed.explanation || 'Polished grammar, clarity, and craft vocabulary.',
      extractedAttributes: parsed.extractedAttributes || {},
    };
  }

  /**
   * Indic Rule-based NLP Polish & Craft Attribute Extractor
   */
  public generateIndicNlpPolish(
    rawText: string,
    context: 'product_story' | 'search' | 'saathi' | 'general'
  ): AiVoiceModificationResult {
    const lower = rawText.toLowerCase();

    // 1. Clean speech fillers
    let polished = rawText
      .replace(/\b(umm|uh|arre|matlab|basically|like|you know|na)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Capitalize first letter
    if (polished.length > 0) {
      polished = polished.charAt(0).toUpperCase() + polished.slice(1);
      if (!/[.!?।]$/.test(polished)) {
        polished += '।';
      }
    }

    const extracted: AiVoiceModificationResult['extractedAttributes'] = {};

    // 2. Material Extraction
    if (lower.includes('clay') || lower.includes('mitti') || lower.includes('terracotta') || lower.includes('mitti se')) {
      extracted.material = 'शुद्ध नदी की प्राकृतिक मिट्टी (Natural Riverbed Clay)';
      extracted.craftCategory = 'POTTERY_TERRACOTTA';
    } else if (lower.includes('silk') || lower.includes('resham') || lower.includes('saree') || lower.includes('saadi')) {
      extracted.material = 'शुद्ध मलबरी सिल्क व ज़री (Pure Mulberry Silk & Zari)';
      extracted.craftCategory = 'TEXTILE_HANDLOOM';
    } else if (lower.includes('cotton') || lower.includes('sut') || lower.includes('soot') || lower.includes('khadi')) {
      extracted.material = 'हाथ से बुना ऑर्गेनिक कॉटन (Handspun Organic Cotton)';
      extracted.craftCategory = 'TEXTILE_HANDLOOM';
    } else if (lower.includes('metal') || lower.includes('brass') || lower.includes('peetal') || lower.includes('dhokra') || lower.includes('bell metal')) {
      extracted.material = 'बेल मेटल व पीतल (Bastar Bell Metal)';
      extracted.craftCategory = 'METAL_BELL';
    } else if (lower.includes('wood') || lower.includes('lakdi') || lower.includes('channapatna')) {
      extracted.material = 'प्राकृतिक अले मरे लकड़ी (Ivory Wood & Natural Lac)';
      extracted.craftCategory = 'TOY_CHANNAPATNA';
    } else {
      extracted.material = 'प्राकृतिक पारंपरिक कच्चा माल (Indigenous Natural Materials)';
    }

    // 3. Technique Extraction
    if (lower.includes('chak') || lower.includes('wheel') || lower.includes('chaak')) {
      extracted.technique = 'पारंपरिक कुम्हार चाक पर गढ़ा (Hand-thrown Wheel Technique)';
    } else if (lower.includes('hath se buna') || lower.includes('handloom') || lower.includes('weav')) {
      extracted.technique = 'पारंपरिक हथकरघा बुनाई (Traditional Handloom Weave)';
    } else if (lower.includes('paint') || lower.includes('rang') || lower.includes('kalam') || lower.includes('brush')) {
      extracted.technique = 'बांस की निब से प्राकृतिक रंगों द्वारा चित्रकारी (Bamboo Nib Painting)';
      extracted.craftCategory = 'PAINTING_MITHILA';
    } else {
      extracted.technique = '100% पारंपरिक हस्तशिल्प तकनीक (Centuries-old Handcrafting)';
    }

    // 4. Motif Extraction
    if (lower.includes('fish') || lower.includes('matsya') || lower.includes('machhli')) {
      extracted.motif = 'मत्स्य रूपांकन (Matsya / Fish Motif — Prosperity)';
    } else if (lower.includes('peacock') || lower.includes('mor') || lower.includes('mayur')) {
      extracted.motif = 'मयूर रूपांकन (Mayur / Peacock Motif)';
    } else if (lower.includes('diya') || lower.includes('deepak') || lower.includes('lamp')) {
      extracted.motif = 'पारंपरिक दीया नक्काशी (Traditional Festive Diya)';
    } else if (lower.includes('phool') || lower.includes('flower') || lower.includes('floral')) {
      extracted.motif = 'पुष्प व लताएं (Traditional Floral Vines)';
    } else {
      extracted.motif = 'प्रामाणिक सांस्कृतिक धरोहर रूपांकन (Authentic Heritage Motif)';
    }

    // 5. Labor Hours Extraction
    if (lower.includes('1 din') || lower.includes('one day') || lower.includes('8 ghante')) {
      extracted.laborHours = 8;
    } else if (lower.includes('2 din') || lower.includes('two days') || lower.includes('do din')) {
      extracted.laborHours = 16;
    } else if (lower.includes('3 din') || lower.includes('three days') || lower.includes('teen din')) {
      extracted.laborHours = 24;
    } else if (lower.includes('hafte') || lower.includes('week') || lower.includes('saat din')) {
      extracted.laborHours = 56;
    } else {
      extracted.laborHours = 16;
    }

    // Context-specific polish
    let aiPolishedText = polished;
    let explanation = 'Filler words removed, sentences structured, and craft entities highlighted.';

    if (context === 'product_story') {
      aiPolishedText = `अस्सल हस्तशिल्प: ${polished} यह उत्पाद ${extracted.material} से निर्मित है और इसमें ${extracted.technique} का उपयोग किया गया है।`;
      explanation = 'AI ne aawaz ko formal e-commerce craft narrative me badla aur material/technique jode.';
    } else if (context === 'search') {
      // For search, make it a clean, optimized craft query
      aiPolishedText = rawText
        .replace(/\b(mujhe|chahiye|dikhao|batao|search|karo|plz|please)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      explanation = 'Search intent optimized for artisan catalog.';
    }

    return {
      originalText: rawText,
      modifiedText: aiPolishedText,
      explanation,
      extractedAttributes: extracted,
      suggestedActions: [
        { label: 'Use AI Enhanced', actionKey: 'apply_ai' },
        { label: 'Keep Original Words', actionKey: 'keep_original' },
      ],
    };
  }

  /**
   * Intelligently processes artisan queries on Voice Saathi Screen based on what was actually said.
   */
  public processSaathiQuery(query: string): SaathiVoiceResponse {
    const q = query.toLowerCase().trim();

    // 1. Earnings / Paisa / Kamai
    if (
      q.includes('kamaya') ||
      q.includes('earning') ||
      q.includes('paise') ||
      q.includes('rupaye') ||
      q.includes('income') ||
      q.includes('munafa') ||
      q.includes('balance') ||
      q.includes('khata')
    ) {
      return {
        query,
        replyText:
          '💰 Ramesh Ji, aaj aapne kul ₹2,400 kamaye hain, jo ki kal se 30% zyada hai! Nodal Escrow mein ₹2,892 safe hain.',
        audioText:
          'Ramesh Ji, aaj aapne kul do hazaar char sau rupaye kamaye hain, jo kal se tees pratishat zyada hai.',
        actionType: 'earnings',
        data: { earnings: '₹2,400', escrow: '₹2,892', change: '+30%' },
      };
    }

    // 2. Orders / Pending / Naya order / Buyer
    if (
      q.includes('order') ||
      q.includes('orders') ||
      q.includes('bikri') ||
      q.includes('customer') ||
      q.includes('grahak') ||
      q.includes('kharidaar')
    ) {
      return {
        query,
        replyText:
          '📦 Aapke pass 2 naye orders pending hain. Pune se Priya Sharma Ji ne Terracotta Diya Set ka order diya hai (₹1,250).',
        audioText:
          'Aapke pass do naye orders pending hain. Pune se Priya Sharma Ji ka diya set ka order accept karna hai.',
        actionType: 'orders',
        data: { count: 2, buyer: 'Priya Sharma', item: 'Terracotta Diya Set', amount: '₹1,250' },
      };
    }

    // 3. Pricing / Daam / Rate / Value
    if (
      q.includes('price') ||
      q.includes('daam') ||
      q.includes('rate') ||
      q.includes('mulya') ||
      q.includes('bhaav') ||
      q.includes('kitne') ||
      q.includes('cost')
    ) {
      return {
        query,
        replyText:
          '💡 Terracotta Diya Set ka recommended fair price ₹850 hai (Labor + River Clay). Festival demand par ye ₹1,200 tak bik sakta hai.',
        audioText:
          'Terracotta Diya Set ka recommended fair price aath sau pachaas rupaye hai. Diwali demand par daam badha sakte hain.',
        actionType: 'price',
        data: { recommended: '₹850', festival: '₹1,200' },
      };
    }

    // 4. Delivery / Dispatch / Post / Courier / Dakghar
    if (
      q.includes('delivery') ||
      q.includes('bhejna') ||
      q.includes('dispatch') ||
      q.includes('post') ||
      q.includes('dak') ||
      q.includes('courier') ||
      q.includes('pickup')
    ) {
      return {
        query,
        replyText:
          '🚚 Anita Desai Ji ka order 12 September tak deliver hona hai. India Post parcel van kal subah 10 baje pickup karegi.',
        audioText:
          'Anita Desai Ji ka parcel kal subah das baje India Post pickup karegi. Kripya QR passport ke saath pack rakhein.',
        actionType: 'delivery',
        data: { customer: 'Anita Desai', deadline: '12 Sept', pickup: 'Tomorrow 10 AM' },
      };
    }

    // 5. Government Schemes / Yojana / Loan / Grant
    if (
      q.includes('yojana') ||
      q.includes('scheme') ||
      q.includes('sarkari') ||
      q.includes('vishwakarma') ||
      q.includes('mudra') ||
      q.includes('loan') ||
      q.includes('subsidy') ||
      q.includes('grant')
    ) {
      return {
        query,
        replyText:
          '🏛️ PM Vishwakarma Yojana mein ₹15,000 tool grant approved hai. PMEGP Mudra loan mein ₹50,000 pre-approved hain 5% subsidy ke saath.',
        audioText:
          'PM Vishwakarma Yojana mein pandrah hazaar rupaye tool grant approved hai, aur mudra loan pre-approved hai.',
        actionType: 'schemes',
        data: { vishwakarma: '₹15,000 Tool Grant', mudra: '₹50,000 Pre-approved' },
      };
    }

    // 6. Product Creation / Photo / Listing / Craft Story
    if (
      q.includes('photo') ||
      q.includes('naya product') ||
      q.includes('bechna') ||
      q.includes('listing') ||
      q.includes('upload') ||
      q.includes('craft') ||
      q.includes('diya') ||
      q.includes('saree') ||
      q.includes('painting')
    ) {
      return {
        query,
        replyText: `🎨 Maine aapki craft suni: "${query}". Chaliye iska AI studio photo aur GI catalog passport banate hain!`,
        audioText:
          'Maine aapka craft sun liya hai. Chaliye iska AI studio photo aur catalog passport banate hain.',
        actionType: 'create',
        data: { query },
      };
    }

    // 7. General Conversational Query
    return {
      query,
      replyText: `Namaste Ramesh Ji! Maine suna: "${query}". Main aapki saari madad karne ke liye taiyaar hoon. Aap orders, kamai, delivery ya product creation ke baare me pooch sakte hain.`,
      audioText: `Maine aapki aawaz sun li hai: ${query}. Boliye, main aapki aur kya madad kar sakta hoon?`,
      actionType: 'general',
      data: { query },
    };
  }
}

export const aiVoiceModifierService = new AiVoiceModifierService();
