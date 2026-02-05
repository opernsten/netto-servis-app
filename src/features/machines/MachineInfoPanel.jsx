import React from 'react';
import { Truck, MapPin, Cpu, CalendarCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/dateUtils';

const MachineInfoPanel = ({ machine }) => {
  return (
    <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Technické Info</h3>

        <div className="space-y-5">
        {/* Majitel */}
        <div>
            <div className="text-xs text-slate-500 mb-1">Majitel (Zákazník)</div>
            <div className="font-medium text-slate-900">{machine.customers?.name}</div>
            <div className="text-sm text-slate-500">{machine.customers?.address}</div>
        </div>

        {/* Dodavatel */}
        <div className="flex items-start gap-3">
            <Truck className="text-orange-500 mt-1" size={20} />
            <div>
                <div className="text-xs text-slate-500">Dodavatel stroje</div>
                <div className="font-medium text-slate-900">{machine.supplier || 'Neurčeno'}</div>
            </div>
        </div>

        {/* S/N */}
        <div>
            <div className="text-xs text-slate-500 mb-1">Výrobní číslo</div>
            <div className="font-mono bg-slate-100 px-2 py-1 rounded inline-block text-slate-700">
                {machine.serial_number || '-'}
            </div>
        </div>

        {/* Rok výroby */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Rok výroby
            </h3>
            <p className="font-medium text-slate-900 text-lg">
            {machine.manufacturing_year || '-'}
            </p>
        </div>

        <hr className="border-slate-100" />

        {/* Umístění */}
        <div className="flex items-start gap-3">
            <MapPin className="text-blue-500 mt-1" size={20} />
            <div>
                <div className="text-xs text-slate-500">Umístění / Linka</div>
                <div className="font-medium text-slate-900">{machine.location || 'Neurčeno'}</div>
            </div>
        </div>

        {/* SW Verze */}
        <div className="flex items-start gap-3">
            <Cpu className="text-purple-500 mt-1" size={20} />
            <div>
                <div className="text-xs text-slate-500">Verze Software</div>
                <div className="font-medium text-slate-900">{machine.sw_version || 'Neurčeno'}</div>
            </div>
        </div>

        {/* Prvotní ověření */}
            <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-1 rounded text-slate-500 mt-1">
                <CalendarCheck size={16} />
            </div>
            <div>
                <div className="text-xs text-slate-500">Prvotní ověření</div>
                <div className="font-medium text-slate-900">
                {machine.initial_verification ? formatDate(machine.initial_verification) : 'Neurčeno'}
                </div>
            </div>
        </div>

            {/* Poslední kontrola */}
            <div className="flex items-start gap-3">
            <CalendarCheck className="text-green-500 mt-1" size={20} />
            <div>
                <div className="text-xs text-slate-500">Poslední datum ověření</div>
                <div className="font-medium text-slate-900">{machine.last_verified ? formatDate(machine.last_verified) : 'Neurčeno'}</div>
            </div>
        </div>

        </div>
    </Card>
  );
};

export default MachineInfoPanel;
