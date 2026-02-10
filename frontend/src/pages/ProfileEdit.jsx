import React, { useState, useRef } from 'react';
import { T } from '../theme';
import { S } from '../styles';
import {
  Avatar,
  Button,
  Input,
  TextArea,
  Select,
  Tag,
} from '../components/UI';
import Icon from '../components/Icons';
import {
  LOCATIONS,
  SMALL_GROUPS,
  DESIRED_GROUPS,
  SPIRITUAL_GIFTS,
  HOBBY_OPTS,
  AVAIL_OPTS,
} from '../constants';

export default function ProfileEdit({ user, setUser, setPage }) {
  const fileInputRef = useRef(null);
  const [showSaved, setShowSaved] = useState(false);

  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    age: user.age || '',
    birthday: user.birthday || '',
    maritalStatus: user.maritalStatus || '',
    kids: user.kids || '',
    retired: user.retired || 'No',
    canDrive: user.canDrive || 'No',
    location: user.location || '',
    work: user.work || '',
    dietary: user.dietary || '',
    languages: user.languages || [],
    bio: user.bio || '',
    socialInterests: user.socialInterests || '',
    smallGroups: user.smallGroups || [],
    desiredGroups: user.desiredGroups || [],
    spiritualGifts: user.spiritualGifts || [],
    hobbies: user.hobbies || [],
    availableToHelp: user.availableToHelp || [],
    profilePhoto: user.profilePhoto || null,
  });

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (e) => {
    const langStr = e.target.value;
    const langs = langStr
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l);
    setForm((prev) => ({ ...prev, languages: langs }));
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, profilePhoto: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setUser(form);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={S.h1}>Edit My Profile</h1>
          <p style={{ ...S.muted, marginTop: '4px' }}>Tell the Vineyard community about yourself</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={() => setPage('myprofile')}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showSaved && (
        <div
          style={{
            backgroundColor: T.success,
            color: T.white,
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Icon name="check" size={18} color={T.white} />
          Profile saved!
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div style={S.card}>
        <h2 style={S.h2}>Basic Information</h2>

        {/* Profile Photo Area */}
        <div
          style={{
            backgroundColor: T.bgSoft,
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '20px',
            position: 'relative',
          }}
        >
          {/* Photo Display */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            {form.profilePhoto ? (
              <img
                src={form.profilePhoto}
                alt="Profile"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  backgroundColor: T.primaryLight,
                  color: T.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  fontWeight: '600',
                }}
              >
                {getInitials(form.fullName)}
              </div>
            )}

            {/* Camera Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: T.primaryDark,
                color: T.white,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: T.shadow,
              }}
            >
              <Icon name="camera" size={18} color={T.white} />
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: T.textDark, marginBottom: '4px' }}>
              Profile Picture
            </h4>
            <p style={{ ...S.muted, marginBottom: '12px' }}>
              Add a profile picture to help others recognize you
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Photo
              </Button>
              {form.profilePhoto && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Full Name, Email, Phone, Age */}
        <div style={S.grid2}>
          <Input
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <Input
            placeholder="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <Input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
        </div>

        {/* Birthday, Marital Status, Kids */}
        <div style={{ ...S.grid2, marginTop: '16px' }}>
          <Input
            placeholder="Birthday"
            type="date"
            value={form.birthday}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
          />
          <Select
            options={['Single', 'Married', 'Engaged', 'Widowed', 'Divorced']}
            value={form.maritalStatus}
            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            placeholder="Marital Status"
          />
        </div>

        {/* Kids, Retired, Can Drive */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          <Input
            placeholder="Number of Kids"
            type="number"
            value={form.kids}
            onChange={(e) => handleInputChange('kids', e.target.value)}
          />
          <Select
            options={['Yes', 'No']}
            value={form.retired}
            onChange={(e) => handleInputChange('retired', e.target.value)}
            placeholder="Retired"
          />
          <Select
            options={['Yes', 'No']}
            value={form.canDrive}
            onChange={(e) => handleInputChange('canDrive', e.target.value)}
            placeholder="Can Provide Rides"
          />
        </div>
      </div>

      {/* SECTION 2: Location & Work */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>Location & Work</h2>
        <div style={{ ...S.flexCol, gap: '16px' }}>
          <Select
            options={LOCATIONS}
            value={form.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Select Location"
          />
          <Input
            placeholder="Where I Work"
            value={form.work}
            onChange={(e) => handleInputChange('work', e.target.value)}
          />
          <Input
            placeholder="Dietary Preferences"
            value={form.dietary}
            onChange={(e) => handleInputChange('dietary', e.target.value)}
          />
          <Input
            placeholder="Languages Spoken (comma-separated)"
            value={form.languages.join(', ')}
            onChange={handleLanguageChange}
          />
        </div>
      </div>

      {/* SECTION 3: About Me */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>About Me</h2>
        <div style={{ ...S.flexCol, gap: '16px' }}>
          <TextArea
            placeholder="Tell us about yourself..."
            rows={5}
            value={form.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
          <TextArea
            placeholder="What are your social interests and activities?"
            rows={4}
            value={form.socialInterests}
            onChange={(e) => handleInputChange('socialInterests', e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 4: Current Small Groups */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>Current Small Groups</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {SMALL_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => toggleArrayField('smallGroups', group)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${
                  form.smallGroups.includes(group) ? T.primary : T.border
                }`,
                backgroundColor: form.smallGroups.includes(group)
                  ? T.primaryFaint
                  : 'transparent',
                color: T.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 5: Groups I'd Like to Join */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>Groups I'd Like to Join</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {DESIRED_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => toggleArrayField('desiredGroups', group)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${
                  form.desiredGroups.includes(group) ? T.primary : T.border
                }`,
                backgroundColor: form.desiredGroups.includes(group)
                  ? T.primaryFaint
                  : 'transparent',
                color: T.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 6: Spiritual Gifts */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>Spiritual Gifts</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {SPIRITUAL_GIFTS.map((gift) => (
            <button
              key={gift}
              onClick={() => toggleArrayField('spiritualGifts', gift)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${
                  form.spiritualGifts.includes(gift) ? T.primary : T.border
                }`,
                backgroundColor: form.spiritualGifts.includes(gift)
                  ? T.primaryFaint
                  : 'transparent',
                color: T.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {gift}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 7: My Hobbies */}
      <div style={{ ...S.card, marginTop: '20px' }}>
        <h2 style={S.h2}>My Hobbies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {HOBBY_OPTS.map((hobby) => (
            <button
              key={hobby}
              onClick={() => toggleArrayField('hobbies', hobby)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${
                  form.hobbies.includes(hobby) ? T.primary : T.border
                }`,
                backgroundColor: form.hobbies.includes(hobby)
                  ? T.primaryFaint
                  : 'transparent',
                color: T.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {hobby}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 8: Available to Help */}
      <div style={{ ...S.card, marginTop: '20px', marginBottom: '20px' }}>
        <h2 style={S.h2}>Available to Help</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {AVAIL_OPTS.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleArrayField('availableToHelp', opt)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${
                  form.availableToHelp.includes(opt) ? T.primary : T.border
                }`,
                backgroundColor: form.availableToHelp.includes(opt)
                  ? T.primaryFaint
                  : 'transparent',
                color: T.text,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Button
          variant="primary"
          onClick={handleSave}
          style={{ padding: '14px 40px', fontSize: '16px' }}
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
}
