import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: "How do I create a new issue?",
    answer: "Click on the '+ New Issue' button in the top right corner of your dashboard. Fill in the title, description, and priority, then hit 'Create Issue'."
  },
  {
    question: "Can I change the priority of an existing task?",
    answer: "Currently, you can set the priority during creation. We are working on an edit feature to allow priority updates directly from the board."
  },
  {
    question: "Is my data synced with the database?",
    answer: "Yes, every action you take is synced in real-time with our MongoDB backend, ensuring your tasks are always up to date."
  },
  {
    question: "How can I contact the developer?",
    answer: "You can reach out via email below."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
          {question}
        </span>
        <div className={`p-1 rounded-full border border-slate-700 transition-all ${isOpen ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent'}`}>
          {isOpen ? <Minus size={20} className="text-white" /> : <Plus size={20} className="text-slate-400" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8 pt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Need more answers?</h1>
          <p className="text-slate-400 text-xl font-medium">Our FAQ page has got you covered</p>
        </motion.div>

        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* ✅ CONTACT SECTION */}
        <div className="mt-20 p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 text-center">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6 text-sm">
            Can't find the answer you're looking for? Feel free to reach out.
          </p>

          {/* ✅ FINAL FIX */}
          <a
            href="mailto:pandeyshikhar2004@gmail.com?subject=Support Request"
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-bold transition-all inline-block"
          >
            Get in touch
          </a>

          <p className="mt-4 text-sm text-slate-500">
            or email me directly at{" "}
            <span className="text-indigo-400 font-medium">
              pandeyshikhar2004@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;