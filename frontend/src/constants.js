// ─── East Baton Rouge & Zachary Locations ───────────────────────
export const LOCATIONS = [
  "Zachary", "Central", "Baker",
  "Baton Rouge - Mid City", "Baton Rouge - Southdowns", "Baton Rouge - Broadmoor",
  "Baton Rouge - Sherwood Forest", "Baton Rouge - Garden District",
  "Baton Rouge - Bluebonnet", "Baton Rouge - Siegen Lane",
  "Baton Rouge - Highland / LSU", "Baton Rouge - Jefferson Hwy",
  "Baton Rouge - Coursey Blvd", "Baton Rouge - Airline Hwy",
  "Baton Rouge - Shenandoah", "Baton Rouge - Old Hammond Hwy",
  "Denham Springs", "Prairieville", "Gonzales", "Walker",
];

// ─── Small Groups & Events ──────────────────────────────────────
export const SMALL_GROUPS = [
  "Women of Faith", "Men's Fellowship", "Couples Connect", "Young Adults",
  "Senior Saints", "Creative Arts Team", "Worship Team", "Prayer Warriors",
  "New Members Group", "Bible Study - Monday Night", "Bible Study - Wednesday AM",
  "Youth Leaders", "Parenting Group", "Financial Peace", "Grief & Loss Support",
  "Recovery Group", "Spanish Fellowship", "College & Career",
];

export const DESIRED_GROUPS = [
  "Women's Bible Study", "Men's Bible Study", "Couples Retreat",
  "Young Adults Social", "Senior Activities", "Worship Team",
  "Prayer Group", "Community Outreach", "Missions Team",
  "Marriage Enrichment", "Parenting Workshop", "Financial Literacy",
  "Grief Support", "Recovery Support", "Sports League",
  "Cooking Club", "Book Club", "Outdoor Adventures",
  "Creative Arts Workshop", "Tech & Media Team", "Children's Ministry",
  "Youth Ministry Volunteer", "Hospitality Team", "Welcome Team",
];

export const SPIRITUAL_GIFTS = [
  "Teaching", "Encouragement", "Hospitality", "Leadership", "Giving",
  "Mercy", "Administration", "Service", "Worship", "Prophecy",
  "Evangelism", "Pastoral Care", "Wisdom", "Faith", "Discernment",
];

export const AVAIL_OPTS = [
  "Childcare Help", "Tutoring", "Meal Prep", "Prayer Partner", "Tech Support",
  "Moving Help", "Sports Activities", "Youth Mentoring", "Health Advice",
  "Hospital Visits", "Worship Team", "Home Repairs", "Marriage Mentoring",
  "Hosting Events", "Mentoring", "Fitness Coaching", "Design Work",
  "Photography", "Event Planning", "Creative Projects", "Financial Guidance",
  "Flower Arrangements", "Rides/Transportation", "Yard Work", "Cooking for Events",
];

export const HOBBY_OPTS = [
  "Gardening", "Reading", "Hiking", "Photography", "Basketball", "Coding",
  "Cooking", "Board Games", "Yoga", "Painting", "Travel", "Music",
  "Camping", "Soccer", "Baking", "Quilting", "Birdwatching", "Volunteering",
  "Bible Study", "Running", "Guitar", "Fishing", "Woodworking", "Calligraphy",
  "Coffee", "Dancing", "Golf", "Hunting", "Kayaking", "Football",
];

export const JOB_TYPES = ["Full-Time", "Part-Time", "Freelance", "Volunteer", "Internship"];

export const JOB_CATS = [
  "Healthcare", "Education", "Technology", "Trades & Labor", "Ministry",
  "Food & Hospitality", "Business", "Creative", "Government", "Other",
];

export const PRAYER_CATS = [
  "Health", "Family", "Work & Career", "Spiritual Growth", "Relationships",
  "Financial", "Grief & Loss", "Thanksgiving", "Other",
];

export const GALLERY_CATS = [
  "Church Events", "Small Groups", "Community Service", "Worship",
  "Social", "Youth", "Nature", "Family",
];

// ─── Mock Members with All Fields ─────────────────────────────
export const MEMBERS = [
  { id:1, name:"Sarah Johnson", email:"sarah@vineyardbr.org", avatar:"SJ", location:"Zachary", work:"Elementary School Teacher at Zachary Community Schools", age:38, kids:3, retired:false, maritalStatus:"Married", birthday:"March 15", languages:["English"], canDrive:true, spiritualGifts:["Teaching","Encouragement","Hospitality"], currentGroups:["Women of Faith","Bible Study - Wednesday AM"], desiredGroups:["Community Outreach","Cooking Club"], hobbies:["Gardening","Reading","Hiking","Photography"], bio:"Mom of three and longtime Vineyard member. Born and raised in Zachary. I love connecting people and helping wherever I can. Passionate about children's education and creating beautiful garden spaces.", social:"Love coffee meetups at the Coffee House, book clubs, and family game nights at our home in Zachary.", available:["Childcare Help","Tutoring","Meal Prep","Prayer Partner"], joined:"2019", smallGroup:"Women of Faith", phone:"(225) 234-5678", dietary:"No restrictions" },
  { id:2, name:"Marcus Williams", email:"marcus@vineyardbr.org", avatar:"MW", location:"Baton Rouge - Mid City", work:"Software Engineer at CGI Federal", age:29, kids:0, retired:false, maritalStatus:"Single", birthday:"July 22", languages:["English","Spanish"], canDrive:true, spiritualGifts:["Service","Administration","Teaching"], currentGroups:["Men's Fellowship","Young Adults"], desiredGroups:["Sports League","Tech & Media Team"], hobbies:["Basketball","Coding","Cooking","Board Games"], bio:"Tech enthusiast who found his faith community here at Vineyard. Always up for a pickup basketball game at the BREC courts or helping someone with their computer issues.", social:"Enjoy group dinners in Mid City, sports outings, and volunteering at the Greater Baton Rouge Food Bank.", available:["Tech Support","Moving Help","Sports Activities","Youth Mentoring"], joined:"2021", smallGroup:"Men's Fellowship", phone:"(225) 345-6789", dietary:"No restrictions" },
  { id:3, name:"Emily Chen", email:"emily@vineyardbr.org", avatar:"EC", location:"Baton Rouge - Southdowns", work:"Registered Nurse at Our Lady of the Lake", age:34, kids:1, retired:false, maritalStatus:"Married", birthday:"November 8", languages:["English","Mandarin"], canDrive:true, spiritualGifts:["Mercy","Pastoral Care","Encouragement"], currentGroups:["Creative Arts Team","Parenting Group"], desiredGroups:["Worship Team","Women's Bible Study"], hobbies:["Yoga","Painting","Travel","Music"], bio:"Healthcare worker with a heart for serving others. I find peace in painting and love exploring new places whenever I get the chance. My husband and I moved to Baton Rouge 5 years ago.", social:"Love art walks at the Shaw Center, worship nights, and trying new restaurants on Government Street.", available:["Health Advice","Hospital Visits","Worship Team","Prayer Partner"], joined:"2020", smallGroup:"Creative Arts Team", phone:"(225) 456-7890", dietary:"Vegetarian" },
  { id:4, name:"David & Rachel Martinez", email:"martinez@vineyardbr.org", avatar:"DM", location:"Central", work:"David: Contractor | Rachel: Stay-at-home Mom", age:42, kids:2, retired:false, maritalStatus:"Married", birthday:"David: Feb 14 | Rachel: Sep 3", languages:["English","Spanish"], canDrive:true, spiritualGifts:["Hospitality","Service","Leadership"], currentGroups:["Couples Connect","Bible Study - Monday Night"], desiredGroups:["Marriage Enrichment","Outdoor Adventures"], hobbies:["Camping","Home Renovation","Soccer","Baking"], bio:"Married couple with two kids. We love the outdoors and are always working on some home project. Our door is always open for fellowship! We've been in Central for 10 years.", social:"Enjoy hosting backyard BBQs, couples' game nights, and camping trips at Tickfaw State Park.", available:["Home Repairs","Marriage Mentoring","Hosting Events","Childcare Help"], joined:"2018", smallGroup:"Couples Connect", phone:"(225) 567-8901", dietary:"No restrictions" },
  { id:5, name:"Grace Thompson", email:"grace@vineyardbr.org", avatar:"GT", location:"Baton Rouge - Broadmoor", work:"Retired School Principal - EBRP Schools", age:67, kids:4, retired:true, maritalStatus:"Widowed", birthday:"May 20", languages:["English"], canDrive:true, spiritualGifts:["Wisdom","Teaching","Pastoral Care"], currentGroups:["Senior Saints","Prayer Warriors"], desiredGroups:["Grief Support","Mentoring","Community Outreach"], hobbies:["Quilting","Birdwatching","Volunteering","Bible Study"], bio:"Retired educator with 35 years in East Baton Rouge Parish schools. Now I spend my days giving back to the community and mentoring young families. Baton Rouge born and raised!", social:"Enjoy quilting circles, Wednesday morning coffee at Stab's, and prayer walks around University Lake.", available:["Mentoring","Tutoring","Prayer Partner","Meal Prep"], joined:"2010", smallGroup:"Senior Saints", phone:"(225) 678-9012", dietary:"Diabetic-friendly" },
  { id:6, name:"Jason Park", email:"jason@vineyardbr.org", avatar:"JP", location:"Baton Rouge - Sherwood Forest", work:"Physical Therapist at Baton Rouge General", age:31, kids:0, retired:false, maritalStatus:"Engaged", birthday:"August 11", languages:["English","Korean"], canDrive:true, spiritualGifts:["Worship","Encouragement","Service"], currentGroups:["Worship Team","Young Adults"], desiredGroups:["Sports League","Men's Bible Study"], hobbies:["Running","Guitar","Fishing","Woodworking"], bio:"Fitness enthusiast and amateur musician. I lead worship occasionally and love spending time outdoors. Happy to help anyone with exercise tips or PT advice. Love fishing at False River!", social:"Enjoy jam sessions, running groups along the levee, and Saturday fishing trips.", available:["Fitness Coaching","Worship Team","Moving Help","Youth Mentoring"], joined:"2022", smallGroup:"Worship Team", phone:"(225) 789-0123", dietary:"No restrictions" },
  { id:7, name:"Lisa Okafor", email:"lisa@vineyardbr.org", avatar:"LO", location:"Baton Rouge - Garden District", work:"Graphic Designer & Freelancer", age:27, kids:0, retired:false, maritalStatus:"Single", birthday:"December 1", languages:["English","Yoruba"], canDrive:false, spiritualGifts:["Giving","Service","Administration"], currentGroups:["Creative Arts Team","New Members Group"], desiredGroups:["Welcome Team","Creative Arts Workshop","Book Club"], hobbies:["Photography","Calligraphy","Coffee","Dancing"], bio:"Creative soul who designs everything from church bulletins to community event flyers. I believe art is a form of worship. Recently moved to Baton Rouge and love exploring the Garden District.", social:"Love coffee dates at Magpie Cafe, art shows, creative workshops, and dance fitness.", available:["Design Work","Photography","Event Planning","Creative Projects"], joined:"2024", smallGroup:"Creative Arts Team", phone:"(225) 890-1234", dietary:"Gluten-free" },
  { id:8, name:"Tom & Linda Baker", email:"bakers@vineyardbr.org", avatar:"TB", location:"Denham Springs", work:"Tom: Financial Advisor | Linda: Florist at Peregrin's", age:58, kids:3, retired:false, maritalStatus:"Married", birthday:"Tom: Jan 7 | Linda: Apr 19", languages:["English"], canDrive:true, spiritualGifts:["Hospitality","Giving","Leadership"], currentGroups:["Couples Connect","Financial Peace"], desiredGroups:["Marriage Enrichment","Hospitality Team"], hobbies:["Gardening","Golf","Cooking","Entertaining"], bio:"Empty nesters who love hosting and entertaining. Our home in Denham Springs has been a gathering place for small groups for over a decade. Passionate about financial literacy!", social:"Enjoy hosting dinner parties, golf at Santa Maria, and leading financial peace workshops.", available:["Financial Guidance","Hosting Events","Flower Arrangements","Marriage Mentoring","Rides/Transportation"], joined:"2012", smallGroup:"Couples Connect", phone:"(225) 901-2345", dietary:"No restrictions" },
];
