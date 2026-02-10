-- Seed users data
INSERT INTO users (name, email, password, avatar, location, work, age, has_kids, marital_status, bio, phone, dietary, languages, hobbies, spiritual_gifts, current_groups, desired_groups, available, joined) VALUES
('Sarah Johnson', 'sarah.johnson@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👩', 'Zachary', 'Elementary School Teacher', 38, 3, 'Married', 'Passionate about education and community', '225-555-0001', 'Vegetarian', '{English}', '{Reading,Gardening,Volunteering}', '{Teaching,Encouragement}', '{Kids Ministry,Women Group}', '{Bible Study,Prayer Group}', '{Monday,Wednesday,Saturday}', '2024'),
('Marcus Williams', 'marcus.williams@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👨', 'Baton Rouge Mid City', 'Software Engineer at CGI Federal', 29, 0, 'Single', 'Tech enthusiast passionate about serving the community', '225-555-0002', 'Omnivore', '{English,Spanish}', '{Coding,Sports,Gaming}', '{Leadership,Innovation}', '{Tech Ministry,Young Adults}', '{Outreach,Mission Work}', '{Tuesday,Thursday,Sunday}', '2023'),
('Emily Chen', 'emily.chen@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👩', 'Baton Rouge Southdowns', 'Registered Nurse', 34, 1, 'Married', 'Healthcare professional dedicated to caring for others', '225-555-0003', 'Gluten-free', '{English,Mandarin}', '{Cooking,Yoga,Hiking}', '{Compassion,Healing}', '{Healthcare Ministry,Young Families}', '{Community Service,Discipleship}', '{Wednesday,Friday,Saturday}', '2024'),
('David Martinez', 'david.martinez@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👨', 'Central', 'Contractor', 42, 2, 'Married', 'Skilled tradesman committed to building God''s kingdom', '225-555-0004', 'Omnivore', '{English,Spanish}', '{Construction,Sports,Music}', '{Service,Building}', '{Men Group,Family Ministry}', '{Worship,Service Opportunities}', '{Monday,Wednesday,Saturday,Sunday}', '2022'),
('Rachel Martinez', 'rachel.martinez@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👩', 'Central', 'Accountant', 40, 2, 'Married', 'Detail-oriented professional serving the family', '225-555-0005', 'Omnivore', '{English,Spanish}', '{Music,Family Activities,Volunteering}', '{Administration,Organization}', '{Women Group,Family Ministry}', '{Worship,Community Service}', '{Tuesday,Thursday,Saturday,Sunday}', '2022'),
('Grace Thompson', 'grace.thompson@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👵', 'Baton Rouge Broadmoor', 'Retired School Principal', 67, 4, 'Widowed', 'Retired educator passionate about mentoring youth', '225-555-0006', 'Omnivore', '{English}', '{Reading,Mentoring,Crafts}', '{Wisdom,Mentorship}', '{Senior Fellowship,Prayer Group}', '{Discipleship,Mentoring}', '{Monday,Wednesday,Thursday,Sunday}', '2020'),
('Jason Park', 'jason.park@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👨', 'Baton Rouge Sherwood Forest', 'Physical Therapist', 31, 0, 'Engaged', 'Healthcare professional focused on wellness and service', '225-555-0007', 'Omnivore', '{English,Korean}', '{Sports,Fitness,Outdoor Activities}', '{Healing,Encouragement}', '{Young Adults,Sports Ministry}', '{Mission Work,Community Outreach}', '{Tuesday,Thursday,Friday,Saturday}', '2023'),
('Lisa Okafor', 'lisa.okafor@example.com', '$2a$10$R6RrDvjgyE.DPm5ZHs9dFOqFyuf/V2Vp/THqQ.GfFLtb4TFj.f2v6', '👩', 'Baton Rouge Garden District', 'Graphic Designer', 27, 0, 'Single', 'Creative professional using design to serve the community', '225-555-0008', 'Vegetarian', '{English,Yoruba}', '{Design,Art,Travel}', '{Creativity,Service}', '{Young Adults,Creative Arts Ministry}', '{Outreach,Community Service}', '{Wednesday,Friday,Saturday,Sunday}', '2024')
ON CONFLICT (email) DO NOTHING;

-- Seed jobs data
INSERT INTO jobs (user_id, title, company, type, category, description, location, salary, urgent) VALUES
(2, 'Senior Software Engineer', 'Tech Solutions Inc', 'Full-Time', 'Technology', 'Looking for experienced software engineers to join our growing team. Experience with React, Node.js required.', 'Baton Rouge', '$120,000 - $150,000', false),
(2, 'Web Developer', 'Digital Agency Pro', 'Full-Time', 'Technology', 'Seeking full-stack developers with 3+ years experience. Remote work available.', 'Remote', '$100,000 - $130,000', false),
(4, 'General Contractor Needed', 'Church Construction Project', 'Volunteer', 'Construction', 'Help renovate our church fellowship hall. All skill levels welcome!', 'Baton Rouge', 'Volunteer', true),
(3, 'Nursing Assistant', 'St. Mary Hospital', 'Part-Time', 'Healthcare', 'Part-time nursing assistant needed for evening shifts.', 'Baton Rouge', '$18 - $22/hour', false),
(7, 'Personal Training Client', 'Fitness Center', 'Freelance', 'Health & Wellness', 'Looking for physical therapy consultations for recovery program.', 'Baton Rouge', 'Negotiable', false);

-- Seed prayer requests
INSERT INTO prayer_requests (user_id, anonymous, category, title, description, prayer_count, answered) VALUES
(1, false, 'Family', 'Prayer for Safe Travels', 'Please pray for my family as we travel to visit relatives this month. Safe roads and safe travels.', 5, false),
(2, false, 'Health', 'Job Interview Success', 'I have an important job interview coming up next week. Please pray for confidence and clarity.', 3, false),
(3, true, 'Personal', 'Health Recovery', 'Praying for full recovery from recent surgery. Strength and healing needed.', 8, false),
(5, false, 'Family', 'Marriage Strength', 'Please pray for continued strength and unity in our marriage during this season.', 2, false),
(6, false, 'Wisdom', 'Guidance for Decisions', 'Seeking God''s wisdom as we make important decisions about our future and family.', 6, true),
(7, false, 'Health', 'Fitness Goals', 'Prayers for discipline and health as I work toward fitness goals this year.', 1, false),
(8, true, 'Personal', 'Peace and Anxiety', 'Struggling with anxiety. Praying for God''s peace to overcome worry.', 4, false),
(4, false, 'Community', 'Church Growth', 'Praying for continued growth and spiritual development of our church community.', 7, false);

-- Seed gallery posts
INSERT INTO gallery_posts (user_id, caption, category, media_type, color, emoji, likes) VALUES
(1, 'Beautiful day at the church fellowship event! So grateful for this community.', 'Fellowship', 'photo', 'blue', '🙏', 12),
(4, 'Family time at the park - blessed to spend time together!', 'Family', 'photo', 'green', '👨‍👩‍👧‍👦', 8),
(6, 'Mentoring our young people in Bible study - what a joy!', 'Ministry', 'photo', 'gold', '📖', 15),
(2, 'Tech talk at the young adults meeting - discussing innovation and faith.', 'Education', 'photo', 'purple', '💡', 6),
(3, 'Volunteering at the community health clinic. Blessed to serve!', 'Service', 'photo', 'red', '❤️', 9),
(8, 'Designed new graphics for our church outreach program!', 'Creative', 'photo', 'pink', '🎨', 11),
(7, 'Leading a fitness and wellness class at church - body as temple!', 'Health', 'photo', 'orange', '💪', 7),
(5, 'Women''s breakfast - wonderful fellowship and connection!', 'Fellowship', 'photo', 'rose', '☕', 10);

-- Seed suggestions
INSERT INTO suggestions (user_id, category, title, description, votes) VALUES
(2, 'Programming', 'Monthly Tech Talks Series', 'Host monthly tech talks where members can share their expertise and learn new skills together.', 8),
(1, 'Education', 'Sunday School Expansion', 'Expand our Sunday school program to include all age groups with engaging curriculum.', 12),
(6, 'Community', 'Senior Mentorship Program', 'Formalize mentorship between seniors and young professionals for spiritual guidance.', 6),
(3, 'Health', 'Wellness Workshops', 'Monthly workshops on health, nutrition, and mental wellness from a faith perspective.', 9),
(8, 'Creative', 'Art & Craft Ministry', 'Create an art ministry to express faith through visual arts and creative expression.', 5),
(4, 'Service', 'Monthly Service Projects', 'Organize regular community service projects to serve the greater Baton Rouge area.', 14),
(7, 'Social', 'Young Adults Retreat', 'Plan a weekend retreat for young adults to deepen friendships and spiritual growth.', 10),
(5, 'Outreach', 'Community Pantry', 'Start a food pantry to serve families in need within our church community.', 11);

-- Seed gallery comments
INSERT INTO gallery_comments (gallery_post_id, user_id, text) VALUES
(1, 2, 'Such a beautiful gathering! Love this community!'),
(1, 3, 'This is what church should look like - true fellowship!'),
(2, 4, 'What a precious memory!'),
(2, 5, 'Blessings on your family!'),
(3, 1, 'Such an inspiration, Grace! Thank you for pouring into the next generation.'),
(3, 6, 'Your dedication is remarkable!'),
(4, 8, 'Great conversation! Really appreciated the insights.'),
(5, 2, 'Healthcare heroes! Thank you for your service!');

-- Seed suggestion comments
INSERT INTO suggestion_comments (suggestion_id, user_id, text) VALUES
(1, 8, 'I would love to participate in this! We need more learning opportunities.'),
(1, 6, 'Excellent idea for engaging our tech-savvy members.'),
(2, 3, 'This would be wonderful for families and children!'),
(3, 1, 'Such a valuable program idea!'),
(4, 7, 'As a healthcare professional, I''d be happy to help lead wellness workshops.'),
(6, 4, 'I''m interested in coordinating service projects!'),
(7, 2, 'Count me in for helping plan this retreat!'),
(8, 3, 'This would make a real difference in our community.');
