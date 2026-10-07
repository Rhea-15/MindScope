# 🧠 MindScope

**AI-powered student stress assessment, explainable insights, and wellbeing support.**

MindScope lets students complete a short, guided self-assessment and get back a predicted stress level (**Low / Moderate / High**) from an XGBoost model, along with the top factors driving the result (via SHAP) and personalised coping suggestions. Their history is stored so they can track trends over time. A separate admin workspace gives institutions a cohort-level view of student wellbeing.

---

## ✨ Features

### Student workspace
- **Guided 4-step assessment**: Academic → Environment → Psychological & Social → Physiological (20 input features).
- **ML-powered prediction**: stress level, model confidence, and per-class probabilities.
- **Explainable AI**: SHAP values identify the top 5 factors influencing the result, with a context-aware filter so healthy baselines are never shown as "stressors" (and unhealthy ones are never shown as "protective factors").
- **Personalised interventions**: rule-based suggestions (sleep, study load, anxiety, support, health, self-esteem), capped at 3 per result.
- **Dashboard**: current stress level, top stressor, wellbeing trend chart, and a weekly focus tip.
- **Insights**: gauge chart, factor-influence breakdown, and a downloadable/printable wellbeing summary.
- **History**: filter by 7 days / 30 days / 3 months / all time, view trends, delete a single record or clear everything.
- **Recommendations library**: categorised self-help toolkit (Sleep, Anxiety, Focus, Social).

### Admin workspace (institution view)
- **Overview dashboard**: KPIs (total students, % low/moderate/high, average risk index), stress distribution donut, and top stressors across the cohort, with filters for department, year, cohort, semester, and assessment period.
- **Cohort analytics**: heatmap of stress factors by cohort, primary stressors, and recommended actions.

---

## 🏗️ Architecture

```
┌──────────────────────────┐        REST/JSON        ┌─────────────────────────────┐
│   Next.js 14 Frontend    │ ──────────────────────▶ │       FastAPI Backend       │
│  (React 18, Tailwind,    │                         │                             │
│   Recharts)              │ ◀────────────────────── │  XGBoost + SHAP + Scalers   │
│       :3000              │                         │  SQLAlchemy ─▶ SQLite       │
└──────────────────────────┘                         │            :8000            │
                                                     └─────────────────────────────┘
```

**Prediction flow**
1. The student submits the assessment form.
2. `POST /predict` scales the inputs (StandardScaler for continuous features, MinMaxScaler for Likert features).
3. XGBoost predicts the class and probabilities.
4. A SHAP `TreeExplainer` computes feature contributions, which are filtered for context.
5. Interventions are generated, and the result (level, confidence, top stressor) is saved to SQLite.
6. The frontend caches the latest result in `localStorage` and routes to the Insights page.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS 3, Recharts, date-fns |
| Backend | Python 3.11, FastAPI, Pydantic v2, Uvicorn |
| ML | XGBoost, scikit-learn (Random Forest baseline, scalers), SHAP, pandas, NumPy, joblib |
| Database | SQLite via SQLAlchemy |
| DevOps | Docker, Docker Compose (multi-stage frontend build, Next.js `standalone` output) |

---

## 📁 Project Structure

```
mindscope/
├── docker-compose.yml
├── backend/
│   ├── main.py            # FastAPI app, DB models, SHAP, interventions, routes
│   ├── train.py           # Preprocessing + model training pipeline
│   ├── seed_db.py         # Seeds demo history + cohort records
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── data/              # StressLevelDataset.csv + mindscope.db (runtime)
│   └── models/            # xgboost_model.joblib, scaler_standard.joblib, scaler_minmax.joblib
└── frontend/
    ├── app/
    │   ├── page.tsx                     # Login / role selection
    │   ├── student/
    │   │   ├── dashboard/  assessment/  insights/  history/  recommendations/
    │   └── admin/
    │       ├── dashboard/  cohort/
    ├── components/
    │   ├── forms/AssessmentForm.tsx     # Multi-step assessment
    │   ├── charts/                      # GaugeChart, TrendChart, FactorChart, MetricCard
    │   ├── cards/  ui/                  # Shared UI building blocks
    ├── lib/api.ts                       # Backend API client
    ├── types/index.ts                   # Shared TS types
    └── Dockerfile
```

---

## 🧪 The Model

**Dataset**: `StressLevelDataset.csv` (target column: `stress_level`, classes 0/1/2).

**Input features (20)**

| Group | Features | Range |
|---|---|---|
| Continuous scores | `anxiety_level` / `self_esteem` / `depression` | 0–21 / 0–30 / 0–27 |
| Likert (0–5) | `academic_performance`, `study_load`, `teacher_student_relationship`, `future_career_concerns`, `basic_needs`, `living_conditions`, `safety`, `noise_level`, `peer_pressure`, `social_support`, `bullying`, `sleep_quality`, `headache`, `breathing_problem`, `extracurricular_activities` | 0–5 |
| Categorical | `blood_pressure` (1 = Low, 2 = Normal, 3 = High) / `mental_health_history` (0 = No, 1 = Yes) | – |

**Training pipeline (`train.py`)**
- 80/20 stratified train/test split (`random_state=42`). The split happens *before* scaling to avoid data leakage.
- `StandardScaler` on continuous features, `MinMaxScaler` on Likert features, and categorical features left as-is.
- **Baseline**: Random Forest (100 trees, depth 15).
- **Primary model**: XGBoost (150 estimators, depth 7, lr 0.05, subsample/colsample 0.8).
- Evaluation with accuracy, classification report, and 5-fold stratified cross-validation, plus feature-importance output.
- Saves `xgboost_model.joblib`, `scaler_standard.joblib`, and `scaler_minmax.joblib` to `models/`.

**Explainability**: `shap.TreeExplainer` on the XGBoost booster. The top 5 contributors are returned with both absolute `impact` and signed `contribution`. A rule-based filter (`is_feature_healthy`) keeps results sensible: for Moderate/High predictions, healthy-valued features can't appear as top stressors, and for Low predictions, unhealthy-valued features can't appear as protective factors.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) Docker & Docker Compose

### Option 1: Docker Compose

1. Make sure `backend/models/` contains the trained artifacts (see [Training](#2-train-the-model)).
2. Build and start both services:
```bash
   docker compose up --build
```
3. Open:
   - Frontend → http://localhost:3000
   - API → http://localhost:8000
   - Swagger docs → http://localhost:8000/docs

> `backend/data` and `backend/models` are mounted as volumes, so the SQLite DB and model files persist on your host.

### Option 2: Local development

#### 1. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. Train the model
Place `StressLevelDataset.csv` in `backend/data/` and create the `models/` folder, then run:
```bash
mkdir -p models
python train.py
```

#### 3. (Optional) Seed demo data
```bash
python seed_db.py
```
This creates 11 history records for the demo student (`alex@northbridge.edu`) showing a High → Moderate → Low trend, plus 150 anonymised cohort records.

#### 4. Run the API
```bash
uvicorn main:app --reload --port 8000
```

#### 5. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000.

### Environment variables

| Variable | Where | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8000` | Base URL of the FastAPI backend |

---

## 🔌 API Reference

Base URL: `http://localhost:8000` · Interactive docs: `/docs`

### `POST /predict`
Runs a stress prediction and saves it to history.

**Request body**
```json
{
  "user_email": "alex@northbridge.edu",
  "academic_performance": 3,
  "study_load": 4,
  "teacher_student_relationship": 3,
  "future_career_concerns": 4,
  "basic_needs": 3,
  "living_conditions": 3,
  "safety": 3,
  "noise_level": 2,
  "anxiety_level": 12,
  "self_esteem": 18,
  "depression": 10,
  "peer_pressure": 3,
  "social_support": 2,
  "bullying": 1,
  "sleep_quality": 2,
  "headache": 2,
  "breathing_problem": 1,
  "blood_pressure": 2,
  "mental_health_history": 0,
  "extracurricular_activities": 2
}
```

**Response**
```json
{
  "stress_level": "Moderate",
  "stress_level_code": 1,
  "confidence": 0.87,
  "color": "#f59e0b",
  "top_stressors": [
    { "feature": "study_load", "impact": 0.42, "contribution": 0.42 }
  ],
  "interventions": ["💤 SLEEP: ...", "📚 STUDY: ...", "🤝 SUPPORT: ..."],
  "raw_probabilities": { "Low": 0.05, "Moderate": 0.87, "High": 0.08 }
}
```

### `GET /history/{email}`
Returns all assessments for a user, ordered oldest → newest.

### `DELETE /history/{email}`
Clears all assessments for a user.

### `DELETE /history/record/{record_id}`
Deletes a single assessment (`404` if not found).

### Database schema: `assessments`

| Column | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `user_email` | String | Indexed |
| `date` | DateTime | Defaults to UTC now |
| `stress_level` | String | Low / Moderate / High |
| `stress_level_code` | Integer | 0 / 1 / 2 |
| `confidence` | Float | Max class probability |
| `top_stressor` | String | Top SHAP feature |

---

## 🗺️ App Routes

| Route | Description |
|---|---|
| `/` | Login / role selection (student or admin) |
| `/student/dashboard` | Personal overview, trend, weekly focus |
| `/student/assessment` | Multi-step stress assessment |
| `/student/insights` | Result, gauge, factor breakdown, summary export |
| `/student/history` | Past assessments with filters and deletion |
| `/student/recommendations` | Self-help toolkit |
| `/admin/dashboard` | Institution-wide stress overview |
| `/admin/cohort` | Cohort analytics and heatmap |

---

## ⚠️ Current Limitations

- **Authentication is a UI placeholder.** There are no real accounts, sessions, or role enforcement. The student identity is hardcoded to the demo email `alex@northbridge.edu`.
- **Admin dashboards currently render mock/sample data**; the backend has no cohort/aggregate endpoints yet (the seeded cohort records aren't read by the admin UI).
- **The `/admin/stressors` nav item has no matching page yet.**
- `hooks/usePrediction.ts` and `hooks/useAssessmentHistory.ts` are empty stubs.
- CORS is open to all origins (`*`), which is fine for development but should be restricted in production.
- The training dataset and trained model files are not included in the repo.

## 🛣️ Roadmap Ideas

- Real authentication (JWT / OAuth) and role-based access control
- Backend aggregate endpoints powering the admin dashboards from real data
- Admin "Stressors" page
- Migrate from SQLite to PostgreSQL for multi-user deployments
- Model monitoring, calibration, and fairness evaluation
- Connect users to real campus counselling resources and crisis helplines

---

## ⚕️ Disclaimer

MindScope is an educational/screening tool and **not a medical or diagnostic device**. Its output does not replace professional mental health advice, diagnosis, or treatment. If you or someone you know is struggling, please contact a qualified counsellor or local emergency/crisis services.

---
