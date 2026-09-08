import React from 'react';
import { ArrowRight, BarChart3, ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FAQAssistant } from '../components/FAQAssistant';
import { PublicFooter, PublicHeader } from './HowItWorks';

const questions = [
  ['What is BizLens?', 'BizLens is a business intelligence workspace for small businesses. It turns sales and expense data into dashboards, trends, and practical starting points for investigation.'],
  ['How do I get started?', 'Create an account, add your business, then open Upload Data and import your sales or expense CSV. After the data is prepared, your Dashboard will be ready to explore.'],
  ['What can I upload?', 'BizLens is designed around business CSV data. The exact columns and validation feedback are handled in the Upload Data workflow.'],
  ['Where should I look first?', 'Start with Dashboard for the high-level view. If something stands out, open Insights for context and then use Sales, Expenses, Products, Customers, or Transactions for detail.'],
  ['What are Insights?', 'Insights highlight meaningful changes in the available data and identify a significant factor to investigate. They are decision support, not a substitute for your own business judgment.'],
  ['Can I manage more than one business?', 'Yes. BizLens uses separate business workspaces, and the business selector in the signed-in area lets you switch between them.'],
];

export const FAQs: React.FC = () => (
  <div className="public-page">
    <PublicHeader />
    <main>
      <section className="public-page-hero faq-hero">
        <p className="eyebrow"><span /> Answers in plain language</p>
        <h1>Questions are part of the work.</h1>
        <p>Here are the things clients usually want to know before they begin. For a direct answer about the website, open the BizLens guide in the corner.</p>
        <button type="button" className="btn btn-secondary faq-page-button" onClick={() => document.querySelector<HTMLButtonElement>('.faq-launcher')?.click()}><MessageCircle size={16} /> Ask the guide</button>
      </section>
      <section className="faq-list" aria-label="Frequently asked questions">
        {questions.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}
      </section>
      <section className="public-callout faq-callout"><div><p className="eyebrow"><span /> Ready when you are</p><h2>Put your own questions in the workspace.</h2></div><Link to="/register" className="btn btn-primary">Get started <ArrowRight size={15} /></Link></section>
    </main>
    <PublicFooter />
    <FAQAssistant />
  </div>
);
