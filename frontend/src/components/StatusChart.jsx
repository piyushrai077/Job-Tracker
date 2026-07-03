import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  Applied: '#6c8ebf',
  Interview: '#ffb454',
  Offer: '#4caf7d',
  Rejected: '#d16a6a',
};

function StatusChart({ applications }) {
  const data = ['Applied', 'Interview', 'Offer', 'Rejected']
    .map(status => ({
      name: status,
      value: applications.filter(a => a.status === status).length,
    }))
    .filter(item => item.value > 0); // khaali status skip karo

  if (data.length === 0) return null;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Application Breakdown</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} stroke="#14161c" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1c1f28',
              border: '1px solid #2a2e38',
              borderRadius: 8,
              color: '#f4f2ec',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, color: '#8b8fa3' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusChart;