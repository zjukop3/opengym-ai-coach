import OpenAI from 'openai';

/**
 * Calculates total volume (sets * reps * weight) for a list of workouts.
 * @param {Array} workouts - Array of workout objects from openGym
 * @returns {number} Total volume
 */
function calculateTotalVolume(workouts) {
  return workouts.reduce((total, w) => {
    const sets = w.sets || 0;
    const reps = w.reps || 0;
    const weight = w.weight || 0;
    return total + (sets * reps * weight);
  }, 0);
}

/**
 * Finds the maximum weight lifted per exercise.
 * @param {Array} workouts
 * @returns {Object} Map of exercise name to max weight
 */
function calculatePRs(workouts) {
  const prs = {};
  workouts.forEach(w => {
    const exercise = w.exercise || 'Unknown';
    const weight = w.weight || 0;
    if (!prs[exercise] || weight > prs[exercise]) {
      prs[exercise] = weight;
    }
  });
  return prs;
}

/**
 * Generates a prompt for the LLM based on workout statistics.
 * @param {Object} stats - Calculated statistics
 * @param {Array} workouts - Raw workout data
 * @returns {string} Formatted prompt
 */
function buildPrompt(stats, workouts) {
  return `You are an expert fitness coach analyzing data from openGym.
Based on the following workout history, provide:
1. A brief summary of their training status.
2. Fatigue warning (if any muscle seems overworked or under-recovered).
3. Periodization advice for the next cycle.

Total Volume: ${stats.totalVolume}
Personal Records (PRs): ${JSON.stringify(stats.prs, null, 2)}

Workout History (last 5 sessions):
${JSON.stringify(workouts.slice(-5), null, 2)}

Respond in a friendly, motivating tone. Format your response in Markdown.`;
}

/**
 * Main function to analyze workouts and generate AI advice.
 * @param {Array} workouts - Array of workout objects
 * @returns {Promise<Object>} Analysis result including stats and AI advice
 */
export async function analyzeWorkouts(workouts) {
  // 1. Calculate basic stats
  const totalVolume = calculateTotalVolume(workouts);
  const prs = calculatePRs(workouts);
  const stats = { totalVolume, prs };

  // 2. Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    return {
      stats,
      advice: 'OPENAI_API_KEY is not set. Cannot generate AI advice. Please set the environment variable.'
    };
  }

  // 3. Call OpenAI API
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = buildPrompt(stats, workouts);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using a fast and cost-effective model
      messages: [
        { role: 'system', content: 'You are a helpful AI fitness coach.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    return {
      stats,
      advice: completion.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      stats,
      advice: 'Failed to generate AI advice due to an API error.',
      error: error.message
    };
  }
}