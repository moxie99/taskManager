import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface TaskInsight {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  completionRate: number;
  mostRecentTask: string | null;
  tasksByMonth: { [key: string]: number };
  priorityDistribution: { [key: string]: number };
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Set auth
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user's tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (tasksError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tasks' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate insights
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get most recent task
    const sortedTasks = tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const mostRecentTask = sortedTasks.length > 0 ? sortedTasks[0].title : null;

    // Tasks by month
    const tasksByMonth: { [key: string]: number } = {};
    tasks.forEach(task => {
      const month = new Date(task.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
      tasksByMonth[month] = (tasksByMonth[month] || 0) + 1;
    });

    // Priority distribution from extras
    const priorityDistribution: { [key: string]: number } = {};
    tasks.forEach(task => {
      const priority = task.extras?.priority || 'medium';
      priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
    });

    const insights: TaskInsight = {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      completionRate,
      mostRecentTask,
      tasksByMonth,
      priorityDistribution,
    };

    return new Response(
      JSON.stringify(insights),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in task-insights function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});