
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload />
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
