import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, AchievementCard, Button, FormInput, Modal } from '../components';
import { mockAchievements } from '../data/mockData';
import { Search, Filter, Download } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/Toast';

export const ViewAchievementsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdmin = user?.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const categories = ['Sports', 'Technical', 'Cultural', 'Other'];
  const levels = ['Participation', 'College', 'State', 'National', 'International'];

  // Mock data tailored for the student view
  const baseAchievements = isAdmin ? mockAchievements : mockAchievements.slice(0, 3);

  const filteredAchievements = baseAchievements.filter((achievement) => {
    const matchesSearch =
      achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.activity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || achievement.category === selectedCategory;
    const matchesLevel = selectedLevel === '' || achievement.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div style={{ flex: 1, padding: 'var(--spacing-4)' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--spacing-8)' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-light)', margin: 0 }}>
              {isAdmin ? 'View Achievements' : 'My Achievements'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--spacing-1)', margin: 0 }}>
              {isAdmin ? 'Browse all student achievements' : 'Browse your recorded achievements'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => addToast('Exporting achievements...', 'info')}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
          >
            <Download size={16} />
            Export
          </Button>
        </div >
      </motion.div >

      {/* Filters */}
      < motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 'var(--spacing-8)' }}
      >
        <Card style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', margin: '0 0 var(--spacing-4) 0' }}>
            <Filter size={20} />
            Filters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', alignItems: 'end' }}>
            {/* Search (Only for Admin to search students, or search by activity) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <FormInput
                type="text"
                placeholder={isAdmin ? "Search by student name or activity..." : "Search by activity name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                id="searchAchievements"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: 'var(--spacing-2)' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-light)'
                }}
              >
                <option value="" style={{ background: 'var(--bg-dark)' }}>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} style={{ background: 'var(--bg-dark)' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-light)', marginBottom: 'var(--spacing-2)' }}>Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-light)'
                }}
              >
                <option value="" style={{ background: 'var(--bg-dark)' }}>All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level} style={{ background: 'var(--bg-dark)' }}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedLevel('');
                }}
                style={{ width: '100%' }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </Card>
      </motion.div >

      {/* Results Info */}
      < motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 'var(--spacing-4)' }}
      >
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          Showing <span style={{ color: 'var(--text-light)', fontWeight: '600' }}>{filteredAchievements.length}</span> achievements
        </p>
      </motion.div >

      {/* Achievements List - Grid Layout */}
      < motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-6)'
        }}
      >
        {
          filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAchievement(achievement)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <AchievementCard achievement={achievement} style={{ height: '100%' }} />
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <Card style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', margin: 0 }}>No achievements found</p>
                <p style={{ color: 'var(--text-muted)', opacity: 0.7, fontSize: '0.875rem', marginTop: 'var(--spacing-2)', margin: 0 }}>Try adjusting your filters</p>
              </Card>
            </div>
          )
        }
      </motion.div >

      {/* Certificate Modal */}
      < Modal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title="Achievement Certificate"
        size="lg"
      >
        {selectedAchievement && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
            <div style={{
              width: '100%',
              aspectRatio: '1.414', /* A4 Ratio */
              background: 'var(--bg-surface)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative Elements */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(to right, var(--primary), var(--secondary))' }} />

              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>🎓</div>

              <h2 style={{ fontSize: '2rem', color: 'var(--text-light)', margin: '0 0 var(--spacing-6) 0', fontFamily: 'serif' }}>Certificate of Achievement</h2>

              <p style={{ color: 'var(--text-muted)', margin: '0 0 var(--spacing-2) 0' }}>This is to certify that</p>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: '0 0 var(--spacing-6) 0' }}>{selectedAchievement.studentName}</h3>

              <p style={{ color: 'var(--text-muted)', margin: '0 0 var(--spacing-2) 0' }}>has successfully achieved</p>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-light)', margin: '0 0 var(--spacing-6) 0' }}>
                {selectedAchievement.position} in {selectedAchievement.activity}
              </h4>

              <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                <span style={{ padding: '4px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-default)', borderRadius: '9999px', fontSize: '0.875rem', color: 'var(--text-main)' }}>{selectedAchievement.category}</span>
                <span style={{ padding: '4px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-default)', borderRadius: '9999px', fontSize: '0.875rem', color: 'var(--text-main)' }}>{selectedAchievement.level} Level</span>
              </div>

              <div style={{ position: 'absolute', bottom: 'var(--spacing-6)', right: 'var(--spacing-8)', textAlign: 'right' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 var(--spacing-1) 0' }}>Date Awarded</p>
                <p style={{ color: 'var(--text-light)', fontWeight: '600', margin: 0 }}>{new Date(selectedAchievement.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
              <Button variant="secondary" onClick={() => setSelectedAchievement(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => addToast('Downloading PDF certificate...', 'success')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
              >
                <Download size={16} />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
