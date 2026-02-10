import React, { useState } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import { Button, Input, TextArea, Select, Avatar, Tag } from '../components/UI';
import Icon from '../components/Icons';
import { JOB_TYPES, JOB_CATS } from '../constants';

export default function JobBoardPage({ members }) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [savedJobs, setSavedJobs] = useState(new Set());

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: '',
    category: '',
    location: '',
    salary: '',
    description: '',
  });

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Elementary Teacher',
      company: 'Zachary Community Schools',
      type: 'Full Time',
      category: 'Education',
      location: 'Zachary',
      salary: '$42-55k',
      description: 'We are seeking a dedicated elementary teacher for our school district.',
      contactName: 'Sarah',
      contactId: 'sarah-id',
      urgent: false,
      postedDate: '2024-01-15',
      responses: 3,
    },
    {
      id: 2,
      title: 'Front Desk Receptionist',
      company: 'Baton Rouge General',
      type: 'Part Time',
      category: 'Healthcare',
      location: 'Downtown Baton Rouge',
      salary: '$14-17/hr',
      description: 'Friendly receptionist needed for our medical facility front desk.',
      contactName: 'Jason',
      contactId: 'jason-id',
      urgent: false,
      postedDate: '2024-01-14',
      responses: 2,
    },
    {
      id: 3,
      title: 'Freelance Graphic Designer',
      company: 'Creative Projects',
      type: 'Freelance',
      category: 'Arts & Entertainment',
      location: 'Remote',
      salary: 'Project-based',
      description: 'Looking for talented graphic designer for various creative projects.',
      contactName: 'Lisa',
      contactId: 'lisa-id',
      urgent: false,
      postedDate: '2024-01-13',
      responses: 1,
    },
    {
      id: 4,
      title: 'Youth Program Volunteer',
      company: 'Vineyard Church',
      type: 'Volunteer',
      category: 'Non-Profit & Community Service',
      location: 'Downtown Baton Rouge',
      salary: 'Unpaid',
      description: 'Help us lead and mentor youth in our community programs.',
      contactName: 'Grace',
      contactId: 'grace-id',
      urgent: true,
      postedDate: '2024-01-12',
      responses: 5,
    },
    {
      id: 5,
      title: 'IT Support Technician',
      company: 'CGI Federal',
      type: 'Full Time',
      category: 'Engineering & Technology',
      location: 'Downtown Baton Rouge',
      salary: '$45-60k',
      description: 'IT support professional needed for tech support and troubleshooting.',
      contactName: 'Marcus',
      contactId: 'marcus-id',
      urgent: false,
      postedDate: '2024-01-11',
      responses: 4,
    },
    {
      id: 6,
      title: 'Handyman',
      company: 'Martinez Home Services',
      type: 'Part Time',
      category: 'Construction & Trades',
      location: 'Prairieville',
      salary: '$20-30/hr',
      description: 'Experienced handyman needed for various home repair projects.',
      contactName: 'David',
      contactId: 'david-id',
      urgent: true,
      postedDate: '2024-01-10',
      responses: 2,
    },
    {
      id: 7,
      title: 'Floral Designer Assistant',
      company: 'Peregrin\'s',
      type: 'Part Time',
      category: 'Retail & Sales',
      location: 'Downtown Baton Rouge',
      salary: '$13-16/hr',
      description: 'Assist our experienced floral designers in creating beautiful arrangements.',
      contactName: 'Tom & Linda',
      contactId: 'tom-linda-id',
      urgent: false,
      postedDate: '2024-01-09',
      responses: 1,
    },
    {
      id: 8,
      title: 'Home Health Aide',
      company: 'OLOL Home Health',
      type: 'Full Time',
      category: 'Healthcare',
      location: 'Downtown Baton Rouge',
      salary: '$28-35k',
      description: 'Compassionate healthcare professional to provide home health services.',
      contactName: 'Emily',
      contactId: 'emily-id',
      urgent: false,
      postedDate: '2024-01-08',
      responses: 3,
    },
  ]);

  const typeColors = {
    'Full Time': '#374151',
    'Part Time': '#6B7280',
    'Freelance': '#4B5563',
    'Volunteer': '#22C55E',
    'Internship': '#9CA3AF',
    'Contract': '#7C3AED',
    'Apprenticeship': '#06B6D4',
    'Seasonal': '#EC4899',
    'Temporary': '#F97316',
    'Permanent': '#10B981',
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.title && formData.company && formData.type && formData.category) {
      const newJob = {
        id: jobs.length + 1,
        ...formData,
        contactName: members?.[0]?.name || 'Church Member',
        contactId: members?.[0]?.id || 'member-id',
        urgent: false,
        postedDate: new Date().toISOString().split('T')[0],
        responses: 0,
      };
      setJobs([newJob, ...jobs]);
      setFormData({
        title: '',
        company: '',
        type: '',
        category: '',
        location: '',
        salary: '',
        description: '',
      });
      setShowForm(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.type === filterType;
    const matchesCategory = !filterCategory || job.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const toggleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          ...S.card,
          background: `linear-gradient(135deg, ${T.primaryDark}, ${T.primary})`,
          color: T.white,
          border: 'none',
          textAlign: 'center',
          padding: '32px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>💼</div>
        <h1 style={{ ...S.h1, color: T.white, marginBottom: '8px' }}>Job Bulletin Board</h1>
        <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '20px' }}>
          Helping our Vineyard Church of Baton Rouge family find great opportunities!
        </p>
        <Button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: T.white,
            border: `2px solid ${T.white}`,
          }}
        >
          <span style={{ marginRight: '8px' }}>+</span>
          Post a Job
        </Button>
      </div>

      {/* Job Form */}
      {showForm && (
        <div
          style={{
            ...S.card,
            border: `2px solid ${T.primary}`,
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h3 style={S.h3}>Post a New Job / Opportunity</h3>
          <div style={{ marginTop: '20px' }}>
            <div style={S.grid2}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Job Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Teacher, Software Developer"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Company
                </label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  placeholder="e.g., ABC Company"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Job Type
                </label>
                <Select
                  options={JOB_TYPES}
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Select job type"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Category
                </label>
                <Select
                  options={JOB_CATS}
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Select category"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Location
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g., Baton Rouge, LA"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Salary / Compensation
                </label>
                <Input
                  name="salary"
                  value={formData.salary}
                  onChange={handleFormChange}
                  placeholder="e.g., $50k-60k, Negotiable"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Description
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe the job opportunity..."
                rows={5}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ ...S.flex, marginTop: '20px', gap: '12px' }}>
              <Button onClick={handleSubmit}>Post Job</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    title: '',
                    company: '',
                    type: '',
                    category: '',
                    location: '',
                    salary: '',
                    description: '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Row */}
      <div
        style={{
          ...S.flex,
          marginBottom: '24px',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <Select
          options={JOB_TYPES}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          placeholder="All Types"
          style={{ minWidth: '150px' }}
        />
        <Select
          options={JOB_CATS}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="All Categories"
          style={{ minWidth: '150px' }}
        />
        <span style={{ ...S.muted, whiteSpace: 'nowrap' }}>
          {filteredJobs.length} opportunit{filteredJobs.length === 1 ? 'y' : 'ies'}
        </span>
      </div>

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.map(job => (
          <div
            key={job.id}
            style={{
              ...S.card,
              padding: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Urgent Banner */}
            {job.urgent && (
              <div
                style={{
                  backgroundColor: T.warning,
                  color: '#92400E',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                ⚠️ URGENT HIRING
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px' }}>
              {/* Type & Category Badges */}
              <div style={{ ...S.flex, marginBottom: '12px', gap: '8px' }}>
                <Tag
                  variant="default"
                  style={{
                    backgroundColor: typeColors[job.type] || T.primary,
                    color: T.white,
                  }}
                >
                  {job.type}
                </Tag>
                <Tag variant="default" style={{ backgroundColor: T.primaryFaint }}>
                  {job.category}
                </Tag>
                <span style={{ ...S.muted, marginLeft: 'auto' }}>
                  {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>

              {/* Job Title */}
              <h3 style={{ ...S.h3, fontSize: '20px' }}>{job.title}</h3>

              {/* Company & Location */}
              <div style={{ ...S.flex, marginBottom: '12px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ ...S.flex, color: T.primary, fontWeight: '600' }}>
                  <Icon name="briefcase" size={18} style={{ marginRight: '6px' }} />
                  {job.company}
                </div>
                <div style={{ ...S.flex, color: T.textMuted }}>
                  <Icon name="location" size={18} style={{ marginRight: '6px' }} />
                  {job.location}
                </div>
              </div>

              {/* Description */}
              <p style={{ color: T.text, marginBottom: '12px', lineHeight: '1.5' }}>
                {job.description}
              </p>

              {/* Salary */}
              <div style={{ color: T.success, fontWeight: '500', marginBottom: '16px' }}>
                💰 {job.salary}
              </div>

              {/* Save Button */}
              <button
                onClick={() => toggleSaveJob(job.id)}
                style={{
                  position: 'absolute',
                  top: job.urgent ? '56px' : '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: savedJobs.has(job.id) ? T.warning : T.textMuted,
                }}
              >
                {savedJobs.has(job.id) ? '★' : '☆'}
              </button>

              {/* Divider */}
              <div style={S.divider} />

              {/* Contact Section */}
              <div
                style={{
                  ...S.flex,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={S.flex}>
                  <Avatar name={job.contactName} size={36} />
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{ fontWeight: '500' }}>Posted by {job.contactName}</div>
                  </div>
                </div>
                <Button size="sm">Contact About This Job</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
          <h3 style={S.h3}>No jobs found</h3>
          <p style={{ ...S.muted, marginTop: '8px' }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
