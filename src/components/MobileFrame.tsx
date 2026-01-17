import React, { type ReactNode } from 'react';

export const MobileFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-stone/50 flex items-center justify-center p-4 sm:p-8">
            {/* Phone Case */}
            <div className="relative w-full max-w-[390px] h-[844px] bg-background rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden ring-4 ring-gray-900/10 transform-gpu">

                {/* Dynamic Island / Notch Mockup */}
                <div className="absolute top-0 left-0 right-0 h-8 z-[100] flex justify-center pt-2 pointer-events-none">
                    <div className="w-28 h-7 bg-black rounded-full flex items-center justify-center gap-2 px-3">
                        {/* Fake sensors */}
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-800/50"></div>
                    </div>
                </div>

                {/* Content Area (Viewport) */}
                <div className="w-full h-full relative bg-background overflow-hidden">
                    {children}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none z-[100]">
                    <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};
