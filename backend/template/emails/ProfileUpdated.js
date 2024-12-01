export const ProfileUpdated = (user) => {
    return {
        subject: 'Profile Updated',
        text: `Hello ${user.name}, your profile has been updated successfully.`
    };
};
