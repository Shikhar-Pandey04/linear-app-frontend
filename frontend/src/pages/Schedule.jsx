import React from 'react';

const Schedule = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      <div className="text-center">
        <span className="text-5xl mb-6 block">📈</span>
        
        <h2 className="text-2xl text-[var(--text-secondary)] font-medium italic tracking-wide">
          Analytics Visualization Coming Soon...
        </h2>
        
        <p className="text-[var(--text-secondary)] mt-2 text-sm">
          We're working on something amazing for your schedule.
        </p>
      </div>

    </div>
  );
};

export default Schedule;