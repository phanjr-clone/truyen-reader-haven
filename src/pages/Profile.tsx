
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
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
