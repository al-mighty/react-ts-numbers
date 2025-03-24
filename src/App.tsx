import { useState } from 'react';

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function serialize(nums: number[]): string {
  const bitmask = new Array(300).fill(0);
  for (const num of nums) {
    if (num >= 1 && num <= 300) {
      bitmask[num - 1] = 1;
    }
  }

  let result = '';
  for (let i = 0; i < 300; i += 6) {
    const chunk = bitmask.slice(i, i + 6);
    const value = parseInt(chunk.join(''), 2);
    result += CHARSET[value];
  }

  return result;
}

function deserialize(str: string): number[] {
  const nums: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const value = CHARSET.indexOf(str[i]);
    for (let bit = 0; bit < 6; bit++) {
      if ((value >> (5 - bit)) & 1) {
        const number = i * 6 + bit + 1;
        if (number <= 300) {
          nums.push(number);
        }
      }
    }
  }
  return nums;
}

function generateRandomSet(count: number): number[] {
  const numbers: number[] = [];

  // Сначала получаем максимум уникальных чисел
  const uniqueSet = new Set<number>();
  while (uniqueSet.size < Math.min(count, 300)) {
    uniqueSet.add(Math.floor(Math.random() * 300) + 1);
  }
  numbers.push(...uniqueSet);

  // Если нужно больше — добавим случайные дубли
  while (numbers.length < count) {
    numbers.push(numbers[Math.floor(Math.random() * uniqueSet.size)]);
  }

  return numbers;
}

function downloadResult(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function App() {
  const [input, setInput] = useState('1,2,3,10');
  const [compressed, setCompressed] = useState('');
  const [decompressed, setDecompressed] = useState<number[]>([]);
  const [ratio, setRatio] = useState(0);

  const handleCompress = () => {
    const nums = input
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    const compressedStr = serialize(nums);
    const decompressedArr = deserialize(compressedStr);

    setCompressed(compressedStr);
    setDecompressed(decompressedArr);
    setRatio((compressedStr.length / JSON.stringify(nums).length) * 100);
  };

  const handleGenerate = (count: number) => {
    const randomNums = generateRandomSet(count);
    setInput(randomNums.join(','));
  };

  const handleExport = () => {
    const inputArray = input
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    const content = JSON.stringify({
      inputArray,
      compressed,
      decompressed,
      compressionRatio: `${ratio.toFixed(1)}%`,
    });

    downloadResult('compression-result.json', content);
  };

  return (
    <div className='p-4 max-w-xl mx-auto space-y-4'>
      <h1 className='text-xl font-bold'>Сериализация массива чисел</h1>

      <div>
        <label className='block font-semibold mb-1'>
          Ввод чисел (через запятую):
        </label>
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          className='border p-2 w-full rounded'
        />
      </div>

      <div className='flex gap-2 flex-wrap'>
        <button
          onClick={handleCompress}
          className='bg-blue-600 text-white px-4 py-2 rounded'
        >
          Сжать
        </button>

        <button
          onClick={() => handleGenerate(50)}
          className='bg-green-600 text-white px-3 py-2 rounded'
        >
          50 случайных
        </button>
        <button
          onClick={() => handleGenerate(100)}
          className='bg-green-600 text-white px-3 py-2 rounded'
        >
          100 случайных
        </button>
        <button
          onClick={() => handleGenerate(500)}
          className='bg-green-600 text-white px-3 py-2 rounded'
        >
          500 случайных
        </button>

        {compressed && (
          <button
            onClick={handleExport}
            className='bg-purple-600 text-white px-3 py-2 rounded'
          >
            Экспорт в файл
          </button>
        )}
      </div>

      {compressed && (
        <div className='bg-gray-100 p-4 rounded space-y-2'>
          <div>
            <strong>Сжатая строка:</strong> 
            <div className='break-all'>{compressed}</div>
          </div>
          <div>
            <strong>Десериализовано:</strong>
            <div className='break-all max-h-[200px] overflow-y-auto'>{JSON.stringify(decompressed)}</div>
          </div>
          <div>
            <strong>Коэффициент сжатия:</strong> {ratio.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}

// Log to console
console.log('Hello console');
