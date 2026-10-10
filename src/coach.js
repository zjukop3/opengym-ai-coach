import OpenAI from 'openai';
import fetch from 'node-fetch';

const OPENGYM_URL = process.env.OPENGYM_URL || 'http://localhost:8080';
const OPENGYM_API_KEY = process.env.OPENGYM_API_KEY;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fetch recent workout data from openGym API
export async function fetchOpenGymWorkouts(weeks = 4) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const params = new URLSearchParams({
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0]
  });

  const response = await fetch(`${OPENGYM_URL}/api/workouts?${params}`, {
    headers: { 'Authorization': `Bearer ${OPENGYM_API_KEY}` }
  });

  if (!response.ok) {
    throw new Error(`openGym API error: ${response.statusText}`);
  }
  return response.json();
}

// Generate coaching advice using OpenAI
export async function getTrainingAdvice(weeks = 4) {
  // 1. Gather data
  const workouts = await fetchOpenGymWorkouts(weeks);

  // 2. Summarize training stats
  const summary = summarizeWorkouts(workouts);

  // 3. Call LLM
  const prompt = buildCoachPrompt(summary);
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: 'You are an experienced strength and conditioning coach. Give concise, actionable advice.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const advice = completion.choices[0].message.content;

  // 4. Simple fatigue detection
  const fatigue = detectFatigue(summary);

  return { advice, fatigueLevel: fatigue.level, nextWeekPlan: {} }; // nextWeekPlan can be parsed from advice if structured
}

// Basic workout summarizer (real implementation would be more detailed)
function summarizeWorkouts(workouts) {
  // workouts is an array of workout objects from openGym
  let totalSets = 0;
  let totalVolume = 0; // sets x reps x weight
  const exercises = new Map();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const name = exercise.name;
      if (!exercises.has(name)) exercises.set(name, { sets: 0, volume: 0 });
      const ex = exercises.get(name);
      for (const set of exercise.sets) {
        if (set.type === 'warmup') continue;
        totalSets++;
        ex.sets++;
        const vol = set.reps * (set.weight || 0);
        totalVolume += vol;
        ex.volume += vol;
      }
    }
  }

  return {
    weeks: workouts.length ? Math.ceil((new Date() - new Date(workouts[0].date)) / (7*24*3600*1000)) : 0,
    totalWorkouts: workouts.length,
    totalSets,
    totalVolume: Math.round(totalVolume),
    exercises: Object.fromEntries(exercises)
  };
}

function buildCoachPrompt(summary) {
  return `Training summary for the last ${summary.weeks} weeks:
- Total workouts: ${summary.totalWorkouts}
- Total sets: ${summary.totalSets}
- Total volume load: ${summary.totalVolume} kg
- Exercises trained: ${Object.keys(summary.exercises).join(', ')}

Based on this, provide a brief analysis and suggestions for the next training week. Include fatigue assessment and whether the user should deload, maintain, or increase intensity.`;
}

function detectFatigue(summary) {
  // Simplified heuristic: high session frequency + high volume -> fatigue
  const avgVolumePerWorkout = summary.totalWorkouts > 0 ? summary.totalVolume / summary.totalWorkouts : 0;
  if (avgVolumePerWorkout > 20000) return { level: 'high', reason: 'Extremely high per-session volume' };
  if (avgVolumePerWorkout > 12000) return { level: 'moderate', reason: 'Sustained high volume' };
  return { level: 'low', reason: 'Normal' };
}