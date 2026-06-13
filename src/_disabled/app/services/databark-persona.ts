// DataBark Persona Service - Intelligent user analysis and personalized interactions
import { usePostHog } from 'posthog-js/react';
import type { PostHog } from 'posthog-js';

export interface UserInsights {
  totalEvents: number;
  topEvents: string[];
  recentActivity: string[];
  userSegment: 'new' | 'active' | 'power' | 'returning';
  businessContext: {
    industry?: string;
    teamSize?: string;
    useCases: string[];
  };
  personalizedSuggestions: string[];
}

export interface DataBarkPersona {
  mood: 'excited' | 'thinking' | 'working' | 'celebrating' | 'happy' | 'confused';
  greeting: string;
  personality: string;
  suggestions: {
    text: string;
    confidence: number;
    category: 'metrics' | 'analysis' | 'trends' | 'comparison';
  }[];
  funnyQuips: string[];
}

class DataBarkPersonaService {
  private posthog: PostHog | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  setPostHog(posthog: PostHog | null) {
    this.posthog = posthog;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() - cached.timestamp < this.CACHE_TTL : false;
  }

  private getCached<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data || null;
    }
    return null;
  }

  private setCached<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async analyzeUserInsights(): Promise<UserInsights> {
    const cacheKey = 'user_insights';
    const cached = this.getCached<UserInsights>(cacheKey);
    if (cached) return cached;

    try {
      // In a real implementation, this would query PostHog's API
      // For now, we'll simulate intelligent analysis based on typical user patterns
      const mockInsights = await this.generateMockInsights();
      this.setCached(cacheKey, mockInsights);
      return mockInsights;
    } catch (error) {
      console.error('Failed to analyze user insights:', error);
      return this.getDefaultInsights();
    }
  }

  private async generateMockInsights(): Promise<UserInsights> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get domain-specific insights based on current domain
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    const businessContexts = [
      {
        industry: 'Analytics Platform',
        domain: 'debark/analytics',
        useCases: ['user behavior tracking', 'feature adoption', 'dashboard performance', 'widget engagement'],
        suggestions: [
          'Ask me to make a dashboard about "user engagement and session analytics"',
          'Ask me to add a widget for "most popular dashboard features"',
          'Ask me to make a dashboard about "widget creation trends over time"',
          'Ask me to add a widget for "user retention and churn analysis"',
          'Ask me to make a dashboard about "platform performance metrics"',
          'Ask me to add a widget for "daily active users vs widget creation"'
        ]
      },
      {
        industry: 'E-commerce',
        domain: 'ecommerce/retail',
        useCases: ['conversion tracking', 'customer acquisition', 'revenue analysis', 'product performance'],
        suggestions: [
          'Ask me to make a dashboard about "sales performance and conversion rates"',
          'Ask me to add a widget for "top-selling products this month"',
          'Ask me to make a dashboard about "customer acquisition cost by channel"',
          'Ask me to add a widget for "cart abandonment recovery rates"',
          'Ask me to make a dashboard about "seasonal revenue trends"',
          'Ask me to add a widget for "customer lifetime value analysis"'
        ]
      },
      {
        industry: 'SaaS',
        domain: 'saas/software',
        useCases: ['user engagement', 'feature adoption', 'churn analysis', 'growth metrics'],
        suggestions: [
          'Ask me to make a dashboard about "monthly recurring revenue (MRR) trends"',
          'Ask me to add a widget for "feature adoption rates by user segment"',
          'Ask me to make a dashboard about "user onboarding funnel analysis"',
          'Ask me to add a widget for "churn risk indicators"',
          'Ask me to make a dashboard about "customer success metrics"',
          'Ask me to add a widget for "trial-to-paid conversion rates"'
        ]
      },
      {
        industry: 'Content/Media',
        domain: 'media/content',
        useCases: ['content engagement', 'audience analysis', 'monetization', 'growth tracking'],
        suggestions: [
          'Ask me to make a dashboard about "content engagement and reach metrics"',
          'Ask me to add a widget for "top-performing content by category"',
          'Ask me to make a dashboard about "audience demographics and behavior"',
          'Ask me to add a widget for "subscription growth and retention"',
          'Ask me to make a dashboard about "monetization performance across channels"',
          'Ask me to add a widget for "content creation vs engagement correlation"'
        ]
      }
    ];

    // Prioritize Analytics Platform context for Debark, but provide variety
    let selectedContext;
    if (currentDomain.includes('debark') || currentDomain.includes('localhost')) {
      // 70% chance for Analytics Platform context, 30% for others to show variety
      if (Math.random() < 0.7) {
        selectedContext = businessContexts[0]; // Analytics Platform
      } else {
        selectedContext = businessContexts[Math.floor(Math.random() * businessContexts.length)];
      }
    } else {
      // For other domains, select based on domain matching or randomly
      selectedContext = businessContexts.find(ctx => 
        currentDomain.includes(ctx.domain.split('/')[0])
      ) || businessContexts[Math.floor(Math.random() * businessContexts.length)];
    }
    
    return {
      totalEvents: Math.floor(Math.random() * 50000) + 10000,
      topEvents: ['page_view', 'click', 'sign_up', 'purchase', 'feature_used'],
      recentActivity: [
        'Dashboard viewed 12 times today',
        'New widgets created: 3',
        'Data exports: 2'
      ],
      userSegment: Math.random() > 0.5 ? 'active' : 'power',
      businessContext: {
        industry: selectedContext.industry,
        teamSize: Math.random() > 0.5 ? '10-50' : '1-10',
        useCases: selectedContext.useCases
      },
      personalizedSuggestions: selectedContext.suggestions
    };
  }

  private getDefaultInsights(): UserInsights {
    return {
      totalEvents: 0,
      topEvents: [],
      recentActivity: [],
      userSegment: 'new',
      businessContext: {
        useCases: ['getting started', 'exploring features']
      },
      personalizedSuggestions: [
        'Connect your data source to get started',
        'Try creating your first widget',
        'Explore our template gallery'
      ]
    };
  }

  async generatePersona(insights: UserInsights): Promise<DataBarkPersona> {
    const cacheKey = `persona_${insights.userSegment}`;
    const cached = this.getCached<DataBarkPersona>(cacheKey);
    if (cached) return cached;

    const persona = this.createPersonaFromInsights(insights);
    this.setCached(cacheKey, persona);
    return persona;
  }

  private createPersonaFromInsights(insights: UserInsights): DataBarkPersona {
    const { userSegment, businessContext, personalizedSuggestions, totalEvents } = insights;
    
    const greetings = {
      new: [
        `Welcome to DataBark! 🪵 I'm excited to help you unlock your data's potential!`,
        `Hey there! 👋 Ready to turn your data into beautiful insights? Let's bark up the right tree together!`,
        `Welcome aboard! 🚀 I'm DataBark, and I'm here to make analytics fun and powerful!`
      ],
      active: [
        `Welcome back! 🎉 I see you've been busy with ${totalEvents.toLocaleString()} events tracked. Ready for more insights?`,
        `Great to see you again! 📊 Based on your ${businessContext.industry || 'business'} activity, I have some exciting ideas for you!`,
        `Hey there, data explorer! 🔍 I've been analyzing your patterns and have some cool suggestions!`
      ],
      power: [
        `Look who's back! 🚀 You're clearly a data pro with ${totalEvents.toLocaleString()} events under your belt!`,
        `Welcome back, analytics wizard! 🧙‍♂️ Ready to create something extraordinary together?`,
        `Hey superstar! ⭐ Your data game is strong - let's build something amazing!`
      ],
      returning: [
        `Nice to see you again! 👋 I've missed our data adventures together!`,
        `Welcome back! 🎯 Ready to dive back into the world of insights?`,
        `Hey there! 📈 Let's pick up where we left off and create some magic!`
      ]
    };

    const personalities = {
      new: "I'm enthusiastic and encouraging, ready to guide you through your first steps in data analytics!",
      active: "I'm knowledgeable and supportive, building on what you've already learned to take you further!",
      power: "I'm your expert partner, ready to tackle complex analyses and advanced visualizations!",
      returning: "I'm friendly and familiar, excited to reconnect and help you achieve your goals!"
    };

    const moods = {
      new: 'excited' as const,
      active: 'happy' as const,
      power: 'working' as const,
      returning: 'celebrating' as const
    };

    const funnyQuips = {
      new: [
        "Don't worry, I don't actually bark! 🐕 But I do fetch amazing insights!",
        "Ready to fetch some data? I promise it's more fun than it sounds! 🎾",
        "I'm like a golden retriever, but for analytics - loyal, smart, and always excited! 🐕‍🦺"
      ],
      active: [
        "I've been crunching numbers while you were away... they taste like insights! 🤖📊",
        "Your data has been growing! I think it's ready for some new widget friends! 🌱",
        "I found some patterns in your data - they're more interesting than my favorite chew toy! 🦴"
      ],
      power: [
        "I'm basically the Einstein of analytics, but with better jokes! 🧠✨",
        "Ready to make your data sing opera? Because these insights are about to hit some high notes! 🎭",
        "I've been training my neural networks on your data... they're getting pretty smart! 🤖🧠"
      ],
      returning: [
        "I kept all your data warm and cozy while you were gone! 🔥",
        "Miss me? I've been practicing my widget-making skills! 🎨",
        "Your data missed you too - it's been asking when you'd be back! 💙"
      ]
    };

    const mood = moods[userSegment];
    const randomGreeting = greetings[userSegment][Math.floor(Math.random() * greetings[userSegment].length)];
    const randomQuips = funnyQuips[userSegment];

    // Create intelligent suggestions based on business context
    const suggestions = personalizedSuggestions.map((suggestion, index) => ({
      text: suggestion,
      confidence: 0.8 + (Math.random() * 0.2), // 80-100% confidence
      category: this.categorizeSuggestion(suggestion)
    }));

    return {
      mood,
      greeting: randomGreeting,
      personality: personalities[userSegment],
      suggestions,
      funnyQuips: randomQuips
    };
  }

  private categorizeSuggestion(suggestion: string): 'metrics' | 'analysis' | 'trends' | 'comparison' {
    const text = suggestion.toLowerCase();
    
    if (text.includes('track') || text.includes('monitor') || text.includes('measure')) {
      return 'metrics';
    } else if (text.includes('analyze') || text.includes('funnel') || text.includes('cohort')) {
      return 'analysis';
    } else if (text.includes('trend') || text.includes('over time') || text.includes('growth')) {
      return 'trends';
    } else if (text.includes('compare') || text.includes('vs') || text.includes('across')) {
      return 'comparison';
    }
    
    return 'analysis'; // default
  }

  async getPersonalizedMessage(): Promise<{ greeting: string; suggestions: string[]; mood: DataBarkPersona['mood'] }> {
    try {
      const insights = await this.analyzeUserInsights();
      const persona = await this.generatePersona(insights);
      
      return {
        greeting: persona.greeting,
        suggestions: persona.suggestions.slice(0, 4).map(s => `• "${s.text}"`),
        mood: persona.mood
      };
    } catch (error) {
      console.error('Failed to generate personalized message:', error);
      return this.getFallbackMessage();
    }
  }

  private getFallbackMessage() {
    return {
      greeting: "Hello! I'm DataBark 🪵 — your intelligent analytics assistant!",
      suggestions: [
        '• "Show me total users for the last month"',
        '• "Create a revenue chart for Q4"',
        '• "Track conversion rates by channel"',
        '• "Build a customer retention dashboard"'
      ],
      mood: 'excited' as const
    };
  }

  getRandomThinkingMessage(): string {
    const messages = [
      "Let me fetch that data for you... 🐕",
      "Crunching numbers like a good boy! 🦴",
      "Sniffing out the best insights... 👃",
      "Digging deep into your data! ⛏️",
      "Calculating the perfect widget... 🧮",
      "Assembling data like building blocks! 🧱",
      "Teaching the charts some new tricks! 🎪",
      "Making your metrics do backflips! 🤸‍♂️",
      "Turning raw data into pure gold! ✨",
      "Brewing up some analytical magic! 🧙‍♂️"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getRandomWorkingMessage(): string {
    const messages = [
      "Widget assembly in progress... 🔧",
      "Connecting the data dots! 🔗",
      "Fine-tuning the visualizations... 🎨",
      "Quality checking these insights! ✅",
      "Adding the finishing touches! 🎭",
      "Making sure everything looks pawsome! 🐾",
      "Optimizing for maximum wow factor! 💫",
      "Testing the user experience... 🧪",
      "Polishing these charts to perfection! ✨",
      "Almost ready to unleash this masterpiece! 🚀"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getCelebrationMessage(widgetCount: number): string {
    if (widgetCount === 1) {
      const messages = [
        "Woof! 🎉 Created 1 amazing widget just for you!",
        "Boom! 💥 Your new widget is ready to shine!",
        "Ta-da! ✨ One beautiful widget, served fresh!",
        "Success! 🎯 Your widget is now live and looking great!"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else {
      const messages = [
        `Incredible! 🚀 Created ${widgetCount} widgets that'll make your dashboard sing!`,
        `Amazing! 🎊 ${widgetCount} new widgets ready to rock your world!`,
        `Fantastic! 🌟 ${widgetCount} widgets deployed and looking spectacular!`,
        `Outstanding! 🏆 ${widgetCount} widgets that would make any data scientist proud!`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }
}

export const dataBarkPersona = new DataBarkPersonaService();