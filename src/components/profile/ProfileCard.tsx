import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { PublicProfile, UserProfile } from '@/types';

interface ProfileCardProps {
  profile: PublicProfile | UserProfile;
  isEditable?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isEditable }) => {
  return (
    <Card variant="glass" className="w-full">
      <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <Avatar 
            src={profile.avatarUrl} 
            fallback={profile.username} 
            size="xl" 
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h2 className="text-display text-2xl font-bold mb-1">
              {profile.displayName || profile.username}
            </h2>
            <p className="text-muted">@{profile.username}</p>
          </div>
          
          {profile.bio && (
            <p className="text-secondary max-w-lg leading-relaxed">
              {profile.bio}
            </p>
          )}
          
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Instruments</h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.instruments?.length > 0 ? (
                  profile.instruments.map((inst, i) => (
                    <Badge key={i} variant="instrument">{inst}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted">No instruments listed</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Genres</h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {profile.genres?.length > 0 ? (
                  profile.genres.map((genre, i) => (
                    <Badge key={i} variant="genre">{genre}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted">No genres listed</span>
                )}
              </div>
            </div>
          </div>
          
          {isEditable && (
            <div className="pt-4">
              <button className="btn btn-secondary btn-sm">Edit Profile</button>
            </div>
          )}
        </div>
        
        <div className="sm:ml-auto flex flex-col items-center gap-2 bg-bg-elevated p-4 rounded-xl border border-border-subtle">
          <span className="text-sm text-muted uppercase font-semibold">Skill</span>
          <Badge variant="primary" className="text-sm capitalize">{profile.skillLevel || 'Beginner'}</Badge>
          <div className="mt-2 text-center">
            <span className="block text-2xl font-bold text-accent-primary">{profile.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-muted">Rating</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
