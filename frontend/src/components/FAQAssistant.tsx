import React, { useState } from 'react';
import { Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react';

interface FAQItem {
  keywords: string[];
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    keywords: ['what is bizlens', 'what does bizlens', 'about bizlens'],
    answer: 'BizLens is a business intelligence workspace for small businesses. It cleans uploaded CSV data, turns it into clear dashboards, and helps you understand changes in revenue, costs, products, and customers.',
  },
  {
    keywords: ['upload', 'csv', 'import', 'data'],
    answer: 'After you sign in and choose your business, open Upload Data from the navigation. Import your sales or expenses CSV, review the cleaning feedback, then open Dashboard to see the results.',
  },
  {
    keywords: ['dashboard', 'kpi', 'metrics', 'numbers'],
    answer: 'The Dashboard gives you the quick view: revenue, expenses, net profit, profit margin, customers, transactions, revenue trends, expense categories, top products, and regional sales when your data supports them.',
  },
  {
    keywords: ['insight', 'why', 'revenue fall', 'root cause', 'analysis'],
    answer: 'Open Insights for explanations behind important changes. BizLens compares the available business data and highlights the most significant contributing factor. Treat it as a starting point for investigation, not a replacement for your judgment.',
  },
  {
    keywords: ['sales', 'expense', 'product', 'customer', 'transaction'],
    answer: 'Use the dedicated Sales, Expenses, Products, Customers, and Transactions pages when you need detail behind a dashboard number. Start with the relevant page, then return to Insights for the bigger picture.',
  },
  {
    keywords: ['business', 'workspace', 'multiple'],
    answer: 'BizLens keeps business workspaces separate. Use the business selector in the top navigation to switch between businesses, or use the plus button to add another business to your account.',
  },
  {
    keywords: ['login', 'sign in', 'account', 'signup', 'register'],
    answer: 'Use Sign in if you already have an account. Use Get started to create an account and add your business, then you can upload data and open the dashboard.',
  },
];

const fallbackAnswer = 'I can help with BizLens setup, CSV uploads, dashboards, insights, business workspaces, and the Sales, Expenses, Products, Customers, or Transactions pages. Try asking about one of those topics.';

const getAnswer = (question: string) => {
  const normalizedQuestion = question.toLowerCase();
  const match = faqItems.find((item) => item.keywords.some((keyword) => normalizedQuestion.includes(keyword)));
  return match?.answer || fallbackAnswer;
};

export const FAQAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: 'Hi, I am the BizLens guide. Ask me how the website works or where to find something.' },
  ]);

  const askQuestion = (text = question) => {
    const trimmedQuestion = text.trim();
    if (!trimmedQuestion) return;
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedQuestion },
      { role: 'assistant', text: getAnswer(trimmedQuestion) },
    ]);
    setQuestion('');
  };

  return (
    <div className="faq-assistant">
      {isOpen && (
        <section className="faq-panel" aria-label="BizLens FAQ assistant">
          <div className="faq-panel-header">
            <div className="faq-agent-mark"><Bot size={17} /></div>
            <div>
              <strong>BizLens guide</strong>
              <span>Answers about the website</span>
            </div>
            <button type="button" className="faq-close" onClick={() => setIsOpen(false)} aria-label="Close FAQ assistant">
              <X size={17} />
            </button>
          </div>

          <div className="faq-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`faq-message ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="faq-suggestions">
            {['How do I upload data?', 'What is on the dashboard?'].map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => askQuestion(suggestion)}>{suggestion}</button>
            ))}
          </div>

          <form className="faq-form" onSubmit={(event) => { event.preventDefault(); askQuestion(); }}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question" aria-label="Ask a BizLens question" />
            <button type="submit" aria-label="Send question"><Send size={16} /></button>
          </form>
        </section>
      )}

      <button type="button" className="faq-launcher" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
        {isOpen ? <ChevronDown size={18} /> : <MessageCircle size={18} />}
        <span>{isOpen ? 'Close guide' : 'Ask BizLens'}</span>
      </button>
    </div>
  );
};
