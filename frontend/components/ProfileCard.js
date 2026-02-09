import Link from 'next/link';

export default function ProfileCard({ profile }) {
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return 'U';
  };

  const groupsArray = Array.isArray(profile?.groups)
    ? profile.groups
    : profile?.groups?.split(',').map(g => g.trim()) || [];

  return (
    <Link href={`/profile/${profile.id}`}>
      <div className="bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300 overflow-hidden cursor-pointer h-full">
        {/* Header with initials avatar */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-sm">
            {getInitials()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg">
            {profile?.first_name} {profile?.last_name}
          </h3>

          {profile?.bio && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Info bits */}
          <div className="mt-4 space-y-1 text-xs text-gray-600">
            {profile?.age && <p>Age: {profile.age}</p>}
            {profile?.kids && <p>Kids: {profile.kids}</p>}
            {profile?.retired && <p>Retired</p>}
          </div>

          {/* Groups tags */}
          {groupsArray.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {groupsArray.slice(0, 3).map((group, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-light text-white"
                >
                  {group}
                </span>
              ))}
              {groupsArray.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{groupsArray.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
