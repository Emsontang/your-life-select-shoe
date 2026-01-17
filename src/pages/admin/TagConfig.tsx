import React, { useState } from 'react';
import { useMockData, type SpaceId } from '../../context/MockDataContext';
import { User, Users, Check } from 'lucide-react';

export const AdminTagConfig: React.FC = () => {
    const { personas, spaces, updatePersonaSpaces } = useMockData();
    const [selectedPersonaId, setSelectedPersonaId] = useState<string>('single');

    const selectedPersona = personas.find(p => p.id === selectedPersonaId);
    if (!selectedPersona) return null;

    const handleToggleSpace = (spaceId: SpaceId) => {
        const currentSpaces = selectedPersona.linkedSpaces;
        const newSpaces = currentSpaces.includes(spaceId)
            ? currentSpaces.filter(id => id !== spaceId)
            : [...currentSpaces, spaceId];

        updatePersonaSpaces(selectedPersona.id, newSpaces);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">标签管理</h2>
                <p className="text-gray-500 mt-2">核心大脑：定义人群与空间的映射关系。此处的修改需实时同步至前端App。</p>
            </div>

            <div className="grid grid-cols-12 gap-8 h-[600px]">
                {/* Left: Persona List */}
                <div className="col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-700">
                        人员画像
                    </div>
                    <div className="p-4 space-y-3">
                        {personas.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPersonaId(p.id)}
                                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedPersonaId === p.id
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPersonaId === p.id ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                                    {p.id === 'single' ? <User size={20} /> : <Users size={20} />}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">{p.name}</div>
                                    <div className="text-xs opacity-70">关联 {p.linkedSpaces.length} 个空间</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Space List */}
                <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-700 flex justify-between items-center">
                        <span>{selectedPersona.name} 的关联空间</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">自动保存</span>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        {spaces.map(space => {
                            const isChecked = selectedPersona.linkedSpaces.includes(space.id);
                            return (
                                <label
                                    key={space.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${isChecked
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-gray-300 bg-white'}`}>
                                        {isChecked && <Check size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isChecked}
                                        onChange={() => handleToggleSpace(space.id)}
                                    />
                                    <span className="font-medium">{space.name}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
