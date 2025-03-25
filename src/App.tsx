import { useState } from 'react';

function serialize(nums: number[]): string {
  if (nums.length === 0) return '';

  // Сортируем и удаляем дубликаты
  const uniqueNums = [...new Set(nums)].sort((a, b) => a - b);
  
  // Преобразуем в строку с разделителями
  return uniqueNums
    .map(n => n.toString(36)) // используем base36 для более короткой записи
    .join(',');
}

function deserialize(str: string): number[] {
  if (!str) return [];
  
  // Преобразуем обратно в числа
  return str
    .split(',')
    .map(n => parseInt(n, 36))
    .filter(n => n > 0 && n <= 300);
}

function generateRandomSet(count: number): number[] {
  const numbers: number[] = [];
  const uniqueSet = new Set<number>();
  
  // Генерируем уникальные числа
  while (uniqueSet.size < count) {
    uniqueSet.add(Math.floor(Math.random() * 300) + 1);
  }
  
  numbers.push(...uniqueSet);
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
      .filter(n => !isNaN(n) && n > 0 && n <= 300);

    console.log('Parsed numbers:', nums);
    // Если массив пустой, не выполняем сжатие
    if (nums.length === 0) {
      setCompressed('');
      setDecompressed([]);
      setRatio(0);
      return;
    }

    const compressedStr = serialize(nums);
    const decompressedArr = deserialize(compressedStr);

    setCompressed(compressedStr);
    setDecompressed(decompressedArr);
    setRatio(nums.length > 0 ? (compressedStr.length / JSON.stringify(nums).length) * 100 : 0);
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
          onClick={() => handleGenerate(300)}
          className='bg-green-600 text-white px-3 py-2 rounded'
        >
          300 случайных
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
            <div className='break-all whitespace-pre-wrap'>{compressed}</div>
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
