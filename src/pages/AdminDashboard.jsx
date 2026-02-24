import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard, ChartCard, AchievementCard, Card, FormInput } from '../components';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { monthlyAchievementsData, categoryDistributionData, statisticsData, mockAchievements } from '../data/mockData';
import { Award, Users, Flag, MapPin, Search } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

export const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const statIcons = {
    'award': Award,
    'users': Users,
    'flag': Flag,
    'map-pin': MapPin,
  };

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--success)'];

  const filteredAchievements = mockAchievements.filter((achievement) =>
    achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    achievement.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--spacing-8)' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-light)', margin: 0 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-1)', margin: 0 }}>Welcome back, {user?.name || 'Admin'}! Here's your achievement overview</p>
          </div>
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <FormInput
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-8)'
        }}
      >
        {statisticsData.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatCard
              icon={statIcons[stat.icon]}
              label={stat.label}
              value={stat.value}
              trend={12}
              color={stat.color}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-8)'
        }}
      >
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ gridColumn: '1 / -1' }}
        >
          <ChartCard title="Monthly Achievements" subtitle="Track your achievement trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAchievementsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)'
                  }}
                  itemStyle={{ color: 'var(--text-light)' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="achievements"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="var(--secondary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--secondary)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ChartCard title="Category Distribution" subtitle="Achievement breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-light)'
                  }}
                  itemStyle={{ color: 'var(--text-light)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-light)', margin: '0 0 var(--spacing-2) 0' }}>Recent Achievements</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Latest submissions from your students</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {filteredAchievements.slice(0, 5).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementCard achievement={achievement} />
            </motion.div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No achievements found matching your search</p>
          </Card>
        )}
      </motion.div>
    </>
  );
};
