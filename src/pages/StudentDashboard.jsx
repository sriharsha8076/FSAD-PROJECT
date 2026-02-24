import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard, ChartCard, Card, Button } from '../components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockStudents, mockAchievements, categoryDistributionData } from '../data/mockData';
import { Award, Filter, Download, Calendar, Plus } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export const StudentDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const student = mockStudents[0]; // Get first student as example (keep for mock stats)
  const studentAchievements = mockAchievements.slice(0, 3); // Mock achievements for student

  const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--success)'];

  const stats = [
    { label: 'Total Achievements', value: student.totalAchievements, icon: Award, color: 'from-purple-500 to-indigo-600' },
  ];

  const badges = [
    { name: 'Rising Star', description: '5+ Achievements' },
    { name: 'Team Player', description: 'Sports Category' },
    { name: 'Tech Master', description: 'Technical Excellence' },
  ];
  //1234

  return (
    <div style={{ flex: 1, padding: 'var(--spacing-4)' }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--spacing-8)' }}
      >
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-6)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-light)', margin: 0 }}>Welcome, {user?.name || student.name}!</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-1)', margin: 0 }}>Track and celebrate your achievements</p>
            </div>
            <div style={{ fontSize: '2.25rem' }}>🎓</div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 'var(--spacing-8)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StatCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-8)'
        }}
      >
        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ChartCard title="Category Breakdown" subtitle="Your achievements by type">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => <text fill="var(--text-light)" fontSize="12" dy={-10}>{name}</text>}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="var(--bg-dark)"
                  strokeWidth={2}
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

        {/* Badges & Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ gridColumn: '1 / -1', '@media (min-width: 1024px)': { gridColumn: 'span 2' } }}>
          <ChartCard title="Achievement Badges" subtitle="Your earned recognition">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-4)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-xl)',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition-normal)'
                  }}
                  whileHover={{ borderColor: 'var(--primary)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ fontSize: '1.5rem' }}>🏆</div>
                    <div>
                      <p style={{ fontWeight: '600', color: 'var(--text-light)', margin: 0 }}>{badge.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{badge.description}</p>
                    </div>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    background: 'var(--success-bg)',
                    color: 'var(--success)',
                    border: '1px solid var(--success)'
                  }}>
                    Earned
                  </span>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </motion.div>

      {/* Timeline & Recent Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-light)', margin: 0 }}>My Achievements</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Timeline of your accomplishments</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button
                variant="primary"
                onClick={() => navigate('/student/add-achievement')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: '0.875rem' }}
              >
                <Plus size={16} />
                Add
              </Button>
              <Button
                variant="secondary"
                onClick={() => addToast('Exporting timeline...', 'info')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: '0.875rem' }}
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {studentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card style={{ padding: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', marginTop: '8px' }} />
                      {index < studentAchievements.length - 1 && (
                        <div style={{ width: '2px', height: '64px', background: 'linear-gradient(to bottom, var(--primary), transparent)', marginTop: '8px' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 'var(--spacing-4)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                        <h3 style={{ fontWeight: '600', color: 'var(--text-light)', fontSize: '1.125rem', margin: 0 }}>{achievement.activity}</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-default)' }}>{achievement.level}</span>
                          <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>{achievement.status}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', opacity: 0.8, margin: '0 0 var(--spacing-2) 0' }}>{achievement.category} • {achievement.position}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>📅 {new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Certificates Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'var(--spacing-8)' }}>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-light)', margin: 0 }}>Certificates</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>View and download your achievement certificates</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
          {studentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable style={{ overflow: 'hidden', padding: 'var(--spacing-4)' }}>
                <div style={{
                  aspectRatio: '16/9',
                  background: 'linear-gradient(to bottom right, var(--primary), var(--secondary))',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.875rem' }}>📜</span>
                </div>
                <h3 style={{ fontWeight: '600', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 var(--spacing-1) 0' }}>{achievement.activity}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 var(--spacing-4) 0' }}>{new Date(achievement.date).toLocaleDateString()}</p>
                <Button
                  variant="secondary"
                  onClick={() => addToast(`Downloading ${achievement.activity} certificate...`, 'success')}
                  style={{ width: '100%', fontSize: '0.875rem' }}
                >
                  Download
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
