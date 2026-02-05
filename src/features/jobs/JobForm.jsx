import React, { useState } from 'react';
import { User, Briefcase, Calendar, FileText } from 'lucide-react';
import Input from '../../components/ui/Input';
import { JOB_STATUS_OPTIONS } from '../../constants/appConstants';

const SERVICE_TYPES = [
    "Pozáruční servis",
    "Záruční servis",
    "Oprava poruchy",
    "Instalace",
    "MID (Ověření)",
    "Údržba / Preventivní prohlídka"
];

const JobForm = ({ formData, onChange, customers, searchTerm, onSearchTermChange, isSearchOpen, onSearchOpenChange, onCustomerSelect }) => {
  return (
    <div className="space-y-4">
        {/* Číslo zakázky */}
        <Input
            label="Číslo zakázky *"
            name="job_number"
            required
            value={formData.job_number}
            onChange={onChange}
            placeholder="ZE(YY)-XXXX"
            className="font-mono font-bold text-slate-700"
        />

        {/* 1. Typ a Zákazník */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Typ servisu *</label>
            <select
                name="title"
                required
                value={formData.title}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium border-slate-300"
            >
                {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Zákazník *</label>
            {/* NAŠEPTÁVAČ ZÁKAZNÍKA */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Začněte psát jméno firmy..."
                    value={searchTerm}
                    onClick={() => onSearchOpenChange(true)}
                    onChange={(e) => {
                        onSearchTermChange(e.target.value);
                        onSearchOpenChange(true);
                        // Reset customer ID handled in parent usually, or pass a specific handler
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                        formData.customer_id ? 'border-green-500 bg-green-50 text-green-800 font-bold' : 'border-slate-300'
                    }`}
                />

                {/* Rozbalovací seznam výsledků */}
                {isSearchOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {customers
                            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(c => (
                            <div
                                key={c.id}
                                onClick={() => onCustomerSelect(c)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0"
                            >
                                <div className="font-bold text-slate-800">{c.name}</div>
                                <div className="text-xs text-slate-500">{c.address}</div>
                            </div>
                            ))}

                        {/* Pokud nic nenajde */}
                        {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <div className="p-3 text-sm text-slate-400 text-center italic">
                                Žádný zákazník nenalezen.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Checkbox Smlouva */}
            <div className="flex items-center gap-2 mt-2 ml-1">
                <input
                    type="checkbox"
                    id="has_service_contract"
                    name="has_service_contract"
                    checked={formData.has_service_contract}
                    onChange={onChange}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="has_service_contract" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Zákazník má aktivní servisní smlouvu
                </label>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* 2. Lidé (Technici a Kouč) */}
        <div className="grid grid-cols-2 gap-4">
            <Input
                label="Technici"
                name="technician_names"
                value={formData.technician_names}
                onChange={onChange}
                placeholder="Novák, Svoboda"
                icon={User}
            />
            <Input
                label="Kouč zakázky"
                name="coach"
                value={formData.coach}
                onChange={onChange}
                placeholder="Jméno kouče"
                icon={Briefcase}
            />
        </div>

        {/* 3. Termín a Priorita */}
        <div className="grid grid-cols-2 gap-4">
            <Input
                label="Termín výjezdu"
                type="date"
                name="scheduled_date"
                required
                value={formData.scheduled_date}
                onChange={onChange}
                icon={Calendar}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priorita</label>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={onChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium border-slate-300 ${
                        formData.priority === 'havarie' ? 'text-red-600 border-red-200 bg-red-50' : ''
                    }`}
                >
                    <option value="nizka">Nízká</option>
                    <option value="stredni">Střední</option>
                    <option value="vysoka">Vysoká</option>
                    <option value="havarie">HAVÁRIE</option>
                </select>
            </div>
        </div>

        {/* 4. Popis */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Podrobný popis / Zadání</label>
            <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={onChange}
                    className="w-full pl-9 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Specifikace závady..."
                ></textarea>
            </div>
        </div>
    </div>
  );
};

export default JobForm;
