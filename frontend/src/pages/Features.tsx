import React from 'react';
import { ArrowRight, BarChart3, Boxes, CircleDollarSign, LineChart, MapPin, Package, Receipt, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FAQAssistant } from '../components/FAQAssistant';
import { PublicFooter, PublicHeader } from './HowItWorks';

const views = [
  { icon: BarChart3, title: 'Dashboard', text: 'A balanced overview of revenue, expenses, profit, customers, transactions, and trends.' },
  { icon: LineChart, title: 'Sales', text: 'Follow sales performance over time and find the movement behind the headline number.' },
  { icon: Receipt, title: 'Expenses', text: 'See where money is going and compare categories that shape your margins.' },
  { icon: Package, title: 'Products', text: 'Understand which products are contributing most to your revenue.' },
  { icon: Users, title: 'Customers', text: 'Keep customer activity visible so you can recognize patterns in demand.' },
  { icon: Sparkles, title: 'Insights', text: 'Start with a focused explanation when a meaningful business change appears.' },
];

export const Features: React.FC = () => (
  <div className="public-page">
    <PublicHeader />
    <main>
      <section className="public-page-hero features-hero">
        <p className="eyebrow"><span /> One workspace, useful angles</p>
        <h1>See the numbers that help you run the day.</h1>
        <p>BizLens gives each important part of your business a place to be understood, without turning the experience into a wall of charts.</p>
      </section>
      <section className="views-grid">
        {views.map((view) => { const Icon = view.icon; return <article className="view-card" key={view.title}><div className="view-card-icon"><Icon size={20} /></div><h2>{view.title}</h2><p>{view.text}</p><Link to="/register" aria-label={`Start using ${view.title}`}><ArrowRight size={16} /></Link></article>; })}
      </section>
      <section className="feature-strip"><div className="feature-strip-icon"><CircleDollarSign size={24} /></div><div><p className="eyebrow"><span /> Built around your questions</p><h2>Start broad. Then follow the thread.</h2><p>Begin on Dashboard, open Insights when something changes, and use the detailed views to see where the change came from.</p></div><div className="feature-strip-stats"><span><strong>6</strong> core views</span><span><strong>1</strong> business story</span></div></section>
    </main>
    <PublicFooter />
    <FAQAssistant />
  </div>
);
