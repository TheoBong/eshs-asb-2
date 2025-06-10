import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CommaSeparatedInput } from '@/components/ui/comma-separated-input';

export default function CommaTest() {
  const [value, setValue] = useState('');
  const [splitValue, setSplitValue] = useState<string[]>([]);
  const [arrayValue, setArrayValue] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setSplitValue(newValue.split(',').map(s => s.trim()).filter(s => s));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-white text-2xl font-bold">Comma Input Test</h1>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Test Input (try typing commas)
          </label>
          <Input
            value={value}
            onChange={handleChange}
            placeholder="Type items separated by commas"
            className="bg-white/5 border-white/20 text-white"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>        <div className="text-white">
          <p><strong>Raw value:</strong> "{value}"</p>
          <p><strong>Split array:</strong> [{splitValue.map(s => `"${s}"`).join(', ')}]</p>
          <p><strong>Can type comma:</strong> {value.includes(',') ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Can type space:</strong> {value.includes(' ') ? '✅ Yes' : '❌ No'}</p>
        </div><div>
          <label className="block text-sm font-medium text-white mb-2">
            Regular HTML Input (control test)
          </label>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Regular HTML input"
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            CommaSeparatedInput Component (our fix)
          </label>
          <CommaSeparatedInput
            value={arrayValue}
            onChange={setArrayValue}
            placeholder="Type items separated by commas"
          />
          <p className="text-white mt-2">
            <strong>Array value:</strong> [{arrayValue.map(s => `"${s}"`).join(', ')}]
          </p>
        </div>
      </div>
    </div>
  );
}
