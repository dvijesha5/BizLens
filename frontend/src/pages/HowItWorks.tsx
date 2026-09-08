import React from 'react';
import { ArrowRight, BarChart3, CheckCircle2, FileUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FAQAssistant } from '../components/FAQAssistant';
import { BrandLogo } from '../components/BrandLogo';

const steps = [
  { number: '01', icon: FileUp, title: 'Bring the files you already have', text: 'Start with your sales or expense CSVs. You do not need to rebuild your records or learn a new reporting system.' },
  { number: '02', icon: Sparkles, title: 'Let BizLens prepare the story', text: 'BizLens cleans the uploaded data and organizes it into useful business categories for analysis.' },
  { number: '03', icon: BarChart3, title: 'Read the business clearly', text: 'Use the Dashboard for the overview, then open the detailed pages when you need to investigate a number.' },
  { number: '04', icon: Sparkles, title: 'Decide what to do next', text: 'Insights highlights meaningful changes and gives you a focused place to begin your next investigation.' },
];

export const HowItWorks: React.FC = () => (
  <div className="public-page">
    <PublicHeader />
    <main>
      <section className="public-page-hero process-hero">
        <p className="eyebrow"><span /> A practical workflow</p>
        <h1>From everyday files to a clearer next step.</h1>
        <p>BizLens keeps the process grounded in the way small businesses already work. Upload what you have, understand what changed, and follow the evidence.</p>
        <Link to="/register" className="btn btn-primary landing-main-cta">Create your workspace <ArrowRight size={17} /></Link>
      </section>
      <section className="process-list">
        {steps.map((step) => {
          const Icon = step.icon;
          return <article className="process-step" key={step.number}><span className="process-number">{step.number}</span><div className="process-icon"><Icon size={21} /></div><div><h2>{step.title}</h2><p>{step.text}</p></div><CheckCircle2 className="process-check" size={20} /></article>;
        })}
      </section>
      <section className="public-callout"><div><p className="eyebrow"><span /> Keep your attention on the business</p><h2>Less time formatting reports. More time understanding them.</h2></div><Link to="/features" className="landing-text-link">See what you can track <ArrowRight size={15} /></Link></section>
    </main>
    <PublicFooter />
    <FAQAssistant />
  </div>
);

export const PublicHeader: React.FC = () => (
  <header className="landing-nav public-nav">
    <Link to="/" className="landing-brand"><BrandLogo /></Link>
    <nav className="landing-links" aria-label="Main navigation"><Link to="/how-it-works">How it works</Link><Link to="/features">What you can see</Link><Link to="/faqs">FAQs</Link></nav>
    <div className="landing-actions"><Link to="/login" className="landing-login">Sign in</Link><Link to="/register" className="btn btn-primary landing-cta">Get started <ArrowRight size={15} /></Link></div>
  </header>
);

export const PublicFooter: React.FC = () => <footer className="landing-footer"><span>© 2026 BizLens</span><span>Small business intelligence, made legible.</span><Link to="/login">Sign in to your workspace <ArrowRight size={14} /></Link></footer>;
