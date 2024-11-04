import React, { useState } from "react";
import { observer } from "mobx-react";

import "./Profile.css";
import userStore from "../../store/userStore";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";

const Profile = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { init, user, updateUser } = userStore;

  React.useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await init();
      } catch (error) {
        setFeedback({
          type: 'error',
          message: 'Failed to load profile. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [init]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUser();
      setIsEditing(false);
      setFeedback({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileEdit = () => (
    <>
      <TextInput
        label="Profile Image URL"
        placeholder="https://example.com/image.jpg"
        value={user.avatar || ""}
        onChange={(val) => (user.avatar = val.toString())}
        disabled={isLoading}
      />
      <TextInput
        label="Full Name"
        placeholder="John Doe"
        value={user.fullName || ""}
        onChange={(val) => (user.fullName = val.toString())}
        disabled={isLoading}
      />
    </>
  );

  const renderProfile = () => (
    <div className="profile-page__profile">
      <img
        src={user.avatar || "https://via.placeholder.com/600/92c952"}
        alt={user.fullName || "User"}
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/600/92c952";
        }}
      />
      <p>{user.fullName}</p>
      <p>{user.email}</p>
    </div>
  );

  return (
    <div className={`profile-page ${isLoading ? 'profile-page--loading' : ''}`}>
      <h1 className="profile-page__title">Your Profile</h1>

      {feedback && (
        <div className={`profile-page__feedback profile-page__feedback--${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <div className="profile-page__info">
        {!isEditing && renderProfile()}
        {isEditing && renderProfileEdit()}
      </div>

      <div className="profile-page__action">
        {isEditing ? (
          <>
            <Button
              variant="outlined-secondary"
              label="Cancel"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            />
            <Button
              variant="outlined-primary"
              label={isLoading ? "Updating..." : "Update"}
              onClick={handleUpdate}
              disabled={isLoading}
            />
          </>
        ) : (
          <Button
            variant="outlined-primary"
            label="Edit Profile"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
});

export default Profile;