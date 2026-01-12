# Промпт для создания API каталога дисков на FastAPI

## Контекст

Необходимо создать FastAPI приложение для управления каталогом автомобильных дисков. API должен полностью повторять структуру и поведение текущего API, который использует внешний сервис api.tirebase.ru. Новый API будет принимать выгрузки от разных поставщиков в различных форматах и объединять их в единый каталог.

## Анализ текущей реализации

### Структура данных диска

Фронтенд ожидает следующую структуру данных для каждого диска:

```typescript
interface Disk {
  id: string                              // Уникальный идентификатор
  name: string                            // Название диска (обычно бренд + модель)
  title?: string                          // Полное название (опционально)
  price: number                           // Текущая цена
  rrc: number                             // Рекомендованная розничная цена
  stock: number                           // Количество в наличии
  image: string                           // URL изображения
  brand: string                           // Бренд
  model?: string | null                   // Модель диска
  diameter: number                        // Диаметр (в дюймах, например: 17)
  width: number                           // Ширина (например: 7)
  pcd: string                             // Разболтовка в формате "4x100"
  et: number                              // Вылет (offset)
  dia: number                             // Центральное отверстие (hub diameter)
  type: "stamped" | "cast" | "forged"    // Тип диска
  color?: string | null                   // Цвет диска
  isPromotional?: boolean                 // Акционный товар
  provider?: string | null                // Поставщик/склад
  storehouse?: Record<string, number>     // Данные о складах {складName: количество}
}
```

### Текущий API endpoint

**Endpoint:** `GET /api/wheels`

**Query параметры:**
- `diam` или `diameter` - диаметр диска (например: 17)
- `width` - ширина диска (например: 7)
- `pcd` - разболтовка (например: 4x100)
- `et` - вылет/offset (например: 40)
- `cb` или `hub` - центральное отверстие/DIA (например: 66.1)
- `brand` - бренд (например: "Replica")
- `access_token` - токен доступа (не обязательно для нового API, но структура должна поддерживать аутентификацию)

**Формат ответа:**

```json
{
  "data": [
    {
      "id": "wheel-12345",
      "name": "Replica BMW 123",
      "title": "Replica BMW 123",
      "price": 5000,
      "rrc": 6000,
      "stock": 10,
      "image": "https://example.com/image.jpg",
      "brand": "Replica",
      "model": "BMW 123",
      "diameter": 17,
      "width": 7,
      "pcd": "4x100",
      "et": 40,
      "dia": 66.1,
      "type": "cast",
      "color": "silver",
      "isPromotional": false,
      "provider": null,
      "storehouse": {}
    }
  ],
  "error": null
}
```

### Логика трансформации данных

Текущий API выполняет следующие трансформации:

1. **Фильтрация по наличию:** Показываются только диски с `quantity > 0`

2. **Форматирование PCD:** Формат `pn x pcd` → `"4x100"` (pn - количество отверстий, pcd - диаметр окружности)

3. **Определение типа диска по русскому названию:**
   - "Стальной", "Штампованный", "steel", "stamp" → `"stamped"`
   - "Кованый", "forg" → `"forged"`
   - "Литой", "cast" → `"cast"`
   - По умолчанию → `"cast"`

4. **Маппинг полей из внешнего API:**
   - `title` или `brand + model` → `name`
   - `rrc` или `opt` или `price` → `price` (приоритет в указанном порядке)
   - `cb` → `dia`
   - `diam` → `diameter`

5. **ET фильтрация:** На фронтенде применяется диапазон ±5 от указанного значения

6. **Hub/DIA фильтрация:** Диск подходит если `disk.dia >= filter.hub`

## Требования к новому FastAPI приложению

### 1. Технологический стек

- **FastAPI** - основной фреймворк
- **SQLAlchemy** - ORM для работы с базой данных
- **PostgreSQL** или **SQLite** - база данных
- **Pydantic** - валидация данных
- **Alembic** - миграции базы данных
- **uvicorn** - ASGI сервер

### 2. Структура проекта

```
wheels_api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Основное приложение FastAPI
│   ├── config.py               # Конфигурация (переменные окружения)
│   ├── database.py             # Подключение к БД
│   ├── models/
│   │   ├── __init__.py
│   │   └── wheel.py            # SQLAlchemy модели
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── wheel.py            # Pydantic схемы
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── wheels.py           # Эндпоинты для каталога
│   │   └── import.py           # Эндпоинты для импорта данных
│   ├── services/
│   │   ├── __init__.py
│   │   ├── wheel_service.py    # Бизнес-логика работы с дисками
│   │   └── import_service.py   # Логика импорта данных
│   └── utils/
│       ├── __init__.py
│       ├── parsers.py          # Парсеры разных форматов выгрузок
│       └── normalizers.py      # Нормализация данных
├── migrations/                  # Alembic миграции
├── tests/                       # Тесты
├── requirements.txt
├── .env.example
└── README.md
```

### 3. Модель данных (SQLAlchemy)

```python
class Wheel(Base):
    __tablename__ = "wheels"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    title = Column(String, nullable=True)
    price = Column(Float, nullable=False, index=True)
    rrc = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0, index=True)
    image = Column(String, nullable=True)
    brand = Column(String, nullable=False, index=True)
    model = Column(String, nullable=True)
    diameter = Column(Float, nullable=False, index=True)
    width = Column(Float, nullable=False, index=True)
    pcd = Column(String, nullable=False, index=True)
    et = Column(Float, nullable=False, index=True)
    dia = Column(Float, nullable=False, index=True)
    type = Column(Enum("stamped", "cast", "forged"), nullable=False, index=True)
    color = Column(String, nullable=True)
    is_promotional = Column(Boolean, default=False)
    provider = Column(String, nullable=True, index=True)
    storehouse = Column(JSON, nullable=True)  # {"warehouse1": 5, "warehouse2": 3}

    # Метаданные
    source = Column(String, nullable=True)  # Источник данных (имя поставщика)
    source_id = Column(String, nullable=True)  # ID в системе поставщика
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Индексы для оптимизации поиска
    __table_args__ = (
        Index('idx_wheel_search', 'diameter', 'width', 'pcd', 'brand'),
        Index('idx_wheel_filters', 'type', 'provider', 'stock'),
    )
```

### 4. Основные эндпоинты

#### 4.1. Получение каталога дисков

```python
@router.get("/wheels", response_model=WheelsResponse)
async def get_wheels(
    diam: Optional[float] = Query(None, alias="diameter"),
    width: Optional[float] = None,
    pcd: Optional[str] = None,
    et: Optional[float] = None,
    cb: Optional[float] = Query(None, alias="hub"),
    brand: Optional[str] = None,
    color: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Получить каталог дисков с фильтрацией

    Параметры полностью повторяют текущий API
    """
```

**Логика фильтрации:**
- Фильтр по диаметру: точное совпадение
- Фильтр по ширине: точное совпадение
- Фильтр по PCD: точное совпадение строки
- Фильтр по ET: диапазон ±5 (но можно настроить)
- Фильтр по DIA/CB: `wheel.dia >= filter_cb`
- Фильтр по бренду: частичное совпадение (case-insensitive)
- Фильтр по цене: диапазон
- По умолчанию показывать только товары в наличии (stock > 0)

#### 4.2. Импорт данных от поставщиков

```python
@router.post("/import/wheels", status_code=201)
async def import_wheels(
    file: UploadFile = File(...),
    provider: str = Form(...),
    format: str = Form(...),  # "csv", "xlsx", "json", "xml"
    replace: bool = Form(False),  # Заменить все данные поставщика или обновить
    db: Session = Depends(get_db)
):
    """
    Импортировать выгрузку дисков от поставщика

    - file: файл выгрузки
    - provider: название поставщика
    - format: формат файла
    - replace: если True, удалить старые данные поставщика перед импортом
    """
```

#### 4.3. Управление данными

```python
@router.delete("/wheels/provider/{provider}")
async def delete_provider_wheels(provider: str, db: Session = Depends(get_db)):
    """Удалить все диски конкретного поставщика"""

@router.get("/wheels/stats")
async def get_catalog_stats(db: Session = Depends(get_db)):
    """Получить статистику каталога (количество дисков, поставщики и т.д.)"""

@router.post("/wheels/sync")
async def sync_all_providers(db: Session = Depends(get_db)):
    """Синхронизировать данные всех поставщиков"""
```

### 5. Парсеры форматов данных

Реализовать парсеры для следующих форматов:

#### 5.1. CSV/Excel парсер

```python
class CSVWheelParser:
    """
    Парсит CSV/Excel файлы с маппингом колонок.
    Поддерживает гибкий маппинг названий колонок к полям модели.
    """

    COLUMN_MAPPINGS = {
        # Список возможных названий колонок для каждого поля
        "brand": ["бренд", "марка", "brand", "manufacturer"],
        "model": ["модель", "model", "название"],
        "diameter": ["диаметр", "diameter", "diam", "r"],
        "width": ["ширина", "width", "ширина обода"],
        "pcd": ["разболтовка", "pcd", "bolt pattern"],
        "et": ["вылет", "et", "offset"],
        "dia": ["dia", "cb", "ступица", "центр. отверстие"],
        "price": ["цена", "price", "стоимость"],
        "stock": ["остаток", "stock", "quantity", "количество"],
        # ... и т.д.
    }
```

#### 5.2. JSON парсер

```python
class JSONWheelParser:
    """Парсит JSON выгрузки с различными структурами"""
```

#### 5.3. XML парсер

```python
class XMLWheelParser:
    """Парсит XML выгрузки (например, из 1С)"""
```

### 6. Нормализация данных

```python
class WheelDataNormalizer:
    """
    Нормализует данные из разных источников к единому формату
    """

    @staticmethod
    def normalize_type(type_str: str) -> str:
        """
        Определяет тип диска по названию
        Возвращает: "stamped", "cast" или "forged"
        """
        type_lower = type_str.lower()
        if any(word in type_lower for word in ["сталь", "steel", "штамп", "stamp"]):
            return "stamped"
        elif any(word in type_lower for word in ["кован", "forg"]):
            return "forged"
        else:
            return "cast"

    @staticmethod
    def normalize_pcd(pn: int, pcd: float) -> str:
        """
        Форматирует PCD в строку "4x100"
        """
        return f"{pn}x{pcd}"

    @staticmethod
    def normalize_price(prices: dict) -> tuple:
        """
        Выбирает цену и РРЦ из доступных значений
        Возвращает: (price, rrc)
        """
        price = prices.get("rrc") or prices.get("opt") or prices.get("price") or 5000
        rrc = prices.get("rrc") or price
        return (price, rrc)
```

### 7. Оптимизация и кэширование

```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

@router.get("/wheels")
@cache(expire=60)  # Кэшировать на 60 секунд
async def get_wheels(...):
    ...
```

### 8. Конфигурация

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/wheels_db"

    # Redis (для кэширования)
    REDIS_URL: str = "redis://localhost:6379"

    # API
    API_TITLE: str = "Wheels Catalog API"
    API_VERSION: str = "1.0.0"

    # Импорт
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50 MB
    ALLOWED_PROVIDERS: list = ["provider1", "provider2", "tirebase"]

    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
```

### 9. Примеры использования

#### Пример 1: Получение всех литых дисков R17

```bash
GET /api/wheels?diameter=17&type=cast
```

#### Пример 2: Поиск дисков для конкретного авто

```bash
GET /api/wheels?diameter=17&width=7&pcd=5x112&et=45&hub=66.6&brand=replica
```

#### Пример 3: Импорт выгрузки от поставщика

```bash
POST /api/import/wheels
Content-Type: multipart/form-data

file: wheels_export.xlsx
provider: "provider_name"
format: "xlsx"
replace: false
```

### 10. Миграция с текущего API

Для плавной миграции:

1. **Создать адаптер для Tirebase API:**
   ```python
   @router.get("/wheels/tirebase")
   async def get_tirebase_wheels(...):
       """Прокси к текущему Tirebase API для сравнения"""
   ```

2. **Импортировать данные из Tirebase в новую БД:**
   ```python
   @router.post("/import/tirebase")
   async def import_from_tirebase():
       """Импортировать текущий каталог из Tirebase"""
   ```

3. **Параллельно работать с двумя API:**
   - Фронтенд может переключаться между старым и новым API через env переменную
   - Сравнивать результаты для проверки корректности

### 11. Тестирование

```python
# tests/test_wheels_api.py

def test_get_wheels_by_diameter():
    response = client.get("/api/wheels?diameter=17")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert all(wheel["diameter"] == 17 for wheel in data["data"])

def test_get_wheels_by_pcd():
    response = client.get("/api/wheels?pcd=5x112")
    assert response.status_code == 200
    data = response.json()
    assert all(wheel["pcd"] == "5x112" for wheel in data["data"])

def test_et_range_filter():
    # ET должен работать с диапазоном ±5
    response = client.get("/api/wheels?et=45")
    data = response.json()
    for wheel in data["data"]:
        assert 40 <= wheel["et"] <= 50

def test_import_wheels_csv():
    with open("test_wheels.csv", "rb") as f:
        response = client.post(
            "/api/import/wheels",
            files={"file": f},
            data={"provider": "test_provider", "format": "csv"}
        )
    assert response.status_code == 201
```

### 12. Документация API

FastAPI автоматически генерирует документацию Swagger UI и ReDoc:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI schema: `http://localhost:8000/openapi.json`

### 13. Развертывание

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/wheels
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: wheels
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

## Дополнительные требования

1. **Логирование:** Использовать structured logging (например, structlog)
2. **Мониторинг:** Добавить health check эндпоинт `/health`
3. **Аутентификация:** Опционально добавить JWT auth для защиты импорта данных
4. **Валидация:** Строгая валидация всех входных данных через Pydantic
5. **Обработка ошибок:** Единообразная обработка ошибок с понятными сообщениями
6. **Rate limiting:** Ограничение частоты запросов (например, через slowapi)
7. **Backup:** Регулярное резервное копирование базы данных

## Критерии успеха

1. ✅ API полностью совместим с фронтендом (возвращает данные в том же формате)
2. ✅ Поддерживает все фильтры текущего API
3. ✅ Может импортировать данные из разных форматов (CSV, Excel, JSON, XML)
4. ✅ Объединяет данные от нескольких поставщиков
5. ✅ Быстрый поиск (< 100ms для типичных запросов)
6. ✅ Покрытие тестами > 80%
7. ✅ Полная документация API

## Пример запуска разработки

```bash
# 1. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # или venv\Scripts\activate на Windows

# 2. Установить зависимости
pip install -r requirements.txt

# 3. Настроить БД
cp .env.example .env
# Отредактировать .env

# 4. Запустить миграции
alembic upgrade head

# 5. Запустить сервер
uvicorn app.main:app --reload

# 6. Открыть документацию
# http://localhost:8000/docs
```

---

**Автор промпта:** Claude (Sonnet 4.5)
**Дата:** 2026-01-11
**Версия:** 1.0
