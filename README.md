# React TypeScript Numbers Compressor

Приложение для сжатия массивов чисел с использованием base36 кодирования.

## Принцип работы

1. Сжатие:
   - Удаление дубликатов из входного массива
   - Сортировка чисел для оптимизации
   - Конвертация каждого числа в base36 формат
   - Объединение в строку с разделителями

2. Распаковка:
   - Разделение строки на отдельные значения
   - Конвертация из base36 обратно в числа
   - Фильтрация значений в диапазоне 1-300

## Технологии

- React
- TypeScript
- Tailwind CSS
- Vite

## Локальный запуск

1. Клонировать репозиторий:
```bash
git clone git@github.com:al-mighty/react-ts-numbers.git
cd react-ts-numbers
```

2. Установить зависимости:
```bash
npm install
```

3. Запустить в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

## Сборка и деплой

1. Собрать проект:
```bash
npm run build
```

2. Предварительный просмотр сборки:
```bash
npm run preview
```

3. Деплой на GitHub Pages:
```bash
npm run deploy
```


## Демо

Рабочая версия доступна по адресу: https://al-mighty.github.io/react-ts-numbers/ 

## .gitignore

+ node_modules
+ dist
+ .DS_Store
+ *.log
+ .cache
+ coverage
+ .env
+ .env.local
+ .env.development.local
+ .env.test.local
+ .env.production.local